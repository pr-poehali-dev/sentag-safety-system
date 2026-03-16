import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """Получение статистики кликов по кнопкам за месяц"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        # Подключение к БД
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Получаем статистику за последние 30 дней только для sentag.ru
        cursor.execute("""
            SELECT 
                DATE(clicked_at) as click_date,
                button_name,
                button_location,
                COUNT(*) as click_count
            FROM button_clicks
            WHERE clicked_at >= NOW() - INTERVAL '30 days'
            AND domain = 'sentag.ru'
            GROUP BY DATE(clicked_at), button_name, button_location
            ORDER BY click_date DESC, click_count DESC
        """)
        
        rows = cursor.fetchall()
        
        # Группируем по дням
        stats_by_day = {}
        for row in rows:
            date_str = row[0].strftime('%Y-%m-%d')
            if date_str not in stats_by_day:
                stats_by_day[date_str] = []
            
            stats_by_day[date_str].append({
                'button_name': row[1],
                'button_location': row[2],
                'count': row[3]
            })
        
        # Получаем общую статистику по кнопкам только для sentag.ru
        cursor.execute("""
            SELECT 
                button_name,
                button_location,
                COUNT(*) as total_clicks
            FROM button_clicks
            WHERE clicked_at >= NOW() - INTERVAL '30 days'
            AND domain = 'sentag.ru'
            GROUP BY button_name, button_location
            ORDER BY total_clicks DESC
        """)
        
        total_rows = cursor.fetchall()
        total_stats = [
            {
                'button_name': row[0],
                'button_location': row[1],
                'total_clicks': row[2]
            }
            for row in total_rows
        ]
        
        # Получаем количество уникальных посетителей за месяц только для sentag.ru
        cursor.execute("""
            SELECT COUNT(*) FROM (
                SELECT DISTINCT visitor_id, DATE(visited_at) as visit_date
                FROM page_visits
                WHERE visited_at >= NOW() - INTERVAL '30 days'
                AND domain = 'sentag.ru'
            ) as unique_daily_visitors
        """)
        unique_visitors = cursor.fetchone()[0] or 0

        # Посещения по дням (уникальные visitor_id в день)
        cursor.execute("""
            SELECT
                DATE(visited_at) as visit_date,
                COUNT(DISTINCT visitor_id) as visitors_count
            FROM page_visits
            WHERE visited_at >= NOW() - INTERVAL '30 days'
            AND domain = 'sentag.ru'
            GROUP BY DATE(visited_at)
            ORDER BY visit_date DESC
        """)
        visits_rows = cursor.fetchall()
        visits_by_day = {
            row[0].strftime('%Y-%m-%d'): row[1]
            for row in visits_rows
        }

        # Детализация по устройствам/браузерам за каждый день
        cursor.execute("""
            SELECT
                DATE(visited_at) as visit_date,
                CASE
                    WHEN user_agent ILIKE '%bot%' OR user_agent ILIKE '%crawler%' OR user_agent ILIKE '%spider%' THEN 'Боты'
                    WHEN user_agent ILIKE '%Mobile%' AND user_agent ILIKE '%iPhone%' THEN 'iPhone'
                    WHEN user_agent ILIKE '%Mobile%' AND user_agent ILIKE '%Android%' THEN 'Android'
                    WHEN user_agent ILIKE '%iPad%' THEN 'iPad'
                    WHEN user_agent ILIKE '%Windows%' THEN 'Windows'
                    WHEN user_agent ILIKE '%Macintosh%' OR user_agent ILIKE '%Mac OS%' THEN 'Mac'
                    WHEN user_agent ILIKE '%Linux%' THEN 'Linux'
                    ELSE 'Другое'
                END as device_type,
                COUNT(DISTINCT visitor_id) as count
            FROM page_visits
            WHERE visited_at >= NOW() - INTERVAL '30 days'
            AND domain = 'sentag.ru'
            GROUP BY DATE(visited_at), device_type
            ORDER BY visit_date DESC, count DESC
        """)
        device_rows = cursor.fetchall()
        devices_by_day = {}
        for row in device_rows:
            date_str = row[0].strftime('%Y-%m-%d')
            if date_str not in devices_by_day:
                devices_by_day[date_str] = []
            devices_by_day[date_str].append({
                'source': row[1],
                'count': row[2]
            })
        
        # Получаем количество заполненных заявок (шаг 1 и шаг 2)
        cursor.execute("""
            SELECT 
                COUNT(*) as step1_count,
                COUNT(CASE WHEN step2_completed_at IS NOT NULL THEN 1 END) as step2_count
            FROM request_forms
            WHERE created_at >= NOW() - INTERVAL '30 days'
        """)
        form_stats = cursor.fetchone()
        step1_count = form_stats[0] or 0
        step2_count = form_stats[1] or 0
        
        # Считаем конверсию (процент завершивших форму от начавших)
        conversion_rate = round((step2_count / step1_count * 100), 1) if step1_count > 0 else 0
        
        # Получаем среднее время заполнения шагов
        cursor.execute("""
            SELECT 
                AVG(EXTRACT(EPOCH FROM (step1_completed_at - step1_started_at))) as avg_step1_duration,
                AVG(EXTRACT(EPOCH FROM (step2_completed_at - step2_started_at))) as avg_step2_duration
            FROM request_forms
            WHERE created_at >= NOW() - INTERVAL '30 days'
            AND step1_started_at IS NOT NULL
            AND step2_started_at IS NOT NULL
            AND step2_completed_at IS NOT NULL
        """)
        duration_stats = cursor.fetchone()
        avg_step1_seconds = duration_stats[0] or 0
        avg_step2_seconds = duration_stats[1] or 0
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'stats_by_day': stats_by_day,
                'total_stats': total_stats,
                'unique_visitors': unique_visitors,
                'visits_by_day': visits_by_day,
                'devices_by_day': devices_by_day,
                'step1_count': step1_count,
                'step2_count': step2_count,
                'conversion_rate': conversion_rate,
                'avg_step1_seconds': round(avg_step1_seconds),
                'avg_step2_seconds': round(avg_step2_seconds)
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
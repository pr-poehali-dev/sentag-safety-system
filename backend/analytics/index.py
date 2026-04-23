import json
import os
import psycopg2
import requests as http_requests

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def handler(event: dict, context) -> dict:
    """
    Аналитика и статистика.
    GET  ?action=stats           — статистика кликов за 30 дней
    GET  ?action=online          — онлайн-посетители
    POST ?action=track           — запись посещения/клика
    POST ?action=send_telegram   — отправка статистики в Telegram
    DELETE ?action=clear         — очистка статистики
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '', 'isBase64Encoded': False}

    def resp(status, body):
        return {
            'statusCode': status,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps(body),
            'isBase64Encoded': False
        }

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    def get_conn():
        c = psycopg2.connect(dsn, options=f'-c search_path={schema}')
        c.autocommit = False
        return c

    # GET stats
    if method == 'GET' and action == 'stats':
        conn = get_conn()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT DATE(clicked_at) as click_date, button_name, button_location, COUNT(*) as click_count
            FROM button_clicks
            WHERE clicked_at >= NOW() - INTERVAL '30 days' AND domain = 'sentag.ru'
            GROUP BY DATE(clicked_at), button_name, button_location
            ORDER BY click_date DESC, click_count DESC
        """)
        stats_by_day = {}
        for row in cursor.fetchall():
            date_str = row[0].strftime('%Y-%m-%d')
            stats_by_day.setdefault(date_str, []).append({'button_name': row[1], 'button_location': row[2], 'count': row[3]})

        cursor.execute("""
            SELECT button_name, button_location, COUNT(*) as total_clicks
            FROM button_clicks
            WHERE clicked_at >= NOW() - INTERVAL '30 days' AND domain = 'sentag.ru'
            GROUP BY button_name, button_location ORDER BY total_clicks DESC
        """)
        total_stats = [{'button_name': r[0], 'button_location': r[1], 'total_clicks': r[2]} for r in cursor.fetchall()]

        cursor.execute("""
            SELECT COUNT(*) FROM (
                SELECT DISTINCT visitor_id, DATE(visited_at) as visit_date
                FROM page_visits
                WHERE visited_at >= NOW() - INTERVAL '30 days' AND domain = 'sentag.ru'
            ) as t
        """)
        unique_visitors = cursor.fetchone()[0] or 0

        cursor.execute("""
            SELECT DATE(visited_at) as visit_date, COUNT(DISTINCT visitor_id) as visitors_count
            FROM page_visits
            WHERE visited_at >= NOW() - INTERVAL '30 days' AND domain = 'sentag.ru'
            GROUP BY DATE(visited_at) ORDER BY visit_date DESC
        """)
        visits_by_day = {r[0].strftime('%Y-%m-%d'): r[1] for r in cursor.fetchall()}

        cursor.execute("""
            SELECT DATE(visited_at) as visit_date,
                CASE
                    WHEN utm_source IS NOT NULL AND utm_source <> ''
                        THEN CONCAT('🎯 ', utm_source, CASE WHEN utm_campaign IS NOT NULL AND utm_campaign <> '' THEN CONCAT(' / ', utm_campaign) ELSE '' END)
                    WHEN referrer IS NULL OR referrer = '' THEN 'Прямой переход'
                    WHEN referrer ILIKE '%google.%' THEN 'Google'
                    WHEN referrer ILIKE '%yandex.%' THEN 'Яндекс'
                    WHEN referrer ILIKE '%bing.%' THEN 'Bing'
                    WHEN referrer ILIKE '%vk.com%' OR referrer ILIKE '%vkontakte.ru%' THEN 'ВКонтакте'
                    WHEN referrer ILIKE '%t.me%' OR referrer ILIKE '%telegram.%' THEN 'Telegram'
                    WHEN referrer ILIKE '%instagram.%' OR referrer ILIKE '%facebook.%' THEN 'Instagram / Facebook'
                    WHEN referrer ILIKE '%2gis.%' THEN '2ГИС'
                    WHEN referrer ILIKE '%avito.%' THEN 'Авито'
                    ELSE COALESCE(NULLIF(TRIM(REGEXP_REPLACE(REGEXP_REPLACE(referrer, '^https?://(www\.)?', ''), '/.*$', '')), ''), 'Другой сайт')
                END as source,
                COUNT(DISTINCT visitor_id) as count
            FROM page_visits
            WHERE visited_at >= NOW() - INTERVAL '30 days' AND domain = 'sentag.ru'
            GROUP BY DATE(visited_at), source ORDER BY visit_date DESC, count DESC
        """)
        devices_by_day = {}
        for row in cursor.fetchall():
            date_str = row[0].strftime('%Y-%m-%d')
            devices_by_day.setdefault(date_str, []).append({'source': row[1], 'count': row[2]})

        cursor.execute("""
            SELECT COUNT(*) as step1_count, COUNT(CASE WHEN step2_completed_at IS NOT NULL THEN 1 END) as step2_count
            FROM request_forms WHERE created_at >= NOW() - INTERVAL '30 days'
        """)
        form_stats = cursor.fetchone()
        step1_count = form_stats[0] or 0
        step2_count = form_stats[1] or 0
        conversion_rate = round((step2_count / step1_count * 100), 1) if step1_count > 0 else 0

        cursor.execute("""
            SELECT AVG(EXTRACT(EPOCH FROM (step1_completed_at - step1_started_at))) as avg_step1_duration,
                   AVG(EXTRACT(EPOCH FROM (step2_completed_at - step2_started_at))) as avg_step2_duration
            FROM request_forms
            WHERE created_at >= NOW() - INTERVAL '30 days'
              AND step1_started_at IS NOT NULL AND step2_started_at IS NOT NULL AND step2_completed_at IS NOT NULL
        """)
        duration_stats = cursor.fetchone()

        cursor.execute("""
            SELECT DATE(visited_at) as visit_date, COUNT(DISTINCT visitor_id) as visitors_count
            FROM page_visits
            WHERE visited_at >= NOW() - INTERVAL '365 days' AND domain = 'sentag.ru'
            GROUP BY DATE(visited_at) ORDER BY visit_date ASC
        """)
        visits_chart = [{'date': r[0].strftime('%Y-%m-%d'), 'visitors': r[1]} for r in cursor.fetchall()]

        cursor.close()
        conn.close()

        return resp(200, {
            'stats_by_day': stats_by_day,
            'total_stats': total_stats,
            'unique_visitors': unique_visitors,
            'visits_by_day': visits_by_day,
            'devices_by_day': devices_by_day,
            'form_stats': {
                'step1_count': step1_count,
                'step2_count': step2_count,
                'conversion_rate': conversion_rate,
                'avg_step1_seconds': duration_stats[0] or 0 if duration_stats else 0,
                'avg_step2_seconds': duration_stats[1] or 0 if duration_stats else 0,
            },
            'visits_chart': visits_chart,
        })

    # GET online
    if method == 'GET' and action == 'online':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(DISTINCT visitor_id) FROM visitors
            WHERE last_activity >= NOW() - INTERVAL '5 minutes' AND domain = 'sentag.ru'
        """)
        online_count = cur.fetchone()[0] or 0
        cur.close()
        conn.close()
        return resp(200, {'online_visitors': online_count})

    # POST track
    if method == 'POST' and action == 'track':
        body = json.loads(event.get('body', '{}'))
        visitor_id = body.get('visitor_id')
        if not visitor_id:
            return resp(400, {'error': 'visitor_id is required'})
        domain = body.get('domain', 'sentag.ru')
        button_name = body.get('button_name')
        button_location = body.get('button_location')
        referrer = body.get('referrer') or None
        utm_source = body.get('utm_source') or None
        utm_medium = body.get('utm_medium') or None
        utm_campaign = body.get('utm_campaign') or None
        clicks_batch = body.get('clicks') or []
        headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
        user_agent = headers.get('user-agent', '')
        ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
        conn = get_conn()
        cursor = conn.cursor()
        if not button_name:
            cursor.execute("""
                SELECT id FROM page_visits WHERE visitor_id = %s AND domain = %s AND DATE(visited_at) = CURRENT_DATE LIMIT 1
            """, (visitor_id, domain))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO page_visits (visitor_id, user_agent, ip_address, domain, referrer, utm_source, utm_medium, utm_campaign)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (visitor_id, user_agent, ip_address, domain, referrer, utm_source, utm_medium, utm_campaign))
            cursor.execute("""
                INSERT INTO visitors (visitor_id, user_agent, first_visit, last_activity, domain)
                VALUES (%s, %s, NOW(), NOW(), %s)
                ON CONFLICT (visitor_id) DO UPDATE SET last_activity = NOW(), user_agent = EXCLUDED.user_agent, domain = EXCLUDED.domain
            """, (visitor_id, user_agent, domain))
        if button_name and button_location:
            cursor.execute(
                "INSERT INTO button_clicks (button_name, button_location, user_agent, ip_address, visitor_id, domain) VALUES (%s, %s, %s, %s, %s, %s)",
                (button_name, button_location, user_agent, ip_address, visitor_id, domain)
            )
        if clicks_batch:
            cursor.executemany(
                "INSERT INTO button_clicks (button_name, button_location, user_agent, ip_address, visitor_id, domain) VALUES (%s, %s, %s, %s, %s, %s)",
                [(c.get('button_name', ''), c.get('button_location', ''), user_agent, ip_address, visitor_id, domain)
                 for c in clicks_batch if c.get('button_name') and c.get('button_location')]
            )
        conn.commit()
        cursor.close()
        conn.close()
        return resp(200, {'success': True})

    # POST send_telegram
    if method == 'POST' and action == 'send_telegram':
        from datetime import datetime, timedelta
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        if not bot_token or not chat_id:
            return resp(500, {'error': 'Telegram credentials not configured'})
        conn = get_conn()
        cursor = conn.cursor()
        week_ago = datetime.now() - timedelta(days=7)
        cursor.execute("""
            SELECT button_name, button_location, COUNT(*) as click_count
            FROM button_clicks WHERE clicked_at >= %s
            GROUP BY button_name, button_location ORDER BY click_count DESC
        """, (week_ago,))
        clicks_data = cursor.fetchall()
        total_clicks = sum(r[2] for r in clicks_data)
        cursor.execute("SELECT COUNT(*) FROM request_forms WHERE created_at >= %s", (week_ago,))
        new_requests = cursor.fetchone()[0]
        cursor.execute("""
            SELECT COUNT(*) as total, COUNT(CASE WHEN step2_completed_at IS NOT NULL THEN 1 END) as completed_step2,
                   AVG(EXTRACT(EPOCH FROM (step1_completed_at - step1_started_at))),
                   AVG(EXTRACT(EPOCH FROM (step2_completed_at - step2_started_at)))
            FROM request_forms WHERE created_at >= %s AND step1_started_at IS NOT NULL
        """, (week_ago,))
        steps_data = cursor.fetchone()
        step1_count = steps_data[0]
        step2_count = steps_data[1]
        avg_step1_seconds = int(steps_data[2]) if steps_data[2] else 0
        avg_step2_seconds = int(steps_data[3]) if steps_data[3] else 0
        cursor.execute("SELECT COUNT(DISTINCT visitor_id) FROM visitors WHERE first_visit >= %s", (week_ago,))
        unique_visitors = cursor.fetchone()[0]
        cursor.execute("""
            SELECT AVG(EXTRACT(EPOCH FROM (last_activity - first_visit)))
            FROM visitors WHERE first_visit >= %s AND last_activity IS NOT NULL
        """, (week_ago,))
        avg_time_seconds = int(cursor.fetchone()[0] or 0)
        cursor.close()
        conn.close()

        def format_time(s):
            return f"{s // 60}:{str(s % 60).zfill(2)}" if s else "н/д"

        message = f"""📊 <b>Статистика за неделю</b>
📅 {week_ago.strftime('%d.%m.%Y')} - {datetime.now().strftime('%d.%m.%Y')}

<b>👥 Посещаемость:</b>
• Уникальных посетителей: {unique_visitors}
• Среднее время на сайте: {format_time(avg_time_seconds)}

<b>📋 Заявки:</b>
• Новых заявок: {new_requests}
• Шаг 1 заполнен: {step1_count}
• Шаг 2 завершён: {step2_count}
{f"• Конверсия: {round(step2_count / step1_count * 100, 1)}%" if step1_count > 0 else ""}

<b>⏱ Среднее время заполнения:</b>
• Шаг 1: {format_time(avg_step1_seconds)}
• Шаг 2: {format_time(avg_step2_seconds)}

<b>🖱 Активность (всего {total_clicks} кликов):</b>
"""
        for bn, bl, cnt in clicks_data:
            message += f"\n• {bn} ({bl}): {cnt}"
        if not clicks_data:
            message += "\nКликов пока не было"

        r = http_requests.post(f"https://api.telegram.org/bot{bot_token}/sendMessage",
            json={'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML'})
        if r.status_code == 200:
            return resp(200, {'success': True, 'message': 'Статистика отправлена в Telegram'})
        return resp(500, {'error': 'Failed to send to Telegram', 'details': r.text})

    # DELETE clear
    if method == 'DELETE' and action == 'clear':
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM button_clicks")
        clicks_deleted = cursor.rowcount
        cursor.execute("DELETE FROM page_visits")
        visits_deleted = cursor.rowcount
        cursor.execute("DELETE FROM visitors")
        visitors_deleted = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()
        return resp(200, {
            'success': True,
            'deleted_count': clicks_deleted + visits_deleted + visitors_deleted,
            'message': f'Удалено {clicks_deleted} кликов, {visits_deleted} посещений и {visitors_deleted} посетителей'
        })

    return resp(400, {'error': 'Unknown action or method'})
import json
import os
import psycopg2
from datetime import datetime, timedelta
import requests

def handler(event: dict, context) -> dict:
    """Отправка статистики в Telegram за последнюю неделю"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
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
        # Получаем данные из окружения
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        dsn = os.environ.get('DATABASE_URL')
        
        if not bot_token or not chat_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Telegram credentials not configured'}),
                'isBase64Encoded': False
            }
        
        # Подключение к БД
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Получаем статистику за последнюю неделю
        week_ago = datetime.now() - timedelta(days=7)
        
        # Клики по кнопкам за неделю
        cursor.execute("""
            SELECT 
                button_name,
                button_location,
                COUNT(*) as click_count
            FROM button_clicks
            WHERE clicked_at >= %s
            GROUP BY button_name, button_location
            ORDER BY click_count DESC
        """, (week_ago,))
        
        clicks_data = cursor.fetchall()
        total_clicks = sum(row[2] for row in clicks_data)
        
        # Заявки за неделю
        cursor.execute("""
            SELECT COUNT(*) FROM request_forms WHERE created_at >= %s
        """, (week_ago,))
        new_requests = cursor.fetchone()[0]
        
        # Заполненные шаги и среднее время
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN step2_completed_at IS NOT NULL THEN 1 END) as completed_step2,
                AVG(EXTRACT(EPOCH FROM (step1_completed_at - step1_started_at))) as avg_step1_duration,
                AVG(EXTRACT(EPOCH FROM (step2_completed_at - step2_started_at))) as avg_step2_duration
            FROM request_forms 
            WHERE created_at >= %s AND step1_started_at IS NOT NULL
        """, (week_ago,))
        
        steps_data = cursor.fetchone()
        step1_count = steps_data[0]
        step2_count = steps_data[1]
        avg_step1_seconds = int(steps_data[2]) if steps_data[2] else 0
        avg_step2_seconds = int(steps_data[3]) if steps_data[3] else 0
        
        cursor.close()
        conn.close()
        
        # Форматирование времени
        def format_time(seconds):
            if seconds == 0:
                return "н/д"
            minutes = seconds // 60
            secs = seconds % 60
            return f"{minutes}:{str(secs).zfill(2)}"
        
        # Формируем сообщение
        message = f"""📊 <b>Статистика за неделю</b>
📅 {week_ago.strftime('%d.%m.%Y')} - {datetime.now().strftime('%d.%m.%Y')}

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
        
        if clicks_data:
            for button_name, button_location, count in clicks_data:
                message += f"\n• {button_name} ({button_location}): {count}"
        else:
            message += "\nКликов пока не было"
        
        # Отправляем в Telegram
        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        telegram_data = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(telegram_url, json=telegram_data)
        
        if response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Статистика отправлена в Telegram'
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Failed to send to Telegram',
                    'details': response.text
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
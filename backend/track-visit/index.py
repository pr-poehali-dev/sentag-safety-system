import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Сохранение посещения страницы уникальным пользователем"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
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
        body = json.loads(event.get('body', '{}'))
        visitor_id = body.get('visitor_id')
        domain = body.get('domain', 'sentag.ru')
        
        if not visitor_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'visitor_id is required'}),
                'isBase64Encoded': False
            }
        
        headers = event.get('headers', {})
        user_agent = headers.get('user-agent', '')
        ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Проверяем, есть ли уже запись о посещении этого visitor_id сегодня на этом домене
        cursor.execute("""
            SELECT id FROM t_p28851569_sentag_safety_system.page_visits
            WHERE visitor_id = %s 
            AND domain = %s
            AND DATE(visited_at) = CURRENT_DATE
            LIMIT 1
        """, (visitor_id, domain))
        
        existing_visit = cursor.fetchone()
        
        # Записываем посещение только если ещё не было сегодня на этом домене
        if not existing_visit:
            cursor.execute(
                "INSERT INTO t_p28851569_sentag_safety_system.page_visits (visitor_id, user_agent, ip_address, domain) VALUES (%s, %s, %s, %s)",
                (visitor_id, user_agent, ip_address, domain)
            )
        
        # Создаём или обновляем запись в таблице visitors для статистики
        cursor.execute("""
            INSERT INTO t_p28851569_sentag_safety_system.visitors (visitor_id, user_agent, first_visit, last_activity, domain)
            VALUES (%s, %s, NOW(), NOW(), %s)
            ON CONFLICT (visitor_id) 
            DO UPDATE SET last_activity = NOW(), user_agent = EXCLUDED.user_agent, domain = EXCLUDED.domain
        """, (visitor_id, user_agent, domain))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
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
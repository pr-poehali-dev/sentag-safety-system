import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Сохранение посещения и/или клика по кнопке в одном запросе"""
    
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
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    visitor_id = body.get('visitor_id')
    domain = body.get('domain', 'sentag.ru')
    button_name = body.get('button_name')
    button_location = body.get('button_location')
    referrer = body.get('referrer') or None
    clicks_batch = body.get('clicks') or []
    
    if not visitor_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'visitor_id is required'}),
            'isBase64Encoded': False
        }
    
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    user_agent = headers.get('user-agent', '')
    ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    if not button_name:
        cursor.execute("""
            SELECT id FROM t_p28851569_sentag_safety_system.page_visits
            WHERE visitor_id = %s AND domain = %s AND DATE(visited_at) = CURRENT_DATE
            LIMIT 1
        """, (visitor_id, domain))
        
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO t_p28851569_sentag_safety_system.page_visits (visitor_id, user_agent, ip_address, domain, referrer) VALUES (%s, %s, %s, %s, %s)",
                (visitor_id, user_agent, ip_address, domain, referrer)
            )
        
        cursor.execute("""
            INSERT INTO t_p28851569_sentag_safety_system.visitors (visitor_id, user_agent, first_visit, last_activity, domain)
            VALUES (%s, %s, NOW(), NOW(), %s)
            ON CONFLICT (visitor_id)
            DO UPDATE SET last_activity = NOW(), user_agent = EXCLUDED.user_agent, domain = EXCLUDED.domain
        """, (visitor_id, user_agent, domain))
    
    if button_name and button_location:
        cursor.execute(
            "INSERT INTO button_clicks (button_name, button_location, user_agent, ip_address, visitor_id, domain) VALUES (%s, %s, %s, %s, %s, %s)",
            (button_name, button_location, user_agent, ip_address, visitor_id, domain)
        )

    if clicks_batch:
        cursor.executemany(
            "INSERT INTO button_clicks (button_name, button_location, user_agent, ip_address, visitor_id, domain) VALUES (%s, %s, %s, %s, %s, %s)",
            [
                (c.get('button_name', ''), c.get('button_location', ''), user_agent, ip_address, visitor_id, domain)
                for c in clicks_batch
                if c.get('button_name') and c.get('button_location')
            ]
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }
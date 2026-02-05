import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Управление настройками сайта (получение и обновление)"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("SELECT key, value FROM site_settings")
            rows = cur.fetchall()
            
            settings = {}
            for row in rows:
                key, value = row
                if value.lower() in ('true', 'false'):
                    settings[key] = value.lower() == 'true'
                else:
                    settings[key] = value
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'settings': settings
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            key = body.get('key')
            value = body.get('value')
            
            if not key:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Key is required'}),
                    'isBase64Encoded': False
                }
            
            if isinstance(value, bool):
                value = 'true' if value else 'false'
            else:
                value = str(value)
            
            cur.execute("""
                INSERT INTO site_settings (key, value, updated_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT (key) 
                DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
            """, (key, value))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Setting {key} updated'
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
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
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

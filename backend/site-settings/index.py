import json
import os
import psycopg2
import boto3
import base64
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Управление настройками сайта (получение и обновление)"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token'
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
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            favicon_content = body.get('faviconContent')
            favicon_file_name = body.get('faviconFileName')
            
            if not favicon_content or not favicon_file_name:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Favicon file is required'}),
                    'isBase64Encoded': False
                }
            
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            
            favicon_data = base64.b64decode(favicon_content)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            favicon_key = f'favicon/{timestamp}_{favicon_file_name}'
            
            content_type = 'image/png' if favicon_file_name.lower().endswith('.png') else 'image/jpeg'
            
            s3.put_object(
                Bucket='files',
                Key=favicon_key,
                Body=favicon_data,
                ContentType=content_type
            )
            
            favicon_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{favicon_key}"
            
            cur.execute("""
                INSERT INTO site_settings (key, value, updated_at)
                VALUES ('favicon_url', %s, NOW())
                ON CONFLICT (key) 
                DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
            """, (favicon_url,))
            
            cur.execute("""
                INSERT INTO site_settings (key, value, updated_at)
                VALUES ('og_image_url', %s, NOW())
                ON CONFLICT (key) 
                DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
            """, (favicon_url,))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'favicon_url': favicon_url
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
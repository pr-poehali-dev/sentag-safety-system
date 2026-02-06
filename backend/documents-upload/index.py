import json
import os
import base64
import boto3
from datetime import datetime
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для загрузки документов в секцию "Документы и сертификаты"'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization'
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
        auth_header = event.get('headers', {}).get('X-Authorization', '')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        body = json.loads(event.get('body', '{}'))
        title = body.get('title', '').strip()
        description = body.get('description', '').strip()
        icon_name = body.get('iconName', 'FileText').strip()
        file_name = body.get('fileName', '')
        file_type = body.get('fileType', '')
        file_content = body.get('fileContent', '')
        
        if not title or not file_name or not file_content:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        file_data = base64.b64decode(file_content)
        file_size = len(file_data)
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        s3_key = f'documents/{timestamp}_{file_name}'
        
        s3.put_object(
            Bucket='files',
            Key=s3_key,
            Body=file_data,
            ContentType=file_type
        )
        
        file_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute(
            """INSERT INTO documents (title, description, icon_name, file_url, file_name, file_type, file_size)
               VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (title, description, icon_name, file_url, file_name, file_type, file_size)
        )
        
        doc_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'documentId': doc_id,
                'fileUrl': file_url
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        import traceback
        error_details = {
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()
        }
        print(f"Upload error: {error_details}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f"{type(e).__name__}: {str(e)}"}),
            'isBase64Encoded': False
        }
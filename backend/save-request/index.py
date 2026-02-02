import json
import os
import psycopg2
import boto3
import base64
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Сохранение данных заявки на расчет в базу данных с загрузкой файлов в S3"""
    
    method = event.get('httpMethod', 'POST')
    
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
        step = body.get('step')
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if step == 1:
            cur.execute("""
                INSERT INTO request_forms (
                    phone, email, company, role, full_name, 
                    object_name, object_address, consent, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'step1_completed')
                RETURNING id
            """, (
                body.get('phone'),
                body.get('email'),
                body.get('company'),
                body.get('role'),
                body.get('fullName'),
                body.get('objectName'),
                body.get('objectAddress'),
                body.get('consent', False)
            ))
            request_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'requestId': request_id,
                    'message': 'Шаг 1 сохранен'
                }),
                'isBase64Encoded': False
            }
        
        elif step == 2:
            request_id = body.get('requestId')
            
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            
            company_card_url = None
            pool_scheme_urls = []
            
            if body.get('companyCardFile'):
                file_data = body['companyCardFile']
                file_name = file_data.get('name', 'company_card.pdf')
                file_content = base64.b64decode(file_data['content'])
                content_type = file_data.get('type', 'application/pdf')
                
                key = f'request-forms/{request_id}/company_card_{file_name}'
                s3.put_object(
                    Bucket='files',
                    Key=key,
                    Body=file_content,
                    ContentType=content_type
                )
                company_card_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
            
            if body.get('poolSchemeFiles'):
                for idx, file_data in enumerate(body['poolSchemeFiles']):
                    file_name = file_data.get('name', f'pool_scheme_{idx}.pdf')
                    file_content = base64.b64decode(file_data['content'])
                    content_type = file_data.get('type', 'application/pdf')
                    
                    key = f'request-forms/{request_id}/pool_scheme_{idx}_{file_name}'
                    s3.put_object(
                        Bucket='files',
                        Key=key,
                        Body=file_content,
                        ContentType=content_type
                    )
                    pool_scheme_urls.append(f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}")
            
            cur.execute("""
                UPDATE request_forms 
                SET visitors_info = %s,
                    pool_size = %s,
                    deadline = %s,
                    company_card_url = %s,
                    pool_scheme_urls = %s,
                    step2_completed_at = NOW(),
                    updated_at = NOW(),
                    status = 'completed'
                WHERE id = %s
                RETURNING id
            """, (
                body.get('visitorsInfo'),
                body.get('poolSize'),
                body.get('deadline'),
                company_card_url,
                pool_scheme_urls,
                request_id
            ))
            
            if cur.rowcount == 0:
                conn.rollback()
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Заявка не найдена'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Заявка полностью сохранена'
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неверный шаг'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
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

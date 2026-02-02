import json
import os
import psycopg2

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
        body_str = event.get('body', '{}')
        print(f"Received body (first 500 chars): {body_str[:500]}")
        
        body = json.loads(body_str)
        step = body.get('step')
        print(f"Processing step: {step}")
        
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
            company_card_url = body.get('companyCardUrl')
            pool_scheme_urls = body.get('poolSchemeUrls', [])
            
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
        print(f"Error occurred: {type(e).__name__}: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        
        if 'conn' in locals():
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e), 'type': type(e).__name__}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
import json
import os
import psycopg2
import requests

def handler(event: dict, context) -> dict:
    """Сохранение данных заявки на расчет в базу данных с загрузкой файлов в S3"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, X-Requested-With',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Credentials': 'false'
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
        
        cur.execute("""
            DELETE FROM request_forms
            WHERE created_at < NOW() - INTERVAL '7 days'
        """)
        deleted_count = cur.rowcount
        if deleted_count > 0:
            print(f"Удалено старых заявок: {deleted_count}")
        conn.commit()
        
        if step == 1:
            step1_started = body.get('step1StartTime')
            visitor_id = body.get('visitorId')
            if step1_started:
                cur.execute("""
                    INSERT INTO request_forms (
                        phone, email, company, role, full_name, 
                        object_name, object_address, consent, status,
                        step1_started_at, step1_completed_at, visitor_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'step1_completed', %s, NOW(), %s)
                    RETURNING id
                """, (
                    body.get('phone'),
                    body.get('email'),
                    body.get('company'),
                    body.get('role'),
                    body.get('fullName'),
                    body.get('objectName'),
                    body.get('objectAddress'),
                    body.get('consent', False),
                    step1_started,
                    visitor_id
                ))
            else:
                cur.execute("""
                    INSERT INTO request_forms (
                        phone, email, company, role, full_name, 
                        object_name, object_address, consent, status, visitor_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'step1_completed', %s)
                    RETURNING id
                """, (
                    body.get('phone'),
                    body.get('email'),
                    body.get('company'),
                    body.get('role'),
                    body.get('fullName'),
                    body.get('objectName'),
                    body.get('objectAddress'),
                    body.get('consent', False),
                    visitor_id
                ))
            request_id = cur.fetchone()[0]
            print(f"Step 1: Created request_id={request_id}")
            conn.commit()
            print("Step 1: DB commit successful")
            
            response_data = {
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
            print(f"Step 1: Returning response with requestId={request_id}")
            return response_data
        
        elif step == 2:
            request_id = body.get('requestId')
            company_card_url = body.get('companyCardUrl')
            pool_scheme_urls = body.get('poolSchemeUrls', [])
            step2_started = body.get('step2StartTime')
            
            cur.execute("""
                UPDATE request_forms 
                SET visitors_info = %s,
                    pool_size = %s,
                    deadline = %s,
                    company_card_url = %s,
                    pool_scheme_urls = %s,
                    step2_started_at = %s,
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
                step2_started,
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
            
            cur.execute("""
                SELECT phone, email, company, role, full_name,
                       object_name, object_address,
                       step1_started_at, step1_completed_at,
                       step2_started_at, step2_completed_at
                FROM request_forms WHERE id = %s
            """, (request_id,))
            row = cur.fetchone()
            
            send_telegram_step2(request_id, {
                'phone': row[0],
                'email': row[1],
                'company': row[2],
                'role': row[3],
                'fullName': row[4],
                'objectName': row[5],
                'objectAddress': row[6],
                'step1_started_at': row[7],
                'step1_completed_at': row[8],
                'step2_started_at': row[9],
                'step2_completed_at': row[10],
                'visitorsInfo': body.get('visitorsInfo'),
                'poolSize': body.get('poolSize'),
                'deadline': body.get('deadline'),
                'companyCardUrl': company_card_url,
                'poolSchemeUrls': pool_scheme_urls
            })
            
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

def send_telegram_step1(request_id: int, data: dict):
    """Отправка первого шага заявки в Telegram"""
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        print(f'[Telegram] Step 1: bot_token exists={bool(bot_token)}, chat_id exists={bool(chat_id)}')
        
        if not bot_token or not chat_id:
            print('[Telegram] Credentials not configured')
            return
        
        print(f'[Telegram] Sending step 1 notification for request #{request_id}')
        
        role_names = {
            'contractor': 'Подрядчик',
            'customer': 'Конечный заказчик',
            'design': 'Проектная организация'
        }
        
        message = f"""🔔 <b>Новая заявка #{request_id}</b>
<b>Шаг 1/2: Контактные данные</b>

👤 <b>Контактное лицо:</b> {data.get('fullName')}
📞 <b>Телефон:</b> {data.get('phone')}
✉️ <b>Email:</b> {data.get('email')}

🏢 <b>Предприятие:</b> {data.get('company')}
👔 <b>Роль:</b> {role_names.get(data.get('role'), data.get('role'))}

🏊 <b>Объект:</b> {data.get('objectName')}
📍 <b>Адрес:</b> {data.get('objectAddress')}

⏳ <i>Ожидается заполнение шага 2...</i>"""
        
        response = requests.post(
            f'https://api.telegram.org/bot{bot_token}/sendMessage',
            json={
                'chat_id': chat_id,
                'text': message,
                'parse_mode': 'HTML'
            },
            timeout=10
        )
        
        print(f'[Telegram] Step 1 response status: {response.status_code}')
        
        if response.status_code != 200:
            print(f'[Telegram] Step 1 error response: {response.text}')
        else:
            print('[Telegram] Step 1 notification sent successfully')
            
    except Exception as e:
        print(f'[Telegram] Error sending step 1: {type(e).__name__}: {e}')
        import traceback
        print(f'[Telegram] Traceback: {traceback.format_exc()}')

def send_telegram_step2(request_id: int, data: dict):
    """Отправка второго шага заявки в Telegram"""
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        print(f'[Telegram] Step 2: bot_token exists={bool(bot_token)}, chat_id exists={bool(chat_id)}')
        
        if not bot_token or not chat_id:
            print('[Telegram] Credentials not configured')
            return
        
        print(f'[Telegram] Sending step 2 notification for request #{request_id}')
        
        # Расчет времени заполнения
        step1_time = "н/д"
        step2_time = "н/д"
        
        if data.get('step1_started_at') and data.get('step1_completed_at'):
            from datetime import datetime
            start = data['step1_started_at']
            end = data['step1_completed_at']
            if isinstance(start, str):
                start = datetime.fromisoformat(start.replace('Z', '+00:00'))
            if isinstance(end, str):
                end = datetime.fromisoformat(end.replace('Z', '+00:00'))
            duration_seconds = int((end - start).total_seconds())
            step1_time = f"{duration_seconds // 60}:{str(duration_seconds % 60).zfill(2)}"
        
        if data.get('step2_started_at') and data.get('step2_completed_at'):
            from datetime import datetime
            start = data['step2_started_at']
            end = data['step2_completed_at']
            if isinstance(start, str):
                start = datetime.fromisoformat(start.replace('Z', '+00:00'))
            if isinstance(end, str):
                end = datetime.fromisoformat(end.replace('Z', '+00:00'))
            duration_seconds = int((end - start).total_seconds())
            step2_time = f"{duration_seconds // 60}:{str(duration_seconds % 60).zfill(2)}"
        
        role_names = {
            'contractor': 'Подрядчик',
            'customer': 'Конечный заказчик',
            'design': 'Проектная организация'
        }
        
        message = f"""✅ <b>Заявка #{request_id} завершена</b>

👤 <b>Контактное лицо:</b> {data.get('fullName')}
📞 <b>Телефон:</b> {data.get('phone')}
✉️ <b>Email:</b> {data.get('email')}

🏢 <b>Предприятие:</b> {data.get('company')}
👔 <b>Роль:</b> {role_names.get(data.get('role'), data.get('role'))}

🏊 <b>Объект:</b> {data.get('objectName')}
📍 <b>Адрес:</b> {data.get('objectAddress')}

⏱ <b>Время заполнения:</b>
• Шаг 1: {step1_time}
• Шаг 2: {step2_time}

📊 <b>Информация о посетителях:</b>
{data.get('visitorsInfo') or 'Не указано'}

📏 <b>Параметры бассейна:</b>
{data.get('poolSize') or 'Не указано'}

📅 <b>Сроки поставки:</b>
{data.get('deadline') or 'Не указано'}
"""
        
        if data.get('companyCardUrl'):
            message += f"\n📎 <b>Карточка предприятия:</b> <a href=\"{data.get('companyCardUrl')}\">Скачать</a>"
        
        pool_schemes = data.get('poolSchemeUrls', [])
        if pool_schemes:
            message += f"\n📐 <b>Схемы бассейна ({len(pool_schemes)}):</b>"
            for i, url in enumerate(pool_schemes, 1):
                message += f"\n  • <a href=\"{url}\">Схема {i}</a>"
        
        response = requests.post(
            f'https://api.telegram.org/bot{bot_token}/sendMessage',
            json={
                'chat_id': chat_id,
                'text': message,
                'parse_mode': 'HTML',
                'disable_web_page_preview': True
            },
            timeout=10
        )
        
        print(f'[Telegram] Step 2 response status: {response.status_code}')
        
        if response.status_code != 200:
            print(f'[Telegram] Step 2 error response: {response.text}')
        else:
            print('[Telegram] Step 2 notification sent successfully')
            
    except Exception as e:
        print(f'[Telegram] Error sending step 2: {type(e).__name__}: {e}')
        import traceback
        print(f'[Telegram] Traceback: {traceback.format_exc()}')
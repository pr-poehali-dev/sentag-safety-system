import json
import os
import psycopg2
import psycopg2.extras
import boto3
import base64
import uuid
import requests as http_requests
from datetime import datetime, timezone, timedelta

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, X-Requested-With',
}

def handler(event: dict, context) -> dict:
    """
    Управление заявками.
    GET    — список заявок
    POST   — сохранение шага заявки (step в body)
    POST   ?action=upload_file — загрузка файла в S3
    DELETE ?id=N — удаление заявки
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Access-Control-Max-Age': '86400'}, 'body': '', 'isBase64Encoded': False}

    def resp(status, body):
        return {
            'statusCode': status,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps(body),
            'isBase64Encoded': False
        }

    dsn = os.environ.get('DATABASE_URL')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    # GET — список заявок
    if method == 'GET':
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("DELETE FROM request_forms WHERE created_at < NOW() - INTERVAL '7 days'")
        conn.commit()
        cur.execute("""
            SELECT id, phone, email, company, role, full_name, object_name, object_address,
                   consent, marketing_consent, visitors_info, pool_size, deadline,
                   company_card_url, pool_scheme_urls, status,
                   step1_started_at, step1_completed_at, step2_started_at, step2_completed_at,
                   created_at, updated_at, visitor_id
            FROM request_forms ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        requests_list = []
        for row in rows:
            request_data = dict(row)
            visitor_id = request_data.get('visitor_id')
            user_activity = {'clicks': [], 'first_visit': None, 'time_on_site': 0}
            try:
                if visitor_id and request_data.get('step1_started_at'):
                    form_start = request_data['step1_started_at']
                    cur.execute("SELECT button_name, button_location, clicked_at FROM button_clicks WHERE visitor_id = %s ORDER BY clicked_at ASC", (visitor_id,))
                    click_rows = cur.fetchall()
                    clicks_list = [{'button_name': c['button_name'], 'button_location': c['button_location'], 'clicked_at': c['clicked_at'].isoformat()} for c in click_rows]
                    user_activity['clicks'] = clicks_list
                    if clicks_list:
                        first_click_time = click_rows[0]['clicked_at']
                        user_activity['first_visit'] = first_click_time.isoformat()
                        user_activity['time_on_site'] = int((form_start - first_click_time).total_seconds())
                    else:
                        cur.execute("SELECT first_visit FROM visitors WHERE visitor_id = %s", (visitor_id,))
                        visitor_row = cur.fetchone()
                        if visitor_row and visitor_row['first_visit']:
                            first_visit = visitor_row['first_visit']
                            user_activity['first_visit'] = first_visit.isoformat()
                            if first_visit.tzinfo is None:
                                first_visit = first_visit.replace(tzinfo=timezone.utc)
                            if form_start.tzinfo is None:
                                form_start = form_start.replace(tzinfo=timezone.utc)
                            user_activity['time_on_site'] = int((form_start - first_visit).total_seconds())
            except Exception as e:
                print(f"Warning: Could not load user activity: {e}")
            request_data['user_activity'] = user_activity
            for key, value in request_data.items():
                if isinstance(value, datetime):
                    request_data[key] = value.isoformat()
            requests_list.append(request_data)
        cur.close()
        conn.close()
        return resp(200, {'success': True, 'requests': requests_list, 'total': len(requests_list)})

    # DELETE — удаление заявки
    if method == 'DELETE':
        request_id = params.get('id')
        if not request_id:
            return resp(400, {'error': 'ID заявки не указан'})
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        cur.execute("DELETE FROM request_forms WHERE id = %s RETURNING id", (request_id,))
        if cur.rowcount == 0:
            conn.rollback()
            cur.close()
            conn.close()
            return resp(404, {'error': 'Заявка не найдена'})
        conn.commit()
        cur.close()
        conn.close()
        return resp(200, {'success': True, 'message': 'Заявка удалена'})

    # POST upload_file — загрузка файла в S3
    if method == 'POST' and action == 'upload_file':
        body = json.loads(event.get('body', '{}'))
        file_name = body.get('name')
        file_type = body.get('type')
        file_content_base64 = body.get('content')
        request_id = body.get('requestId')
        file_category = body.get('category', 'other')
        if not all([file_name, file_type, file_content_base64, request_id]):
            return resp(400, {'error': 'Missing required fields'})
        file_content = base64.b64decode(file_content_base64)
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        unique_id = str(uuid.uuid4())[:8]
        key = f'request-forms/{request_id}/{file_category}_{unique_id}_{file_name}'
        s3.put_object(Bucket='files', Key=key, Body=file_content, ContentType=file_type)
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return resp(200, {'success': True, 'url': cdn_url, 'key': key})

    # POST — сохранение шага заявки
    if method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        step = body.get('step')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        cur.execute("DELETE FROM request_forms WHERE created_at < NOW() - INTERVAL '7 days'")
        conn.commit()

        if step == 1:
            step1_started = body.get('step1StartTime')
            visitor_id = body.get('visitorId')
            if step1_started:
                cur.execute("""
                    INSERT INTO request_forms (phone, email, company, role, full_name, object_name, object_address, consent, marketing_consent, status, step1_started_at, step1_completed_at, visitor_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'step1_completed', %s, NOW(), %s) RETURNING id
                """, (body.get('phone'), body.get('email'), body.get('company'), body.get('role'), body.get('fullName'),
                      body.get('objectName'), body.get('objectAddress'), body.get('consent', False), body.get('marketingConsent', False),
                      step1_started, visitor_id))
            else:
                cur.execute("""
                    INSERT INTO request_forms (phone, email, company, role, full_name, object_name, object_address, consent, marketing_consent, status, visitor_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'step1_completed', %s) RETURNING id
                """, (body.get('phone'), body.get('email'), body.get('company'), body.get('role'), body.get('fullName'),
                      body.get('objectName'), body.get('objectAddress'), body.get('consent', False), body.get('marketingConsent', False), visitor_id))
            request_id = cur.fetchone()[0]
            conn.commit()

            user_activity = None
            if visitor_id and step1_started:
                try:
                    form_start = datetime.fromisoformat(step1_started.replace('Z', '+00:00'))
                    cur.execute("SELECT button_name, button_location, clicked_at FROM button_clicks WHERE visitor_id = %s ORDER BY clicked_at ASC", (visitor_id,))
                    clicks = [{'button_name': r[0], 'button_location': r[1], 'clicked_at': r[2].isoformat()} for r in cur.fetchall()]
                    time_on_site = 0
                    if clicks:
                        cur.execute("SELECT MIN(clicked_at) FROM button_clicks WHERE visitor_id = %s", (visitor_id,))
                        first_click = cur.fetchone()
                        if first_click and first_click[0]:
                            fct = first_click[0]
                            if fct.tzinfo is None:
                                fct = fct.replace(tzinfo=timezone.utc)
                            time_on_site = int((form_start - fct).total_seconds())
                    else:
                        cur.execute("SELECT first_visit FROM visitors WHERE visitor_id = %s", (visitor_id,))
                        vr = cur.fetchone()
                        if vr and vr[0]:
                            fv = vr[0]
                            if fv.tzinfo is None:
                                fv = fv.replace(tzinfo=timezone.utc)
                            time_on_site = int((form_start - fv).total_seconds())
                    user_activity = {'time_on_site': time_on_site, 'clicks': clicks}
                except Exception as e:
                    print(f"Could not load user activity: {e}")

            message_id = _send_telegram_step1(request_id, body, user_activity)
            if message_id:
                cur.execute("UPDATE request_forms SET telegram_step1_message_id = %s WHERE id = %s", (message_id, request_id))
                conn.commit()
            cur.close()
            conn.close()
            return resp(200, {'success': True, 'requestId': request_id, 'message': 'Шаг 1 сохранен'})

        elif step == 2:
            request_id = body.get('requestId')
            cur.execute("""
                UPDATE request_forms
                SET visitors_info=%s, pool_size=%s, deadline=%s, company_card_url=%s, pool_scheme_urls=%s,
                    step2_started_at=%s, step2_completed_at=NOW(), updated_at=NOW(), status='completed'
                WHERE id=%s RETURNING id
            """, (body.get('visitorsInfo'), body.get('poolSize'), body.get('deadline'),
                  body.get('companyCardUrl'), body.get('poolSchemeUrls', []),
                  body.get('step2StartTime'), request_id))
            if cur.rowcount == 0:
                conn.rollback()
                cur.close()
                conn.close()
                return resp(404, {'error': 'Заявка не найдена'})
            conn.commit()
            cur.execute("""
                SELECT phone, email, company, role, full_name, object_name, object_address,
                       step1_started_at, step1_completed_at, step2_started_at, step2_completed_at, visitor_id, marketing_consent, telegram_step1_message_id
                FROM request_forms WHERE id = %s
            """, (request_id,))
            row = cur.fetchone()
            visitor_id = row[11]
            user_activity = None
            if visitor_id:
                try:
                    step1_started_at = row[7]
                    cur.execute("SELECT button_name, button_location, clicked_at FROM button_clicks WHERE visitor_id = %s ORDER BY clicked_at ASC", (visitor_id,))
                    clicks = [{'button_name': r[0], 'button_location': r[1], 'clicked_at': r[2].isoformat()} for r in cur.fetchall()]
                    time_on_site = 0
                    if clicks:
                        cur.execute("SELECT MIN(clicked_at) FROM button_clicks WHERE visitor_id = %s", (visitor_id,))
                        fc = cur.fetchone()
                        if fc and fc[0]:
                            fct = fc[0]
                            if fct.tzinfo is None:
                                fct = fct.replace(tzinfo=timezone.utc)
                            if step1_started_at and step1_started_at.tzinfo is None:
                                step1_started_at = step1_started_at.replace(tzinfo=timezone.utc)
                            time_on_site = int((step1_started_at - fct).total_seconds())
                    user_activity = {'time_on_site': time_on_site, 'clicks': clicks}
                except Exception as e:
                    print(f"Could not load user activity step2: {e}")
            _send_telegram_step2(request_id, {
                'phone': row[0], 'email': row[1], 'company': row[2], 'role': row[3], 'fullName': row[4],
                'objectName': row[5], 'objectAddress': row[6],
                'step1_started_at': row[7], 'step1_completed_at': row[8],
                'step2_started_at': row[9], 'step2_completed_at': row[10],
                'marketingConsent': row[12],
                'visitorsInfo': body.get('visitorsInfo'), 'poolSize': body.get('poolSize'), 'deadline': body.get('deadline'),
                'companyCardUrl': body.get('companyCardUrl'), 'poolSchemeUrls': body.get('poolSchemeUrls', []),
                'user_activity': user_activity, 'telegram_step1_message_id': row[13]
            })
            cur.close()
            conn.close()
            return resp(200, {'success': True, 'message': 'Заявка полностью сохранена'})

        cur.close()
        conn.close()
        return resp(400, {'error': 'Неверный шаг'})

    return resp(405, {'error': 'Method not allowed'})


def _send_telegram_step1(request_id, data, user_activity=None):
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not bot_token or not chat_id:
        return None
    role_names = {'contractor': 'Монтажная организация', 'customer': 'Собственник объекта', 'design': 'Проектная организация'}
    marketing_consent_text = "✅ Да" if data.get('marketingConsent', False) else "❌ Нет"
    message = f"""🔔 <b>Новая заявка #{request_id}</b>
<b>Шаг 1/2: Контактные данные</b>

👤 <b>Контактное лицо:</b> {data.get('fullName')}
📞 <b>Телефон:</b> {data.get('phone')}
✉️ <b>Email:</b> {data.get('email')}

🏢 <b>Предприятие:</b> {data.get('company')}
👔 <b>Роль:</b> {role_names.get(data.get('role'), data.get('role'))}

🏊 <b>Объект:</b> {data.get('objectName')}
📍 <b>Адрес:</b> {data.get('objectAddress')}

📬 <b>Согласие на рекламу:</b> {marketing_consent_text}
"""
    if user_activity:
        time_on_site = user_activity.get('time_on_site', 0)
        clicks = user_activity.get('clicks', [])
        message += f"\n🎯 <b>Активность на сайте:</b>"
        message += f"\n⏱ Время на сайте до заявки: {time_on_site // 60}:{str(time_on_site % 60).zfill(2)}"
        if clicks:
            total_clicks = len(clicks)
            message += f"\n🖱 Кликов: {total_clicks}"
            display_clicks = clicks[-15:] if total_clicks > 15 else clicks
            message += f"\n\n<b>История кликов{' (последние 15 из ' + str(total_clicks) + ')' if total_clicks > 15 else ''}:</b>"
            for i, click in enumerate(display_clicks, 1):
                clicked_time = click['clicked_at']
                if isinstance(clicked_time, str):
                    clicked_time = datetime.fromisoformat(clicked_time.replace('Z', '+00:00'))
                ekb_tz = timezone(timedelta(hours=5))
                ct = clicked_time.astimezone(ekb_tz)
                months_ru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
                date_str = f"{ct.strftime('%H:%M')}, {ct.day} {months_ru[ct.month - 1]}"
                message += f"\n{i}. {click['button_name']} ({click['button_location']}) — {date_str}"
    message += "\n\n⏳ <i>Ожидается заполнение шага 2...</i>"
    try:
        r = http_requests.post(f'https://api.telegram.org/bot{bot_token}/sendMessage',
            json={'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML'}, timeout=10)
        if r.status_code == 200:
            return r.json().get('result', {}).get('message_id')
    except Exception as e:
        print(f'Telegram step1 error: {e}')
    return None


def _send_telegram_step2(request_id, data):
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not bot_token or not chat_id:
        return
    # Удаляем сообщение шага 1
    msg_id = data.get('telegram_step1_message_id')
    if msg_id:
        try:
            http_requests.post(f'https://api.telegram.org/bot{bot_token}/deleteMessage',
                json={'chat_id': chat_id, 'message_id': msg_id}, timeout=10)
        except Exception:
            pass

    def calc_time(start, end):
        if not start or not end:
            return "н/д"
        if isinstance(start, str):
            start = datetime.fromisoformat(start.replace('Z', '+00:00'))
        if isinstance(end, str):
            end = datetime.fromisoformat(end.replace('Z', '+00:00'))
        d = int((end - start).total_seconds())
        return f"{d // 60}:{str(d % 60).zfill(2)}"

    role_names = {'contractor': 'Монтажная организация', 'customer': 'Собственник объекта', 'design': 'Проектная организация'}
    marketing_consent_text = "✅ Да" if data.get('marketingConsent', False) else "❌ Нет"
    message = f"""✅ <b>Заявка #{request_id} завершена</b>

👤 <b>Контактное лицо:</b> {data.get('fullName')}
📞 <b>Телефон:</b> {data.get('phone')}
✉️ <b>Email:</b> {data.get('email')}

🏢 <b>Предприятие:</b> {data.get('company')}
👔 <b>Роль:</b> {role_names.get(data.get('role'), data.get('role'))}

🏊 <b>Объект:</b> {data.get('objectName')}
📍 <b>Адрес:</b> {data.get('objectAddress')}

📬 <b>Согласие на рекламу:</b> {marketing_consent_text}

⏱ <b>Время заполнения:</b>
• Шаг 1: {calc_time(data.get('step1_started_at'), data.get('step1_completed_at'))}
• Шаг 2: {calc_time(data.get('step2_started_at'), data.get('step2_completed_at'))}

📊 <b>Информация о посетителях:</b>
{data.get('visitorsInfo') or 'Не указано'}

📏 <b>Параметры бассейна:</b>
{data.get('poolSize') or 'Не указано'}

📅 <b>Сроки поставки:</b>
{data.get('deadline') or 'Не указано'}
"""
    user_activity = data.get('user_activity')
    if user_activity:
        time_on_site = user_activity.get('time_on_site', 0)
        clicks = user_activity.get('clicks', [])
        message += f"\n\n🎯 <b>Активность на сайте:</b>"
        message += f"\n⏱ Время на сайте до заявки: {time_on_site // 60}:{str(time_on_site % 60).zfill(2)}"
        if clicks:
            total_clicks = len(clicks)
            message += f"\n🖱 Кликов: {total_clicks}"
            display_clicks = clicks[-15:] if total_clicks > 15 else clicks
            message += f"\n\n<b>История кликов{' (последние 15 из ' + str(total_clicks) + ')' if total_clicks > 15 else ''}:</b>"
            for i, click in enumerate(display_clicks, 1):
                clicked_time = click['clicked_at']
                if isinstance(clicked_time, str):
                    clicked_time = datetime.fromisoformat(clicked_time.replace('Z', '+00:00'))
                ekb_tz = timezone(timedelta(hours=5))
                ct = clicked_time.astimezone(ekb_tz)
                months_ru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
                date_str = f"{ct.strftime('%H:%M')}, {ct.day} {months_ru[ct.month - 1]}"
                message += f"\n{i}. {click['button_name']} ({click['button_location']}) — {date_str}"
    if data.get('companyCardUrl'):
        message += f"\n\n📎 <b>Карточка предприятия:</b> <a href=\"{data.get('companyCardUrl')}\">Скачать</a>"
    pool_schemes = data.get('poolSchemeUrls', [])
    if pool_schemes:
        message += f"\n📐 <b>Схемы бассейна ({len(pool_schemes)}):</b>"
        for i, url in enumerate(pool_schemes, 1):
            message += f"\n  • <a href=\"{url}\">Схема {i}</a>"
    try:
        http_requests.post(f'https://api.telegram.org/bot{bot_token}/sendMessage',
            json={'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML', 'disable_web_page_preview': True}, timeout=10)
    except Exception as e:
        print(f'Telegram step2 error: {e}')

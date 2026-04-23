import json
import os
import psycopg2
import psycopg2.extras
import boto3
import base64
import uuid
import threading
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
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    def get_conn(dict_cursor=False):
        c = psycopg2.connect(dsn, options=f'-c search_path={schema}')
        c.autocommit = False
        return c

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    # GET — список заявок
    if method == 'GET':
        conn = get_conn()
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
        conn = get_conn()
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
        conn = get_conn()
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

            cur.close()
            conn.close()
            # Отправляем Telegram в фоне — не блокируем ответ пользователю
            threading.Thread(target=_send_email_step1, args=(request_id, body, user_activity), daemon=True).start()
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
            tg_data = {
                'phone': row[0], 'email': row[1], 'company': row[2], 'role': row[3], 'fullName': row[4],
                'objectName': row[5], 'objectAddress': row[6],
                'step1_started_at': row[7], 'step1_completed_at': row[8],
                'step2_started_at': row[9], 'step2_completed_at': row[10],
                'marketingConsent': row[12],
                'visitorsInfo': body.get('visitorsInfo'), 'poolSize': body.get('poolSize'), 'deadline': body.get('deadline'),
                'companyCardUrl': body.get('companyCardUrl'), 'poolSchemeUrls': body.get('poolSchemeUrls', []),
                'user_activity': user_activity, 'telegram_step1_message_id': row[13]
            }
            cur.close()
            conn.close()
            # Отправляем email в фоне — не блокируем ответ пользователю
            threading.Thread(target=_send_email_step2, args=(request_id, tg_data), daemon=True).start()
            return resp(200, {'success': True, 'message': 'Заявка полностью сохранена'})

        cur.close()
        conn.close()
        return resp(400, {'error': 'Неверный шаг'})

    return resp(405, {'error': 'Method not allowed'})


def _send_email(subject, html_body):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    smtp_user = 'dimanadym@yandex.ru'
    smtp_password = 'cxathnqrmwmidbxr'
    to_email = 'd.gusak@meridian-t.ru'
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))
    try:
        server = smtplib.SMTP_SSL('smtp.yandex.ru', 465, timeout=15)
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f'Email sent: {subject}')
    except Exception as e:
        print(f'Email send error: {e}')


def _send_email_step1(request_id, data, user_activity=None):
    role_names = {'contractor': 'Монтажная организация', 'customer': 'Собственник объекта', 'design': 'Проектная организация'}
    marketing = 'Да' if data.get('marketingConsent', False) else 'Нет'
    html = f"""
<html><body style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
<h2 style="color:#0ea5e9;">🔔 Новая заявка #{request_id} — Шаг 1/2</h2>
<table style="border-collapse:collapse; width:100%; max-width:600px;">
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Контактное лицо</td><td style="padding:8px;">{data.get('fullName')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Телефон</td><td style="padding:8px;">{data.get('phone')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Email</td><td style="padding:8px;">{data.get('email')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Предприятие</td><td style="padding:8px;">{data.get('company')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Роль</td><td style="padding:8px;">{role_names.get(data.get('role'), data.get('role'))}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Объект</td><td style="padding:8px;">{data.get('objectName')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Адрес</td><td style="padding:8px;">{data.get('objectAddress')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Согласие на рекламу</td><td style="padding:8px;">{marketing}</td></tr>
</table>"""
    if user_activity:
        t = user_activity.get('time_on_site', 0)
        clicks = user_activity.get('clicks', [])
        html += f"<p><b>Время на сайте:</b> {t // 60}:{str(t % 60).zfill(2)}, кликов: {len(clicks)}</p>"
        if clicks:
            html += "<p><b>История кликов:</b></p><ol>"
            for c in clicks[-15:]:
                html += f"<li>{c['button_name']} ({c['button_location']})</li>"
            html += "</ol>"
    html += "<p style='color:#64748b; margin-top:20px;'>⏳ Ожидается заполнение шага 2...</p></body></html>"
    _send_email(f'Новая заявка #{request_id} — Шаг 1', html)
    return None


def _send_email_step2(request_id, data):
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
    marketing = 'Да' if data.get('marketingConsent', False) else 'Нет'
    html = f"""
<html><body style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
<h2 style="color:#22c55e;">✅ Заявка #{request_id} завершена</h2>
<table style="border-collapse:collapse; width:100%; max-width:600px;">
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Контактное лицо</td><td style="padding:8px;">{data.get('fullName')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Телефон</td><td style="padding:8px;">{data.get('phone')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Email</td><td style="padding:8px;">{data.get('email')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Предприятие</td><td style="padding:8px;">{data.get('company')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Роль</td><td style="padding:8px;">{role_names.get(data.get('role'), data.get('role'))}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Объект</td><td style="padding:8px;">{data.get('objectName')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Адрес</td><td style="padding:8px;">{data.get('objectAddress')}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Согласие на рекламу</td><td style="padding:8px;">{marketing}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Шаг 1</td><td style="padding:8px;">{calc_time(data.get('step1_started_at'), data.get('step1_completed_at'))}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Шаг 2</td><td style="padding:8px;">{calc_time(data.get('step2_started_at'), data.get('step2_completed_at'))}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Посетители</td><td style="padding:8px;">{data.get('visitorsInfo') or 'Не указано'}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Параметры бассейна</td><td style="padding:8px;">{data.get('poolSize') or 'Не указано'}</td></tr>
  <tr><td style="padding:8px; background:#f1f5f9; font-weight:bold;">Срок поставки</td><td style="padding:8px;">{data.get('deadline') or 'Не указано'}</td></tr>
</table>"""
    if data.get('companyCardUrl'):
        html += f'<p><b>Карточка предприятия:</b> <a href="{data.get("companyCardUrl")}">Скачать</a></p>'
    pool_schemes = data.get('poolSchemeUrls') or []
    if pool_schemes:
        html += f'<p><b>Схемы бассейна ({len(pool_schemes)}):</b></p><ul>'
        for i, url in enumerate(pool_schemes, 1):
            html += f'<li><a href="{url}">Схема {i}</a></li>'
        html += '</ul>'
    user_activity = data.get('user_activity')
    if user_activity:
        t = user_activity.get('time_on_site', 0)
        clicks = user_activity.get('clicks', [])
        html += f"<p><b>Время на сайте:</b> {t // 60}:{str(t % 60).zfill(2)}, кликов: {len(clicks)}</p>"
    html += "</body></html>"
    _send_email(f'Заявка #{request_id} завершена', html)
import json
import os
import hashlib
import secrets
import psycopg2
from datetime import datetime, timedelta
from typing import Optional

def generate_otp() -> str:
    """Генерация 6-значного одноразового пароля"""
    return ''.join([str(secrets.randbelow(10)) for _ in range(6)])

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def send_otp_email(email: str, otp: str) -> bool:
    """Отправка OTP на email через SMTP"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '').strip()
    smtp_password = os.environ.get('SMTP_PASSWORD', '').strip()
    
    if not smtp_user or not smtp_password:
        print("[DEBUG] SMTP credentials not configured")
        return False
    
    print(f"[DEBUG] SMTP config: host={smtp_host}, port={smtp_port}, user={smtp_user}, pass_len={len(smtp_password)}")
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Ваш код доступа в админ-панель Sentag'
    msg['From'] = smtp_user
    msg['To'] = email
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0EA5E9;">Вход в админ-панель Sentag</h2>
          <p>Ваш одноразовый код для входа:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0EA5E9; border-radius: 8px;">
            {otp}
          </div>
          <p style="color: #64748b; margin-top: 20px;">Код действителен 10 минут</p>
          <p style="color: #64748b; font-size: 12px;">Если вы не запрашивали вход, проигнорируйте это письмо</p>
        </div>
      </body>
    </html>
    """
    
    msg.attach(MIMEText(html, 'html'))
    
    try:
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.starttls()
        
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"[DEBUG] Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"[DEBUG] Email send error: {e}")
        import traceback
        print(f"[DEBUG] Traceback: {traceback.format_exc()}")
        return False

def get_db_connection():
    """Подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(dsn, options=f'-c search_path={schema}')
    conn.autocommit = False
    return conn

def handler(event: dict, context) -> dict:
    """API для авторизации и управления пользователями админ-панели"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}
        action = body.get('action', '')
        
        conn = get_db_connection()
        
        if action == 'request_otp':
            email = body.get('email', '').strip().lower()
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute("SELECT id, is_active FROM users WHERE email = %s", (email,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
                        'isBase64Encoded': False
                    }
                
                user_id, is_active = user
                
                if not is_active:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь деактивирован'}),
                        'isBase64Encoded': False
                    }
                
                otp = generate_otp()
                otp_hash = hash_password(otp)
                expires_at = datetime.utcnow() + timedelta(minutes=10)
                
                cur.execute(
                    "INSERT INTO one_time_passwords (user_id, password_hash, expires_at) VALUES (%s, %s, %s)",
                    (user_id, otp_hash, expires_at)
                )
                conn.commit()
                
                email_sent = send_otp_email(email, otp)
                
                if not email_sent:
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Ошибка отправки email. Проверьте настройки SMTP.'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Код отправлен на email'}),
                    'isBase64Encoded': False
                }
        
        elif action == 'verify_otp':
            email = body.get('email', '').strip().lower()
            otp = body.get('otp', '').strip()
            
            if not email or not otp:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и код обязательны'}),
                    'isBase64Encoded': False
                }
            
            otp_hash = hash_password(otp)
            
            with conn.cursor() as cur:
                cur.execute("SELECT id, email, role FROM users WHERE email = %s AND is_active = TRUE", (email,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
                        'isBase64Encoded': False
                    }
                
                user_id, user_email, user_role = user
                
                cur.execute(
                    """SELECT id FROM one_time_passwords 
                       WHERE user_id = %s AND password_hash = %s 
                       AND expires_at > NOW() AND used = FALSE
                       ORDER BY created_at DESC LIMIT 1""",
                    (user_id, otp_hash)
                )
                otp_record = cur.fetchone()
                
                if not otp_record:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный или истекший код'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE one_time_passwords SET used = TRUE WHERE id = %s", (otp_record[0],))
                
                session_token = secrets.token_urlsafe(32)
                session_expires = datetime.utcnow() + timedelta(days=7)
                ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', '')
                user_agent = event.get('headers', {}).get('user-agent', '')
                
                cur.execute(
                    """INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent) 
                       VALUES (%s, %s, %s, %s, %s)""",
                    (user_id, session_token, session_expires, ip_address, user_agent)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Set-Cookie': f'session_token={session_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800'
                    },
                    'body': json.dumps({
                        'message': 'Успешный вход',
                        'user': {'id': user_id, 'email': user_email, 'role': user_role},
                        'session_token': session_token
                    }),
                    'isBase64Encoded': False
                }
        
        elif action == 'verify_session':
            auth_header = event.get('headers', {}).get('x-authorization', '')
            session_token = auth_header.replace('Bearer ', '') if auth_header else body.get('session_token', '')
            
            if not session_token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не предоставлен'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT u.id, u.email, u.role 
                       FROM sessions s 
                       JOIN users u ON s.user_id = u.id
                       WHERE s.session_token = %s AND s.expires_at > NOW() AND u.is_active = TRUE""",
                    (session_token,)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Сессия недействительна'}),
                        'isBase64Encoded': False
                    }
                
                user_id, user_email, user_role = user
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': {'id': user_id, 'email': user_email, 'role': user_role}
                    }),
                    'isBase64Encoded': False
                }
        
        elif action == 'list_users':
            auth_header = event.get('headers', {}).get('x-authorization', '')
            session_token = auth_header.replace('Bearer ', '') if auth_header else body.get('session_token', '')
            
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT u.role FROM sessions s 
                       JOIN users u ON s.user_id = u.id
                       WHERE s.session_token = %s AND s.expires_at > NOW()""",
                    (session_token,)
                )
                result = cur.fetchone()
                
                if not result or result[0] != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    """SELECT id, email, role, created_at, is_active 
                       FROM users ORDER BY created_at DESC"""
                )
                users = cur.fetchall()
                
                users_list = [
                    {
                        'id': u[0],
                        'email': u[1],
                        'role': u[2],
                        'created_at': u[3].isoformat() if u[3] else None,
                        'is_active': u[4]
                    }
                    for u in users
                ]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'users': users_list}),
                    'isBase64Encoded': False
                }
        
        elif action == 'create_user':
            auth_header = event.get('headers', {}).get('x-authorization', '')
            session_token = auth_header.replace('Bearer ', '') if auth_header else body.get('session_token', '')
            
            new_email = body.get('new_email', '').strip().lower()
            new_role = body.get('new_role', 'user')
            
            if not new_email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT u.id, u.role FROM sessions s 
                       JOIN users u ON s.user_id = u.id
                       WHERE s.session_token = %s AND s.expires_at > NOW()""",
                    (session_token,)
                )
                result = cur.fetchone()
                
                if not result or result[1] != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'}),
                        'isBase64Encoded': False
                    }
                
                creator_id = result[0]
                
                cur.execute(
                    "INSERT INTO users (email, role, created_by, is_active) VALUES (%s, %s, %s, TRUE) RETURNING id",
                    (new_email, new_role, creator_id)
                )
                new_user_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Пользователь создан', 'user_id': new_user_id}),
                    'isBase64Encoded': False
                }
        
        elif action == 'update_user':
            auth_header = event.get('headers', {}).get('x-authorization', '')
            session_token = auth_header.replace('Bearer ', '') if auth_header else body.get('session_token', '')
            
            target_user_id = body.get('user_id')
            new_role = body.get('role')
            is_active = body.get('is_active')
            
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT u.id, u.role FROM sessions s 
                       JOIN users u ON s.user_id = u.id
                       WHERE s.session_token = %s AND s.expires_at > NOW()""",
                    (session_token,)
                )
                result = cur.fetchone()
                
                if not result or result[1] != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'}),
                        'isBase64Encoded': False
                    }
                
                updates = []
                params = []
                
                if new_role:
                    updates.append("role = %s")
                    params.append(new_role)
                
                if is_active is not None:
                    updates.append("is_active = %s")
                    params.append(is_active)
                
                if not updates:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Нет данных для обновления'}),
                        'isBase64Encoded': False
                    }
                
                params.append(target_user_id)
                cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = %s", params)
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Пользователь обновлен'}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'}),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Внутренняя ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if 'conn' in locals():
            conn.close()
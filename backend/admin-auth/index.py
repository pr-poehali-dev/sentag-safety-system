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
    smtp_password = os.environ.get('SMTP_PASSWORD', '').replace(' ', '')
    
    if not smtp_user or not smtp_password:
        print("[DEBUG] SMTP credentials not configured")
        return False
    
    print(f"[DEBUG] SMTP: host={smtp_host}, port={smtp_port}, user={smtp_user}")
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Ваш код доступа в админ-панель Sentag'
    msg['From'] = smtp_user
    msg['To'] = email
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0EA5E9;">Код доступа в админ-панель</h2>
          <p>Ваш одноразовый код для входа:</p>
          <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; border-radius: 8px;">
            {otp}
          </div>
          <p style="color: #64748b; margin-top: 20px;">Код действителен 10 минут.</p>
          <p style="color: #64748b;">Если вы не запрашивали код, просто проигнорируйте это письмо.</p>
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
        print(f"[DEBUG] Email sent successfully to {email}")
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
            
            cur = conn.cursor()
            cur.execute("SELECT id FROM users WHERE email = %s AND is_active = TRUE", (email,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            user_id = user[0]
            otp = generate_otp()
            otp_hash = hash_password(otp)
            expires_at = datetime.utcnow() + timedelta(minutes=10)
            
            cur.execute(
                "INSERT INTO one_time_passwords (user_id, password_hash, expires_at) VALUES (%s, %s, %s)",
                (user_id, otp_hash, expires_at)
            )
            conn.commit()
            
            if send_otp_email(email, otp):
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Код отправлен на email'}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не удалось отправить email'}),
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
            
            cur = conn.cursor()
            cur.execute("SELECT id, role FROM users WHERE email = %s AND is_active = TRUE", (email,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            user_id, user_role = user
            otp_hash = hash_password(otp)
            
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
            
            cur.execute(
                "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                (user_id, session_token, session_expires)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'session_token': session_token,
                    'user': {'id': user_id, 'email': email, 'role': user_role}
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'verify_session':
            auth_header = event.get('headers', {}).get('X-Authorization', event.get('headers', {}).get('authorization', ''))
            token = auth_header.replace('Bearer ', '').strip()
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не предоставлен'}),
                    'isBase64Encoded': False
                }
            
            cur = conn.cursor()
            cur.execute(
                """SELECT u.id, u.email, u.role 
                   FROM sessions s 
                   JOIN users u ON s.user_id = u.id 
                   WHERE s.session_token = %s AND s.expires_at > NOW() AND u.is_active = TRUE""",
                (token,)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Сессия недействительна'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {'id': user[0], 'email': user[1], 'role': user[2]}
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'list_users':
            auth_header = event.get('headers', {}).get('X-Authorization', event.get('headers', {}).get('authorization', ''))
            token = auth_header.replace('Bearer ', '').strip()
            
            cur = conn.cursor()
            cur.execute(
                """SELECT u.role FROM sessions s 
                   JOIN users u ON s.user_id = u.id 
                   WHERE s.session_token = %s AND s.expires_at > NOW()""",
                (token,)
            )
            session_user = cur.fetchone()
            
            if not session_user or session_user[0] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id, email, role, created_at, is_active FROM users ORDER BY created_at DESC")
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'users': [
                        {'id': u[0], 'email': u[1], 'role': u[2], 'created_at': u[3].isoformat(), 'is_active': u[4]}
                        for u in users
                    ]
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'create_user':
            auth_header = event.get('headers', {}).get('X-Authorization', event.get('headers', {}).get('authorization', ''))
            token = auth_header.replace('Bearer ', '').strip()
            
            cur = conn.cursor()
            cur.execute(
                """SELECT u.id, u.role FROM sessions s 
                   JOIN users u ON s.user_id = u.id 
                   WHERE s.session_token = %s AND s.expires_at > NOW()""",
                (token,)
            )
            session_user = cur.fetchone()
            
            if not session_user or session_user[1] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'}),
                    'isBase64Encoded': False
                }
            
            new_email = body.get('new_email', '').strip().lower()
            new_role = body.get('new_role', 'user')
            
            if not new_email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "INSERT INTO users (email, role, created_by) VALUES (%s, %s, %s) RETURNING id",
                (new_email, new_role, session_user[0])
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
            auth_header = event.get('headers', {}).get('X-Authorization', event.get('headers', {}).get('authorization', ''))
            token = auth_header.replace('Bearer ', '').strip()
            
            cur = conn.cursor()
            cur.execute(
                """SELECT u.role FROM sessions s 
                   JOIN users u ON s.user_id = u.id 
                   WHERE s.session_token = %s AND s.expires_at > NOW()""",
                (token,)
            )
            session_user = cur.fetchone()
            
            if not session_user or session_user[0] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'}),
                    'isBase64Encoded': False
                }
            
            user_id = body.get('user_id')
            new_role = body.get('role')
            is_active = body.get('is_active')
            
            if new_role:
                cur.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id))
            if is_active is not None:
                cur.execute("UPDATE users SET is_active = %s WHERE id = %s", (is_active, user_id))
            
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
        import traceback
        print(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Внутренняя ошибка сервера'}),
            'isBase64Encoded': False
        }
    finally:
        if 'conn' in locals():
            conn.close()

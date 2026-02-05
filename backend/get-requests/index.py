import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Получение списка всех заявок для админ-панели"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
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
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            DELETE FROM request_forms
            WHERE created_at < NOW() - INTERVAL '7 days'
        """)
        deleted_count = cur.rowcount
        conn.commit()
        
        if deleted_count > 0:
            print(f"Удалено старых заявок: {deleted_count}")
        
        cur.execute("""
            SELECT 
                id,
                phone,
                email,
                company,
                role,
                full_name,
                object_name,
                object_address,
                consent,
                marketing_consent,
                visitors_info,
                pool_size,
                deadline,
                company_card_url,
                pool_scheme_urls,
                status,
                step1_started_at,
                step1_completed_at,
                step2_started_at,
                step2_completed_at,
                created_at,
                updated_at,
                visitor_id
            FROM request_forms
            ORDER BY created_at DESC
        """)
        
        rows = cur.fetchall()
        
        requests = []
        for row in rows:
            request_data = dict(row)
            
            # Получаем историю кликов для этого пользователя ДО начала заполнения формы
            visitor_id = request_data.get('visitor_id')
            user_activity = {
                'clicks': [],
                'first_visit': None,
                'time_on_site': 0
            }
            
            try:
                if visitor_id and request_data.get('step1_started_at'):
                    form_start = request_data['step1_started_at']
                    
                    # Получаем активность пользователя из таблицы visitors
                    cur.execute("""
                        SELECT first_visit, last_activity
                        FROM visitors
                        WHERE visitor_id = %s
                    """, (visitor_id,))
                    visitor_row = cur.fetchone()
                    
                    if visitor_row and visitor_row['first_visit']:
                        first_visit = visitor_row['first_visit']
                        last_activity = visitor_row['last_activity']
                        
                        user_activity['first_visit'] = first_visit.isoformat()
                        
                        # Время на сайте = от первого посещения до последней активности (или начала формы)
                        if last_activity and first_visit:
                            time_delta = (last_activity - first_visit).total_seconds()
                            user_activity['time_on_site'] = int(time_delta)
                    
                    # Получаем клики ДО начала заполнения формы
                    cur.execute("""
                        SELECT button_name, button_location, clicked_at
                        FROM button_clicks
                        WHERE visitor_id = %s AND clicked_at < %s
                        ORDER BY clicked_at ASC
                    """, (visitor_id, form_start))
                    click_rows = cur.fetchall()
                    
                    user_activity['clicks'] = [
                        {
                            'button_name': click['button_name'],
                            'button_location': click['button_location'],
                            'clicked_at': click['clicked_at'].isoformat()
                        }
                        for click in click_rows
                    ]
            except Exception as activity_error:
                print(f"Warning: Could not load user activity for request {request_data.get('id')}: {activity_error}")
                import traceback
                print(f"Traceback: {traceback.format_exc()}")
            
            request_data['user_activity'] = user_activity
            
            for key, value in request_data.items():
                if isinstance(value, datetime):
                    request_data[key] = value.isoformat()
            requests.append(request_data)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'requests': requests,
                'total': len(requests)
            }),
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
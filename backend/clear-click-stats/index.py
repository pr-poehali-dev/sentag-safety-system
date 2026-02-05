import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Удаление всей статистики кликов (только для администраторов)"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'DELETE':
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
        # Подключение к БД
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Удаляем все записи из таблицы button_clicks
        cursor.execute("DELETE FROM button_clicks")
        clicks_deleted = cursor.rowcount
        
        # Удаляем все записи из таблицы page_visits
        cursor.execute("DELETE FROM page_visits")
        visits_deleted = cursor.rowcount
        
        # Удаляем все записи из таблицы visitors
        cursor.execute("DELETE FROM visitors")
        visitors_deleted = cursor.rowcount
        
        conn.commit()
        cursor.close()
        conn.close()
        
        total_deleted = clicks_deleted + visits_deleted + visitors_deleted
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'deleted_count': total_deleted,
                'message': f'Удалено {clicks_deleted} кликов, {visits_deleted} посещений и {visitors_deleted} посетителей'
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
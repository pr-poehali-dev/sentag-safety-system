import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для удаления документа'''
    
    method = event.get('httpMethod', 'DELETE')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token'
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
        print(f"[DELETE] Received event: {json.dumps(event)}")
        
        token = event.get('headers', {}).get('X-Auth-Token', '')
        print(f"[DELETE] Auth token: {token[:20] if token else 'None'}...")
        
        if not token:
            print("[DELETE] Unauthorized - missing or invalid auth header")
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        params = event.get('queryStringParameters', {})
        doc_id = params.get('id') if params else None
        print(f"[DELETE] Document ID: {doc_id}, Params: {params}")
        
        if not doc_id:
            print("[DELETE] Missing document ID")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing document ID'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        delete_query = f"DELETE FROM documents WHERE id = {int(doc_id)}"
        print(f"[DELETE] Executing: {delete_query}")
        cur.execute(delete_query)
        
        deleted_count = cur.rowcount
        print(f"[DELETE] Deleted count: {deleted_count}")
        
        conn.commit()
        cur.close()
        conn.close()
        
        if deleted_count == 0:
            print(f"[DELETE] Document {doc_id} not found")
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Document not found'}),
                'isBase64Encoded': False
            }
        
        print(f"[DELETE] Successfully deleted document {doc_id}")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f"[DELETE] Exception: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
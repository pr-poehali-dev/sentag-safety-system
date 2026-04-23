import json
import os
import base64
import boto3
from datetime import datetime
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

def get_s3():
    return boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

def upload_thumbnail(s3, thumbnail_content, thumbnail_file_name):
    thumbnail_data = base64.b64decode(thumbnail_content)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    thumbnail_key = f'documents/thumbnails/{timestamp}_{thumbnail_file_name}'
    content_type = 'image/png' if thumbnail_file_name.lower().endswith('.png') else 'image/jpeg'
    s3.put_object(Bucket='files', Key=thumbnail_key, Body=thumbnail_data, ContentType=content_type)
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{thumbnail_key}"

def handler(event: dict, context) -> dict:
    """API управления документами: GET - список, POST - загрузка, PUT - обновление, DELETE - удаление"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '', 'isBase64Encoded': False}

    def resp(status, body):
        return {
            'statusCode': status,
            'headers': {'Content-Type': 'application/json', **CORS_HEADERS},
            'body': json.dumps(body),
            'isBase64Encoded': False
        }

    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    def get_conn():
        c = psycopg2.connect(dsn, options=f'-c search_path={schema}')
        c.autocommit = False
        return c

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, title, description, icon_name, file_url, file_name, file_type, file_size, created_at, thumbnail_url
            FROM documents ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        documents = [{
            'id': r[0], 'title': r[1], 'description': r[2], 'iconName': r[3],
            'fileUrl': r[4], 'fileName': r[5], 'fileType': r[6], 'fileSize': r[7],
            'createdAt': r[8].isoformat() if r[8] else None, 'thumbnailUrl': r[9]
        } for r in rows]
        return resp(200, {'success': True, 'documents': documents})

    if method in ('POST', 'PUT'):
        token = event.get('headers', {}).get('X-Auth-Token', '')
        if not token:
            return resp(401, {'error': 'Unauthorized'})

        body = json.loads(event.get('body', '{}'))

        if method == 'PUT':
            doc_id = body.get('id')
            title = body.get('title', '').strip()
            if not doc_id or not title:
                return resp(400, {'error': 'id and title are required'})
            conn = get_conn()
            cur = conn.cursor()
            thumbnail_url = None
            thumbnail_content = body.get('thumbnailContent')
            thumbnail_file_name = body.get('thumbnailFileName')
            if thumbnail_content and thumbnail_file_name:
                thumbnail_url = upload_thumbnail(get_s3(), thumbnail_content, thumbnail_file_name)
            if thumbnail_url:
                cur.execute("UPDATE documents SET title=%s, description=%s, icon_name=%s, thumbnail_url=%s WHERE id=%s",
                    (title, body.get('description', ''), body.get('iconName', 'FileText'), thumbnail_url, doc_id))
            else:
                cur.execute("UPDATE documents SET title=%s, description=%s, icon_name=%s WHERE id=%s",
                    (title, body.get('description', ''), body.get('iconName', 'FileText'), doc_id))
            conn.commit()
            cur.close()
            conn.close()
            return resp(200, {'success': True, 'documentId': doc_id})

        # POST — загрузка нового документа
        title = body.get('title', '').strip()
        file_name = body.get('fileName', '')
        file_content = body.get('fileContent', '')
        if not title or not file_name or not file_content:
            return resp(400, {'error': 'Missing required fields'})
        file_data = base64.b64decode(file_content)
        file_size = len(file_data)
        s3 = get_s3()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        s3_key = f'documents/{timestamp}_{file_name}'
        s3.put_object(Bucket='files', Key=s3_key, Body=file_data, ContentType=body.get('fileType', ''))
        file_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
        thumbnail_url = None
        if body.get('thumbnailContent') and body.get('thumbnailFileName'):
            thumbnail_url = upload_thumbnail(s3, body['thumbnailContent'], body['thumbnailFileName'])
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO documents (title, description, icon_name, file_url, file_name, file_type, file_size, thumbnail_url) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (title, body.get('description', ''), body.get('iconName', 'FileText'), file_url, file_name, body.get('fileType', ''), file_size, thumbnail_url)
        )
        doc_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return resp(200, {'success': True, 'documentId': doc_id, 'fileUrl': file_url})

    if method == 'DELETE':
        token = event.get('headers', {}).get('X-Auth-Token', '')
        if not token:
            return resp(401, {'error': 'Unauthorized'})
        params = event.get('queryStringParameters') or {}
        doc_id = params.get('id')
        if not doc_id:
            return resp(400, {'error': 'Missing document ID'})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM documents WHERE id = {int(doc_id)}")
        deleted = cur.rowcount
        conn.commit()
        cur.close()
        conn.close()
        if deleted == 0:
            return resp(404, {'error': 'Document not found'})
        return resp(200, {'success': True})

    return resp(405, {'error': 'Method not allowed'})
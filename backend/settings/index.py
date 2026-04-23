import json
import os
import re
import psycopg2
import boto3
import base64
from datetime import datetime
import urllib.request
import urllib.parse

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token',
}

def get_s3():
    return boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

def handler(event: dict, context) -> dict:
    """
    Управление настройками сайта.
    GET              — получение всех настроек
    POST             — обновление настройки (key, value) или action=update_seo, action=notify_search_engines
    PUT              — загрузка favicon (faviconContent, faviconFileName) или action=update_index_html
    """
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

    dsn = os.environ.get('DATABASE_URL')

    # GET — получение всех настроек
    if method == 'GET':
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM site_settings")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        settings = {}
        for key, value in rows:
            if value.lower() in ('true', 'false'):
                settings[key] = value.lower() == 'true'
            else:
                settings[key] = value
        return resp(200, {'success': True, 'settings': settings})

    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', '')

        # Уведомление поисковых систем
        if action == 'notify_search_engines':
            sitemap_url = 'https://sentag.ru/sitemap.xml'
            results = {}
            for engine, ping_url in [
                ('google', f'https://www.google.com/ping?sitemap={urllib.parse.quote(sitemap_url)}'),
                ('yandex', f'https://webmaster.yandex.ru/ping?sitemap={urllib.parse.quote(sitemap_url)}'),
                ('bing', f'https://www.bing.com/ping?sitemap={urllib.parse.quote(sitemap_url)}'),
            ]:
                try:
                    with urllib.request.urlopen(ping_url, timeout=10) as r:
                        results[engine] = {'success': True, 'status_code': r.status}
                except Exception as e:
                    results[engine] = {'success': False, 'error': str(e)}
            any_success = any(r.get('success', False) for r in results.values())
            return resp(200 if any_success else 500, {'success': any_success, 'results': results, 'sitemap_url': sitemap_url})

        # Обновление одной настройки
        key = body.get('key')
        value = body.get('value')
        if not key:
            return resp(400, {'error': 'Key is required'})
        if isinstance(value, bool):
            value = 'true' if value else 'false'
        else:
            value = str(value)
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO site_settings (key, value, updated_at) VALUES (%s, %s, NOW())
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        """, (key, value))
        conn.commit()
        cur.close()
        conn.close()
        return resp(200, {'success': True, 'message': f'Setting {key} updated'})

    if method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', '')

        # Обновление index.html в S3
        if action == 'update_index_html':
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            cur.execute("SELECT key, value FROM site_settings WHERE key IN ('seo_title', 'seo_description', 'seo_keywords', 'og_image_url')")
            settings = {r[0]: r[1] for r in cur.fetchall()}
            cur.close()
            conn.close()
            s3 = get_s3()
            obj = s3.get_object(Bucket='files', Key='index.html')
            html = obj['Body'].read().decode('utf-8')
            seo_title = settings.get('seo_title', '')
            seo_description = settings.get('seo_description', '')
            seo_keywords = settings.get('seo_keywords', '')
            og_image_url = settings.get('og_image_url', '')
            if seo_title:
                html = re.sub(r'(<title>)[^<]*(</title>)', rf'\g<1>{seo_title}\g<2>', html)
                html = re.sub(rf'(<meta\s+property="og:title"\s+content=")[^"]*(")', rf'\g<1>{seo_title}\g<2>', html)
                html = re.sub(rf'(<meta\s+name="twitter:title"\s+content=")[^"]*(")', rf'\g<1>{seo_title}\g<2>', html)
            if seo_description:
                html = re.sub(rf'(<meta\s+name="description"\s+content=")[^"]*(")', rf'\g<1>{seo_description}\g<2>', html)
                html = re.sub(rf'(<meta\s+property="og:description"\s+content=")[^"]*(")', rf'\g<1>{seo_description}\g<2>', html)
                html = re.sub(rf'(<meta\s+name="twitter:description"\s+content=")[^"]*(")', rf'\g<1>{seo_description}\g<2>', html)
            if seo_keywords:
                html = re.sub(rf'(<meta\s+name="keywords"\s+content=")[^"]*(")', rf'\g<1>{seo_keywords}\g<2>', html)
            if og_image_url:
                html = re.sub(rf'(<meta\s+property="og:image"\s+content=")[^"]*(")', rf'\g<1>{og_image_url}\g<2>', html)
                html = re.sub(rf'(<meta\s+name="twitter:image"\s+content=")[^"]*(")', rf'\g<1>{og_image_url}\g<2>', html)
            s3.put_object(Bucket='files', Key='index.html', Body=html.encode('utf-8'), ContentType='text/html; charset=utf-8')
            return resp(200, {'success': True, 'message': 'index.html обновлён', 'seo_title': seo_title})

        # Загрузка favicon
        favicon_content = body.get('faviconContent')
        favicon_file_name = body.get('faviconFileName')
        if not favicon_content or not favicon_file_name:
            return resp(400, {'error': 'Favicon file is required'})
        s3 = get_s3()
        favicon_data = base64.b64decode(favicon_content)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        favicon_key = f'favicon/{timestamp}_{favicon_file_name}'
        content_type = 'image/png' if favicon_file_name.lower().endswith('.png') else 'image/jpeg'
        s3.put_object(Bucket='files', Key=favicon_key, Body=favicon_data, ContentType=content_type)
        favicon_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{favicon_key}"
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        cur.execute("INSERT INTO site_settings (key, value, updated_at) VALUES ('favicon_url', %s, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()", (favicon_url,))
        cur.execute("INSERT INTO site_settings (key, value, updated_at) VALUES ('og_image_url', %s, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()", (favicon_url,))
        conn.commit()
        cur.close()
        conn.close()
        return resp(200, {'success': True, 'favicon_url': favicon_url})

    return resp(405, {'error': 'Method not allowed'})

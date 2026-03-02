import json
import os
import re
import psycopg2
import boto3

S3_BUCKET = 'files'
INDEX_HTML_KEY = 'index.html'

def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

def replace_meta(html: str, name: str, content: str) -> str:
    pattern = rf'(<meta\s+name="{re.escape(name)}"\s+content=")[^"]*(")'
    replacement = rf'\g<1>{content}\g<2>'
    return re.sub(pattern, replacement, html)

def replace_og(html: str, prop: str, content: str) -> str:
    pattern = rf'(<meta\s+property="{re.escape(prop)}"\s+content=")[^"]*(")'
    replacement = rf'\g<1>{content}\g<2>'
    return re.sub(pattern, replacement, html)

def replace_title(html: str, title: str) -> str:
    return re.sub(r'(<title>)[^<]*(</title>)', rf'\g<1>{title}\g<2>', html)

def handler(event: dict, context) -> dict:
    """Обновляет index.html в S3 актуальными SEO-данными из базы данных"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token'
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM site_settings WHERE key IN ('seo_title', 'seo_description', 'seo_keywords', 'og_image_url')")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    settings = {row[0]: row[1] for row in rows}
    seo_title = settings.get('seo_title', '')
    seo_description = settings.get('seo_description', '')
    seo_keywords = settings.get('seo_keywords', '')
    og_image_url = settings.get('og_image_url', '')

    s3 = get_s3()
    obj = s3.get_object(Bucket=S3_BUCKET, Key=INDEX_HTML_KEY)
    html = obj['Body'].read().decode('utf-8')

    if seo_title:
        html = replace_title(html, seo_title)
        html = replace_og(html, 'og:title', seo_title)
        pattern = rf'(<meta\s+name="twitter:title"\s+content=")[^"]*(")'
        html = re.sub(pattern, rf'\g<1>{seo_title}\g<2>', html)

    if seo_description:
        html = replace_meta(html, 'description', seo_description)
        html = replace_og(html, 'og:description', seo_description)
        pattern = rf'(<meta\s+name="twitter:description"\s+content=")[^"]*(")'
        html = re.sub(pattern, rf'\g<1>{seo_description}\g<2>', html)

    if seo_keywords:
        html = replace_meta(html, 'keywords', seo_keywords)

    if og_image_url:
        html = replace_og(html, 'og:image', og_image_url)
        pattern = rf'(<meta\s+name="twitter:image"\s+content=")[^"]*(")'
        html = re.sub(pattern, rf'\g<1>{og_image_url}\g<2>', html)

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=INDEX_HTML_KEY,
        Body=html.encode('utf-8'),
        ContentType='text/html; charset=utf-8'
    )

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'message': 'index.html обновлён',
            'seo_title': seo_title
        })
    }

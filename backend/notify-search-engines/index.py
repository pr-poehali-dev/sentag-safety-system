import json
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    """Уведомление поисковых систем об обновлении sitemap"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    sitemap_url = 'https://sentag.ru/sitemap.xml'
    results = {}
    
    try:
        google_ping_url = f'https://www.google.com/ping?sitemap={urllib.parse.quote(sitemap_url)}'
        try:
            with urllib.request.urlopen(google_ping_url, timeout=10) as response:
                results['google'] = {
                    'success': True,
                    'status_code': response.status,
                    'message': 'Google уведомлён об обновлении sitemap'
                }
        except Exception as e:
            results['google'] = {
                'success': False,
                'error': str(e),
                'message': 'Не удалось уведомить Google'
            }
        
        yandex_ping_url = f'https://webmaster.yandex.ru/ping?sitemap={urllib.parse.quote(sitemap_url)}'
        try:
            with urllib.request.urlopen(yandex_ping_url, timeout=10) as response:
                results['yandex'] = {
                    'success': True,
                    'status_code': response.status,
                    'message': 'Яндекс уведомлён об обновлении sitemap'
                }
        except Exception as e:
            results['yandex'] = {
                'success': False,
                'error': str(e),
                'message': 'Не удалось уведомить Яндекс'
            }
        
        bing_ping_url = f'https://www.bing.com/ping?sitemap={urllib.parse.quote(sitemap_url)}'
        try:
            with urllib.request.urlopen(bing_ping_url, timeout=10) as response:
                results['bing'] = {
                    'success': True,
                    'status_code': response.status,
                    'message': 'Bing уведомлён об обновлении sitemap'
                }
        except Exception as e:
            results['bing'] = {
                'success': False,
                'error': str(e),
                'message': 'Не удалось уведомить Bing'
            }
        
        any_success = any(r.get('success', False) for r in results.values())
        
        return {
            'statusCode': 200 if any_success else 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': any_success,
                'results': results,
                'sitemap_url': sitemap_url
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
            'body': json.dumps({
                'success': False,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }

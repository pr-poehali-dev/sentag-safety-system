-- Добавляем запись для favicon_url в site_settings
INSERT INTO site_settings (key, value) 
VALUES ('favicon_url', 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg')
ON CONFLICT (key) DO NOTHING;
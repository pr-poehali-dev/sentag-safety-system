-- Добавляем запись для og_image_url в site_settings
INSERT INTO site_settings (key, value) 
VALUES ('og_image_url', 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/files/og-image-1770456083663.png')
ON CONFLICT (key) DO NOTHING;
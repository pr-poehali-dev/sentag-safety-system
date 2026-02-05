-- Создание таблицы для настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Добавляем дефолтное значение для отображения документов
INSERT INTO site_settings (key, value) VALUES ('show_documents_section', 'true')
ON CONFLICT (key) DO NOTHING;
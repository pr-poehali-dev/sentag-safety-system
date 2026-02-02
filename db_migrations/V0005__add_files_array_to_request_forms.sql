-- Добавляем поля для хранения URL файлов
ALTER TABLE request_forms ADD COLUMN IF NOT EXISTS company_card_url TEXT;
ALTER TABLE request_forms ADD COLUMN IF NOT EXISTS pool_scheme_urls TEXT[];
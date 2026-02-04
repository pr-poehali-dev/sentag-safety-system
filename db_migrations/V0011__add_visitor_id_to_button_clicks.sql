-- Добавляем visitor_id в таблицу button_clicks для связи кликов с пользователями
ALTER TABLE button_clicks ADD COLUMN visitor_id VARCHAR(255);

-- Добавляем индекс для быстрого поиска по visitor_id
CREATE INDEX idx_button_clicks_visitor_id ON button_clicks(visitor_id);
-- Добавляем visitor_id в таблицу request_forms для связи с активностью пользователя
ALTER TABLE request_forms ADD COLUMN visitor_id VARCHAR(255);

-- Добавляем индекс для быстрого поиска по visitor_id
CREATE INDEX idx_request_forms_visitor_id ON request_forms(visitor_id);
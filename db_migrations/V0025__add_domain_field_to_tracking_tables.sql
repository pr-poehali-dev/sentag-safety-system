-- Добавление поля domain в таблицы для фильтрации статистики по домену

ALTER TABLE t_p28851569_sentag_safety_system.page_visits 
ADD COLUMN domain VARCHAR(255) DEFAULT 'sentag.ru';

ALTER TABLE t_p28851569_sentag_safety_system.button_clicks 
ADD COLUMN domain VARCHAR(255) DEFAULT 'sentag.ru';

ALTER TABLE t_p28851569_sentag_safety_system.visitors 
ADD COLUMN domain VARCHAR(255) DEFAULT 'sentag.ru';

-- Индексы для ускорения запросов с фильтрацией по домену
CREATE INDEX idx_page_visits_domain ON t_p28851569_sentag_safety_system.page_visits(domain);
CREATE INDEX idx_button_clicks_domain ON t_p28851569_sentag_safety_system.button_clicks(domain);
CREATE INDEX idx_visitors_domain ON t_p28851569_sentag_safety_system.visitors(domain);
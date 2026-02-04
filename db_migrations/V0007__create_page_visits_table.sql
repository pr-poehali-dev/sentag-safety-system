-- Таблица для отслеживания уникальных посетителей
CREATE TABLE page_visits (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL,
  visited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address VARCHAR(45)
);

-- Индекс для быстрой выборки по дате
CREATE INDEX idx_page_visits_date ON page_visits (visited_at DESC);

-- Индекс для быстрой выборки по visitor_id
CREATE INDEX idx_page_visits_visitor ON page_visits (visitor_id);

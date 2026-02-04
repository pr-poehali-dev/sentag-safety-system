-- Таблица для хранения статистики кликов по кнопкам
CREATE TABLE button_clicks (
  id SERIAL PRIMARY KEY,
  button_name VARCHAR(255) NOT NULL,
  button_location VARCHAR(255) NOT NULL,
  clicked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address VARCHAR(45)
);

-- Индекс для быстрой выборки по дате
CREATE INDEX idx_button_clicks_date ON button_clicks (clicked_at DESC);

-- Индекс для быстрой выборки по названию кнопки
CREATE INDEX idx_button_clicks_name ON button_clicks (button_name);
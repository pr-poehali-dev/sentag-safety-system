CREATE TABLE IF NOT EXISTS t_p28851569_sentag_safety_system.visitors (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(255) UNIQUE NOT NULL,
    first_visit TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON t_p28851569_sentag_safety_system.visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON t_p28851569_sentag_safety_system.visitors(first_visit);

COMMENT ON TABLE t_p28851569_sentag_safety_system.visitors IS 'Таблица для отслеживания активности посетителей сайта';
COMMENT ON COLUMN t_p28851569_sentag_safety_system.visitors.visitor_id IS 'Уникальный идентификатор посетителя из браузера';
COMMENT ON COLUMN t_p28851569_sentag_safety_system.visitors.first_visit IS 'Время первого визита';
COMMENT ON COLUMN t_p28851569_sentag_safety_system.visitors.last_activity IS 'Время последней активности';
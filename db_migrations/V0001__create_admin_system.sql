-- Таблица пользователей админ-панели
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

-- Таблица одноразовых паролей
CREATE TABLE IF NOT EXISTS one_time_passwords (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сессий
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_otp_user_id ON one_time_passwords(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON one_time_passwords(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Создаем первого суперадмина
INSERT INTO users (email, role, is_active) 
VALUES ('admin@meridian-t.ru', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

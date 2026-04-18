-- Добавляем первого администратора
INSERT INTO users (email, role, is_active)
VALUES ('dimanadym@yandex.ru', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;
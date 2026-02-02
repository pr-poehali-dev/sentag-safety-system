-- Обновляем email первого администратора
UPDATE users SET email = 'dimanadym@yandex.ru' WHERE email = 'admin@meridian-t.ru';

-- Если такого пользователя нет, создаем
INSERT INTO users (email, role, is_active) 
VALUES ('dimanadym@yandex.ru', 'admin', TRUE)
ON CONFLICT (email) DO UPDATE SET role = 'admin', is_active = TRUE;
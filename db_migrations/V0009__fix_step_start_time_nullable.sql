-- Делаем поля времени начала nullable
ALTER TABLE request_forms ALTER COLUMN step1_started_at SET DEFAULT NOW();

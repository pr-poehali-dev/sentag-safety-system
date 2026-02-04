-- Добавляем поле для отслеживания времени начала заполнения формы
ALTER TABLE request_forms ADD COLUMN step1_started_at TIMESTAMP;

-- Обновляем существующие записи: ставим step1_started_at = created_at
UPDATE request_forms SET step1_started_at = created_at WHERE step1_started_at IS NULL;

-- Теперь делаем поле обязательным
ALTER TABLE request_forms ALTER COLUMN step1_started_at SET NOT NULL;
ALTER TABLE request_forms ALTER COLUMN step1_started_at SET DEFAULT NOW();

-- Добавляем поле для времени начала второго шага
ALTER TABLE request_forms ADD COLUMN step2_started_at TIMESTAMP;

-- Таблица для хранения заявок на расчет
CREATE TABLE IF NOT EXISTS request_forms (
  id SERIAL PRIMARY KEY,
  
  -- Шаг 1: Контактная информация
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(500) NOT NULL,
  role VARCHAR(100) NOT NULL,
  full_name VARCHAR(500) NOT NULL,
  object_name VARCHAR(500) NOT NULL,
  object_address TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  step1_completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Шаг 2: Детальная информация (опционально)
  company_card_file_url TEXT,
  visitors_info TEXT,
  pool_size TEXT,
  pool_scheme_file_url TEXT,
  deadline TEXT,
  step2_completed_at TIMESTAMP,
  
  -- Метаданные
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'step1_completed'
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_request_forms_email ON request_forms(email);
CREATE INDEX IF NOT EXISTS idx_request_forms_status ON request_forms(status);
CREATE INDEX IF NOT EXISTS idx_request_forms_created_at ON request_forms(created_at DESC);
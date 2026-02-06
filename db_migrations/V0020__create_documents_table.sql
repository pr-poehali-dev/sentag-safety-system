CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100) NOT NULL DEFAULT 'FileText',
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

COMMENT ON TABLE documents IS 'Документы для секции на главной странице';
COMMENT ON COLUMN documents.title IS 'Название документа';
COMMENT ON COLUMN documents.description IS 'Описание документа';
COMMENT ON COLUMN documents.icon_name IS 'Название иконки из lucide-react';
COMMENT ON COLUMN documents.file_url IS 'URL файла в S3';
COMMENT ON COLUMN documents.file_name IS 'Оригинальное имя файла';
COMMENT ON COLUMN documents.file_type IS 'MIME-тип файла';
COMMENT ON COLUMN documents.file_size IS 'Размер файла в байтах';
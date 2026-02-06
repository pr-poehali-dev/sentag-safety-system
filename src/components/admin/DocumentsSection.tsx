import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const DOCUMENTS_LIST_URL = 'https://functions.poehali.dev/0c6aa7f0-6f84-4a44-938f-3e2ba7024f4b';
const DOCUMENTS_UPLOAD_URL = 'https://functions.poehali.dev/3a50767d-8e84-4ec4-aa31-c0c115ada27d';
const DOCUMENTS_DELETE_URL = 'https://functions.poehali.dev/ed8b5498-3e46-4bd6-b0b8-8cd49df60a3d';

const ICON_OPTIONS = [
  'FileCheck', 'Award', 'FileText', 'ClipboardCheck', 'BookOpen', 'Shield',
  'File', 'Download', 'FileBadge', 'FileBox', 'FileStack', 'Paperclip'
];

interface Document {
  id: number;
  title: string;
  description: string;
  iconName: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('FileText');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(DOCUMENTS_LIST_URL);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить документы', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка подключения', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: 'Ошибка', description: 'Размер файла не должен превышать 10 МБ', variant: 'destructive' });
        return;
      }
      setSelectedFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const handleUpload = async () => {
    if (!title.trim() || !selectedFile) {
      toast({ title: 'Ошибка', description: 'Заполните все поля и выберите файл', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileContent = await fileToBase64(selectedFile);
      const token = localStorage.getItem('admin_token') || '';

      const response = await fetch(DOCUMENTS_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          iconName,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileContent
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Документ загружен' });
        setTitle('');
        setDescription('');
        setIconName('FileText');
        setSelectedFile(null);
        loadDocuments();
      } else {
        const data = await response.json();
        toast({ title: 'Ошибка', description: data.error || 'Не удалось загрузить', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка загрузки', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Удалить этот документ?')) return;

    try {
      const token = localStorage.getItem('admin_token') || '';
      const response = await fetch(`${DOCUMENTS_DELETE_URL}?id=${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Документ удален' });
        loadDocuments();
      } else {
        const data = await response.json();
        toast({ title: 'Ошибка', description: data.error || 'Не удалось удалить', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление документами</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Добавить документ</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="doc-title">Название документа</Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Сертификат соответствия ГОСТ"
              maxLength={255}
            />
          </div>

          <div>
            <Label htmlFor="doc-description">Описание</Label>
            <Input
              id="doc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подтверждение соответствия требованиям РФ"
            />
          </div>

          <div>
            <Label htmlFor="doc-icon">Иконка</Label>
            <Select value={iconName} onValueChange={setIconName}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    <div className="flex items-center gap-2">
                      <Icon name={icon} size={16} />
                      {icon}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doc-file">Файл (PDF, DOC, XLS, ZIP, до 10 МБ)</Label>
            <Input
              id="doc-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
              className="mt-2"
            />
            {selectedFile && (
              <p className="text-sm text-slate-600 mt-2">
                Выбран: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Загрузка...' : 'Добавить документ'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Загруженные документы ({documents.length})</h3>
        {loading ? (
          <p className="text-slate-600">Загрузка...</p>
        ) : documents.length === 0 ? (
          <p className="text-slate-600">Документов пока нет</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={doc.iconName} className="text-primary" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800">{doc.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{doc.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{doc.fileName}</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Открыть
                      </a>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

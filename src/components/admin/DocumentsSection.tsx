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
  thumbnailUrl?: string;
}

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('FileText');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIconName, setEditIconName] = useState('FileText');
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
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
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: 'Ошибка', description: 'Размер файла не должен превышать 5 МБ', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: 'Ошибка', description: 'Размер изображения не должен превышать 2 МБ', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Ошибка', description: 'Выберите изображение (JPEG, PNG)', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      setThumbnailFile(file);
    }
  };

  const handleEditThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: 'Ошибка', description: 'Размер изображения не должен превышать 2 МБ', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Ошибка', description: 'Выберите изображение (JPEG, PNG)', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      setEditThumbnailFile(file);
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

      let thumbnailContent = null;
      if (thumbnailFile) {
        thumbnailContent = await fileToBase64(thumbnailFile);
      }

      const response = await fetch(DOCUMENTS_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({
          title,
          description,
          iconName,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileContent,
          thumbnailContent,
          thumbnailFileName: thumbnailFile?.name
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Документ загружен' });
        setTitle('');
        setDescription('');
        setIconName('FileText');
        setSelectedFile(null);
        setThumbnailFile(null);
        const fileInput = document.getElementById('doc-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        const thumbInput = document.getElementById('doc-thumbnail') as HTMLInputElement;
        if (thumbInput) thumbInput.value = '';
        loadDocuments();
      } else {
        const data = await response.json().catch(() => ({}));
        let errorMsg = data.error || `Ошибка ${response.status}: ${response.statusText}`;
        
        if (response.status === 413) {
          errorMsg = 'Файл слишком большой. Максимальный размер: 5 МБ. Попробуйте сжать файл или выбрать другой.';
        }
        
        console.error('Upload error:', errorMsg, data);
        toast({ title: 'Ошибка загрузки', description: errorMsg, variant: 'destructive' });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Upload exception:', error);
      toast({ title: 'Ошибка', description: errorMsg, variant: 'destructive' });
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
          'X-Auth-Token': token
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

  const startEdit = (doc: Document) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditDescription(doc.description);
    setEditIconName(doc.iconName);
    setEditThumbnailFile(null);
  };

  const cancelEdit = () => {
    setEditingDoc(null);
    setEditTitle('');
    setEditDescription('');
    setEditIconName('FileText');
    setEditThumbnailFile(null);
    const thumbInput = document.getElementById('edit-thumbnail') as HTMLInputElement;
    if (thumbInput) thumbInput.value = '';
  };

  const handleUpdate = async () => {
    if (!editingDoc || !editTitle.trim()) {
      toast({ title: 'Ошибка', description: 'Название обязательно', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      let thumbnailContent = null;
      if (editThumbnailFile) {
        thumbnailContent = await fileToBase64(editThumbnailFile);
      }

      const response = await fetch(DOCUMENTS_UPLOAD_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({
          id: editingDoc.id,
          title: editTitle,
          description: editDescription,
          iconName: editIconName,
          thumbnailContent,
          thumbnailFileName: editThumbnailFile?.name
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Документ обновлен' });
        cancelEdit();
        loadDocuments();
      } else {
        const data = await response.json().catch(() => ({}));
        toast({ title: 'Ошибка', description: data.error || 'Не удалось обновить', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка обновления', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  return (
    <div className="space-y-6">
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
            <Label htmlFor="doc-file">Файл (PDF, DOC, XLS, ZIP, до 5 МБ)</Label>
            <Input
              id="doc-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
              className="mt-2"
            />
            <p className="text-xs text-slate-500 mt-1">⚠️ Максимальный размер файла: 5 МБ</p>
            {selectedFile && (
              <p className="text-sm text-slate-600 mt-2">
                Выбран: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="doc-thumbnail">Превью (JPEG, PNG, до 2 МБ, необязательно)</Label>
            <Input
              id="doc-thumbnail"
              type="file"
              onChange={handleThumbnailChange}
              accept="image/jpeg,image/jpg,image/png"
              className="mt-2"
            />
            <p className="text-xs text-slate-500 mt-1">Это изображение будет показано на сайте вместо иконки</p>
            {thumbnailFile && (
              <p className="text-sm text-slate-600 mt-2">
                Выбрано: {thumbnailFile.name} ({formatFileSize(thumbnailFile.size)})
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
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4">
                {editingDoc?.id === doc.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Название</Label>
                      <Input
                        id="edit-title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Описание</Label>
                      <Input
                        id="edit-description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-icon">Иконка</Label>
                      <Select value={editIconName} onValueChange={setEditIconName}>
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
                      <Label htmlFor="edit-thumbnail">Новое превью (необязательно)</Label>
                      <Input
                        id="edit-thumbnail"
                        type="file"
                        onChange={handleEditThumbnailChange}
                        accept="image/jpeg,image/jpg,image/png"
                        className="mt-2"
                      />
                      {doc.thumbnailUrl && !editThumbnailFile && (
                        <p className="text-xs text-slate-500 mt-1">Текущее превью установлено</p>
                      )}
                      {editThumbnailFile && (
                        <p className="text-sm text-slate-600 mt-2">
                          Новое: {editThumbnailFile.name} ({formatFileSize(editThumbnailFile.size)})
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdate} disabled={uploading}>
                        {uploading ? 'Сохранение...' : 'Сохранить'}
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} disabled={uploading}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {doc.thumbnailUrl && (
                        <img 
                          src={doc.thumbnailUrl} 
                          alt={doc.title}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name={doc.iconName} size={24} className="text-primary" />
                          <h4 className="font-semibold">{doc.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{doc.description}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(doc)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
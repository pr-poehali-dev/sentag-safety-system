import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ICON_OPTIONS, DOCUMENTS_UPLOAD_URL, fileToBase64, formatFileSize } from './types';

interface DocumentUploadFormProps {
  onUploadSuccess: () => void;
}

export default function DocumentUploadForm({ onUploadSuccess }: DocumentUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('FileText');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { toast } = useToast();

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
        onUploadSuccess();
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

  return (
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
  );
}

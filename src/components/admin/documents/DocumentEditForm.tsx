import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Document, ICON_OPTIONS, DOCUMENTS_UPLOAD_URL, fileToBase64, formatFileSize } from './types';

interface DocumentEditFormProps {
  document: Document;
  onUpdateSuccess: () => void;
  onCancel: () => void;
}

export default function DocumentEditForm({ document, onUpdateSuccess, onCancel }: DocumentEditFormProps) {
  const [uploading, setUploading] = useState(false);
  const [editTitle, setEditTitle] = useState(document.title);
  const [editDescription, setEditDescription] = useState(document.description);
  const [editIconName, setEditIconName] = useState(document.iconName);
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const { toast } = useToast();

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

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
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
          id: document.id,
          title: editTitle,
          description: editDescription,
          iconName: editIconName,
          thumbnailContent,
          thumbnailFileName: editThumbnailFile?.name
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Документ обновлен' });
        onUpdateSuccess();
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

  return (
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
        {document.thumbnailUrl && !editThumbnailFile && (
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
        <Button variant="outline" onClick={onCancel} disabled={uploading}>
          Отмена
        </Button>
      </div>
    </div>
  );
}

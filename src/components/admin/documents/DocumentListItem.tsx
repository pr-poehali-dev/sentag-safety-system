import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Document, DOCUMENTS_DELETE_URL, formatFileSize } from './types';
import DocumentEditForm from './DocumentEditForm';

interface DocumentListItemProps {
  document: Document;
  onUpdate: () => void;
}

export default function DocumentListItem({ document, onUpdate }: DocumentListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm('Удалить этот документ?')) return;

    try {
      const token = localStorage.getItem('admin_token') || '';
      const response = await fetch(`${DOCUMENTS_DELETE_URL}?id=${document.id}`, {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Документ удален' });
        onUpdate();
      } else {
        const data = await response.json();
        toast({ title: 'Ошибка', description: data.error || 'Не удалось удалить', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      {isEditing ? (
        <DocumentEditForm
          document={document}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex gap-4 flex-1">
            {document.thumbnailUrl && (
              <img 
                src={document.thumbnailUrl} 
                alt={document.title}
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={document.iconName} size={24} className="text-primary" />
                <h4 className="font-semibold">{document.title}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-2">{document.description}</p>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>{document.fileName}</span>
                <span>{formatFileSize(document.fileSize)}</span>
                <a
                  href={document.fileUrl}
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
              onClick={() => setIsEditing(true)}
            >
              <Icon name="Edit" size={16} />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

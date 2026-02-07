import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Document, DOCUMENTS_LIST_URL } from './documents/types';
import DocumentUploadForm from './documents/DocumentUploadForm';
import DocumentListItem from './documents/DocumentListItem';
import { useToast } from '@/hooks/use-toast';

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="space-y-6">
      <DocumentUploadForm onUploadSuccess={loadDocuments} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Загруженные документы ({documents.length})</h3>
        {loading ? (
          <p className="text-slate-600">Загрузка...</p>
        ) : documents.length === 0 ? (
          <p className="text-slate-600">Документов пока нет</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentListItem
                key={doc.id}
                document={doc}
                onUpdate={loadDocuments}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

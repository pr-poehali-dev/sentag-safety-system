import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';
import { trackEvent, TrackingEvent, EventCategory } from '@/utils/tracking';

const DOCUMENTS_LIST_URL = 'https://functions.poehali.dev/0c6aa7f0-6f84-4a44-938f-3e2ba7024f4b';

interface Document {
  id: number;
  title: string;
  description: string;
  iconName: string;
  fileUrl: string;
  fileName: string;
}

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch(DOCUMENTS_LIST_URL);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (doc: Document) => {
    trackClick(`Документ: ${doc.title}`, 'documents');
    trackEvent(TrackingEvent.VIEW_DOCUMENT, EventCategory.ENGAGEMENT, {
      document_title: doc.title,
    });
    window.open(doc.fileUrl, '_blank');
  };

  if (loading) {
    return (
      <section id="documents" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600">Загрузка документов...</p>
        </div>
      </section>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  const gridCols = documents.length === 1 
    ? 'max-w-md mx-auto' 
    : documents.length === 2 
    ? 'grid md:grid-cols-2 gap-8 max-w-3xl mx-auto'
    : 'grid md:grid-cols-3 gap-8 max-w-5xl mx-auto';

  return (
    <section id="documents" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
          Документы и сертификаты
        </h2>
        <p className="text-center text-xl text-slate-600 mb-16">Полное соответствие требованиям ГОСТ и международным стандартам</p>
        <div className={gridCols}>
          {documents.map((doc) => (
            <Card 
              key={doc.id} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon name={doc.iconName} className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">{doc.title}</h3>
              <p className="text-slate-600">{doc.description}</p>
              <div className="mt-4 flex items-center text-primary font-semibold">
                <span>Скачать</span>
                <Icon name="Download" className="ml-2" size={16} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';
import { trackEvent, TrackingEvent, EventCategory } from '@/utils/tracking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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
    setSelectedDoc(doc);
    setPreviewOpen(true);
  };

  const handleDownload = (doc: Document) => {
    window.open(doc.fileUrl, '_blank');
  };

  const isPDF = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
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
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="relative h-80 bg-slate-100 overflow-hidden">
                {isPDF(doc.fileName) ? (
                  <>
                    {/* Превью PDF только на десктопе */}
                    <div className="hidden md:flex w-full h-full items-center justify-center p-4">
                      <iframe
                        src={`${doc.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-full h-full pointer-events-none border-0"
                        title={doc.title}
                      />
                    </div>
                    {/* Иконка на мобильных */}
                    <div className="md:hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Icon name="FileText" className="text-primary" size={80} />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Icon name={doc.iconName} className="text-primary" size={80} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-4 shadow-lg">
                      <Icon name="Eye" className="text-primary" size={32} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-slate-800">{doc.title}</h3>
                <p className="text-sm text-slate-600">{doc.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[95vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedDoc?.title}</DialogTitle>
            <p className="text-sm text-slate-600 mt-1">{selectedDoc?.description}</p>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg bg-slate-100 mt-4 min-h-0">
            {selectedDoc && isPDF(selectedDoc.fileName) ? (
              <iframe
                src={`${selectedDoc.fileUrl}#view=FitH`}
                className="w-full h-full border-0"
                title={selectedDoc.title}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Icon name={selectedDoc?.iconName || 'File'} className="text-primary mb-4" size={80} />
                <p className="text-slate-600 mb-6">Предпросмотр недоступен для этого типа файла</p>
                <Button onClick={() => selectedDoc && handleDownload(selectedDoc)}>
                  <Icon name="Download" className="mr-2" size={16} />
                  Скачать документ
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => selectedDoc && handleDownload(selectedDoc)}
              className="flex-1"
            >
              <Icon name="Download" className="mr-2" size={16} />
              Скачать
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setPreviewOpen(false)}
              className="flex-1"
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
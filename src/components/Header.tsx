import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  const [showDocuments, setShowDocuments] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('show_documents_section');
    if (savedState !== null) {
      setShowDocuments(savedState === 'true');
    }
  }, []);
  return (
    <header className="fixed top-0 w-full bg-[#f5f5f5] shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img 
            src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/cf3bde7a-7217-4c93-8917-b7e2e6a73768.jpg" 
            alt="Sentag" 
            className="h-12 w-auto"
          />
          <div className="w-px h-10 bg-slate-300"></div>
          <button onClick={() => scrollToSection('about')} className="cursor-pointer transition hover:opacity-80">
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg" 
              alt="Меридиан" 
              className="h-12 w-auto"
            />
          </button>
        </div>
        <nav className="hidden md:flex gap-6">
          <button onClick={() => scrollToSection('system')} className="text-slate-600 hover:text-primary transition">О системе</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-primary transition">Как работает</button>
          <button onClick={() => scrollToSection('advantages')} className="text-slate-600 hover:text-primary transition">Преимущества</button>
          <button onClick={() => scrollToSection('components')} className="text-slate-600 hover:text-primary transition">Компоненты</button>
          <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-primary transition">О компании</button>
          {showDocuments && (
            <button onClick={() => scrollToSection('documents')} className="text-slate-600 hover:text-primary transition">Документы</button>
          )}
          <button onClick={() => scrollToSection('contacts')} className="text-slate-600 hover:text-primary transition">Контакты</button>
        </nav>
        <Button onClick={() => scrollToSection('request')} className="hidden md:flex">
          Оставить заявку
        </Button>
      </div>
    </header>
  );
}
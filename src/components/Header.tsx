import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  const [showDocuments, setShowDocuments] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('show_documents_section');
    if (savedState !== null) {
      setShowDocuments(savedState === 'true');
    }
  }, []);

  const handleMobileNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };
  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-slate-300 via-slate-150 to-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-6">
          <img 
            src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/cf3bde7a-7217-4c93-8917-b7e2e6a73768.jpg" 
            alt="Sentag" 
            className="h-8 md:h-12 w-auto mix-blend-multiply"
          />
          <div className="w-px h-8 md:h-10 bg-slate-300"></div>
          <button onClick={() => scrollToSection('about')} className="cursor-pointer transition hover:opacity-80">
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg" 
              alt="Меридиан" 
              className="h-8 md:h-12 w-auto mix-blend-multiply"
            />
          </button>
        </div>
        <nav className="hidden xl:flex gap-4 2xl:gap-6 text-sm 2xl:text-base">
          <button onClick={() => scrollToSection('system')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">О системе</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Как работает</button>
          <button onClick={() => scrollToSection('advantages')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Преимущества</button>
          <button onClick={() => scrollToSection('components')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Компоненты</button>
          <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">О компании</button>
          {showDocuments && (
            <button onClick={() => scrollToSection('documents')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Документы</button>
          )}
          <button onClick={() => scrollToSection('contacts')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Контакты</button>
        </nav>
        <Button onClick={() => scrollToSection('request')} className="hidden xl:flex text-sm 2xl:text-base whitespace-nowrap">
          Оставить заявку
        </Button>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="xl:hidden">
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              <button onClick={() => handleMobileNavClick('system')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">О системе</button>
              <button onClick={() => handleMobileNavClick('how-it-works')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Как работает</button>
              <button onClick={() => handleMobileNavClick('advantages')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Преимущества</button>
              <button onClick={() => handleMobileNavClick('components')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Компоненты</button>
              <button onClick={() => handleMobileNavClick('about')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">О компании</button>
              {showDocuments && (
                <button onClick={() => handleMobileNavClick('documents')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Документы</button>
              )}
              <button onClick={() => handleMobileNavClick('contacts')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Контакты</button>
              <Button onClick={() => handleMobileNavClick('request')} className="mt-4 w-full">
                Оставить заявку
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
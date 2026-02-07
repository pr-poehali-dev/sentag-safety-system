import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { trackClick } from '@/utils/trackVisit';

interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  const [showDocuments, setShowDocuments] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Загружаем настройки с сервера
    const loadSettings = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            const showDocs = data.settings.show_documents_section ?? true;
            setShowDocuments(showDocs);
          }
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
        // Fallback to localStorage
        const savedState = localStorage.getItem('show_documents_section');
        if (savedState !== null) {
          setShowDocuments(savedState === 'true');
        }
      }
    };

    loadSettings();

    const handleCustomEvent = () => {
      loadSettings();
    };

    window.addEventListener('documentsToggle', handleCustomEvent);

    return () => {
      window.removeEventListener('documentsToggle', handleCustomEvent);
    };
  }, []);

  const handleNavClick = (id: string, label: string) => {
    trackClick(`Меню: ${label}`, 'header');
    scrollToSection(id);
  };

  const handleMobileNavClick = (id: string, label: string) => {
    trackClick(`Меню (моб): ${label}`, 'header-mobile');
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  const handleRequestClick = (isMobile: boolean = false) => {
    trackClick('Оставить заявку', isMobile ? 'header-mobile' : 'header');
    scrollToSection('request');
    if (isMobile) setMobileMenuOpen(false);
  };
  return (
    <header className="fixed top-0 w-full bg-[#f5f5f5] shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/dfa50620-cca3-4ff7-8b8d-c83d81e84f12.png" 
            alt="Sentag" 
            className="h-8 md:h-12 w-auto"
          />
        </div>
        <nav className="hidden xl:flex gap-4 2xl:gap-6 text-sm 2xl:text-base">
          <button onClick={() => handleNavClick('system', 'О системе')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">О системе</button>
          <button onClick={() => handleNavClick('how-it-works', 'Как работает')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Как работает</button>
          <button onClick={() => handleNavClick('advantages', 'Преимущества')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Преимущества</button>
          <button onClick={() => handleNavClick('components', 'Компоненты')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Компоненты</button>
          <button onClick={() => handleNavClick('about', 'О компании')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">О компании</button>
          {showDocuments && (
            <button onClick={() => handleNavClick('documents', 'Документы')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Документы</button>
          )}
          <button onClick={() => handleNavClick('contacts', 'Контакты')} className="text-slate-600 hover:text-primary transition whitespace-nowrap">Контакты</button>
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleRequestClick()} className="text-xs md:text-sm 2xl:text-base whitespace-nowrap shadow-lg hover:shadow-xl animate-call-attention hover:animate-none transition-shadow duration-300">
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
              <button onClick={() => handleMobileNavClick('system', 'О системе')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">О системе</button>
              <button onClick={() => handleMobileNavClick('how-it-works', 'Как работает')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Как работает</button>
              <button onClick={() => handleMobileNavClick('advantages', 'Преимущества')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Преимущества</button>
              <button onClick={() => handleMobileNavClick('components', 'Компоненты')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Компоненты</button>
              <button onClick={() => handleMobileNavClick('about', 'О компании')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">О компании</button>
              {showDocuments && (
                <button onClick={() => handleMobileNavClick('documents', 'Документы')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Документы</button>
              )}
              <button onClick={() => handleMobileNavClick('contacts', 'Контакты')} className="text-left text-lg text-slate-600 hover:text-primary transition py-2">Контакты</button>
              <Button onClick={() => handleRequestClick(true)} className="mt-4 w-full">
                Оставить заявку
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
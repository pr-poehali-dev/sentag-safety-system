import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  const [showDocuments, setShowDocuments] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('show_documents_section');
    if (savedState !== null) {
      setShowDocuments(savedState === 'true');
    }
  }, []);

  return (
    <footer className="bg-slate-900 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/files/65359691-8b10-40b2-b7b1-41ab7aabf7e7.jpg" 
              alt="Sentag" 
              className="h-10 md:h-12 w-auto mb-3 md:mb-4"
            />
            <p className="text-sm md:text-base text-slate-400">Безопасность вашего бассейна под контролем</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg">Навигация</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-400">
              <li><button onClick={() => scrollToSection('system')} className="hover:text-white transition">О системе</button></li>
              <li><button onClick={() => scrollToSection('advantages')} className="hover:text-white transition">Преимущества</button></li>
              <li><button onClick={() => scrollToSection('components')} className="hover:text-white transition">Компоненты</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg">Компания</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-400">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">О нас</button></li>
              {showDocuments && (
                <li><button onClick={() => scrollToSection('documents')} className="hover:text-white transition">Документы</button></li>
              )}
              <li><button onClick={() => scrollToSection('contacts')} className="hover:text-white transition">Контакты</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg">Контакты</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-400">
              <li>г. Тюмень, ул. 30 лет Победы, д. 60А</li>
              <li><a href="tel:+73452568286" className="hover:text-white transition">+7 (3452) 56-82-86</a></li>
              <li><a href="mailto:info@meridian-t.ru" className="hover:text-white transition break-all">info@meridian-t.ru</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 md:pt-8 text-center text-xs md:text-sm text-slate-400">
          <p>© 2024 Меридиан. Эксклюзивный дистрибьютор Sentag AB в России. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
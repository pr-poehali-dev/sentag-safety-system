import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  const [showDocuments, setShowDocuments] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackClick('Email (футер)', 'footer');
    navigator.clipboard.writeText('info@meridian-t.ru');
    alert('Email скопирован в буфер обмена');
  };

  return (
    <footer className="bg-[#f5f5f5] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/dfa50620-cca3-4ff7-8b8d-c83d81e84f12.png" 
              alt="Sentag" 
              className="h-10 md:h-12 w-auto mb-3 md:mb-4"
            />
            <p className="text-sm md:text-base text-slate-600">Безопасность вашего бассейна под контролем</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg text-slate-900">Навигация</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-600">
              <li><button onClick={() => { trackClick('О системе (футер)', 'footer'); scrollToSection('system'); }} className="hover:text-primary transition">О системе</button></li>
              <li><button onClick={() => { trackClick('Преимущества (футер)', 'footer'); scrollToSection('advantages'); }} className="hover:text-primary transition">Преимущества</button></li>
              <li><button onClick={() => { trackClick('Компоненты (футер)', 'footer'); scrollToSection('components'); }} className="hover:text-primary transition">Компоненты</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg text-slate-900">Компания</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-600">
              <li><button onClick={() => { trackClick('О нас (футер)', 'footer'); scrollToSection('about'); }} className="hover:text-primary transition">О нас</button></li>
              {showDocuments && (
                <li><button onClick={() => { trackClick('Документы (футер)', 'footer'); scrollToSection('documents'); }} className="hover:text-primary transition">Документы</button></li>
              )}
              <li><button onClick={() => { trackClick('Контакты (футер)', 'footer'); scrollToSection('contacts'); }} className="hover:text-primary transition">Контакты</button></li>
              <li><button onClick={() => { trackClick('Политика конфиденциальности', 'footer'); setShowPrivacyPolicy(true); }} className="hover:text-primary transition">Политика конфиденциальности</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg text-slate-900">Контакты</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-600">
              <li>
                <a 
                  href="https://yandex.ru/maps/?text=г.+Тюмень,+ул.+30+лет+Победы,+д.+60А" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackClick('Адрес (футер)', 'footer')}
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <Icon name="MapPin" size={14} />
                  г. Тюмень, ул. 30 лет Победы, д. 60А
                </a>
              </li>
              <li>
                <a 
                  href="tel:+73452568286" 
                  onClick={() => trackClick('Телефон (футер)', 'footer')}
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <Icon name="Phone" size={14} />
                  +7 (3452) 56-82-86
                </a>
              </li>
              <li>
                <button 
                  onClick={handleEmailClick}
                  className="hover:text-primary transition break-all flex items-center gap-1 text-left"
                >
                  <Icon name="Mail" size={14} />
                  info@meridian-t.ru
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-300 pt-6 md:pt-8 text-center text-xs md:text-sm text-slate-600">
          <p>© 2024 Меридиан. Эксклюзивный дистрибьютор Sentag AB в России. Все права защищены.</p>
        </div>
      </div>
      
      <PrivacyPolicyModal open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
    </footer>
  );
}
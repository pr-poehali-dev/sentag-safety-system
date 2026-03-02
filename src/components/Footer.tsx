import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  const { settings } = useSiteSettings();
  const showDocuments = settings.showDocuments;
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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
              width="200"
              height="48"
              loading="lazy"
            />
            <p className="text-sm md:text-base text-slate-600">Безопасность вашего бассейна под контролем</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-base md:text-lg text-slate-900">Навигация</h4>
            <ul className="space-y-2 text-sm md:text-base text-slate-600">
              <li><button onClick={() => { trackClick('О системе (футер)', 'footer'); scrollToSection('system'); }} className="hover:text-primary transition">СООУ для бассейнов</button></li>
              <li><button onClick={() => { trackClick('Как работает (футер)', 'footer'); scrollToSection('how-it-works'); }} className="hover:text-primary transition">Как работает система</button></li>
              <li><button onClick={() => { trackClick('Преимущества (футер)', 'footer'); scrollToSection('advantages'); }} className="hover:text-primary transition">Преимущества ГОСТ</button></li>
              <li><button onClick={() => { trackClick('Компоненты (футер)', 'footer'); scrollToSection('components'); }} className="hover:text-primary transition">Компоненты системы</button></li>
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
                <a 
                  href="tel:+79808544908" 
                  onClick={() => trackClick('Телефон 2 (футер)', 'footer')}
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <Icon name="Phone" size={14} />
                  +7 (980) 854-49-08
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
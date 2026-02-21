import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';
import { trackEvent, TrackingEvent, EventCategory } from '@/utils/tracking';

interface ContactsSectionProps {
  scrollToSection?: (id: string) => void;
}

export default function ContactsSection({ scrollToSection }: ContactsSectionProps) {
  const handleCallRequest = () => {
    trackClick('Заказать звонок', 'contacts');
    trackEvent(TrackingEvent.REQUEST_CALL, EventCategory.CONVERSION, {
      contact_method: 'phone_callback',
    });
    if (scrollToSection) {
      scrollToSection('request');
    } else {
      document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    trackClick('Написать письмо', 'contacts');
    trackEvent(TrackingEvent.CLICK_EMAIL, EventCategory.CONTACT, {
      contact_method: 'email',
    });
    navigator.clipboard.writeText('info@meridian-t.ru');
    alert('Email скопирован в буфер обмена');
  };

  return (
    <section id="contacts" className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-slate-800">Контакты</h2>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <Card className="p-5 md:p-6 text-center hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="MapPin" className="text-primary" size={22} />
            </div>
            <h3 className="font-bold text-sm md:text-base mb-2 text-slate-800">Адрес</h3>
            <p className="text-slate-600">г. Тюмень, ул. 30 лет Победы,<br />д. 60А, офис 302</p>
            <Button variant="link" className="mt-4" asChild>
              <a 
                href="https://yandex.ru/maps/?text=г.+Тюмень,+ул.+30+лет+Победы,+д.+60А" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  trackClick('Открыть на карте', 'contacts');
                  trackEvent(TrackingEvent.CLICK_MAP, EventCategory.CONTACT, {
                    contact_method: 'map',
                  });
                }}
              >
                Открыть на карте
              </a>
            </Button>
          </Card>
          <Card className="p-5 md:p-6 text-center hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Phone" className="text-primary" size={22} />
            </div>
            <h3 className="font-bold text-sm md:text-base mb-2 text-slate-800">Телефон</h3>
            <p className="text-slate-600">
              <a 
                href="tel:+73452568286" 
                className="hover:text-primary transition"
                onClick={() => {
                  trackClick('Клик по телефону', 'contacts');
                  trackEvent(TrackingEvent.CLICK_PHONE, EventCategory.CONTACT, {
                    contact_method: 'phone_direct',
                  });
                }}
              >
                +7 (3452) 56-82-86
              </a>
            </p>
            <Button variant="link" className="mt-4" onClick={handleCallRequest}>
              Заказать звонок
            </Button>
          </Card>
          <Card className="p-5 md:p-6 text-center hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Mail" className="text-primary" size={22} />
            </div>
            <h3 className="font-bold text-sm md:text-base mb-2 text-slate-800">Email</h3>
            <p className="text-slate-600">
              <button 
                onClick={handleCopyEmail}
                className="hover:text-primary transition cursor-pointer"
              >
                info@meridian-t.ru
              </button>
            </p>
            <Button variant="link" className="mt-4" onClick={handleCopyEmail}>
              Написать письмо
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
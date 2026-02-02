import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ContactsSectionProps {
  scrollToSection?: (id: string) => void;
}

export default function ContactsSection({ scrollToSection }: ContactsSectionProps) {
  const handleCallRequest = () => {
    if (scrollToSection) {
      scrollToSection('request');
    } else {
      document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contacts" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">Контакты</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MapPin" className="text-primary" size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Адрес</h3>
            <p className="text-slate-600">г. Тюмень, ул. 30 лет Победы,<br />д. 60А, офис 302</p>
            <Button variant="link" className="mt-4" asChild>
              <a href="https://yandex.ru/maps/?text=г.+Тюмень,+ул.+30+лет+Победы,+д.+60А" target="_blank" rel="noopener noreferrer">
                Открыть на карте
              </a>
            </Button>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Phone" className="text-primary" size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Телефон</h3>
            <p className="text-slate-600">
              <a href="tel:+73452568286" className="hover:text-primary transition">+7 (3452) 56-82-86</a>
            </p>
            <Button variant="link" className="mt-4" onClick={handleCallRequest}>
              Заказать звонок
            </Button>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Mail" className="text-primary" size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Email</h3>
            <p className="text-slate-600">
              <a href="mailto:info@meridian-t.ru" className="hover:text-primary transition">info@meridian-t.ru</a>
            </p>
            <Button variant="link" className="mt-4">
              Написать письмо
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
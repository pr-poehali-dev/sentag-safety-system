import Icon from '@/components/ui/icon';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">Sentag</span>
            </div>
            <p className="text-slate-400">Безопасность вашего бассейна под контролем</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Навигация</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => scrollToSection('system')} className="hover:text-white transition">О системе</button></li>
              <li><button onClick={() => scrollToSection('advantages')} className="hover:text-white transition">Преимущества</button></li>
              <li><button onClick={() => scrollToSection('components')} className="hover:text-white transition">Компоненты</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Компания</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">О нас</button></li>
              <li><button onClick={() => scrollToSection('documents')} className="hover:text-white transition">Документы</button></li>
              <li><button onClick={() => scrollToSection('contacts')} className="hover:text-white transition">Контакты</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-slate-400">
              <li>г. Тюмень, ул. 30 лет Победы, д. 60А</li>
              <li><a href="tel:+73452568286" className="hover:text-white transition">+7 (3452) 56-82-86</a></li>
              <li><a href="mailto:info@meridian-t.ru" className="hover:text-white transition">info@meridian-t.ru</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>© 2024 Меридиан. Эксклюзивный дистрибьютор Sentag AB в России. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

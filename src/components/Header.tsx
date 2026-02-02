import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Shield" className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-slate-800">Sentag</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <button onClick={() => scrollToSection('system')} className="text-slate-600 hover:text-primary transition">О системе</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-primary transition">Как работает</button>
          <button onClick={() => scrollToSection('advantages')} className="text-slate-600 hover:text-primary transition">Преимущества</button>
          <button onClick={() => scrollToSection('components')} className="text-slate-600 hover:text-primary transition">Компоненты</button>
          <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-primary transition">О компании</button>
          <button onClick={() => scrollToSection('documents')} className="text-slate-600 hover:text-primary transition">Документы</button>
          <button onClick={() => scrollToSection('contacts')} className="text-slate-600 hover:text-primary transition">Контакты</button>
        </nav>
        <Button onClick={() => scrollToSection('request')} className="hidden md:flex">
          Оставить заявку
        </Button>
      </div>
    </header>
  );
}

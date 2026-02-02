import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-[#f5f5f5] shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/cf3bde7a-7217-4c93-8917-b7e2e6a73768.jpg" 
            alt="Sentag" 
            className="h-12 w-auto"
          />
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
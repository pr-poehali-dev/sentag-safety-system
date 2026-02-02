import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-start justify-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/10cc27e4-2dba-46d6-90da-7f6f121e50a7.png" 
          alt="Браслет Sentag" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>
      
      <div className="container mx-auto px-4 text-center z-10 animate-fade-in mt-32">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          СООУ Sentag в России
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-blue-100">
          Безопасность вашего бассейна под контролем
        </p>
        <p className="text-lg md:text-xl mb-48 max-w-4xl mx-auto text-blue-50">
          Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => scrollToSection('request')} className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-6 font-semibold">
            Запросить расчет
          </Button>
          <Button size="lg" onClick={() => scrollToSection('how-it-works')} className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-6 font-semibold">
            Узнать больше
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" className="text-white" size={32} />
      </div>
    </section>
  );
}
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-start justify-center text-white overflow-hidden pt-32 md:pt-40">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/952e9eb2-8ecb-4a5b-af1a-6d941ce05946.png" 
          alt="Браслет Sentag" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
      </div>
      
      <div className="container mx-auto px-4 text-center z-10 animate-fade-in pt-20 pb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2">
          СООУ Sentag в России
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-blue-100 px-2">
          Безопасность вашего бассейна под контролем
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-4xl mx-auto text-blue-50 px-4">
          Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          <Button size="lg" onClick={() => scrollToSection('request')} className="bg-white text-primary hover:bg-blue-50 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold w-full sm:w-auto">
            Запросить расчет
          </Button>
          <Button size="lg" onClick={() => scrollToSection('how-it-works')} className="bg-white text-primary hover:bg-blue-50 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold w-full sm:w-auto">
            Узнать больше
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" className="text-white" size={32} />
      </div>
    </section>
  );
}
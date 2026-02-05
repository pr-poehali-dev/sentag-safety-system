import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-start justify-center text-white overflow-hidden pt-32 md:pt-40">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/d181a7ed-76ac-4ddf-9e5f-071e5bb2a3d2.png" 
          alt="Бассейн" 
          className="w-full h-full object-cover object-center sm:object-[center_30%] md:object-center brightness-[1.2]"
        />
        <img 
          src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/db8a685c-ddf9-4f00-aad6-79bacfe19141.png" 
          alt="Браслет Sentag на руке" 
          className="absolute bottom-0 left-0 w-[150%] sm:w-[125%] md:w-[100%] lg:w-[87.5%] xl:w-[75%] h-auto object-contain brightness-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20 pointer-events-none" />
      </div>
      
      <div className="container mx-auto px-4 text-center z-10 animate-fade-in pb-20" style={{ marginTop: '-4rem' }}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
          Безопасность вашего бассейна под контролем
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 px-2 font-semibold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
          СООУ Sentag в России
        </p>
        <div className="inline-block max-w-4xl mx-auto mb-8 md:mb-12 px-4">
          <p className="text-base sm:text-lg md:text-xl bg-black/40 backdrop-blur-sm rounded-lg px-6 py-4 leading-relaxed">
            Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          <Button 
            size="lg" 
            onClick={() => {
              trackClick('Запросить расчет', 'hero');
              scrollToSection('request');
            }} 
            className="bg-white text-primary hover:bg-blue-50 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold w-full sm:w-auto"
          >
            Запросить расчет
          </Button>
          <Button 
            size="lg" 
            onClick={() => {
              trackClick('Узнать больше', 'hero');
              scrollToSection('how-it-works');
            }} 
            className="bg-white text-primary hover:bg-blue-50 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold w-full sm:w-auto"
          >
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
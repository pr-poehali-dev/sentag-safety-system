import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { trackClick } from "@/utils/trackVisit";

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section className="relative min-h-[50vh] md:h-screen flex items-center justify-center text-white overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/d181a7ed-76ac-4ddf-9e5f-071e5bb2a3d2.png"
          alt="Система безопасности бассейнов Sentag AB - СООУ для предотвращения утопления"
          className="w-full h-full object-cover object-center brightness-[1.2]"
        />
        <img
          src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/db8a685c-ddf9-4f00-aad6-79bacfe19141.png"
          alt="Браслет безопасности Sentag СООУ для бассейна - система оповещения опасности утопления"
          className="absolute bottom-0 left-0 hidden md:block w-[40%] lg:w-[32%] xl:w-[28%] h-auto object-contain brightness-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 text-center z-10 animate-fade-in py-6">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight px-2"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
        >
          Безопасность вашего бассейна под контролем
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl mb-3 px-2 font-semibold"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
        >
          СООУ Sentag в России
        </p>
        <div className="inline-block max-w-2xl mx-auto mb-6 md:mb-8 px-4">
          <p className="text-sm sm:text-base md:text-lg bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 leading-relaxed">
            Система оповещения опасности утопления производства компании «Sentag
            AB» — современное решение для обеспечения безопасности плавания.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
          <Button
            size="lg"
            onClick={() => {
              trackClick("Запросить расчет", "hero");
              scrollToSection("request");
            }}
            className="bg-white text-primary hover:bg-blue-50 text-sm md:text-base px-6 py-4 font-semibold w-full sm:w-auto"
          >
            Запросить расчет
          </Button>
          <Button
            size="lg"
            onClick={() => {
              trackClick("Узнать больше", "hero");
              scrollToSection("how-it-works");
            }}
            className="bg-white text-primary hover:bg-blue-50 text-sm md:text-base px-6 py-4 font-semibold w-full sm:w-auto"
          >
            Узнать больше
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" className="text-white" size={28} />
      </div>
    </section>
  );
}
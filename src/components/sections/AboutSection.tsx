import { Card } from '@/components/ui/card';

export default function AboutSection() {
  return (
    <section id="about" className="py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 md:mb-12">
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/f8b16601-3c21-4e50-9f84-e2b4378f7d09.png" 
              alt="Логотип Меридиан" 
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 md:mb-6 text-slate-800 px-2">О компании — официальный дистрибьютор СООУ Sentag AB в России</h2>
          <div className="max-w-none text-slate-700 space-y-3 md:space-y-4">
            <p className="text-sm sm:text-base leading-relaxed">
              Компания <strong>«Меридиан»</strong> имеет эксклюзивное право на реализацию продукции шведских систем обнаружения опасности утопления производства «Sentag AB» в России. Мы сможем реализовать решения разных уровней сложности, начиная от маленьких частных бассейнов, до олимпийских объектов и аквапарков.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Подберем оборудование с учетом особенностей вашего бассейна. Расскажем о работе системы, подберем оптимальные варианты для вашего объекта.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              «Меридиан» надёжный партнёр, который ответственно относится к принятым на себя обязательствам, что подтверждено многолетним опытом работы и довольными заказчиками. Наши системы позволяют сделать бассейны еще более безопасными, сохраняя жизни людей.
            </p>
          </div>
          <div className="mt-6 md:mt-8 text-center px-4">
            <Card className="inline-block p-5 md:p-6 bg-primary text-white">
              <p className="text-base md:text-lg font-bold">Миссия компании:</p>
              <p className="text-lg md:text-xl font-bold mt-1">Бассейны должны быть безопасны!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
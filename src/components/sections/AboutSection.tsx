import { Card } from '@/components/ui/card';

export default function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 md:mb-12">
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/d5c9cc72-6f46-4a5f-81b0-e6d17eb0dc48.jpg" 
              alt="Логотип Меридиан" 
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-slate-800 px-2">О компании</h2>
          <div className="prose prose-base sm:prose-lg max-w-none text-slate-700 space-y-4 md:space-y-6">
            <p className="text-base sm:text-lg leading-relaxed">
              Компания <strong>«Меридиан»</strong> имеет эксклюзивное право на реализацию продукции шведских систем обнаружения опасности утопления производства «Sentag AB» в России. Мы сможем реализовать заказ любого уровня сложности, начиная от маленьких частных бассейнов, до олимпийских объектов и аквапарков.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              Легко подберем оборудование с учетом особенностей вашего бассейна. Расскажем о работе системы, подберем оптимальные варианты для вашего объекта.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              «Меридиан» надёжный партнёр, который ответственно относится к принятым на себя обязательствам, что подтверждено многолетним опытом работы и довольными заказчиками. Наши системы позволяют сделать бассейны еще более безопасными, сохраняя жизни людей.
            </p>
          </div>
          <div className="mt-8 md:mt-12 text-center px-4">
            <Card className="inline-block p-6 md:p-8 bg-primary text-white">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">Миссия компании:</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">Бассейны должны быть безопасны!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
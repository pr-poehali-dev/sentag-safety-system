import { Card } from '@/components/ui/card';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/d5c9cc72-6f46-4a5f-81b0-e6d17eb0dc48.jpg" 
              alt="Логотип Меридиан" 
              className="w-48 h-48 object-contain"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">О компании</h2>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6">
            <p className="text-lg leading-relaxed">
              Компания <strong>«Меридиан»</strong> имеет эксклюзивное право на реализацию продукции шведских систем обнаружения опасности утопления производства «Sentag AB» в России. Мы сможем реализовать заказ любого уровня сложности, начиная от маленьких частных бассейнов, до олимпийских объектов и аквапарков.
            </p>
            <p className="text-lg leading-relaxed">
              Легко подберем оборудование с учетом особенностей вашего бассейна. Расскажем о работе системы, подберем оптимальные варианты для вашего объекта.
            </p>
            <p className="text-lg leading-relaxed">
              «Меридиан» надёжный партнёр, который ответственно относится к принятым на себя обязательствам, что подтверждено многолетним опытом работы и довольными заказчиками. Наши системы позволяют сделать бассейны еще более безопасными, сохраняя жизни людей.
            </p>
          </div>
          <div className="mt-12 text-center">
            <Card className="inline-block p-8 bg-primary text-white">
              <p className="text-2xl font-bold">Миссия компании:</p>
              <p className="text-3xl font-bold mt-2">Бассейны должны быть безопасны!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

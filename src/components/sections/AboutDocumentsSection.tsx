import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AboutDocumentsSection() {
  return (
    <>
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
                Компания <strong>«Меридиан»</strong> имеет эксклюзивное право на реализацию продукции шведских систем обнаружения опасности утопления производства «Sentag AB» в России. Мы сможем реализовать решения разных уровней сложности, начиная от маленьких частных бассейнов, до олимпийских объектов и аквапарков.
              </p>
              <p className="text-lg leading-relaxed">
                Подберем оборудование с учетом особенностей вашего бассейна. Расскажем о работе системы, подберем оптимальные варианты для вашего объекта.
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

      <section id="documents" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
            Документы и сертификаты
          </h2>
          <p className="text-center text-xl text-slate-600 mb-16">Полное соответствие требованиям ГОСТ и международным стандартам</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: 'FileCheck', title: 'Сертификат соответствия ГОСТ', description: 'Подтверждение соответствия требованиям РФ' },
              { icon: 'Award', title: 'Международные сертификаты', description: 'CE, ISO 9001 и другие стандарты качества' },
              { icon: 'FileText', title: 'Техническая документация', description: 'Инструкции по установке и эксплуатации' },
              { icon: 'ClipboardCheck', title: 'Тестовые отчёты', description: 'Результаты испытаний систем безопасности' },
              { icon: 'BookOpen', title: 'Руководства пользователя', description: 'Подробные инструкции для персонала' },
              { icon: 'Shield', title: 'Гарантийные документы', description: 'Условия гарантийного обслуживания' }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon} className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
                <div className="mt-4 flex items-center text-primary font-semibold">
                  <span>Скачать</span>
                  <Icon name="Download" className="ml-2" size={16} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
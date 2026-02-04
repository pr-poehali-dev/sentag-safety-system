import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function InfoSections() {
  return (
    <>
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
            Как работает система оповещения опасности утопления?
          </h2>
          <div className="max-w-6xl mx-auto mt-16">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: '01',
                  icon: 'Watch',
                  title: 'Браслет подает сигнал',
                  description: 'Если посетитель бассейна находится продолжительное время на критической глубине, браслет подает сигнал'
                },
                {
                  step: '02',
                  icon: 'Radio',
                  title: 'Передача на сенсоры',
                  description: 'Информация поступает на сенсоры, установленные в бассейне. Блок управления получает сигнал тревоги'
                },
                {
                  step: '03',
                  icon: 'AlertTriangle',
                  title: 'Тревожное оповещение',
                  description: 'Тревожный сигнал отображается на дисплее настенного модуля, включаются световые и звуковые приборы оповещения'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
                          <Icon name={item.icon} className="text-white" size={40} />
                        </div>
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-primary">
                          <span className="text-primary font-bold text-lg">{item.step}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">{item.title}</h3>
                      <p className="text-slate-600 text-base leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <Icon name="ArrowRight" className="text-primary" size={32} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="p-8 bg-blue-50 border-blue-200">
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong>Продолжительность времени нахождения и глубина настраивается отдельно</strong> с учетом особенностей бассейнов и возрастной категории посетителей. Браслеты могут отличаться настройками и цветами.
              </p>
            </Card>
          </div>
          <div className="mt-12 text-center max-w-4xl mx-auto">
            <p className="text-xl text-slate-700 leading-relaxed">
              Инновационная технология Sentag обеспечивает <strong className="text-primary">самую раннюю и точную сигнализацию</strong> об обнаружении опасности утопления с целью сокращения времени на спасение в случае инцидента. Технические решения, предлагаемые нашей компанией, <strong className="text-primary">сводят к нулю риски</strong> того что критическая ситуация останется незамеченной.
            </p>
          </div>
        </div>
      </section>

      <section id="system" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">
            Что вы получаете используя СООУ «Sentag»
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ShieldCheck',
                title: 'Обеспечение безопасности людей',
                description: 'Защита посетителей на закрытой воде с помощью передовых технологий мониторинга'
              },
              {
                icon: 'Users',
                title: 'Оптимизация работы спасателей',
                description: 'Система помогает персоналу быстрее реагировать на критические ситуации'
              },
              {
                icon: 'Award',
                title: 'Повышение имиджа и репутации',
                description: 'Современные системы безопасности укрепляют доверие клиентов к вашему заведению'
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Icon name={item.icon} className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="advantages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">
            Преимущества СООУ Sentag
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Wrench', title: 'Легкое обслуживание и монтаж', description: 'Простая установка и минимальные требования к обслуживанию системы' },
              { icon: 'FileCheck', title: 'Соответствует российскому ГОСТ', description: 'Полное соответствие требованиям и стандартам РФ' },
              { icon: 'CreditCard', title: 'Браслет как ключ или способ оплаты', description: 'Многофункциональность браслета для удобства посетителей' },
              { icon: 'Heart', title: 'Особое внимание к детям и пожилым', description: 'Настраиваемые параметры для разных возрастных групп' },
              { icon: 'Zap', title: 'Мгновенная реакция', description: 'Система реагирует на опасность в режиме реального времени' },
              { icon: 'Search', title: 'Функция "Объект в бассейне"', description: 'Обнаружение посторонних предметов в воде' },
              { icon: 'User', title: 'Индивидуальный контроль', description: 'Система контролирует каждого пользователя отдельно' },
              { icon: 'ShieldAlert', title: 'Защита от сбоев', description: 'Система не подвержена сбоям под воздействием внешних факторов' }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon} className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      <section id="documents" className="py-20 bg-white">
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
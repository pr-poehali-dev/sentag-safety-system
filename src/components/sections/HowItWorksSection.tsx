import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function HowItWorksSection() {
  return (
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
  );
}

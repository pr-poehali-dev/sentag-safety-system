import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-slate-800">
          Как работает система оповещения опасности утопления?
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 relative">
            {[
              {
                step: '01',
                icon: 'Watch',
                title: 'Браслет подает сигнал',
                description: 'Если посетитель находится на критической глубине установленное время, браслет подает сигнал'
              },
              {
                step: '02',
                icon: 'Radio',
                title: 'Передача на сенсоры',
                description: 'Информация поступает на сенсоры в бассейне. Блок управления получает сигнал тревоги'
              },
              {
                step: '03',
                icon: 'AlertTriangle',
                title: 'Тревожное оповещение',
                description: 'Сигнал отображается на дисплее настенного модуля, включаются световые и звуковые приборы'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <Card className="p-5 md:p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon name={item.icon} className="text-white" size={30} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow border-2 border-primary">
                        <span className="text-primary font-bold text-xs">{item.step}</span>
                      </div>
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-2 text-slate-800">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </Card>
                {idx < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <Icon name="ArrowRight" className="text-primary" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 md:mt-10 max-w-2xl mx-auto">
          <Card className="p-5 md:p-6 bg-blue-50 border-blue-200">
            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
              <strong>Продолжительность времени и глубина настраивается отдельно</strong> с учетом особенностей бассейнов и возрастной категории посетителей. Браслеты могут отличаться настройками и цветами.
            </p>
          </Card>
        </div>
        <div className="mt-6 md:mt-8 text-center max-w-3xl mx-auto">
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            Инновационная технология Sentag обеспечивает <strong className="text-primary">самую раннюю и точную сигнализацию</strong> об обнаружении опасности утопления. Технические решения нашей компании <strong className="text-primary">сводят к нулю риски</strong> того, что критическая ситуация останется незамеченной.
          </p>
        </div>
      </div>
    </section>
  );
}
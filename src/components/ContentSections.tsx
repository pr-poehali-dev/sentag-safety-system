import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function ContentSections() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    company: '',
    role: '',
    fullName: '',
    objectName: '',
    objectAddress: '',
    consent: false,
  });
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleComponent = (id: string) => {
    setExpandedComponent(expandedComponent === id ? null : id);
  };

  return (
    <>
      <section id="system" className="py-20 bg-white">
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

      <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
            Как работает система оповещения опасности утопления?
          </h2>
          <div className="max-w-4xl mx-auto space-y-8 mt-16">
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
                description: 'Информация поступает на сенсоры, установленные в бассейне'
              },
              {
                step: '03',
                icon: 'AlertTriangle',
                title: 'Тревожное оповещение',
                description: 'Тревожный сигнал отображается на дисплее настенного модуля, включаются световые и звуковые приборы оповещения'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name={item.icon} className="text-white" size={32} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-primary mb-2">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
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

      <section id="components" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
            Система оповещения опасности утопления
          </h2>
          <p className="text-center text-xl text-slate-600 mb-16">состоит из 6 основных компонентов</p>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Watch" className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Браслет</h3>
              </div>
              
              <img 
                src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/e9f9e9b6-b24f-4766-aa8c-92cf54c1c80a.jpg"
                alt="Браслет Sentag"
                className="w-full h-auto rounded-xl shadow-lg mb-6"
              />
              
              {expandedComponent === 'bracelet' && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Браслет Sentag является <strong>сердцем СООУ</strong>. Он непрерывно контролирует пловца находящегося в воде. Если пловец слишком глубоко и долго пребывает под водой, система срабатывает и оповещает спасателя, что позволяет максимально быстро спасти человека в случае чрезвычайной ситуации.
                  </p>
                  
                  <div className="border-t pt-4">
                    <p><strong>RFID метка в браслете</strong> позволяет использовать дополнительные функции такие как:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-2 mb-4">
                      <li>Открытие шкафчика раздевалки</li>
                      <li>Оплата в фудкорте</li>
                      <li>Оплата дополнительных услуг заведения и прочее</li>
                    </ul>
                    <p className="text-slate-700 mb-3">Метка RFID совместима со всеми существующими системами СКУД и ППС. Бирку RFID можно настроить для работы с существующими системами заказчика, а также нанести логотип компании заказчика.</p>
                    <p className="text-slate-700 mb-3">Браслет Sentag изготовлен из <strong>гипоаллергенного пластика</strong>. Он оснащен встроенным аккумулятором со сроком службы до <strong>3 лет</strong> без необходимости перезарядки.</p>
                    <p className="text-slate-700 mb-3">В случае внутренней ошибки, а также в случае, если батарея разряжена, LED индикатор будет мигать с периодичностью в 30 секунд, чтобы предупредить пользователя об ошибке.</p>
                    <p className="text-slate-700">Браслет Sentag поставляется с отдельным регулируемым ремешком. По запросу также могут быть поставлены отдельные размеры браслетов для детей. Браслеты могут быть произведены в разных цветах по запросу клиента.</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => toggleComponent('bracelet')}
                variant="outline"
                className="w-full"
              >
                {expandedComponent === 'bracelet' ? 'Скрыть' : 'Подробнее'}
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Server" className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Блок управления</h3>
              </div>
              
              <img 
                src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/fcc91bdc-55fd-4ede-be87-db6857f5b894.jpg"
                alt="Блок управления"
                className="w-full h-auto rounded-xl shadow-lg mb-6"
              />
              
              {expandedComponent === 'control' && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Система Sentag имеет возможность отслеживать случаи опасности утопления в <strong>нескольких бассейнах одновременно</strong>. Блок управления получает сигналы тревоги об опасности утопления от блоков датчиков в бассейнах и сигналы тревоги от кнопок, подключенных к блокам ввода-вывода или блокам датчиков.
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-slate-700 mb-3">Привлечения внимания к необходимому участку обеспечивается путём объединения сенсоров и механических кнопок, а также сирен и световых сигналов в определенные <strong>Тревожные Группы</strong> таким образом, чтобы персонал понимал, где происходит инцидент и какие действия необходимо предпринять.</p>
                    <p className="text-slate-700 mb-3">К блоку ввода-вывода можно подключить дополнительные устройства сигнализации, такие, как двусторонние радиостанции, DECT-телефоны, сирены и световые сигналы.</p>
                    <p className="text-slate-700 mb-3"><strong>Веб-интерфейс блока управления</strong> используется для управления и администрирования пользователей, рабочих настроек (например, часы работы), системных настроек (например, сеть и время), устройств, Тревожных групп и журналов тревог. Веб интерфейс доступен на любом современном браузере.</p>
                    <p className="text-slate-700">Блок управления может быть установлен на столе, стойке или стене (VESA100).</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => toggleComponent('control')}
                variant="outline"
                className="w-full"
              >
                {expandedComponent === 'control' ? 'Скрыть' : 'Подробнее'}
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Monitor" className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Настенный модуль</h3>
              </div>
              
              <div className="w-full h-64 bg-slate-200 rounded-xl shadow-lg mb-6 flex items-center justify-center">
                <Icon name="Monitor" className="text-slate-400" size={64} />
              </div>
              
              {expandedComponent === 'wall' && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Настенный модуль Sentag используется для отображения состояния и сигналов тревоги, а также для сброса и сброса сигналов тревоги. Он имеет <strong>водонепроницаемый сенсорный экран</strong> и только одно соединение для сети и питания (питание через Ethernet).
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-slate-700 mb-3">Настенный Модуль отображает время и указывает, что он активен, а при возникновении тревоги он меняет цвет фона на <strong className="text-red-600">красный</strong> и отображает название Тревожной Группы (Групп).</p>
                    <p className="text-slate-700 mb-3">Сигнал тревоги можно отключить (все выходы сигналов Тревожной Группы очищаются) с помощью PIN-кода, а когда причина сигнала тревоги устранена (пловец спасен, приняты меры), Тревожная Группа может быть сброшена и восстановлена для нового сигнала тревоги.</p>
                    <p className="text-slate-700 mb-3">Во избежание несанкционированного использования системы спасатели имеют <strong>персональный PIN-код</strong> для отключения и сброса сигналов тревоги. Все действия регистрируются с указанием времени и пользователя в блоке управления.</p>
                    <p className="text-slate-700">Настенные модули следует устанавливать вблизи бассейна, чтобы они были видны и помогали оператору бассейна сигнализировать о том, что у объекта есть дополнительный уровень защиты для помощи спасателям.</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => toggleComponent('wall')}
                variant="outline"
                className="w-full"
              >
                {expandedComponent === 'wall' ? 'Скрыть' : 'Подробнее'}
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Radio" className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Сенсор для чаши бассейна</h3>
              </div>
              
              <div className="w-full h-64 bg-slate-200 rounded-xl shadow-lg mb-6 flex items-center justify-center">
                <Icon name="Radio" className="text-slate-400" size={64} />
              </div>
              
              {expandedComponent === 'sensor' && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Сенсор для чаши бассейнов непрерывно контролирует воду в бассейне на предмет сигналов тревоги от браслетов Sentag. Для снижения риска ложных срабатываний и преодоления помех в воде были приняты меры предосторожности, и все сигналы надежно улавливаются и анализируются блоком датчиков.
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-slate-700 mb-3">Как только браслет Sentag подает сигнал в воде, когда человек тонет, т.е. срабатывают уровни тревоги, информация <strong>немедленно отправляется</strong> в блок управления для активации соответствующих Тревожных Групп.</p>
                    <p className="text-slate-700 mb-3">Сенсоры должны быть размещены <strong>через каждые 25 метров</strong> в бассейне, на стенах. Они подключаются к блокам датчиков, расположенным вне бассейна, с помощью тонкого кабеля.</p>
                    <p className="text-slate-700 mb-3">Специальный монтажный комплект упрощает установку датчика. Белая задняя панель удерживает датчик Sentag в нужном положении и может быть легко привинчена или приклеена к стене бассейна. Черная крышка защищает от ударов и толчков и устанавливается одним щелчком.</p>
                    <p className="text-slate-700">Блок датчиков оснащен дополнительными разъемами для ручного тревожного входа и внешнего тревожного выхода.</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => toggleComponent('sensor')}
                variant="outline"
                className="w-full"
              >
                {expandedComponent === 'sensor' ? 'Скрыть' : 'Подробнее'}
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Cpu" className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Блок ввода-вывода ioLogik</h3>
              </div>
              
              <div className="w-full h-64 bg-slate-200 rounded-xl shadow-lg mb-6 flex items-center justify-center">
                <Icon name="Cpu" className="text-slate-400" size={64} />
              </div>
              
              {expandedComponent === 'iologik' && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Блок ввода-вывода Sentag <strong>(Moxa ioLogik E1214)</strong> используется для устройств сигнализации, таких, как сирены, мигающие лампы, двусторонние радиостанции, а также для внешних входов, таких, как кнопки Help и Emergency.
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-slate-700 mb-3">Стандартное устройство вмещает <strong>6 цифровых входов и 6 релейных выходов</strong>. Другие конфигурации доступны по запросу.</p>
                    <p className="text-slate-700 mb-3">Устройство поддерживает два типа монтажа: Монтаж на DIN-рейку и настенный монтаж. Устройство можно легко объединить в стек с помощью встроенного 2-портового коммутатора Ethernet, чтобы увеличить количество доступных входов и выходов.</p>
                    <p className="text-slate-700 mb-3">Сервер имеет встроенный двухпортовый Ethernet коммутатор, что позволяет подключить к нему любые другие Ethernet устройства или еще один ioLogik для организации цепочной сетевой топологии.</p>
                    <p className="text-slate-700">Блок ввода-вывода может быть размещен в местах электрических соединений устройств сигнализации и требует 12-36 В постоянного тока, 200 мА и подключения через Sentag LAN CAT6 к блоку управления.</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => toggleComponent('iologik')}
                variant="outline"
                className="w-full"
              >
                {expandedComponent === 'iologik' ? 'Скрыть' : 'Подробнее'}
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Wrench" className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Тестер-программатор браслетов</h3>
              </div>
              
              <div className="w-full h-64 bg-slate-200 rounded-xl shadow-lg mb-6 flex items-center justify-center">
                <Icon name="Wrench" className="text-slate-400" size={64} />
              </div>
              
              {expandedComponent === 'tester' && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Браслеты Sentag имеют ключевое значение для корректного обнаружения опасности утопления и должны быть всегда исправны, чтобы выполнять свою задачу. Для проверки функциональности Браслеты оснащены <strong>встроенной системой самопроверки</strong> и постоянно сообщают о своем состоянии на Sentag Tester.
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="text-slate-700 mb-3">К тестеру Sentag прикладывается браслет Sentag (Sentag 6001), и результат немедленно отображается на дисплее.</p>
                    <p className="font-semibold text-slate-800 mb-2">Тестирование меток Sentag:</p>
                    <p className="text-slate-700 mb-3">Каждый раз, когда браслет Sentag выдается для использования в плавательном учреждении, его следует проверять на работоспособность. Для этого необходимо приложить браслет Sentag к тестеру и посмотреть результат теста:</p>
                    <ul className="list-none space-y-2 mb-3">
                      <li className="flex items-center gap-3">
                        <span className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></span>
                        <span className="text-slate-700"><strong className="text-green-700">Зелёный цвет</strong> - Браслет исправен, готов к использованию</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></span>
                        <span className="text-slate-700"><strong className="text-red-700">Красный цвет</strong> - Ошибка. Запрещено использовать! Браслет неисправен и должен быть утилизирован</span>
                      </li>
                    </ul>
                    <p className="text-slate-700">Неисправный браслет должен быть помечен, что он неисправен, и его следует передать дистрибьютору (поставщику) для дальнейшего изучения или замены батареи.</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => toggleComponent('tester')}
                variant="outline"
                className="w-full"
              >
                {expandedComponent === 'tester' ? 'Скрыть' : 'Подробнее'}
              </Button>
            </Card>
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

      <section id="request" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-800">
              Запросить расчет
            </h2>
            <p className="text-center text-slate-600 mb-12">Заполните форму, и наш специалист свяжется с вами</p>
            
            <Card className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                    1
                  </div>
                  <div className={`h-1 w-20 ${formStep >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                    2
                  </div>
                </div>
              </div>

              {formStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <Label htmlFor="phone">Контактный телефон *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="example@company.ru"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Наименование предприятия *</Label>
                    <Input 
                      id="company" 
                      placeholder="ООО «Название»"
                      value={formData.company}
                      onChange={(e) => handleFormChange('company', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Кем является *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleFormChange('role', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contractor">Подрядчик</SelectItem>
                        <SelectItem value="customer">Конечный заказчик</SelectItem>
                        <SelectItem value="design">Проектная организация</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fullName">ФИО, должность *</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Иванов Иван Иванович, Директор"
                      value={formData.fullName}
                      onChange={(e) => handleFormChange('fullName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="objectName">Наименование объекта *</Label>
                    <Input 
                      id="objectName" 
                      placeholder="Бассейн «Название»"
                      value={formData.objectName}
                      onChange={(e) => handleFormChange('objectName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="objectAddress">Адрес объекта *</Label>
                    <Input 
                      id="objectAddress" 
                      placeholder="г. Город, ул. Улица, д. 1"
                      value={formData.objectAddress}
                      onChange={(e) => handleFormChange('objectAddress', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => handleFormChange('consent', checked)}
                    />
                    <Label htmlFor="consent" className="text-sm cursor-pointer">
                      Даю согласие на сбор и обработку персональных данных
                    </Label>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setFormStep(2)}
                    disabled={!formData.consent}
                  >
                    Далее
                  </Button>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <Label htmlFor="visitors">Максимальное количество посетителей в день *</Label>
                    <Input 
                      id="visitors" 
                      type="number"
                      placeholder="Например: 200"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zones">Градация зон</Label>
                    <Textarea 
                      id="zones" 
                      placeholder="Опишите детские зоны, взрослые зоны, их размеры и глубину..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bracelets">Цвета браслетов и их количество</Label>
                    <Input 
                      id="bracelets" 
                      placeholder="Например: синие - 50 шт, красные - 30 шт"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="poolSize">Форма, размеры и глубина бассейна *</Label>
                    <Textarea 
                      id="poolSize" 
                      placeholder="Опишите параметры бассейна..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="poolScheme">Схема бассейна</Label>
                    <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                      <Icon name="Upload" className="mx-auto mb-2 text-slate-400" size={32} />
                      <p className="text-sm text-slate-600">Прикрепите файл со схемой</p>
                      <p className="text-xs text-slate-400 mt-1">Укажите подводные фонари, водные преграды, волны и др.</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deadline">Сроки поставки и запуска объекта</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="consent2" defaultChecked />
                    <Label htmlFor="consent2" className="text-sm cursor-pointer">
                      Даю согласие на сбор и обработку персональных данных
                    </Label>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setFormStep(1)}
                    >
                      Назад
                    </Button>
                    <Button className="flex-1" size="lg">
                      Отправить заявку
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <p className="text-center text-sm text-slate-500 mt-6">
              <button className="underline hover:text-primary transition">Политика конфиденциальности</button>
            </p>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">Контакты</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" className="text-primary" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Адрес</h3>
              <p className="text-slate-600">г. Тюмень, ул. 30 лет Победы,<br />д. 60А, офис 302</p>
              <Button variant="link" className="mt-4">
                Открыть на карте
              </Button>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Phone" className="text-primary" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Телефон</h3>
              <p className="text-slate-600">
                <a href="tel:+73452568286" className="hover:text-primary transition">+7 (3452) 56-82-86</a>
              </p>
              <Button variant="link" className="mt-4">
                Заказать звонок
              </Button>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" className="text-primary" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Email</h3>
              <p className="text-slate-600">
                <a href="mailto:info@meridian-t.ru" className="hover:text-primary transition">info@meridian-t.ru</a>
              </p>
              <Button variant="link" className="mt-4">
                Написать письмо
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
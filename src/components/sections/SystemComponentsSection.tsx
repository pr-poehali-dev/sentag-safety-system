import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface SystemComponentsSectionProps {
  expandedComponent: string | null;
  toggleComponent: (id: string) => void;
}

export default function SystemComponentsSection({ expandedComponent, toggleComponent }: SystemComponentsSectionProps) {
  return (
    <section id="components" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
          Система оповещения опасности утопления
        </h2>
        <p className="text-center text-xl text-slate-600 mb-16">состоит из 6 основных компонентов</p>
        
        <div className="max-w-6xl mx-auto space-y-16">
          <Card className="p-8 md:p-12 hover:shadow-2xl transition-all">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Icon name="Watch" className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">Браслет</h3>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img 
                  src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/e9f9e9b6-b24f-4766-aa8c-92cf54c1c80a.jpg" 
                  alt="Браслет Sentag" 
                  className="w-full max-w-sm h-auto object-contain rounded-lg"
                />
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p>Браслет Sentag является <strong>сердцем СООУ</strong>. Он непрерывно контролирует пловца находящегося в воде. Если пловец слишком глубоко и долго пребывает под водой, система срабатывает и оповещает спасателя, что позволяет максимально быстро спасти человека в случае чрезвычайной ситуации.</p>
              
              {expandedComponent === 'bracelet' && (
                <div className="space-y-4 mt-4">
                  <p><strong>RFID метка в браслете</strong> позволяет использовать дополнительные функции такие как:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Открытие шкафчика раздевалки</li>
                    <li>Оплата в фудкорте</li>
                    <li>Оплата дополнительных услуг заведения и прочее</li>
                  </ul>
                  <p>Метка RFID совместима со всеми существующими системами СКУД и ППС. Бирку RFID можно настроить для работы с существующими системами заказчика, а также нанести логотип компании заказчика.</p>
                  <p>Браслет Sentag изготовлен из <strong>гипоаллергенного пластика</strong>. Он оснащен встроенным аккумулятором со сроком службы до <strong>3 лет</strong> без необходимости перезарядки.</p>
                  <p>В случае внутренней ошибки, а также в случае, если батарея разряжена, LED индикатор будет мигать с периодичностью в 30 секунд, чтобы предупредить пользователя об ошибке.</p>
                  <p>Браслет Sentag поставляется с отдельным регулируемым ремешком. По запросу также могут быть поставлены отдельные размеры браслетов для детей. Браслеты могут быть произведены в разных цветах по запросу клиента.</p>
                </div>
              )}
              
              <Button 
                variant="link" 
                onClick={() => toggleComponent('bracelet')}
                className="mt-4 p-0 h-auto font-semibold text-primary"
              >
                {expandedComponent === 'bracelet' ? 'Скрыть' : 'Подробнее'} 
                <Icon name={expandedComponent === 'bracelet' ? 'ChevronUp' : 'ChevronDown'} className="ml-1" size={20} />
              </Button>
            </div>
          </Card>

          <Card className="p-8 md:p-12 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="Server" className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Блок управления</h3>
            </div>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p>Система Sentag имеет возможность отслеживать случаи опасности утопления в <strong>нескольких бассейнах одновременно</strong>. Блок управления получает сигналы тревоги об опасности утопления от блоков датчиков в бассейнах и сигналы тревоги от кнопок, подключенных к блокам ввода-вывода или блокам датчиков.</p>
              
              {expandedComponent === 'control' && (
                <div className="space-y-4 mt-4">
                  <p>Привлечения внимания к необходимому участку обеспечивается путём объединения сенсоров и механических кнопок, а также сирен и световых сигналов в определенные <strong>Тревожные Группы</strong> таким образом, чтобы персонал понимал, где происходит инцидент и какие действия необходимо предпринять.</p>
                  <p>К блоку ввода-вывода можно подключить дополнительные устройства сигнализации, такие, как двусторонние радиостанции, DECT-телефоны, сирены и световые сигналы.</p>
                  <p><strong>Веб-интерфейс блока управления</strong> используется для управления и администрирования пользователей, рабочих настроек (например, часы работы), системных настроек (например, сеть и время), устройств, Тревожных групп и журналов тревог. Веб интерфейс доступен на любом современном браузере.</p>
                  <p>Блок управления может быть установлен на столе, стойке или стене (VESA100).</p>
                </div>
              )}
              
              <Button 
                variant="link" 
                onClick={() => toggleComponent('control')}
                className="mt-4 p-0 h-auto font-semibold text-primary"
              >
                {expandedComponent === 'control' ? 'Скрыть' : 'Подробнее'} 
                <Icon name={expandedComponent === 'control' ? 'ChevronUp' : 'ChevronDown'} className="ml-1" size={20} />
              </Button>
            </div>
          </Card>

          <Card className="p-8 md:p-12 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="Monitor" className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Настенный модуль</h3>
            </div>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p>Настенный модуль Sentag используется для отображения состояния и сигналов тревоги, а также для сброса и сброса сигналов тревоги. Он имеет <strong>водонепроницаемый сенсорный экран</strong> и только одно соединение для сети и питания (питание через Ethernet).</p>
              
              {expandedComponent === 'wall' && (
                <div className="space-y-4 mt-4">
                  <p>Настенный Модуль отображает время и указывает, что он активен, а при возникновении тревоги он меняет цвет фона на <strong className="text-red-600">красный</strong> и отображает название Тревожной Группы (Групп).</p>
                  <p>Сигнал тревоги можно отключить (все выходы сигналов Тревожной Группы очищаются) с помощью PIN-кода, а когда причина сигнала тревоги устранена (пловец спасен, приняты меры), Тревожная Группа может быть сброшена и восстановлена для нового сигнала тревоги.</p>
                  <p>Во избежание несанкционированного использования системы спасатели имеют <strong>персональный PIN-код</strong> для отключения и сброса сигналов тревоги. Все действия регистрируются с указанием времени и пользователя в блоке управления.</p>
                  <p>Настенные модули следует устанавливать вблизи бассейна, чтобы они были видны и помогали оператору бассейна сигнализировать о том, что у объекта есть дополнительный уровень защиты для помощи спасателям.</p>
                </div>
              )}
              
              <Button 
                variant="link" 
                onClick={() => toggleComponent('wall')}
                className="mt-4 p-0 h-auto font-semibold text-primary"
              >
                {expandedComponent === 'wall' ? 'Скрыть' : 'Подробнее'} 
                <Icon name={expandedComponent === 'wall' ? 'ChevronUp' : 'ChevronDown'} className="ml-1" size={20} />
              </Button>
            </div>
          </Card>

          <Card className="p-8 md:p-12 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="Radio" className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Сенсор для чаши бассейна</h3>
            </div>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p>Сенсор для чаши бассейнов непрерывно контролирует воду в бассейне на предмет сигналов тревоги от браслетов Sentag. Для снижения риска ложных срабатываний и преодоления помех в воде были приняты меры предосторожности, и все сигналы надежно улавливаются и анализируются блоком датчиков.</p>
              
              {expandedComponent === 'sensor' && (
                <div className="space-y-4 mt-4">
                  <p>Как только браслет Sentag подает сигнал в воде, когда человек тонет, т.е. срабатывают уровни тревоги, информация <strong>немедленно отправляется</strong> в блок управления для активации соответствующих Тревожных Групп.</p>
                  <p>Сенсоры должны быть размещены <strong>через каждые 25 метров</strong> в бассейне, на стенах. Они подключаются к блокам датчиков, расположенным вне бассейна, с помощью тонкого кабеля.</p>
                  <p>Специальный монтажный комплект упрощает установку датчика. Белая задняя панель удерживает датчик Sentag в нужном положении и может быть легко привинчена или приклеена к стене бассейна. Черная крышка защищает от ударов и толчков и устанавливается одним щелчком.</p>
                  <p>Блок датчиков оснащен дополнительными разъемами для ручного тревожного входа и внешнего тревожного выхода.</p>
                </div>
              )}
              
              <Button 
                variant="link" 
                onClick={() => toggleComponent('sensor')}
                className="mt-4 p-0 h-auto font-semibold text-primary"
              >
                {expandedComponent === 'sensor' ? 'Скрыть' : 'Подробнее'} 
                <Icon name={expandedComponent === 'sensor' ? 'ChevronUp' : 'ChevronDown'} className="ml-1" size={20} />
              </Button>
            </div>
          </Card>

          <Card className="p-8 md:p-12 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="Cpu" className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Блок ввода-вывода ioLogik</h3>
            </div>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p>Блок ввода-вывода Sentag <strong>(Moxa ioLogik E1214)</strong> используется для устройств сигнализации, таких, как сирены, мигающие лампы, двусторонние радиостанции, а также для внешних входов, таких, как кнопки Help и Emergency.</p>
              
              {expandedComponent === 'iologik' && (
                <div className="space-y-4 mt-4">
                  <p>Стандартное устройство вмещает <strong>6 цифровых входов и 6 релейных выходов</strong>. Другие конфигурации доступны по запросу.</p>
                  <p>Устройство поддерживает два типа монтажа: Монтаж на DIN-рейку и настенный монтаж. Устройство можно легко объединить в стек с помощью встроенного 2-портового коммутатора Ethernet, чтобы увеличить количество доступных входов и выходов.</p>
                  <p>Сервер имеет встроенный двухпортовый Ethernet коммутатор, что позволяет подключить к нему любые другие Ethernet устройства или еще один ioLogik для организации цепочной сетевой топологии.</p>
                  <p>Блок ввода-вывода может быть размещен в местах электрических соединений устройств сигнализации и требует 12-36 В постоянного тока, 200 мА и подключения через Sentag LAN CAT6 к блоку управления.</p>
                </div>
              )}
              
              <Button 
                variant="link" 
                onClick={() => toggleComponent('iologik')}
                className="mt-4 p-0 h-auto font-semibold text-primary"
              >
                {expandedComponent === 'iologik' ? 'Скрыть' : 'Подробнее'} 
                <Icon name={expandedComponent === 'iologik' ? 'ChevronUp' : 'ChevronDown'} className="ml-1" size={20} />
              </Button>
            </div>
          </Card>

          <Card className="p-8 md:p-12 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="Wrench" className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Тестер-программатор браслетов</h3>
            </div>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p>Браслеты Sentag имеют ключевое значение для корректного обнаружения опасности утопления и должны быть всегда исправны, чтобы выполнять свою задачу. Для проверки функциональности Браслеты оснащены <strong>встроенной системой самопроверки</strong> и постоянно сообщают о своем состоянии на Sentag Tester.</p>
              
              {expandedComponent === 'tester' && (
                <div className="space-y-4 mt-4">
                  <p>К тестеру Sentag прикладывается браслет Sentag (Sentag 6001), и результат немедленно отображается на дисплее.</p>
                  <p className="font-semibold">Тестирование меток Sentag:</p>
                  <p>Каждый раз, когда браслет Sentag выдается для использования в плавательном учреждении, его следует проверять на работоспособность. Для этого необходимо приложить браслет Sentag к тестеру и посмотреть результат теста:</p>
                  <ul className="list-none space-y-2">
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></span>
                      <strong className="text-green-700">Зелёный цвет</strong> - Браслет исправен, готов к использованию
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></span>
                      <strong className="text-red-700">Красный цвет</strong> - Ошибка. Запрещено использовать! Браслет неисправен и должен быть утилизирован
                    </li>
                  </ul>
                  <p>Неисправный браслет должен быть помечен, что он неисправен, и его следует передать дистрибьютору (поставщику) для дальнейшего изучения или замены батареи.</p>
                </div>
              )}
              
              <Button 
                variant="link" 
                onClick={() => toggleComponent('tester')}
                className="mt-4 p-0 h-auto font-semibold text-primary"
              >
                {expandedComponent === 'tester' ? 'Скрыть' : 'Подробнее'} 
                <Icon name={expandedComponent === 'tester' ? 'ChevronUp' : 'ChevronDown'} className="ml-1" size={20} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

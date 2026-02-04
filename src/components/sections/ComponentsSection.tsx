import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function ComponentsSection() {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const toggleComponent = (id: string) => {
    setExpandedComponent(expandedComponent === id ? null : id);
  };

  return (
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
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/9684c64f-f412-4dff-afb0-b0f554bd549f.png"
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
                  <p className="text-slate-700"><strong>Веб-интерфейс блока управления</strong> используется для управления и администрирования пользователей, рабочих настроек (например, часы работы), системных настроек (например, сеть и время), устройств, Тревожных групп и журналов тревог. Веб интерфейс доступен на любом современном браузере.</p>
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
            
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/49682fb7-d208-408a-9df4-443eab580edf.jpg"
              alt="Настенный модуль Sentag"
              className="w-full h-auto rounded-xl shadow-lg mb-6"
            />
            
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
            
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/8707c55e-51a1-4738-a4a2-6c3705340c3f.jpg"
              alt="Сенсор для чаши бассейна Sentag"
              className="w-full h-auto rounded-xl shadow-lg mb-6"
            />
            
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
            
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/077c0ea4-20b8-4d73-9561-5fae5849a976.jpg"
              alt="Блок ввода-вывода ioLogik"
              className="w-full h-auto rounded-xl shadow-lg mb-6"
            />
            
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
            
            <img 
              src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/f0c3dc40-6715-466b-a3c0-24432523eb55.jpg"
              alt="Тестер-программатор браслетов Sentag"
              className="w-full h-auto rounded-xl shadow-lg mb-6"
            />
            
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
                  <p className="text-slate-700">Неисправный браслет должен быть помечен, что он неисправен, и его следует передать дистрибьютору (поставщику) для дальнейшего изучения батареи.</p>
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
  );
}
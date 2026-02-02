import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const Index = () => {
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-800">Sentag</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection('system')} className="text-slate-600 hover:text-primary transition">О системе</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-primary transition">Как работает</button>
            <button onClick={() => scrollToSection('advantages')} className="text-slate-600 hover:text-primary transition">Преимущества</button>
            <button onClick={() => scrollToSection('components')} className="text-slate-600 hover:text-primary transition">Компоненты</button>
            <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-primary transition">О компании</button>
            <button onClick={() => scrollToSection('documents')} className="text-slate-600 hover:text-primary transition">Документы</button>
            <button onClick={() => scrollToSection('contacts')} className="text-slate-600 hover:text-primary transition">Контакты</button>
          </nav>
          <Button onClick={() => scrollToSection('request')} className="hidden md:flex">
            Оставить заявку
          </Button>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600 z-0" />
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="container mx-auto px-4 text-center z-10 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            СООУ Sentag в России
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Безопасность вашего бассейна под контролем
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto text-blue-50">
            Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => scrollToSection('request')} className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-6">
              Запросить расчет
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('how-it-works')} className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              Узнать больше
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" className="text-white" size={32} />
        </div>
      </section>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'Watch', title: 'Браслет', description: 'Водонепроницаемый браслет с датчиками глубины и времени погружения. Настраивается под разные возрастные группы.' },
              { icon: 'Server', title: 'Блок управления', description: 'Центральный процессор системы, обрабатывающий сигналы от всех браслетов и сенсоров в режиме реального времени.' },
              { icon: 'Monitor', title: 'Настенный модуль', description: 'Дисплей для визуального отображения тревожных сигналов с указанием местоположения в бассейне.' },
              { icon: 'Radio', title: 'Сенсор для чаши бассейна', description: 'Водонепроницаемые приемники сигналов, устанавливаемые по периметру и дну бассейна.' },
              { icon: 'Cpu', title: 'Блок ввода-вывода ioLogik', description: 'Интерфейс для подключения световых и звуковых систем оповещения к центральному блоку.' },
              { icon: 'Wrench', title: 'Тестер-программатор браслетов', description: 'Устройство для настройки параметров браслетов и проверки их работоспособности перед выдачей посетителям.' }
            ].map((item, idx) => (
              <Card key={idx} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Icon name={item.icon} className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">Меридиан</span>
              </div>
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

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Shield" className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold">Sentag</span>
              </div>
              <p className="text-slate-400">Безопасность вашего бассейна под контролем</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('system')} className="hover:text-white transition">О системе</button></li>
                <li><button onClick={() => scrollToSection('advantages')} className="hover:text-white transition">Преимущества</button></li>
                <li><button onClick={() => scrollToSection('components')} className="hover:text-white transition">Компоненты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">О нас</button></li>
                <li><button onClick={() => scrollToSection('documents')} className="hover:text-white transition">Документы</button></li>
                <li><button onClick={() => scrollToSection('contacts')} className="hover:text-white transition">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-slate-400">
                <li>г. Тюмень, ул. 30 лет Победы, д. 60А</li>
                <li><a href="tel:+73452568286" className="hover:text-white transition">+7 (3452) 56-82-86</a></li>
                <li><a href="mailto:info@meridian-t.ru" className="hover:text-white transition">info@meridian-t.ru</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2024 Меридиан. Эксклюзивный дистрибьютор Sentag AB в России. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
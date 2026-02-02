import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

export default function RequestFormSection() {
  const [formStep, setFormStep] = useState(1);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [showConsentText, setShowConsentText] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
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

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.company.trim()) newErrors.company = true;
    if (!formData.role.trim()) newErrors.role = true;
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.objectName.trim()) newErrors.objectName = true;
    if (!formData.objectAddress.trim()) newErrors.objectAddress = true;
    if (!formData.consent) newErrors.consent = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setFormStep(2);
    }
  };

  return (
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
                    className={`mt-2 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">Необходимо заполнить контактный телефон</p>}
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@company.ru"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className={`mt-2 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">Необходимо заполнить e-mail</p>}
                </div>
                <div>
                  <Label htmlFor="company">Наименование предприятия *</Label>
                  <Input 
                    id="company" 
                    placeholder="ООО «Название»"
                    value={formData.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    className={`mt-2 ${errors.company ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.company && <p className="text-sm text-red-500 mt-1">Необходимо заполнить наименование предприятия</p>}
                </div>
                <div>
                  <Label htmlFor="role">Кем является *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleFormChange('role', value)}>
                    <SelectTrigger className={`mt-2 ${errors.role ? 'border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contractor">Подрядчик</SelectItem>
                      <SelectItem value="customer">Конечный заказчик</SelectItem>
                      <SelectItem value="design">Проектная организация</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500 mt-1">Необходимо выбрать роль</p>}
                </div>
                <div>
                  <Label htmlFor="fullName">ФИО, должность *</Label>
                  <Input 
                    id="fullName" 
                    placeholder="Иванов Иван Иванович, Директор"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    className={`mt-2 ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.fullName && <p className="text-sm text-red-500 mt-1">Необходимо заполнить ФИО и должность</p>}
                </div>
                <div>
                  <Label htmlFor="objectName">Наименование объекта *</Label>
                  <Input 
                    id="objectName" 
                    placeholder="Бассейн «Название»"
                    value={formData.objectName}
                    onChange={(e) => handleFormChange('objectName', e.target.value)}
                    className={`mt-2 ${errors.objectName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.objectName && <p className="text-sm text-red-500 mt-1">Необходимо заполнить наименование объекта</p>}
                </div>
                <div>
                  <Label htmlFor="objectAddress">Адрес объекта *</Label>
                  <Input 
                    id="objectAddress" 
                    placeholder="г. Город, ул. Улица, д. 1"
                    value={formData.objectAddress}
                    onChange={(e) => handleFormChange('objectAddress', e.target.value)}
                    className={`mt-2 ${errors.objectAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.objectAddress && <p className="text-sm text-red-500 mt-1">Необходимо заполнить адрес объекта</p>}
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => {
                        handleFormChange('consent', checked);
                        setShowConsentText(checked as boolean);
                      }}
                    />
                    <Label htmlFor="consent" className="text-sm cursor-pointer">
                      Даю согласие на сбор и обработку персональных данных
                    </Label>
                  </div>
                  {showConsentText && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed animate-fade-in">
                      <p className="font-semibold mb-2">Даю согласие на сбор и обработку персональных данных.</p>
                      <p className="mb-2">
                        Настоящим я, действуя своей волей и в своем интересе, даю своё согласие (далее – Согласие) на обработку моих персональных данных компанией <strong>ООО "Меридиан"</strong> ОГРН 1217200006760 ИНН/КПП 7203519186/720301001 (далее – Оператор) в соответствии со статьей 9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
                      </p>
                      <p className="mb-2">
                        <strong>Цель обработки персональных данных:</strong> получение заявки и возможности обратной связи для формирования коммерческого предложения. В дальнейшем предоставление услуг и выполнение обязательств по договору, а также информирование о продуктах, услугах и специальных предложениях Оператора.
                      </p>
                      <p className="mb-2">
                        В рамках обработки Оператор имеет право собирать, систематизировать, накапливать, хранить, уточнять (обновлять, изменять), использовать и обезличивать мои персональные данные, включая ФИО, контактную информация, адрес электронной почты.
                      </p>
                      <p>
                        Согласие действительно до его отзыва мной в установленном законом порядке.
                      </p>
                    </div>
                  )}
                  {errors.consent && <p className="text-sm text-red-500 mt-2">Необходимо дать согласие на обработку данных</p>}
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleNextStep}
                >
                  Далее
                </Button>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label htmlFor="companyCard">1. Добавьте карточку предприятия</Label>
                  <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                    <Icon name="Upload" className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-sm text-slate-600">Прикрепите файл с карточкой предприятия</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, Word, Excel до 10 МБ</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="visitorsInfo">2. Укажите, максимальное количество посетителей в день? Есть ли градация, детские зоны, взрослые зоны? Цвета браслетов и их количество?</Label>
                  <Textarea 
                    id="visitorsInfo" 
                    placeholder="Например: До 300 посетителей в день. Есть детская зона (глубина 0.8м) и взрослая зона (глубина 2.5м). Браслеты: синие - 100 шт, красные - 50 шт, желтые - 50 шт."
                    className="mt-2"
                    rows={5}
                  />
                </div>
                <div>
                  <Label htmlFor="poolSize">3. Укажите форму, размеры и глубину бассейна *</Label>
                  <Textarea 
                    id="poolSize" 
                    placeholder="Например: Прямоугольная форма, 25м х 12м, глубина от 1.2м до 2.8м"
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="poolScheme">4. Добавьте схему бассейна</Label>
                  <p className="text-sm text-slate-500 mt-1 mb-2">При наличии укажите на схеме: подводные фонари, водные преграды, волны, аэромассажные зоны, подводные лежаки, гейзеры и др.</p>
                  <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                    <Icon name="Upload" className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-sm text-slate-600">Прикрепите файл со схемой бассейна</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DWG до 20 МБ</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline">5. Какие сроки поставки интересуют, когда планируется запуск объекта?</Label>
                  <Textarea 
                    id="deadline" 
                    placeholder="Например: Поставка до 1 июня 2025, запуск объекта планируется на 15 июня 2025"
                    className="mt-2"
                    rows={2}
                  />
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
            <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
              <DialogTrigger asChild>
                <button className="underline hover:text-primary transition">Политика конфиденциальности</button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Политика конфиденциальности</DialogTitle>
                  <DialogDescription className="sr-only">
                    Политика конфиденциальности и обработки персональных данных
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    <strong>1.</strong> Оператор гарантирует конфиденциальность и защиту персональных данных пользователей в соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных» и иных нормативных правовых актов Российской Федерации.
                  </p>
                  <p>
                    <strong>2.</strong> Персональные данные собираются исключительно для целей, указанных в настоящем Согласии, и не передаются третьим лицам без согласия субъекта данных, за исключением случаев, предусмотренных законодательством.
                  </p>
                  <p>
                    <strong>3.</strong> Оператор использует технические и организационные меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
                  </p>
                  <p>
                    <strong>4.</strong> Пользователь имеет право на доступ к своим персональным данным, требование об их уточнении, блокировании или удалении в порядке, установленном законодательством.
                  </p>
                  <p>
                    <strong>5.</strong> Настоящая Политика конфиденциальности может быть изменена Оператором. Информация об изменениях будет размещена на сайте.
                  </p>
                  <p className="pt-4 border-t font-medium">
                    Используя сайт, Вы подтверждаете своё согласие с условиями настоящей Политики.
                  </p>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setPrivacyOpen(false)}>Понятно</Button>
                </div>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </div>
    </section>
  );
}
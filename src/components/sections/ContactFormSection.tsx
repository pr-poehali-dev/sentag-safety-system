import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Label from '@/components/ui/Label';
import Checkbox from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import Icon from '@/components/ui/Icon';

interface ContactFormSectionProps {
  formStep: number;
  formData: any;
  setFormStep: (step: number) => void;
  handleFormChange: (field: string, value: any) => void;
}

export default function ContactFormSection({ formStep, formData, setFormStep, handleFormChange }: ContactFormSectionProps) {
  return (
    <>
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
                        <SelectItem value="contractor">Монтажная организация</SelectItem>
                        <SelectItem value="customer">Собственник объекта</SelectItem>
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
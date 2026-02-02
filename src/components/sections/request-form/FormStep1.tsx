import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormStep1Props {
  formData: {
    phone: string;
    email: string;
    company: string;
    role: string;
    fullName: string;
    objectName: string;
    objectAddress: string;
    consent: boolean;
  };
  errors: Record<string, boolean>;
  showConsentText: boolean;
  isSubmitting: boolean;
  onFormChange: (field: string, value: any) => void;
  onSetShowConsentText: (show: boolean) => void;
  onNextStep: () => void;
}

export default function FormStep1({
  formData,
  errors,
  showConsentText,
  isSubmitting,
  onFormChange,
  onSetShowConsentText,
  onNextStep
}: FormStep1Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Label htmlFor="phone">Контактный телефон *</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="+7 (___) ___-__-__"
          value={formData.phone}
          onChange={(e) => onFormChange('phone', e.target.value)}
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
          onChange={(e) => onFormChange('email', e.target.value)}
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
          onChange={(e) => onFormChange('company', e.target.value)}
          className={`mt-2 ${errors.company ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.company && <p className="text-sm text-red-500 mt-1">Необходимо заполнить наименование предприятия</p>}
      </div>
      <div>
        <Label htmlFor="role">Кем является *</Label>
        <Select value={formData.role} onValueChange={(value) => onFormChange('role', value)}>
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
          onChange={(e) => onFormChange('fullName', e.target.value)}
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
          onChange={(e) => onFormChange('objectName', e.target.value)}
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
          onChange={(e) => onFormChange('objectAddress', e.target.value)}
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
              onFormChange('consent', checked);
              onSetShowConsentText(checked as boolean);
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
        onClick={onNextStep}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Сохранение...' : 'Далее'}
      </Button>
    </div>
  );
}

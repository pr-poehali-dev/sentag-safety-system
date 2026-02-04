import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trackClick } from '@/utils/trackClick';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const isTopFieldsFilled = formData.phone && formData.email && formData.company && formData.role && formData.fullName;
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="phone">Контактный телефон *</Label>
          <span className="text-xs text-slate-500">{formData.phone.length}/30</span>
        </div>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="+7 (___) ___-__-__"
          value={formData.phone}
          onChange={(e) => {
            if (e.target.value.length <= 30) {
              onFormChange('phone', e.target.value);
            }
          }}
          maxLength={30}
          className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">Необходимо заполнить контактный телефон</p>}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="email">E-mail *</Label>
          <span className="text-xs text-slate-500">{formData.email.length}/30</span>
        </div>
        <Input 
          id="email" 
          type="email" 
          placeholder="example@company.ru"
          value={formData.email}
          onChange={(e) => {
            if (e.target.value.length <= 30) {
              onFormChange('email', e.target.value);
            }
          }}
          maxLength={30}
          className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">Необходимо заполнить e-mail</p>}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="company">Наименование предприятия *</Label>
          <span className="text-xs text-slate-500">{formData.company.length}/30</span>
        </div>
        <Input 
          id="company" 
          placeholder="ООО «Название»"
          value={formData.company}
          onChange={(e) => {
            if (e.target.value.length <= 30) {
              onFormChange('company', e.target.value);
            }
          }}
          maxLength={30}
          className={errors.company ? 'border-red-500 focus-visible:ring-red-500' : ''}
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
            <SelectItem value="contractor">Монтажная организация</SelectItem>
            <SelectItem value="customer">Собственник объекта</SelectItem>
            <SelectItem value="design">Проектная организация</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500 mt-1">Необходимо выбрать роль</p>}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="fullName">ФИО, должность *</Label>
          <span className="text-xs text-slate-500">{formData.fullName.length}/30</span>
        </div>
        <Input 
          id="fullName" 
          placeholder="Иванов Иван Иванович, Директор"
          value={formData.fullName}
          onChange={(e) => {
            if (e.target.value.length <= 30) {
              onFormChange('fullName', e.target.value);
            }
          }}
          maxLength={30}
          className={errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {errors.fullName && <p className="text-sm text-red-500 mt-1">Необходимо заполнить ФИО и должность</p>}
      </div>
      
      {isTopFieldsFilled && (
        <>
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="objectName">Наименование объекта *</Label>
              <span className="text-xs text-slate-500">{formData.objectName.length}/30</span>
            </div>
            <Input 
              id="objectName" 
              placeholder="Бассейн «Название»"
              value={formData.objectName}
              onChange={(e) => {
                if (e.target.value.length <= 30) {
                  onFormChange('objectName', e.target.value);
                }
              }}
              maxLength={30}
              className={errors.objectName ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.objectName && <p className="text-sm text-red-500 mt-1">Необходимо заполнить наименование объекта</p>}
          </div>
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="objectAddress">Адрес объекта *</Label>
              <span className="text-xs text-slate-500">{formData.objectAddress.length}/30</span>
            </div>
            <Input 
              id="objectAddress" 
              placeholder="г. Город, ул. Улица, д. 1"
              value={formData.objectAddress}
              onChange={(e) => {
                if (e.target.value.length <= 30) {
                  onFormChange('objectAddress', e.target.value);
                }
              }}
              maxLength={30}
              className={errors.objectAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.objectAddress && <p className="text-sm text-red-500 mt-1">Необходимо заполнить адрес объекта</p>}
          </div>
        </>
      )}
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
            Даю согласие на обработку персональных данных
          </Label>
        </div>
        {showConsentText && (
          <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed animate-fade-in">
            <p className="mb-2">
              Нажимая кнопку «Далее», я даю согласие <strong>ООО «Меридиан»</strong> (ИНН 7203519186, ОГРН 1217200006760, адрес: 625016, ТЮМЕНСКАЯ ОБЛАСТЬ, Г.О. ГОРОД ТЮМЕНЬ, Г ТЮМЕНЬ, УЛ 30 ЛЕТ ПОБЕДЫ, Д. 60А, ОФИС 302) на обработку моих персональных данных (ФИО, телефон, e-mail, данные о пользовательском устройстве и cookies) для:
            </p>
            <ol className="list-decimal list-inside mb-2 space-y-1">
              <li>Обработки заявки, заключения и исполнения договоров.</li>
              <li>Консультаций, ответов на запросы и анализа качества сервиса.</li>
              <li>Направления информационных и рекламных сообщений.</li>
            </ol>
            <p className="mb-2">
              Настоящим я подтверждаю свое согласие на привлечение Оператором третьих лиц для обработки данных (использование CRM-систем, сервисов аналитики и рассылок). Обработка включает все действия от сбора до уничтожения.
            </p>
            <p>
              Обработка включает все действия от сбора до уничтожения (полный перечень указан в политике конфиденциальности). Я ознакомлен с{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyPolicy(true)}
                className="text-primary font-semibold underline hover:text-primary/80 transition"
              >
                Политикой конфиденциальности
              </button>
              , где указан порядок отзыва согласия через e-mail: <strong>info@meridian-t.ru</strong>.
            </p>
          </div>
        )}
        {errors.consent && <p className="text-sm text-red-500 mt-2">Необходимо дать согласие на обработку данных</p>}
      </div>

      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Политика конфиденциальности</DialogTitle>
            <DialogDescription className="text-base">
              ООО «Меридиан» ИНН 7203519186, ОГРН 1217200006760
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Общие положения</h3>
              <p>
                Настоящая Политика конфиденциальности персональных данных (далее – Политика) действует в отношении всей информации, которую ООО «Меридиан» (далее – Оператор) может получить о пользователе во время использования сайта и сервисов Оператора.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Собираемая информация</h3>
              <p className="mb-2">Оператор собирает и обрабатывает следующие персональные данные:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>ФИО, должность</li>
                <li>Контактный телефон</li>
                <li>Адрес электронной почты</li>
                <li>Наименование организации</li>
                <li>Данные о пользовательском устройстве и cookies</li>
                <li>Информация о взаимодействии с сайтом (клики, время на сайте)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Цели обработки персональных данных</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Обработка заявок и запросов пользователей</li>
                <li>Заключение и исполнение договоров</li>
                <li>Предоставление консультаций и технической поддержки</li>
                <li>Анализ качества предоставляемых услуг</li>
                <li>Направление информационных и рекламных сообщений</li>
                <li>Улучшение работы сайта и сервисов</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Правовые основания обработки</h3>
              <p>
                Обработка персональных данных осуществляется на основании согласия субъекта персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Способы и сроки обработки</h3>
              <p className="mb-2">Оператор осуществляет следующие действия с персональными данными:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Сбор, запись, систематизация, накопление</li>
                <li>Хранение, уточнение (обновление, изменение)</li>
                <li>Извлечение, использование, передача (предоставление, доступ)</li>
                <li>Обезличивание, блокирование, удаление, уничтожение</li>
              </ul>
              <p className="mt-2">
                Обработка персональных данных осуществляется с использованием средств автоматизации и без использования таких средств. Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, но не более 5 лет с момента последнего взаимодействия.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Передача данных третьим лицам</h3>
              <p>
                Оператор может привлекать третьих лиц для обработки персональных данных (CRM-системы, сервисы аналитики, почтовые рассылки). Все третьи лица обязаны соблюдать конфиденциальность персональных данных.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Права субъекта персональных данных</h3>
              <p className="mb-2">Вы имеете право:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Получать информацию об обработке ваших персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Обжаловать действия Оператора в уполномоченный орган по защите прав субъектов персональных данных</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Меры по защите персональных данных</h3>
              <p>
                Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Порядок отзыва согласия</h3>
              <p>
                Вы можете в любой момент отозвать согласие на обработку персональных данных, направив письменное уведомление на электронную почту: <strong>info@meridian-t.ru</strong>. Отзыв согласия не влияет на законность обработки, осуществлявшейся до его отзыва.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Контактная информация</h3>
              <p>
                <strong>ООО «Меридиан»</strong><br />
                ИНН: 7203519186<br />
                ОГРН: 1217200006760<br />
                Адрес: 625016, ТЮМЕНСКАЯ ОБЛАСТЬ, Г.О. ГОРОД ТЮМЕНЬ, Г ТЮМЕНЬ, УЛ 30 ЛЕТ ПОБЕДЫ, Д. 60А, ОФИС 302<br />
                E-mail: <strong>info@meridian-t.ru</strong>
              </p>
            </section>

            <section>
              <p className="text-xs text-slate-500 mt-4">
                Настоящая Политика может быть изменена Оператором. При внесении изменений в Политике указывается дата последнего обновления. Новая редакция Политики вступает в силу с момента её размещения на сайте.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        className="w-full" 
        size="lg"
        onClick={() => {
          trackClick('Далее (Шаг 1)', 'request-form');
          onNextStep();
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Сохранение...' : 'Далее'}
      </Button>
    </div>
  );
}
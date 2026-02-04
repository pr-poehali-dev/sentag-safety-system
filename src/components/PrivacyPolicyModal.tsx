import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivacyPolicyModal({ open, onOpenChange }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Политика в отношении обработки персональных данных</DialogTitle>
          <DialogDescription className="text-base">
            Общество с ограниченной ответственностью «Меридиан»
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <section>
            <h3 className="font-semibold text-base mb-2">1. ОБЩИЕ ПОЛОЖЕНИЯ</h3>
            <p className="mb-2">
              <strong>1.1.</strong> Настоящая Политика (далее — Политика) разработана в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности в <strong>ООО «Меридиан»</strong> (ИНН 7203519186, ОГРН 1217200006760, адрес: 625016, ТЮМЕНСКАЯ ОБЛАСТЬ, Г.О. ГОРОД ТЮМЕНЬ, Г ТЮМЕНЬ, УЛ 30 ЛЕТ ПОБЕДЫ, Д. 60А, ОФИС 302) (далее — Оператор).
            </p>
            <p>
              <strong>1.2.</strong> Оператор ставит своей целью соблюдение прав и свобод человека при обработке его персональных данных.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">2. ЦЕЛИ ОБРАБОТКИ ДАННЫХ</h3>
            <p className="mb-2">Оператор обрабатывает персональные данные Пользователей для следующих целей:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Обработка входящих заявок, подготовка коммерческих предложений, заключение и исполнение договоров.</li>
              <li>Предоставление консультационной поддержки и ответов на запросы.</li>
              <li>Анализ взаимодействия Пользователя с Сайтом для улучшения качества сервиса (в т.ч. через метрические системы Яндекс.Метрика).</li>
              <li>Направление информационных сообщений и рекламных рассылок (при наличии отдельного согласия Пользователя).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">3. ПЕРЕЧЕНЬ ОБРАБАТЫВАЕМЫХ ДАННЫХ</h3>
            <p className="mb-2">Оператор может обрабатывать следующие данные:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Фамилия, имя, отчество.</li>
              <li>Номер телефона и адрес электронной почты.</li>
              <li>Технические данные (IP-адрес, файлы cookies, данные об устройстве и браузере, UTM-метки).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">4. ПРИВЛЕЧЕНИЕ ТРЕТЬИХ ЛИЦ</h3>
            <p className="mb-2">
              <strong>4.1.</strong> Для достижения целей обработки Оператор вправе привлекать третьих лиц (провайдеры CRM-систем, сервисы email-рассылок и аналитики).
            </p>
            <p>
              <strong>4.2.</strong> Передача данных осуществляется при условии обеспечения конфиденциальности и безопасности данных на стороне привлеченных лиц.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">5. ПОРЯДОК ОБРАБОТКИ И СРОКИ ХРАНЕНИЯ</h3>
            <p className="mb-2">
              <strong>5.1.</strong> Обработка включает: сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, обезличивание, блокирование, удаление и уничтожение.
            </p>
            <p>
              <strong>5.2.</strong> Обработка прекращается при достижении целей обработки, отзыве согласия или истечении срока хранения, установленного договором или законом. Уничтожение данных производится безвозвратно.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">6. ПРАВА ПОЛЬЗОВАТЕЛЯ</h3>
            <p className="mb-2">
              <strong>6.1.</strong> Пользователь имеет право на получение информации, касающейся обработки его данных, их уточнение, блокирование или уничтожение.
            </p>
            <p>
              <strong>6.2.</strong> Отзыв согласия осуществляется путем направления уведомления на электронную почту: <strong>info@meridian-t.ru</strong>. Оператор прекращает обработку в течение 10 рабочих дней с момента получения запроса.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h3>
            <p className="mb-2">
              <strong>7.1.</strong> Настоящая Политика актуальна до замены её новой редакцией.
            </p>
            <p>
              <strong>7.2.</strong> Актуальная версия всегда размещена на Сайте по адресу: <strong>sentag.ru</strong>
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-700">
              Используя сайт, Вы подтверждаете своё согласие с условиями настоящей Политики.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
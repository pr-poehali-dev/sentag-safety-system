import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={() => onOpenChange(false)}>Понятно</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

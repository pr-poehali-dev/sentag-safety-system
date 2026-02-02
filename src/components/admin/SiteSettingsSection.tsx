import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SiteSettingsSectionProps {
  showDocuments: boolean;
  onToggleDocuments: () => void;
}

export default function SiteSettingsSection({ 
  showDocuments, 
  onToggleDocuments 
}: SiteSettingsSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Управление секциями сайта</h2>
          <p className="text-slate-600">Включайте и отключайте видимость секций</p>
        </div>
      </div>
      <Card className="p-4 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showDocuments ? 'bg-green-100' : 'bg-slate-200'}`}>
            <Icon name="FileText" className={showDocuments ? 'text-green-600' : 'text-slate-400'} size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Документы и сертификаты</p>
            <p className="text-sm text-slate-500">
              {showDocuments ? 'Секция отображается на сайте' : 'Секция скрыта от посетителей'}
            </p>
          </div>
        </div>
        <Button
          variant={showDocuments ? 'outline' : 'default'}
          onClick={onToggleDocuments}
        >
          {showDocuments ? (
            <>
              <Icon name="EyeOff" className="mr-2" size={16} />
              Скрыть секцию
            </>
          ) : (
            <>
              <Icon name="Eye" className="mr-2" size={16} />
              Показать секцию
            </>
          )}
        </Button>
      </Card>
    </Card>
  );
}

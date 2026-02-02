import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface FormStep2Props {
  step2Data: {
    visitorsInfo: string;
    poolSize: string;
    deadline: string;
  };
  companyCardFile: File | null;
  poolSchemeFiles: File[];
  isSubmitting: boolean;
  uploadProgress?: string;
  onStep2DataChange: (field: string, value: string) => void;
  onSetCompanyCardFile: (file: File | null) => void;
  onSetPoolSchemeFiles: (files: File[]) => void;
  onSubmitStep2: () => void;
  onBackStep: () => void;
}

export default function FormStep2({
  step2Data,
  companyCardFile,
  poolSchemeFiles,
  isSubmitting,
  uploadProgress,
  onStep2DataChange,
  onSetCompanyCardFile,
  onSetPoolSchemeFiles,
  onSubmitStep2,
  onBackStep
}: FormStep2Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Label htmlFor="companyCard">Добавьте карточку предприятия</Label>
        <input
          type="file"
          id="companyCard"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 20 * 1024 * 1024) {
              alert('Размер файла не должен превышать 20 МБ');
              e.target.value = '';
              return;
            }
            onSetCompanyCardFile(file || null);
            e.target.value = '';
          }}
          className="hidden"
        />
        <label
          htmlFor="companyCard"
          className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer block"
        >
          <Icon name="Upload" className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="text-sm text-slate-600">Нажмите для добавления карточки предприятия</p>
          <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, Word, Excel до 20 МБ</p>
        </label>
        
        {companyCardFile && (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Загружен файл:</p>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="FileText" className="text-slate-400" size={20} />
                <div>
                  <p className="text-sm text-slate-700 font-medium">{companyCardFile.name}</p>
                  <p className="text-xs text-slate-400">{(companyCardFile.size / 1024 / 1024).toFixed(2)} МБ</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSetCompanyCardFile(null)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="poolScheme">Добавьте схему бассейна</Label>
        <p className="text-sm text-slate-500 mt-1 mb-2">При наличии укажите на схеме: подводные фонари, водные преграды, волны, аэромассажные зоны, подводные лежаки, гейзеры и др.</p>
        <input
          type="file"
          id="poolScheme"
          accept=".pdf,.jpg,.jpeg,.png,.dwg"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const validFiles: File[] = [];
            
            for (const file of files) {
              if (poolSchemeFiles.length + validFiles.length >= 5) {
                alert('Максимум 5 файлов схем');
                break;
              }
              if (file.size > 20 * 1024 * 1024) {
                alert(`Файл "${file.name}" превышает 20 МБ`);
                continue;
              }
              validFiles.push(file);
            }
            
            onSetPoolSchemeFiles([...poolSchemeFiles, ...validFiles]);
            e.target.value = '';
          }}
          className="hidden"
        />
        <label
          htmlFor="poolScheme"
          className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer block"
        >
          <Icon name="Upload" className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="text-sm text-slate-600">Нажмите для добавления схем бассейна</p>
          <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DWG до 20 МБ (макс. 5 файлов)</p>
        </label>
        
        {poolSchemeFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-slate-700">Загружено схем: {poolSchemeFiles.length}/5</p>
            {poolSchemeFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="FileText" className="text-slate-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-700 font-medium">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} МБ</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onSetPoolSchemeFiles(poolSchemeFiles.filter((_, i) => i !== index));
                  }}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="visitorsInfo">Укажите максимальное количество посетителей в день? Есть ли градация, детские зоны, взрослые зоны? Цвета браслетов и их количество?</Label>
        <Textarea 
          id="visitorsInfo" 
          placeholder="Например: До 300 посетителей в день. Есть детская зона (глубина 0.8м) и взрослая зона (глубина 2.5м). Браслеты: синие - 100 шт, красные - 50 шт, желтые - 50 шт."
          value={step2Data.visitorsInfo}
          onChange={(e) => onStep2DataChange('visitorsInfo', e.target.value)}
          className="mt-2"
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="poolSize">Укажите форму, размеры и глубину бассейна *</Label>
        <Textarea 
          id="poolSize" 
          placeholder="Например: Прямоугольная форма, 25м х 12м, глубина от 1.2м до 2.8м"
          value={step2Data.poolSize}
          onChange={(e) => onStep2DataChange('poolSize', e.target.value)}
          className="mt-2"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="deadline">Какие сроки поставки интересуют, когда планируется запуск объекта?</Label>
        <Textarea 
          id="deadline" 
          placeholder="Например: Поставка до 1 июня 2025, запуск объекта планируется на 15 июня 2025"
          value={step2Data.deadline}
          onChange={(e) => onStep2DataChange('deadline', e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
      {uploadProgress && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <Icon name="Loader2" className="text-blue-600" size={20} />
            </div>
            <p className="text-sm font-medium text-blue-800">{uploadProgress}</p>
          </div>
        </div>
      )}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onBackStep}
          disabled={isSubmitting}
        >
          Назад
        </Button>
        <Button className="flex-1" size="lg" onClick={onSubmitStep2} disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </Button>
      </div>
    </div>
  );
}
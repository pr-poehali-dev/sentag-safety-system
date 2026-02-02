import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RequestForm {
  id: number;
  phone: string;
  email: string;
  company: string;
  role: string;
  full_name: string;
  object_name: string;
  object_address: string;
  visitors_info: string | null;
  pool_size: string | null;
  deadline: string | null;
  status: string;
  step1_completed_at: string;
  step2_completed_at: string | null;
  created_at: string;
}

interface RequestsSectionProps {
  requests: RequestForm[];
  onLoadRequests: () => Promise<void>;
  onDeleteRequest: (requestId: number) => Promise<void>;
}

export default function RequestsSection({ 
  requests, 
  onLoadRequests, 
  onDeleteRequest 
}: RequestsSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Заявки на расчет</h2>
          <p className="text-slate-600">Все заявки с сайта</p>
        </div>
        <Button variant="outline" onClick={onLoadRequests}>
          <Icon name="RefreshCw" className="mr-2" size={16} />
          Обновить
        </Button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Заявок пока нет</p>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{request.company}</h3>
                  <p className="text-sm text-slate-600">{request.object_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status === 'completed' ? 'Завершена' : 'Шаг 1'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Контакт</p>
                  <p className="font-medium">{request.full_name}</p>
                  <p className="text-slate-600">{request.phone}</p>
                  <p className="text-slate-600">{request.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Объект</p>
                  <p className="font-medium">{request.object_address}</p>
                  <p className="text-slate-600">Роль: {request.role === 'contractor' ? 'Подрядчик' : request.role === 'customer' ? 'Конечный заказчик' : 'Проектная организация'}</p>
                </div>
              </div>

              {request.status === 'completed' && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium text-slate-700 mb-2">Детали проекта:</p>
                  <div className="text-sm space-y-1">
                    {request.pool_size && <p><span className="text-slate-500">Бассейн:</span> {request.pool_size}</p>}
                    {request.visitors_info && <p><span className="text-slate-500">Посетители:</span> {request.visitors_info}</p>}
                    {request.deadline && <p><span className="text-slate-500">Сроки:</span> {request.deadline}</p>}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon name="Calendar" size={12} />
                  {new Date(request.created_at).toLocaleString('ru-RU')}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteRequest(request.id)}
                >
                  <Icon name="Trash2" className="mr-2" size={14} />
                  Удалить
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}

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
  company_card_url: string | null;
  pool_scheme_urls: string[] | null;
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
  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'contractor': return 'Подрядчик';
      case 'customer': return 'Конечный заказчик';
      case 'design': return 'Проектная организация';
      default: return role;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Заявки на расчет</h2>
          <p className="text-slate-600">Всего заявок: {requests.length}</p>
        </div>
        <Button variant="outline" onClick={onLoadRequests}>
          <Icon name="RefreshCw" className="mr-2" size={16} />
          Обновить
        </Button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Inbox" className="mx-auto mb-4 text-slate-300" size={64} />
            <p className="text-slate-500 text-lg">Заявок пока нет</p>
          </div>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    request.status === 'completed' 
                      ? 'bg-green-100' 
                      : 'bg-yellow-100'
                  }`}>
                    <Icon 
                      name={request.status === 'completed' ? 'CheckCircle2' : 'Clock'} 
                      className={request.status === 'completed' ? 'text-green-600' : 'text-yellow-600'} 
                      size={24} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-800 truncate">{request.company}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        request.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'completed' ? 'Завершена' : 'Не завершена'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1 truncate">
                      <Icon name="Building2" className="inline mr-1 flex-shrink-0" size={14} />
                      {request.object_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      <Icon name="Calendar" className="inline mr-1 flex-shrink-0" size={12} />
                      {new Date(request.created_at).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteRequest(request.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-4 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="User" className="text-slate-400 flex-shrink-0" size={16} />
                    <p className="text-xs font-semibold text-slate-500 uppercase">Контактное лицо</p>
                  </div>
                  <p className="font-semibold text-slate-800 mb-1 truncate" title={request.full_name}>{request.full_name}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600 flex items-center gap-2 min-w-0">
                      <Icon name="Phone" size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{request.phone}</span>
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2 min-w-0">
                      <Icon name="Mail" size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate" title={request.email}>{request.email}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="MapPin" className="text-slate-400 flex-shrink-0" size={16} />
                    <p className="text-xs font-semibold text-slate-500 uppercase">Объект</p>
                  </div>
                  <p className="font-semibold text-slate-800 mb-2 break-words" title={request.object_address}>{request.object_address}</p>
                  <p className="text-sm text-slate-600">
                    <span className="text-slate-400">Роль:</span> {getRoleLabel(request.role)}
                  </p>
                </div>

                {request.status === 'completed' && request.pool_size && (
                  <div className="bg-blue-50 rounded-lg p-4 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Waves" className="text-blue-500 flex-shrink-0" size={16} />
                      <p className="text-xs font-semibold text-blue-700 uppercase">Бассейн</p>
                    </div>
                    <p className="text-sm text-slate-700 break-words">{request.pool_size}</p>
                  </div>
                )}
              </div>

              {request.status === 'completed' && (
                <div className="border-t pt-4 space-y-4">
                  {request.visitors_info && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-2">
                        <Icon name="Users" size={14} className="flex-shrink-0" />
                        Информация о посетителях
                      </p>
                      <p className="text-sm text-slate-700 bg-slate-50 rounded p-3 break-words whitespace-pre-wrap">{request.visitors_info}</p>
                    </div>
                  )}

                  {request.deadline && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-2">
                        <Icon name="Clock" size={14} className="flex-shrink-0" />
                        Сроки поставки
                      </p>
                      <p className="text-sm text-slate-700 bg-slate-50 rounded p-3 break-words whitespace-pre-wrap">{request.deadline}</p>
                    </div>
                  )}

                  {(request.company_card_url || (request.pool_scheme_urls && request.pool_scheme_urls.length > 0)) && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <Icon name="Paperclip" size={14} />
                        Прикрепленные файлы
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {request.company_card_url && (
                          <a 
                            href={request.company_card_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-primary/10 hover:border-primary border border-slate-200 transition group min-w-0"
                          >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition">
                              <Icon name="FileText" className="text-primary" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">Карточка предприятия</p>
                              <p className="text-xs text-slate-500 truncate">Открыть файл</p>
                            </div>
                            <Icon name="ExternalLink" className="text-slate-400 group-hover:text-primary transition flex-shrink-0" size={16} />
                          </a>
                        )}
                        {request.pool_scheme_urls && request.pool_scheme_urls.map((url, idx) => (
                          <a 
                            key={idx}
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-primary/10 hover:border-primary border border-slate-200 transition group min-w-0"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                              <Icon name="FileImage" className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                Схема бассейна {request.pool_scheme_urls!.length > 1 ? `#${idx + 1}` : ''}
                              </p>
                              <p className="text-xs text-slate-500 truncate">Открыть файл</p>
                            </div>
                            <Icon name="ExternalLink" className="text-slate-400 group-hover:text-blue-600 transition flex-shrink-0" size={16} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}
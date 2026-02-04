import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

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

interface ClickStat {
  button_name: string;
  button_location: string;
  count?: number;
  total_clicks?: number;
}

interface ClickStats {
  stats_by_day: Record<string, ClickStat[]>;
  total_stats: ClickStat[];
}

interface StatisticsSectionProps {
  users: User[];
  requests: RequestForm[];
}

export default function StatisticsSection({ users, requests }: StatisticsSectionProps) {
  const [clickStats, setClickStats] = useState<ClickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Функция для получения цвета для графика
  const getBarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
    return colors[index % colors.length];
  };
  
  // Функция для расчета ширины бара в процентах
  const getBarWidth = (value: number, maxValue: number) => {
    if (maxValue === 0) return 0;
    return Math.round((value / maxValue) * 100);
  };

  const loadStats = () => {
    setLoading(true);
    fetch('https://functions.poehali.dev/49b6c391-335d-4b83-a4e4-02430a757ab9')
      .then(res => res.json())
      .then(data => {
        setClickStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching click stats:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearStats = async () => {
    if (!confirm('Вы уверены, что хотите удалить всю статистику кликов? Это действие нельзя отменить.')) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/fd0a1f7e-5e13-474c-a085-8fadf347d2c1', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Успешно удалено: ${result.message}`);
        loadStats(); // Перезагружаем статистику
      } else {
        alert('Ошибка при удалении статистики');
      }
    } catch (error) {
      console.error('Error clearing stats:', error);
      alert('Ошибка при удалении статистики');
    } finally {
      setIsClearing(false);
    }
  };

  const handleSendToTelegram = async () => {
    setIsSending(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2d1524af-6da7-4f95-aca5-ba7fcaa723ba', {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Статистика успешно отправлена в Telegram!');
      } else {
        alert('Ошибка при отправке в Telegram');
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      alert('Ошибка при отправке в Telegram');
    } finally {
      setIsSending(false);
    }
  };

  // Счётчики заполнения шагов
  const step1Completed = requests.length; // Все заявки имеют шаг 1
  const step2Completed = requests.filter(r => r.step2_completed_at !== null).length;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Статистика</h2>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSendToTelegram}
            disabled={isSending || loading}
            className="gap-2"
          >
            <Icon name="Send" size={16} />
            {isSending ? 'Отправка...' : 'Отправить в Telegram'}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleClearStats}
            disabled={isClearing || loading}
            className="gap-2"
          >
            <Icon name="Trash2" size={16} />
            {isClearing ? 'Удаление...' : 'Очистить'}
          </Button>
        </div>
      </div>
      
      {/* Общая статистика */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-orange-50 rounded-lg">
          <Icon name="FileText" className="text-orange-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{requests.length}</p>
          <p className="text-slate-600">Заявок получено</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <Icon name="ClipboardCheck" className="text-green-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{step1Completed}</p>
          <p className="text-slate-600">Шаг 1 заполнен</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <Icon name="ClipboardList" className="text-purple-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{step2Completed}</p>
          <p className="text-slate-600">Шаг 2 заполнен</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <Icon name="MousePointerClick" className="text-primary mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">
            {clickStats?.total_stats.reduce((sum, stat) => sum + (stat.total_clicks || 0), 0) || 0}
          </p>
          <p className="text-slate-600">Кликов за месяц</p>
        </div>
      </div>

      {/* Статистика кликов по кнопкам с графиком */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Клики по кнопкам (за месяц)</h3>
        {loading ? (
          <p className="text-slate-600">Загрузка...</p>
        ) : clickStats && clickStats.total_stats.length > 0 ? (
          <div className="space-y-4">
            {(() => {
              const maxClicks = Math.max(...clickStats.total_stats.map(s => s.total_clicks || 0));
              return clickStats.total_stats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">{stat.button_name}</p>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">{stat.button_location}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary ml-4">{stat.total_clicks}</p>
                  </div>
                  {/* График баром */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getBarColor(idx)} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${getBarWidth(stat.total_clicks || 0, maxClicks)}%` }}
                    >
                      {stat.total_clicks && stat.total_clicks > 0 && (
                        <span className="text-[10px] font-bold text-white">
                          {getBarWidth(stat.total_clicks, maxClicks)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <p className="text-slate-600">Пока нет данных по кликам</p>
        )}
      </div>

      {/* Статистика по дням с детализацией */}
      {clickStats && Object.keys(clickStats.stats_by_day).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Детализация по дням</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {Object.entries(clickStats.stats_by_day).map(([date, stats]) => {
              const dayTotal = stats.reduce((sum, s) => sum + (s.count || 0), 0);
              const maxDayClicks = Math.max(...stats.map(s => s.count || 0));
              
              return (
                <div key={date} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <Icon name="Calendar" className="text-primary" size={20} />
                      <p className="font-semibold text-slate-800">
                        {new Date(date).toLocaleDateString('ru-RU', { 
                          weekday: 'short',
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                      {dayTotal} {dayTotal === 1 ? 'клик' : dayTotal < 5 ? 'клика' : 'кликов'}
                    </div>
                  </div>
                  <div className="space-y-3 mt-3">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="MousePointerClick" className="text-slate-400" size={14} />
                            <span className="text-slate-700 font-medium">{stat.button_name}</span>
                            <span className="text-xs text-slate-500">• {stat.button_location}</span>
                          </div>
                          <span className="font-bold text-primary">{stat.count}</span>
                        </div>
                        {/* Мини-график для каждой кнопки в дне */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ml-5">
                          <div 
                            className={`h-full ${getBarColor(idx)} transition-all duration-300`}
                            style={{ width: `${getBarWidth(stat.count || 0, maxDayClicks)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
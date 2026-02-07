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
  unique_visitors: number;
  step1_count: number;
  step2_count: number;
  conversion_rate: number;
  avg_step1_seconds: number;
  avg_step2_seconds: number;
}

interface StatisticsSectionProps {
  users: User[];
  requests: RequestForm[];
}

export default function StatisticsSection({ users, requests }: StatisticsSectionProps) {
  const [clickStats, setClickStats] = useState<ClickStats | null>(null);
  const [onlineVisitors, setOnlineVisitors] = useState<number>(0);
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

  const loadOnlineVisitors = () => {
    fetch('https://functions.poehali.dev/e68367dd-bf35-454c-bee2-9625e5a28fe4')
      .then(res => res.json())
      .then(data => {
        setOnlineVisitors(data.online_visitors || 0);
      })
      .catch(err => {
        console.error('Error fetching online visitors:', err);
      });
  };

  useEffect(() => {
    loadStats();
    loadOnlineVisitors();
    
    // Обновляем онлайн-посетителей каждые 10 секунд
    const intervalId = setInterval(() => {
      loadOnlineVisitors();
    }, 10000);
    
    return () => clearInterval(intervalId);
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

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 mt-1">Данные о посетителях и активности на сайте</p>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col items-end gap-2">
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
              <p className="text-xs text-slate-500 max-w-xs text-right">
                Отправит сводку за последние 7 дней: заявки, конверсию, время заполнения и клики по кнопкам
              </p>
            </div>
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
      </div>
      
      {/* Онлайн-посетители */}
      <div className="mb-6">
        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Icon name="Users" className="text-green-600" size={40} />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-700">{onlineVisitors}</p>
                <p className="text-slate-700 font-medium">На сайте сейчас</p>
                <p className="text-xs text-slate-500 mt-1">Активность за последние 5 минут</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">ОНЛАЙН</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Общая статистика */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-cyan-50 rounded-lg">
          <Icon name="Users" className="text-cyan-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{clickStats?.unique_visitors || 0}</p>
          <p className="text-slate-600">Уникальных посетителей</p>
          <p className="text-xs text-slate-500 mt-1">За последние 30 дней</p>
          <p className="text-xs text-slate-400 mt-2 italic">Каждое устройство учитывается 1 раз в сутки</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <Icon name="FileText" className="text-orange-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{clickStats?.step1_count || 0}</p>
          <p className="text-slate-600">Начали заполнение</p>
          <p className="text-xs text-slate-500 mt-1">Заполнили Шаг 1</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <Icon name="ClipboardCheck" className="text-green-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{clickStats?.step2_count || 0}</p>
          <p className="text-slate-600">Завершили заявку</p>
          <p className="text-xs text-slate-500 mt-1">Заполнили Шаг 2</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <Icon name="TrendingUp" className="text-purple-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{clickStats?.conversion_rate || 0}%</p>
          <p className="text-slate-600">Конверсия</p>
          <p className="text-xs text-slate-500 mt-1">Шаг 2 / Шаг 1</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <Icon name="MousePointerClick" className="text-primary mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">
            {clickStats?.total_stats.reduce((sum, stat) => sum + (stat.total_clicks || 0), 0) || 0}
          </p>
          <p className="text-slate-600">Кликов за месяц</p>
          <p className="text-xs text-slate-500 mt-1">Все кнопки на сайте</p>
        </div>
      </div>

      {/* Среднее время заполнения */}
      {clickStats && (clickStats.avg_step1_seconds > 0 || clickStats.avg_step2_seconds > 0) && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Среднее время заполнения</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Clock" className="text-orange-600" size={24} />
                <h4 className="font-semibold text-slate-800">Шаг 1 (Контактные данные)</h4>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {Math.floor(clickStats.avg_step1_seconds / 60)}:{String(Math.floor(clickStats.avg_step1_seconds % 60)).padStart(2, '0')}
              </p>
              <p className="text-sm text-slate-600 mt-1">минут:секунд</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Clock" className="text-green-600" size={24} />
                <h4 className="font-semibold text-slate-800">Шаг 2 (Детали и файлы)</h4>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {Math.floor(clickStats.avg_step2_seconds / 60)}:{String(Math.floor(clickStats.avg_step2_seconds % 60)).padStart(2, '0')}
              </p>
              <p className="text-sm text-slate-600 mt-1">минут:секунд</p>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
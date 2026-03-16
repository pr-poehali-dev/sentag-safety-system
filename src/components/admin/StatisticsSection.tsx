import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ClickStats } from './statistics/types';
import OnlineVisitorsCard from './statistics/OnlineVisitorsCard';
import StatsByDay from './statistics/StatsByDay';
import TotalClickStats from './statistics/TotalClickStats';
import VisitorsChart from './statistics/VisitorsChart';

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

interface StatisticsSectionProps {
  users: User[];
  requests: RequestForm[];
}

export default function StatisticsSection({ users, requests }: StatisticsSectionProps) {
  const [clickStats, setClickStats] = useState<ClickStats | null>(null);
  const [onlineVisitors, setOnlineVisitors] = useState<number | null>(null);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isSending, setIsSending] = useState(false);

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
    setOnlineLoading(true);
    fetch('https://functions.poehali.dev/e68367dd-bf35-454c-bee2-9625e5a28fe4')
      .then(res => res.json())
      .then(data => {
        setOnlineVisitors(data.online_visitors || 0);
        setOnlineLoading(false);
      })
      .catch(err => {
        console.error('Error fetching online visitors:', err);
        setOnlineLoading(false);
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
        loadStats();
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
      {/* Шапка с кнопками */}
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
      <OnlineVisitorsCard
        onlineVisitors={onlineVisitors}
        onlineLoading={onlineLoading}
        onRefresh={loadOnlineVisitors}
      />

      {/* Общая статистика */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-cyan-50 rounded-lg">
          <Icon name="Users" className="text-cyan-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{clickStats?.unique_visitors || 0}</p>
          <p className="text-slate-600">Посетителей</p>
          <p className="text-xs text-slate-500 mt-1">За последний месяц</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <Icon name="ClipboardList" className="text-orange-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{loading ? '...' : (clickStats?.step1_count || 0)}</p>
          <p className="text-slate-600">Начали заявку</p>
          <p className="text-xs text-slate-500 mt-1">Заполнили шаг 1</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <Icon name="CheckCircle" className="text-green-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{loading ? '...' : (clickStats?.step2_count || 0)}</p>
          <p className="text-slate-600">Завершили заявку</p>
          <p className="text-xs text-slate-500 mt-1">Заполнили шаг 2</p>
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

      {/* График посещаемости */}
      {clickStats && clickStats.visits_chart && (
        <VisitorsChart data={clickStats.visits_chart} />
      )}

      {/* Детализация по дням */}
      {clickStats && <StatsByDay clickStats={clickStats} />}

      {/* Клики по кнопкам за месяц */}
      <TotalClickStats totalStats={clickStats?.total_stats ?? []} loading={loading} />
    </div>
  );
}
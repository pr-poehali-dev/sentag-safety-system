import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
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

  useEffect(() => {
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
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Статистика</h2>
      
      {/* Общая статистика */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-orange-50 rounded-lg">
          <Icon name="FileText" className="text-orange-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{requests.length}</p>
          <p className="text-slate-600">Заявок получено</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <Icon name="MousePointerClick" className="text-primary mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">
            {clickStats?.total_stats.reduce((sum, stat) => sum + (stat.total_clicks || 0), 0) || 0}
          </p>
          <p className="text-slate-600">Всего кликов за месяц</p>
        </div>
      </div>

      {/* Статистика кликов по кнопкам */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Клики по кнопкам (за месяц)</h3>
        {loading ? (
          <p className="text-slate-600">Загрузка...</p>
        ) : clickStats && clickStats.total_stats.length > 0 ? (
          <div className="space-y-4">
            {clickStats.total_stats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{stat.button_name}</p>
                    <p className="text-sm text-slate-600">Расположение: {stat.button_location}</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{stat.total_clicks}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Пока нет данных по кликам</p>
        )}
      </div>

      {/* Статистика по дням */}
      {clickStats && Object.keys(clickStats.stats_by_day).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Клики по дням</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(clickStats.stats_by_day).map(([date, stats]) => (
              <div key={date} className="p-4 bg-white border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">{new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <div className="space-y-2">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-slate-700">{stat.button_name} ({stat.button_location})</span>
                      <span className="font-semibold text-primary">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
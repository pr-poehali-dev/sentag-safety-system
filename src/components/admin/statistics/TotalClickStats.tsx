import Icon from '@/components/ui/icon';
import { ClickStat, getBarColor, getBarWidth } from './types';

interface TotalClickStatsProps {
  totalStats: ClickStat[];
  loading: boolean;
}

export default function TotalClickStats({ totalStats, loading }: TotalClickStatsProps) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Клики по кнопкам (за месяц)</h3>
      {loading ? (
        <p className="text-slate-600">Загрузка...</p>
      ) : totalStats.length > 0 ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {(() => {
            const maxClicks = Math.max(...totalStats.map(s => s.total_clicks || 0));
            return totalStats.map((stat, idx) => (
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
  );
}

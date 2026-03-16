import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ClickStats, getBarColor, getBarWidth, formatDate } from './types';

interface StatsByDayProps {
  clickStats: ClickStats;
}

export default function StatsByDay({ clickStats }: StatsByDayProps) {
  const [visitModalDate, setVisitModalDate] = useState<string | null>(null);

  const modalDevices = visitModalDate && clickStats.devices_by_day?.[visitModalDate];
  const modalVisits = visitModalDate && clickStats.visits_by_day?.[visitModalDate];

  if (Object.keys(clickStats.stats_by_day).length === 0) return null;

  return (
    <>
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Детализация по дням</h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {Object.entries(clickStats.stats_by_day).map(([date, stats]) => {
            const dayTotal = stats.reduce((sum, s) => sum + (s.count || 0), 0);
            const maxDayClicks = Math.max(...stats.map(s => s.count || 0));
            const dayVisits = clickStats.visits_by_day?.[date] ?? null;

            return (
              <div key={date} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" className="text-primary" size={20} />
                    <p className="font-semibold text-slate-800">{formatDate(date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dayVisits !== null && (
                      <button
                        onClick={() => setVisitModalDate(date)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold rounded-full text-sm transition cursor-pointer border border-cyan-200"
                        title="Нажмите, чтобы увидеть источники посещений"
                      >
                        <Icon name="Eye" size={14} />
                        {dayVisits} {dayVisits === 1 ? 'посетитель' : dayVisits < 5 ? 'посетителя' : 'посетителей'}
                      </button>
                    )}
                    <div className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                      {dayTotal} {dayTotal === 1 ? 'клик' : dayTotal < 5 ? 'клика' : 'кликов'}
                    </div>
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

      {/* Модальное окно посещений */}
      {visitModalDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setVisitModalDate(null)}
        >
          <Card
            className="w-full max-w-md mx-4 p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Посещения за день</h3>
                <p className="text-sm text-slate-500">{formatDate(visitModalDate)}</p>
              </div>
              <button
                onClick={() => setVisitModalDate(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-cyan-50 rounded-lg flex items-center gap-3">
              <Icon name="Users" className="text-cyan-600" size={28} />
              <div>
                <p className="text-2xl font-bold text-cyan-700">{modalVisits}</p>
                <p className="text-sm text-slate-600">
                  {(modalVisits as number) === 1 ? 'уникальный посетитель' : (modalVisits as number) < 5 ? 'уникальных посетителя' : 'уникальных посетителей'}
                </p>
              </div>
            </div>

            {modalDevices && modalDevices.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Источники перехода:</p>
                <div className="space-y-2">
                  {(() => {
                    const total = modalDevices.reduce((s, d) => s + d.count, 0);
                    return modalDevices.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 text-center">
                          <Icon
                            name={
                              d.source === 'Прямой переход' ? 'Navigation' :
                              d.source === 'Google' || d.source === 'Яндекс' || d.source === 'Bing' ? 'Search' :
                              d.source === 'ВКонтакте' || d.source === 'Instagram / Facebook' ? 'Share2' :
                              d.source === 'Telegram' || d.source === 'WhatsApp' ? 'MessageCircle' :
                              'Link'
                            }
                            fallback="Link"
                            size={16}
                            className="text-slate-500"
                          />
                        </div>
                        <span className="text-sm text-slate-700 flex-1">{d.source}</span>
                        <span className="text-sm font-bold text-slate-800">{d.count}</span>
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${getBarColor(idx)}`}
                            style={{ width: `${getBarWidth(d.count, total)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{getBarWidth(d.count, total)}%</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Нет данных об источниках</p>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
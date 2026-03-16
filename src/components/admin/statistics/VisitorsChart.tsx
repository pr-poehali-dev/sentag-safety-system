import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartPoint } from './types';

type Range = 'week' | 'month' | 'year';

interface VisitorsChartProps {
  data: ChartPoint[];
}

const RANGES: { key: Range; label: string; days: number }[] = [
  { key: 'week', label: 'Неделя', days: 7 },
  { key: 'month', label: 'Месяц', days: 30 },
  { key: 'year', label: 'Год', days: 365 },
];

const formatXAxis = (dateStr: string, range: Range): string => {
  const d = new Date(dateStr);
  if (range === 'year') {
    return d.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const formatTooltipDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

// Заполняем пропущенные дни нулями
const fillGaps = (data: ChartPoint[], days: number): ChartPoint[] => {
  const map: Record<string, number> = {};
  data.forEach(p => { map[p.date] = p.visitors; });

  const result: ChartPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, visitors: map[key] ?? 0 });
  }
  return result;
};

// Для года — агрегируем по неделям чтобы не было перегружено
const aggregateByWeek = (data: ChartPoint[]): ChartPoint[] => {
  const weeks: Record<string, number> = {};
  data.forEach(p => {
    const d = new Date(p.date);
    // Начало недели (понедельник)
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    const key = d.toISOString().slice(0, 10);
    weeks[key] = (weeks[key] ?? 0) + p.visitors;
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, visitors]) => ({ date, visitors }));
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3">
      <p className="text-xs text-slate-500 mb-1">{label ? formatTooltipDate(label) : ''}</p>
      <p className="text-lg font-bold text-primary">{payload[0].value}</p>
      <p className="text-xs text-slate-500">посетителей</p>
    </div>
  );
};

export default function VisitorsChart({ data }: VisitorsChartProps) {
  const [range, setRange] = useState<Range>('month');

  const chartData = useMemo(() => {
    const rangeDef = RANGES.find(r => r.key === range)!;
    const filled = fillGaps(data, rangeDef.days);
    return range === 'year' ? aggregateByWeek(filled) : filled;
  }, [data, range]);

  const totalForRange = useMemo(
    () => chartData.reduce((s, p) => s + p.visitors, 0),
    [chartData]
  );

  const maxVal = useMemo(
    () => Math.max(...chartData.map(p => p.visitors), 1),
    [chartData]
  );

  // Интервал делений по X
  const tickInterval = range === 'week' ? 0 : range === 'month' ? 4 : 3;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Посещаемость</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {totalForRange} {totalForRange === 1 ? 'посетитель' : totalForRange < 5 ? 'посетителя' : 'посетителей'} за {RANGES.find(r => r.key === range)?.label.toLowerCase()}
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                range === r.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              interval={tickInterval}
              tickFormatter={d => formatXAxis(d, range)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              allowDecimals={false}
              domain={[0, maxVal + 1]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 2' }} />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#visitorsGradient)"
              dot={false}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

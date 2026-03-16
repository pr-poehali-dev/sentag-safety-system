export interface ClickStat {
  button_name: string;
  button_location: string;
  count?: number;
  total_clicks?: number;
}

export interface DeviceStat {
  source: string;
  count: number;
}

export interface ChartPoint {
  date: string;
  visitors: number;
}

export interface ClickStats {
  stats_by_day: Record<string, ClickStat[]>;
  total_stats: ClickStat[];
  unique_visitors: number;
  visits_by_day: Record<string, number>;
  devices_by_day: Record<string, DeviceStat[]>;
  visits_chart: ChartPoint[];
  step1_count: number;
  step2_count: number;
  conversion_rate: number;
  avg_step1_seconds: number;
  avg_step2_seconds: number;
}

export const getBarColor = (index: number): string => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
  return colors[index % colors.length];
};

export const getBarWidth = (value: number, maxValue: number): number => {
  if (maxValue === 0) return 0;
  return Math.round((value / maxValue) * 100);
};

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
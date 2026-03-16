import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface OnlineVisitorsCardProps {
  onlineVisitors: number | null;
  onlineLoading: boolean;
  onRefresh: () => void;
}

export default function OnlineVisitorsCard({ onlineVisitors, onlineLoading, onRefresh }: OnlineVisitorsCardProps) {
  return (
    <div className="mb-6">
      <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Icon name="Users" className="text-green-600" size={40} />
              {onlineVisitors !== null && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              )}
            </div>
            <div>
              {onlineVisitors !== null ? (
                <>
                  <p className="text-4xl font-bold text-green-700">{onlineVisitors}</p>
                  <p className="text-slate-700 font-medium">На сайте сейчас</p>
                  <p className="text-xs text-slate-500 mt-1">Активность за последние 5 минут</p>
                </>
              ) : (
                <p className="text-slate-500 font-medium">Нажмите кнопку для проверки</p>
              )}
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={onlineLoading}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Icon name={onlineLoading ? "Loader2" : "RefreshCw"} size={14} className={onlineLoading ? "animate-spin mr-1" : "mr-1"} />
              Обновить
            </Button>
            {onlineVisitors !== null && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">ОНЛАЙН</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

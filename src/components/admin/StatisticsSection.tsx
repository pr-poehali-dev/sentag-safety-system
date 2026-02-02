import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Статистика</h2>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <Icon name="Users" className="text-primary mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{users.length}</p>
          <p className="text-slate-600">Всего пользователей</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <Icon name="CheckCircle" className="text-green-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{users.filter(u => u.is_active).length}</p>
          <p className="text-slate-600">Активных</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <Icon name="Shield" className="text-purple-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-slate-600">Администраторов</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <Icon name="FileText" className="text-orange-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-slate-800">{requests.length}</p>
          <p className="text-slate-600">Заявок получено</p>
        </div>
      </div>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import UserManagementSection from '@/components/admin/UserManagementSection';
import SiteSettingsSection from '@/components/admin/SiteSettingsSection';
import RequestsSection from '@/components/admin/RequestsSection';
import StatisticsSection from '@/components/admin/StatisticsSection';

const API_URL = 'https://functions.poehali.dev/cfaa29d5-c049-499c-b21d-9d21762b09c1';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

interface CurrentUser {
  id: number;
  email: string;
  role: string;
}

interface UserActivity {
  clicks: Array<{
    button_name: string;
    button_location: string;
    clicked_at: string;
  }>;
  first_visit: string | null;
  time_on_site: number;
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
  user_activity?: UserActivity;
}

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDocuments, setShowDocuments] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('admin_token') || '';

  useEffect(() => {
    verifySession();
    loadRequests();
    const savedState = localStorage.getItem('show_documents_section');
    if (savedState !== null) {
      setShowDocuments(savedState === 'true');
    }
  }, []);

  const verifySession = async () => {
    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'verify_session' })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        if (data.user.role === 'admin') {
          loadUsers();
        }
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка проверки сессии', variant: 'destructive' });
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const token = getToken();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'list_users' })
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить пользователей', variant: 'destructive' });
    }
  };

  const createUser = async (email: string, role: string) => {
    if (!email.trim()) {
      toast({ title: 'Ошибка', description: 'Введите email', variant: 'destructive' });
      return;
    }

    const token = getToken();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_user',
          new_email: email,
          new_role: role
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Пользователь создан' });
        loadUsers();
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось создать пользователя', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка подключения', variant: 'destructive' });
    }
  };

  const updateUser = async (userId: number, updates: { role?: string; is_active?: boolean }) => {
    const token = getToken();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'update_user',
          user_id: userId,
          ...updates
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Пользователь обновлен' });
        loadUsers();
      } else {
        const data = await response.json();
        toast({ title: 'Ошибка', description: data.error || 'Не удалось обновить', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка подключения', variant: 'destructive' });
    }
  };

  const loadRequests = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/ecba8763-872e-4b4c-8977-d9ef08098e7c');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded requests data:', data.requests);
        // Проверяем user_activity для первой заявки
        if (data.requests && data.requests.length > 0) {
          console.log('First request user_activity:', data.requests[0].user_activity);
        }
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const deleteRequest = async (requestId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
      return;
    }

    try {
      const response = await fetch(`https://functions.poehali.dev/083d3fc1-3983-4501-8686-0e63931b991e?id=${requestId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Заявка удалена' });
        loadRequests();
      } else {
        const data = await response.json();
        toast({ title: 'Ошибка', description: data.error || 'Не удалось удалить заявку', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка подключения', variant: 'destructive' });
    }
  };

  const toggleDocumentsSection = () => {
    const newState = !showDocuments;
    setShowDocuments(newState);
    localStorage.setItem('show_documents_section', String(newState));
    toast({ 
      title: 'Успешно', 
      description: newState ? 'Секция "Документы" включена' : 'Секция "Документы" отключена' 
    });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Админ-панель Sentag</h1>
              <p className="text-sm text-slate-500">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentUser?.role === 'admin' ? 'Администратор' : 'Менеджер'}
            </span>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" className="mr-2" size={16} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/" className="text-primary hover:underline inline-flex items-center">
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Вернуться на сайт
          </a>
        </div>

        {currentUser?.role === 'admin' ? (
          <div className="space-y-8">
            <UserManagementSection 
              users={users}
              currentUser={currentUser}
              onCreateUser={createUser}
              onUpdateUser={updateUser}
            />

            <SiteSettingsSection 
              showDocuments={showDocuments}
              onToggleDocuments={toggleDocumentsSection}
            />

            <RequestsSection 
              requests={requests}
              onLoadRequests={loadRequests}
              onDeleteRequest={deleteRequest}
            />

            <StatisticsSection 
              users={users}
              requests={requests}
            />
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Icon name="Lock" className="mx-auto mb-4 text-slate-400" size={64} />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Добро пожаловать!</h2>
            <p className="text-slate-600">
              У вас роль {currentUser?.role === 'manager' ? 'менеджера' : 'пользователя'}.
              Функции админ-панели будут доступны в следующих обновлениях.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
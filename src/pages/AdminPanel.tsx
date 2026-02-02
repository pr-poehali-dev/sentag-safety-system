import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  status: string;
  step1_completed_at: string;
  step2_completed_at: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const createUser = async () => {
    if (!newUserEmail.trim()) {
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
          new_email: newUserEmail,
          new_role: newUserRole
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Пользователь создан' });
        setNewUserEmail('');
        setNewUserRole('user');
        setDialogOpen(false);
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
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
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
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Управление пользователями</h2>
                  <p className="text-slate-600">Добавляйте и управляйте доступом к админ-панели</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="UserPlus" className="mr-2" size={16} />
                      Добавить пользователя
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новый пользователь</DialogTitle>
                      <DialogDescription>
                        Пользователь получит одноразовый пароль на указанный email
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="new-email">Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="user@example.com"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-role">Роль</Label>
                        <Select value={newUserRole} onValueChange={setNewUserRole}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Администратор</SelectItem>
                            <SelectItem value="manager">Менеджер</SelectItem>
                            <SelectItem value="user">Пользователь</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={createUser}>
                        Создать пользователя
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.is_active ? 'bg-green-100' : 'bg-slate-100'}`}>
                        <Icon name="User" className={user.is_active ? 'text-green-600' : 'text-slate-400'} size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.email}</p>
                        <p className="text-sm text-slate-500">
                          {user.role === 'admin' ? 'Администратор' : user.role === 'manager' ? 'Менеджер' : 'Пользователь'}
                          {' • '}
                          {new Date(user.created_at).toLocaleDateString('ru')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUser(user.id, { role: value })}
                        disabled={user.id === currentUser?.id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Администратор</SelectItem>
                          <SelectItem value="manager">Менеджер</SelectItem>
                          <SelectItem value="user">Пользователь</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant={user.is_active ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => updateUser(user.id, { is_active: !user.is_active })}
                        disabled={user.id === currentUser?.id}
                      >
                        {user.is_active ? 'Деактивировать' : 'Активировать'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Управление секциями сайта</h2>
                  <p className="text-slate-600">Включайте и отключайте видимость секций</p>
                </div>
              </div>
              <Card className="p-4 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showDocuments ? 'bg-green-100' : 'bg-slate-200'}`}>
                    <Icon name="FileText" className={showDocuments ? 'text-green-600' : 'text-slate-400'} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Документы и сертификаты</p>
                    <p className="text-sm text-slate-500">
                      {showDocuments ? 'Секция отображается на сайте' : 'Секция скрыта от посетителей'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={showDocuments ? 'outline' : 'default'}
                  onClick={toggleDocumentsSection}
                >
                  {showDocuments ? (
                    <>
                      <Icon name="EyeOff" className="mr-2" size={16} />
                      Скрыть секцию
                    </>
                  ) : (
                    <>
                      <Icon name="Eye" className="mr-2" size={16} />
                      Показать секцию
                    </>
                  )}
                </Button>
              </Card>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Заявки на расчет</h2>
                  <p className="text-slate-600">Все заявки с сайта</p>
                </div>
                <Button variant="outline" onClick={loadRequests}>
                  <Icon name="RefreshCw" className="mr-2" size={16} />
                  Обновить
                </Button>
              </div>

              <div className="space-y-4">
                {requests.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Заявок пока нет</p>
                ) : (
                  requests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800">{request.company}</h3>
                          <p className="text-sm text-slate-600">{request.object_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status === 'completed' ? 'Завершена' : 'Шаг 1'}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500">Контакт</p>
                          <p className="font-medium">{request.full_name}</p>
                          <p className="text-slate-600">{request.phone}</p>
                          <p className="text-slate-600">{request.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Объект</p>
                          <p className="font-medium">{request.object_address}</p>
                          <p className="text-slate-600">Роль: {request.role === 'contractor' ? 'Подрядчик' : request.role === 'customer' ? 'Конечный заказчик' : 'Проектная организация'}</p>
                        </div>
                      </div>

                      {request.status === 'completed' && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-slate-700 mb-2">Детали проекта:</p>
                          <div className="text-sm space-y-1">
                            {request.pool_size && <p><span className="text-slate-500">Бассейн:</span> {request.pool_size}</p>}
                            {request.visitors_info && <p><span className="text-slate-500">Посетители:</span> {request.visitors_info}</p>}
                            {request.deadline && <p><span className="text-slate-500">Сроки:</span> {request.deadline}</p>}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Icon name="Calendar" size={12} />
                        {new Date(request.created_at).toLocaleString('ru-RU')}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>

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
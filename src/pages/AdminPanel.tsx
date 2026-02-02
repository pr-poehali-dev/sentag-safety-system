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

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('admin_token') || '';

  useEffect(() => {
    verifySession();
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
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Статистика</h2>
              <div className="grid md:grid-cols-3 gap-6">
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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

interface UserManagementSectionProps {
  users: User[];
  currentUser: CurrentUser | null;
  onCreateUser: (email: string, role: string) => Promise<void>;
  onUpdateUser: (userId: number, updates: { role?: string; is_active?: boolean }) => Promise<void>;
}

export default function UserManagementSection({ 
  users, 
  currentUser, 
  onCreateUser, 
  onUpdateUser 
}: UserManagementSectionProps) {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateUser = async () => {
    await onCreateUser(newUserEmail, newUserRole);
    setNewUserEmail('');
    setNewUserRole('user');
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
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
              <Button className="w-full" onClick={handleCreateUser}>
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
                onValueChange={(value) => onUpdateUser(user.id, { role: value })}
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
                onClick={() => onUpdateUser(user.id, { is_active: !user.is_active })}
                disabled={user.id === currentUser?.id}
              >
                {user.is_active ? 'Деактивировать' : 'Активировать'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/cfaa29d5-c049-499c-b21d-9d21762b09c1';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!email.trim()) {
      toast({ title: 'Ошибка', description: 'Введите email', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_otp', email })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Код отправлен на ваш email' });
        setStep('otp');
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось отправить код', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка подключения к серверу', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast({ title: 'Ошибка', description: 'Введите код', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp', email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.session_token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        toast({ title: 'Успешно', description: 'Вы вошли в систему' });
        navigate('/admin');
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Неверный код', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка подключения к серверу', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') action();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Icon name="Shield" className="text-white" size={32} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Админ-панель</h1>
        <p className="text-center text-slate-600 mb-8">Система управления Sentag</p>

        {step === 'email' ? (
          <div className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, requestOtp)}
                className="mt-2"
                autoFocus
              />
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={requestOtp}
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Получить код доступа'}
            </Button>
            <p className="text-sm text-slate-500 text-center">
              Одноразовый код будет отправлен на вашу почту
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Label htmlFor="otp">Код из письма</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
                className="mt-2 text-center text-2xl tracking-widest font-bold"
                maxLength={6}
                autoFocus
              />
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Проверка...' : 'Войти'}
            </Button>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setStep('email'); setOtp(''); }}
                disabled={loading}
              >
                ← Изменить email
              </Button>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Код действителен 10 минут
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <a href="/" className="text-sm text-primary hover:underline">
            ← Вернуться на сайт
          </a>
        </div>
      </Card>
    </div>
  );
}

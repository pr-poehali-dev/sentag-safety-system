import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function SystemBenefitsSection() {
  return (
    <>
      <section id="system" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">
            Что вы получаете используя СООУ «Sentag»
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ShieldCheck',
                title: 'Обеспечение безопасности людей',
                description: 'Защита посетителей на закрытой воде с помощью передовых технологий мониторинга'
              },
              {
                icon: 'Users',
                title: 'Оптимизация работы спасателей',
                description: 'Система помогает персоналу быстрее реагировать на критические ситуации'
              },
              {
                icon: 'Award',
                title: 'Повышение имиджа и репутации',
                description: 'Современные системы безопасности укрепляют доверие клиентов к вашему заведению'
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Icon name={item.icon} className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="advantages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">
            Преимущества СООУ Sentag
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Wrench', title: 'Легкое обслуживание и монтаж', description: 'Простая установка и минимальные требования к обслуживанию системы' },
              { icon: 'FileCheck', title: 'Соответствует российскому ГОСТ', description: 'Полное соответствие требованиям и стандартам РФ' },
              { icon: 'CreditCard', title: 'Браслет как ключ или способ оплаты', description: 'Многофункциональность браслета для удобства посетителей' },
              { icon: 'Heart', title: 'Особое внимание к детям и пожилым', description: 'Настраиваемые параметры для разных возрастных групп' },
              { icon: 'Zap', title: 'Мгновенная реакция', description: 'Система реагирует на опасность в режиме реального времени' },
              { icon: 'Search', title: 'Функция "Объект в бассейне"', description: 'Обнаружение посторонних предметов в воде' },
              { icon: 'User', title: 'Индивидуальный контроль', description: 'Система контролирует каждого пользователя отдельно' },
              { icon: 'ShieldAlert', title: 'Защита от сбоев', description: 'Система не подвержена сбоям под воздействием внешних факторов' }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon} className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

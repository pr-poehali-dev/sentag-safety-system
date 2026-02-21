import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function SystemBenefitsSection() {
  return (
    <>
      <section id="system" className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-slate-800">
            Что вы получаете используя СООУ «Sentag»
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
              <Card key={idx} className="p-5 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name={item.icon} className="text-primary" size={24} />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2 text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="advantages" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-slate-800">
            Преимущества СООУ Sentag
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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
              <Card key={idx} className="p-4 md:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                  <Icon name={item.icon} className="text-primary" size={22} />
                </div>
                <h3 className="text-sm md:text-base font-bold mb-1 text-slate-800">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
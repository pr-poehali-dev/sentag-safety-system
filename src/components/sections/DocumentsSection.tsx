import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { trackClick } from '@/utils/trackVisit';

export default function DocumentsSection() {
  return (
    <section id="documents" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-slate-800">
          Документы и сертификаты
        </h2>
        <p className="text-center text-xl text-slate-600 mb-16">Полное соответствие требованиям ГОСТ и международным стандартам</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: 'FileCheck', title: 'Сертификат соответствия ГОСТ', description: 'Подтверждение соответствия требованиям РФ' },
            { icon: 'Award', title: 'Международные сертификаты', description: 'CE, ISO 9001 и другие стандарты качества' },
            { icon: 'FileText', title: 'Техническая документация', description: 'Инструкции по установке и эксплуатации' },
            { icon: 'ClipboardCheck', title: 'Тестовые отчёты', description: 'Результаты испытаний систем безопасности' },
            { icon: 'BookOpen', title: 'Руководства пользователя', description: 'Подробные инструкции для персонала' },
            { icon: 'Shield', title: 'Гарантийные документы', description: 'Условия гарантийного обслуживания' }
          ].map((item, idx) => (
            <Card 
              key={idx} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => trackClick(`Документ: ${item.title}`, 'documents')}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon name={item.icon} className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
              <div className="mt-4 flex items-center text-primary font-semibold">
                <span>Скачать</span>
                <Icon name="Download" className="ml-2" size={16} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
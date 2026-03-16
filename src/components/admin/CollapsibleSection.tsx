import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const storageKey = (title: string) => `admin_section_${title}`;

export default function CollapsibleSection({ 
  title, 
  icon = 'ChevronDown',
  defaultOpen = true,
  children 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(storageKey(title));
    return saved !== null ? saved === 'true' : defaultOpen;
  });

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem(storageKey(title), String(next));
  };

  return (
    <Card className="overflow-hidden">
      <button
        onClick={toggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <Icon 
          name={icon} 
          className={`text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={24}
        />
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </Card>
  );
}
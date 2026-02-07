import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 py-4">
      <Link to="/" className="hover:text-primary transition flex items-center">
        <Icon name="Home" size={16} className="mr-1" />
        Главная
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Icon name="ChevronRight" size={16} className="text-slate-400" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary transition">
              {item.label}
            </Link>
          ) : item.onClick ? (
            <button onClick={item.onClick} className="hover:text-primary transition">
              {item.label}
            </button>
          ) : (
            <span className="text-slate-800 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

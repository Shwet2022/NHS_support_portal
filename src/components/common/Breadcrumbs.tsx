import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: {
    label: string;
    path?: string;
  }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useRouter();

  return (
    <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
        <li>
          <button
            onClick={() => navigate('/')}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center space-x-1 sm:space-x-2">
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              {item.path && !isLast ? (
                <button
                  onClick={() => navigate(item.path!)}
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </button>
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

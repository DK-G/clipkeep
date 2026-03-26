'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { Locale } from '@/lib/i18n/ui';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: Locale;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
      <Link 
        href={`/${locale !== 'en' ? `?locale=${locale}` : ''}`}
        className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex-shrink-0"
        title="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex-shrink-0"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px] sm:max-w-xs flex-shrink-0">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

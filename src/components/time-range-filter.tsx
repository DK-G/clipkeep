'use client';

import React from 'react';
import { Locale } from '@/lib/i18n/ui';

export type TimeRange = 'today' | 'week' | 'month';

const rangeLabels: Record<TimeRange, Record<Locale, string>> = {
  today: { en: 'Today', ja: '今日', ar: 'اليوم', es: 'Hoy', pt: 'Hoje', fr: 'Aujourd\'hui', id: 'Hari ini', hi: 'आज', de: 'Heute', tr: 'Bugün' },
  week: { en: 'Week', ja: '今週', ar: 'هذا الأسبوع', es: 'Semana', pt: 'Semana', fr: 'Semaine', id: 'Minggu', hi: 'सप्ताह', de: 'Woche', tr: 'Hafta' },
  month: { en: 'Month', ja: '今月', ar: 'هذا الشهر', es: 'Mes', pt: 'Mês', fr: 'Mois', id: 'Bulan', hi: 'महीना', de: 'Monat', tr: 'Ay' },
};

const ALL_RANGES: TimeRange[] = ['today', 'week', 'month'];

export function getTimeRangeLabel(range: TimeRange, locale: Locale): string {
  return rangeLabels[range][locale] || rangeLabels[range].en;
}

interface TimeRangeFilterProps {
  current: TimeRange;
  onChange: (range: TimeRange) => void;
  locale: Locale;
  className?: string;
}

export function TimeRangeFilter({ current, onChange, locale, className = '' }: TimeRangeFilterProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: '.scrollbar-hide::-webkit-scrollbar { display: none; }' }} />
      {ALL_RANGES.map((range) => {
        const isActive = current === range;
        const label = getTimeRangeLabel(range, locale);
        return (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              isActive
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400/60'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

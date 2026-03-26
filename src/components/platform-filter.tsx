'use client';

import React from 'react';
import { Locale } from '@/lib/i18n/ui';
import { PlatformIcon } from '@/components/platform-icons';
import type { Platform } from '@/lib/extract/types';

const ALL_PLATFORMS: (Platform | 'all')[] = [
  'all', 'tiktok', 'twitter', 'reddit', 'facebook', 'telegram', 
  'pinterest', 'threads', 'bluesky', 'bilibili', 'discord', 'lemon8'
];

const platformLabels: Record<string, Record<Locale, string>> = {
  all: { en: 'All', ja: 'すべて', ar: 'الكل', es: 'Todo', pt: 'Tudo', fr: 'Tout', id: 'Semua', hi: 'सभी', de: 'Alle', tr: 'Hepsi' },
  tiktok: { en: 'TikTok', ja: 'TikTok', ar: 'TikTok', es: 'TikTok', pt: 'TikTok', fr: 'TikTok', id: 'TikTok', hi: 'TikTok', de: 'TikTok', tr: 'TikTok' },
  twitter: { en: 'Twitter', ja: 'X(Twitter)', ar: 'Twitter', es: 'Twitter', pt: 'Twitter', fr: 'Twitter', id: 'Twitter', hi: 'Twitter', de: 'Twitter', tr: 'Twitter' },
  reddit: { en: 'Reddit', ja: 'Reddit', ar: 'Reddit', es: 'Reddit', pt: 'Reddit', fr: 'Reddit', id: 'Reddit', hi: 'Reddit', de: 'Reddit', tr: 'Reddit' },
  facebook: { en: 'Facebook', ja: 'Facebook', ar: 'Facebook', es: 'Facebook', pt: 'Facebook', fr: 'Facebook', id: 'Facebook', hi: 'Facebook', de: 'Facebook', tr: 'Facebook' },
  telegram: { en: 'Telegram', ja: 'Telegram', ar: 'Telegram', es: 'Telegram', pt: 'Telegram', fr: 'Telegram', id: 'Telegram', hi: 'Telegram', de: 'Telegram', tr: 'Telegram' },
  pinterest: { en: 'Pinterest', ja: 'Pinterest', ar: 'Pinterest', es: 'Pinterest', pt: 'Pinterest', fr: 'Pinterest', id: 'Pinterest', hi: 'Pinterest', de: 'Pinterest', tr: 'Pinterest' },
  threads: { en: 'Threads', ja: 'Threads', ar: 'Threads', es: 'Threads', pt: 'Threads', fr: 'Threads', id: 'Threads', hi: 'Threads', de: 'Threads', tr: 'Threads' },
  bluesky: { en: 'Bluesky', ja: 'Bluesky', ar: 'Bluesky', es: 'Bluesky', pt: 'Bluesky', fr: 'Bluesky', id: 'Bluesky', hi: 'Bluesky', de: 'Bluesky', tr: 'Bluesky' },
  bilibili: { en: 'Bilibili', ja: 'Bilibili', ar: 'Bilibili', es: 'Bilibili', pt: 'Bilibili', fr: 'Bilibili', id: 'Bilibili', hi: 'Bilibili', de: 'Bilibili', tr: 'Bilibili' },
  discord: { en: 'Discord', ja: 'Discord', ar: 'Discord', es: 'Discord', pt: 'Discord', fr: 'Discord', id: 'Discord', hi: 'Discord', de: 'Discord', tr: 'Discord' },
  lemon8: { en: 'Lemon8', ja: 'Lemon8', ar: 'Lemon8', es: 'Lemon8', pt: 'Lemon8', fr: 'Lemon8', id: 'Lemon8', hi: 'Lemon8', de: 'Lemon8', tr: 'Lemon8' },
};

interface PlatformFilterProps {
  current: string;
  onChange: (platform: string) => void;
  locale: Locale;
  className?: string;
}

export function PlatformFilter({ current, onChange, locale, className = "" }: PlatformFilterProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: '.scrollbar-hide::-webkit-scrollbar { display: none; }' }} />
      {ALL_PLATFORMS.map((p) => {
        const isActive = current === p;
        const label = platformLabels[p]?.[locale] || p.charAt(0).toUpperCase() + p.slice(1);
        
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              isActive 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400/50'
            }`}
          >
            {p !== 'all' && (
              <PlatformIcon platform={p as Platform} className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

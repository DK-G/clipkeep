'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHistory } from '@/hooks/use-history';
import { PlatformIcon } from '@/components/platform-icons';
import { homeText, Locale } from '@/lib/i18n/ui';
import type { Platform } from '@/lib/extract/types';

interface HistorySectionProps {
  locale: Locale;
}

export function HistorySection({ locale }: HistorySectionProps) {
  const { history, clearHistory } = useHistory();
  const t = homeText[locale] || homeText.en;

  if (history.length === 0) return null;

  return (
    <section className="mt-12 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-5 px-2 sm:px-0">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {t.historyTitle}
        </h2>
        <button 
          onClick={clearHistory}
          className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          {t.clearHistory}
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-6 px-2 sm:px-0 snap-x snap-mandatory scrollbar-hide -mx-2 sm:mx-0">
        <style dangerouslySetInnerHTML={{ __html: '.scrollbar-hide::-webkit-scrollbar { display: none; }' }} />
        
        {history.map((item) => (
          <Link
            key={item.id}
            href={`/result/${item.id}?locale=${locale}`}
            className="group relative flex-none w-[160px] sm:w-[220px] aspect-[16/9] bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 snap-start hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950">
              <Image
                src={item.thumbnail_url || '/placeholder-video.png'}
                alt={item.title || 'Video'}
                fill
                unoptimized
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="bg-white/10 backdrop-blur-md rounded px-1.5 py-1 flex items-center justify-center">
                  <PlatformIcon platform={item.platform as Platform} className="w-3 h-3 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white truncate drop-shadow-sm">
                  {item.title || 'Video'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

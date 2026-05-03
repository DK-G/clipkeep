'use client';

import React, { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');
  const t = homeText[locale] || homeText.en;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredHistory = useMemo(() => {
    if (!normalizedQuery) return history;
    return history.filter((item) => {
      const haystack = [
        item.title,
        item.platform,
        item.source_url,
        item.author_name,
        item.author_handle,
      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [history, normalizedQuery]);

  if (history.length === 0) return null;

  return (
    <section className="mt-12 w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-950/50 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            {t.historyTitle}
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Search saved results by title, platform, creator, or source URL.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:w-[320px] sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search library"
            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
          <button 
            onClick={clearHistory}
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:border-red-200 hover:text-red-500 dark:border-slate-800 dark:hover:border-red-900"
          >
            {t.clearHistory}
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-6 px-2 sm:px-0 snap-x snap-mandatory scrollbar-hide -mx-2 sm:mx-0">
        <style dangerouslySetInnerHTML={{ __html: '.scrollbar-hide::-webkit-scrollbar { display: none; }' }} />
        
        {filteredHistory.map((item) => (
          <Link
            key={item.id}
            href={`/result/${item.id}?locale=${locale}`}
            className="group relative flex-none w-[210px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 snap-start hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900 sm:w-[260px]"
          >
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-950">
              <Image src={item.thumbnail_url || '/placeholder-video.png'} alt={item.title || 'Video'} fill unoptimized className="object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute left-2 top-2 bg-black/45 backdrop-blur-md rounded px-1.5 py-1 flex items-center justify-center">
                <PlatformIcon platform={item.platform as Platform} className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="space-y-2 p-3">
              <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-slate-900 dark:text-slate-100">{item.title || 'Untitled media'}</p>
              <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <span>{item.platform}</span>
                <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString()}</time>
              </div>
              {(item.author_name || item.author_handle) && (
                <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.author_name || `@${item.author_handle}`}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      {filteredHistory.length === 0 && (
        <p className="px-2 pb-2 text-sm font-medium text-slate-500 dark:text-slate-400">No saved results match your search.</p>
      )}
    </section>
  );
}

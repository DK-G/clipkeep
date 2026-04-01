'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, menuText } from '@/lib/i18n/ui';
import { GallerySection, type GalleryPlatform } from '@/components/gallery-section';
import { PlatformFilter } from '@/components/platform-filter';

interface TrendingHubSectionProps {
  locale: Locale;
  title: string;
  subtitle: string;
}

export function TrendingHubSection({ locale, title, subtitle }: TrendingHubSectionProps) {
  const [platform, setPlatform] = useState<string>('all');
  const t = menuText[locale];

  return (
    <div className="mb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center mb-2">
            <span className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></span>
            {title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base ml-4.5">
            {subtitle}
          </p>
        </div>

        <Link
          href={`/trending?locale=${locale}${platform !== 'all' ? `&p=${platform}` : ''}`}
          className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline ml-4.5 sm:ml-0"
        >
          {t.viewAllTrending}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="mb-8">
        <PlatformFilter
          current={platform}
          onChange={setPlatform}
          locale={locale}
        />
      </div>

      <GallerySection
        key={platform}
        platform={platform as GalleryPlatform}
        type="trending"
        locale={locale}
        layout="masonry"
        dense={false}
        limit={8}
        id="trending-hub"
        title=""
        hideMeta={false}
      />
    </div>
  );
}

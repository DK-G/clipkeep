'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { normalizeLocale, homeText, type Locale } from '@/lib/i18n/ui';
import { GalleryPageContent, type GalleryPlatform } from '@/components/gallery-page-content';
import { PlatformFilter } from '@/components/platform-filter';
import { Breadcrumbs } from '@/components/breadcrumbs';

export function TrendingPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get('locale'));
  const t = homeText[locale] || homeText.en;
  const [platform, setPlatform] = useState<string>('all');

  useEffect(() => {
    const p = searchParams.get('p') || 'all';
    setPlatform(p);
  }, [searchParams]);

  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
    const params = new URLSearchParams(searchParams.toString());
    if (newPlatform === 'all') {
      params.delete('p');
    } else {
      params.set('p', newPlatform);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: t.globalTrending }]} locale={locale} />
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-4">
          {t.globalTrending || 'Trending Hub'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          {t.globalTrendingSubtitle || 'Discover popular clips across all platforms.'}
        </p>
      </div>

      <div className="mb-8">
        <PlatformFilter current={platform} onChange={handlePlatformChange} locale={locale as Locale} />
      </div>

      <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.initialMessage}...</div>}>
        <GalleryPageContent platform={platform as GalleryPlatform} locale={locale as Locale} type="trending" />
      </Suspense>
    </main>
  );
}

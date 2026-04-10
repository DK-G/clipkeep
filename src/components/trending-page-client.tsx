'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { normalizeLocale, homeText, galleryRangeText, type Locale } from '@/lib/i18n/ui';
import { GalleryPageContent, type GalleryPlatform } from '@/components/gallery-page-content';
import { PlatformFilter } from '@/components/platform-filter';
import { TimeRangeFilter, type TimeRange, getTimeRangeLabel } from '@/components/time-range-filter';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { trackEvent } from '@/lib/analytics/gtag';

const DEFAULT_TRENDING_RANGE: TimeRange = 'week';

export function TrendingPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get('locale'));
  const t = homeText[locale] || homeText.en;
  const [platform, setPlatform] = useState<string>('all');
  const [range, setRange] = useState<TimeRange>(DEFAULT_TRENDING_RANGE);

  useEffect(() => {
    setPlatform(searchParams.get('p') || 'all');
    const nextRange = searchParams.get('range');
    setRange(nextRange === 'today' || nextRange === 'week' || nextRange === 'month' ? nextRange : DEFAULT_TRENDING_RANGE);
  }, [searchParams]);

  const replaceParams = (nextPlatform: string, nextRange: TimeRange) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPlatform === 'all') params.delete('p'); else params.set('p', nextPlatform);
    if (nextRange === DEFAULT_TRENDING_RANGE) params.delete('range'); else params.set('range', nextRange);
    const query = params.toString();
    router.replace(query ? `?${query}` : '?', { scroll: false });
  };

  const handleRangeChange = (nextRange: TimeRange) => {
    setRange(nextRange);
    trackEvent('discovery_range_change', {
      discovery_type: 'trending',
      locale,
      platform,
      previous_range: range,
      selected_range: nextRange,
    });
    replaceParams(platform, nextRange);
  };

  const handlePlatformChange = (nextPlatform: string) => {
    setPlatform(nextPlatform);
    trackEvent('discovery_platform_change', {
      discovery_type: 'trending',
      locale,
      previous_platform: platform,
      selected_platform: nextPlatform,
      range,
    });
    replaceParams(nextPlatform, range);
  };

  const rangeLabel = getTimeRangeLabel(range, locale as Locale);
  const rangeDict = galleryRangeText[locale] || galleryRangeText.en;
  const subtitle = range === 'today' ? rangeDict.trendingTodaySubtitle : range === 'month' ? rangeDict.trendingMonthSubtitle : rangeDict.trendingWeekSubtitle;

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: t.globalTrending }]} locale={locale} />
      <div className="mb-10 text-center sm:text-left">
        <div className="mb-3 inline-flex rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {rangeLabel}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-4">
          {t.globalTrending || 'Trending Hub'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      </div>

      <div className="mb-4">
        <TimeRangeFilter current={range} onChange={handleRangeChange} locale={locale as Locale} />
      </div>

      <div className="mb-8">
        <PlatformFilter current={platform} onChange={handlePlatformChange} locale={locale as Locale} />
      </div>

      <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.initialMessage}...</div>}>
        <GalleryPageContent platform={platform as GalleryPlatform} locale={locale as Locale} type="trending" range={range} />
      </Suspense>
    </main>
  );
}

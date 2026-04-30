'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { normalizeLocale, menuText, galleryRangeText, type Locale } from '@/lib/i18n/ui';
import { GalleryPageContent, type GalleryPlatform } from '@/components/gallery-page-content';
import { PlatformFilter } from '@/components/platform-filter';
import { TimeRangeFilter, type TimeRange, getTimeRangeLabel } from '@/components/time-range-filter';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { trackEvent } from '@/lib/analytics/gtag';
import { DOWNLOADER_MAP, DOWNLOADER_CTA } from '@/lib/utils/downloader-map';

const DEFAULT_LATEST_RANGE: TimeRange = 'month';

export function LatestPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get('locale'));
  const t = menuText[locale] || menuText.en;
  const [platform, setPlatform] = useState<'all' | GalleryPlatform>('all');
  const [range, setRange] = useState<TimeRange>(DEFAULT_LATEST_RANGE);

  useEffect(() => {
    const nextPlatform = searchParams.get('p');
    setPlatform((nextPlatform as GalleryPlatform | null) || 'all');
    const nextRange = searchParams.get('range');
    setRange(nextRange === 'today' || nextRange === 'week' || nextRange === 'month' ? nextRange : DEFAULT_LATEST_RANGE);
  }, [searchParams]);

  const replaceParams = (nextPlatform: 'all' | GalleryPlatform, nextRange: TimeRange) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPlatform === 'all') params.delete('p'); else params.set('p', nextPlatform);
    if (nextRange === DEFAULT_LATEST_RANGE) params.delete('range'); else params.set('range', nextRange);
    const query = params.toString();
    router.replace(query ? `?${query}` : '?', { scroll: false });
  };

  const handleRangeChange = (nextRange: TimeRange) => {
    setRange(nextRange);
    trackEvent('discovery_range_change', {
      discovery_type: 'latest',
      locale,
      platform,
      previous_range: range,
      selected_range: nextRange,
    });
    replaceParams(platform, nextRange);
  };

  const handlePlatformChange = (nextPlatform: string) => {
    const normalized = (nextPlatform as GalleryPlatform | 'all');
    setPlatform(normalized);
    trackEvent('discovery_platform_change', {
      discovery_type: 'latest',
      locale,
      previous_platform: platform,
      selected_platform: normalized,
      range,
    });
    replaceParams(normalized, range);
  };

  const rangeLabel = getTimeRangeLabel(range, locale as Locale);
  const rangeDict = galleryRangeText[locale] || galleryRangeText.en;
  const subtitle = range === 'today' ? rangeDict.latestTodaySubtitle : range === 'week' ? rangeDict.latestWeekSubtitle : rangeDict.latestMonthSubtitle;

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: t.latest }]} locale={locale} />
      <div className="mb-10 text-center sm:text-left">
        <div className="mb-3 inline-flex rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {rangeLabel}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-4 lowercase">
          {t.latest || 'Latest'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          {subtitle}
        </p>
      </div>

      <div className="mb-4">
        <TimeRangeFilter current={range} onChange={handleRangeChange} locale={locale as Locale} />
      </div>

      <div className="mb-6">
        <PlatformFilter current={platform} onChange={handlePlatformChange} locale={locale as Locale} />
      </div>

      {platform !== 'all' && DOWNLOADER_MAP[platform] && (
        <div className="mb-6">
          <Link
            href={`${DOWNLOADER_MAP[platform]}?locale=${locale}`}
            onClick={() => trackEvent('latest_to_downloader_click', { locale, platform })}
            className="flex items-center justify-between gap-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 px-5 py-3 text-indigo-700 dark:text-indigo-300 font-semibold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <span>{(DOWNLOADER_CTA[locale as Locale] ?? DOWNLOADER_CTA.en)(platform)}</span>
            <span className="text-indigo-400 dark:text-indigo-500 text-xs font-normal">clipkeep.net</span>
          </Link>
        </div>
      )}

      <Suspense fallback={<div className="p-20 text-center text-gray-400">{t.loadingLabel || 'Loading'}...</div>}>
        <GalleryPageContent platform={platform as GalleryPlatform} locale={locale as Locale} type="latest" range={range} />
      </Suspense>
    </main>
  );
}

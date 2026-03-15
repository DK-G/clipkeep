'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Platform } from '@/lib/extract/types';
import { Locale, galleryPages } from '@/lib/i18n/ui';
import { GallerySection, GalleryItem } from '@/components/gallery-section';
import { SEOContent } from '@/components/seo-content';
import { VideoSchema } from '@/components/video-schema';

interface GalleryPageContentProps {
  platform: Platform;
  locale: Locale;
  type: 'trending' | 'latest';
}

function downloaderPath(platform: Platform): string {
  if (platform === 'twitter') return '/download-twitter-video';
  if (platform === 'telegram') return '/download-telegram-video';
  return '/download-tiktok-video';
}

function oppositeFeed(type: 'trending' | 'latest', platform: Platform): string {
  const base = `/${platform}`;
  return type === 'trending' ? `${base}-latest-videos` : `${base}-trending-videos`;
}

export function GalleryPageContent({ platform, locale, type }: GalleryPageContentProps) {
  const pageKey = `${type}${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
  const dict = galleryPages[locale]?.[pageKey] || galleryPages.en?.[pageKey];

  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const endpoint = type === 'trending' ? 'trending' : 'recent';
      const res = await fetch(`/api/v1/gallery/${endpoint}?platform=${platform}&limit=24`);
      const json = (await res.json()) as { ok: boolean; data: GalleryItem[] };
      if (json.ok) {
        setItems(json.data);
      }
    }
    fetchItems();
  }, [platform, type]);

  if (!dict) return <div className="p-20 text-center">Page not found</div>;

  const toolHref = `${downloaderPath(platform)}?locale=${locale}`;
  const feedHref = `${oppositeFeed(type, platform)}?locale=${locale}`;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <VideoSchema items={items} />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{dict.title}</h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto">{dict.subtitle}</p>
      </div>

      <GallerySection platform={platform} locale={locale} title={type === 'trending' ? 'Weekly Ranking' : 'Recent Downloads'} />

      <section className="mt-12 max-w-4xl mx-auto rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Next Steps</h2>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Try the Downloader</h3>
        <p className="text-gray-600 mb-3">
          Ready to save a specific clip? Go directly to the platform downloader.
        </p>
        <Link href={toolHref} className="text-blue-600 font-semibold hover:underline">
          Open {platform.toUpperCase()} Downloader
        </Link>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Explore More Discovery Pages</h3>
        <p className="text-gray-600 mb-3">
          Continue browsing related media from the same platform.
        </p>
        <Link href={feedHref} className="text-blue-600 font-semibold hover:underline">
          Open {type === 'trending' ? 'Recent Downloads' : 'Weekly Ranking'}
        </Link>
      </section>

      <SEOContent content={dict.seoContent || ''} />
    </main>
  );
}

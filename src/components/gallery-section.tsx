'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Platform } from '@/lib/extract/types';
import { Locale } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';

export interface GalleryItem {
  id: string;
  platform: Platform;
  source_url: string;
  thumbnail_url: string;
  access_count: number;
  created_at?: string;
  duration_sec?: number;
}

interface GallerySectionProps {
  platform: Platform;
  locale: Locale;
  title: string;
  id?: string;
}

function formatDuration(sec?: number): string {
  if (!sec || Number.isNaN(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function badgeColor(p: Platform): string {
  if (p === 'twitter') return 'bg-sky-100 text-sky-800';
  if (p === 'telegram') return 'bg-cyan-100 text-cyan-800';
  return 'bg-fuchsia-100 text-fuchsia-800';
}

export function GallerySection({ platform, locale, title, id = 'recent' }: GallerySectionProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`/api/v1/gallery/recent?platform=${platform}&limit=8`);
        const json = (await res.json()) as { ok: boolean; data: GalleryItem[] };
        if (json.ok) setItems(json.data);
      } catch (error) {
        console.error('Gallery fetch failed', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [platform]);

  if (loading) {
    return (
      <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-video bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id={id} className="mt-16 scroll-mt-[100px]">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const resultHref = `/result/${item.id}?locale=${locale}`;
          const onCardClick = () => {
            trackEvent('gallery_card_click', {
              platform,
              locale,
              gallery_section: id,
              job_id: item.id,
              source_host: new URL(item.source_url).hostname.replace('www.', ''),
            });
            router.push(resultHref);
          };
          return (
            <div
              key={item.id}
              role="link"
              tabIndex={0}
              onClick={onCardClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCardClick();
                }
              }}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-video.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold rounded-lg shadow-sm ${badgeColor(platform)}`}>
                  {platform.toUpperCase()}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold">
                    {item.access_count.toLocaleString()} downloads
                  </span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-mono">
                    {formatDuration(item.duration_sec)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider truncate">
                    {new URL(item.source_url).hostname.replace('www.', '')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick();
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors duration-200"
                >
                  <span>Download Now</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


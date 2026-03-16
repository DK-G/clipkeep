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
              className="group relative bg-[#0f1419]/[0.03] dark:bg-white/[0.03] rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-video.png';
                  }}
                />
                
                {/* Platform Icon Badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                   {platform === 'twitter' && (
                     <div className="bg-black/80 rounded px-1.5 py-0.5 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                     </div>
                   )}
                   {platform === 'instagram' && (
                     <div className="bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded px-1.5 py-0.5 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                           <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                           <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                     </div>
                   )}
                   {platform === 'tiktok' && (
                     <div className="bg-black rounded px-1.5 py-0.5 flex items-center justify-center border border-white/20">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                           <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"></path>
                        </svg>
                     </div>
                   )}
                   {platform === 'telegram' && (
                     <div className="bg-[#229ED9] rounded px-1.5 py-0.5 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                           <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.762 5.319-1.056 6.887-.125.664-.371.887-.607.909-.513.048-.903-.337-1.4-.663-.777-.51-1.215-.828-1.967-1.323-.869-.57-.306-.883.19-.139 1.3 1.95 2.394 3.606 3.774 5.679.155.234.305.454.455.67.149.222.284.423.415.617.13.194.25.372.361.534.111.162.213.31.305.441.254.364.57 1.258.113 1.875l.136-.182zm-4.962 0zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"></path>
                        </svg>
                     </div>
                   )}
                   <div className="bg-black/60 text-white text-[10px] font-bold px-1 rounded">
                      {formatDuration(item.duration_sec)}
                   </div>
                </div>

                <div className="absolute top-2 left-2">
                   <div className="bg-white/90 backdrop-blur-sm dark:bg-black/90 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      {item.access_count > 1000 ? `${(item.access_count / 1000).toFixed(1)}k` : item.access_count}
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


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
  initialItems?: GalleryItem[];
  type?: 'recent' | 'trending';
  limit?: number;
}

function formatDuration(sec?: number): string {
  if (!sec || Number.isNaN(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}


export function GallerySection({ 
  platform, 
  locale, 
  title, 
  id = 'gallery', 
  initialItems, 
  type = 'recent', 
  limit = 8 
}: GallerySectionProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
      setLoading(false);
      return;
    }

    async function fetchGallery() {
      try {
        const endpoint = type === 'trending' ? 'trending' : 'recent';
        const res = await fetch(`/api/v1/gallery/${endpoint}?platform=${platform}&limit=${limit}`);
        const json = (await res.json()) as { ok: boolean; data: GalleryItem[] };
        if (json.ok) setItems(json.data);
      } catch (error) {
        console.error('Gallery fetch failed', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [platform, initialItems, type, limit]);

  if (loading) {
    return (
      <div className="mt-12 w-full grid grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 px-2 sm:px-0 animate-pulse">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="aspect-[16/9] bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id={id} className="mt-12 scroll-mt-[80px]">
      <h2 className="text-xl font-extrabold mb-4 text-center text-slate-900 dark:text-slate-50 tracking-tight">{title}</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 px-2 sm:px-0">
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
              // will-change: transform optimizes for older CPUs during hover/scroll
              className="group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-100 hover:border-blue-400/30 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-pointer will-change-transform"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-video.png';
                  }}
                />
                
                {/* Platform Icon Badge - Optimized for high density & high contrast */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1">
                   {platform === 'instagram' && (
                     <div className="bg-[#E4405F] rounded-sm px-1 py-0.5 flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5 text-white fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                           <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                           <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                     </div>
                   )}
                   {platform === 'twitter' && (
                     <div className="bg-black rounded-sm px-1 py-0.5 flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24">
                           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                     </div>
                   )}
                   {platform === 'tiktok' && (
                     <div className="bg-black rounded-sm px-1 py-0.5 flex items-center justify-center shadow-sm border border-white/10">
                        <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24">
                           <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"></path>
                        </svg>
                     </div>
                   )}
                   {platform === 'telegram' && (
                     <div className="bg-[#229ED9] rounded-sm px-1 py-0.5 flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24">
                           <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.762 5.319-1.056 6.887-.125.664-.371.887-.607.909-.513.048-.903-.337-1.4-.663-.777-.51-1.215-.828-1.967-1.323-.869-.57-.306-.883.19-.139 1.3 1.95 2.394 3.606 3.774 5.679.155.234.305.454.455.67.149.222.284.423.415.617.13.194.25.372.361.534.111.162.213.31.305.441.254.364.57 1.258.113 1.875l.136-.182zm-4.962 0zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"></path>
                        </svg>
                     </div>
                   )}
                   <div className="bg-slate-950/70 text-white text-[9px] font-bold px-1 py-0.5 rounded-sm tabular-nums">
                      {formatDuration(item.duration_sec)}
                   </div>
                </div>
 
                <div className="absolute top-1 left-1">
                   <div className="bg-white/95 dark:bg-slate-900/95 px-1.5 py-0.5 rounded-sm text-[9px] font-bold shadow-sm border border-slate-200/50 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_2px_rgba(34,197,94,0.4)]"></span>
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


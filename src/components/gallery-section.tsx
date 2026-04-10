'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Platform as ExtractPlatform } from '@/lib/extract/types';
import { Locale, menuText } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';
import React from 'react';
import { TiktokIcon, TwitterXIcon, RedditIcon, FacebookIcon, TelegramIcon, PinterestIcon, ThreadsIcon, BlueskyIcon, BilibiliIcon, DiscordIcon, Lemon8Icon } from '@/components/platform-icons';

const PlatformIconMap: Partial<Record<ExtractPlatform, React.FC<{ className?: string }>>> = {
  tiktok: TiktokIcon,
  twitter: TwitterXIcon,
  reddit: RedditIcon,
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  pinterest: PinterestIcon,
  threads: ThreadsIcon,
  bluesky: BlueskyIcon,
  bilibili: BilibiliIcon,
  discord: DiscordIcon,
  lemon8: Lemon8Icon,
};

export interface GalleryItem {
  id: string;
  platform: ExtractPlatform;
  source_url: string;
  thumbnail_url: string;
  access_count: number;
  created_at?: string;
  duration_sec?: number;
}

export type GalleryPlatform = ExtractPlatform | 'instagram';

interface GallerySectionProps {
  platform: GalleryPlatform | 'all';
  locale: Locale;
  title: string;
  id?: string;
  initialItems?: GalleryItem[];
  type?: 'recent' | 'trending';
  limit?: number;
  layout?: 'grid' | 'carousel' | 'masonry';
  hideMeta?: boolean;
  dense?: boolean;
  excludeIds?: string[];
}

function formatDuration(sec?: number): string {
  if (!sec || Number.isNaN(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getPlatformBadgeClass(platform: ExtractPlatform): string {
  if (platform === 'tiktok') return 'bg-black border border-white/10';
  if (platform === 'twitter') return 'bg-black';
  if (platform === 'reddit') return 'bg-orange-600';
  if (platform === 'facebook') return 'bg-blue-600';
  if (platform === 'telegram') return 'bg-blue-500';
  if (platform === 'pinterest') return 'bg-red-600';
  if (platform === 'threads') return 'bg-slate-900';
  if (platform === 'bluesky') return 'bg-blue-400';
  if (platform === 'lemon8') return 'bg-yellow-400';
  if (platform === 'bilibili') return 'bg-pink-400';
  return 'bg-indigo-500';
}

function ThumbnailImage({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt="Video Thumbnail"
      width={640}
      height={360}
      unoptimized
      className={className}
      loading="lazy"
      onError={() => setImageSrc('/placeholder-video.png')}
    />
  );
}

function useColumnCount(dense?: boolean) {
  const [columnCount, setColumnCount] = useState(dense ? 4 : 2);

  useEffect(() => {
    const updateCount = () => {
      const w = window.innerWidth;
      if (dense) {
        if (w >= 1536) setColumnCount(12);
        else if (w >= 1280) setColumnCount(10);
        else if (w >= 1024) setColumnCount(9);
        else if (w >= 768) setColumnCount(7);
        else if (w >= 640) setColumnCount(5);
        else setColumnCount(4);
      } else {
        if (w >= 1536) setColumnCount(8);
        else if (w >= 1280) setColumnCount(6);
        else if (w >= 1024) setColumnCount(5);
        else if (w >= 768) setColumnCount(4);
        else if (w >= 640) setColumnCount(3);
        else setColumnCount(2);
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [dense]);

  return columnCount;
}

export function GallerySection({
  platform,
  locale,
  title,
  id = 'gallery',
  initialItems,
  type = 'recent',
  limit = 8,
  layout = 'grid',
  hideMeta = true,
  dense = false,
  excludeIds = [],
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
        const res = await fetch(`/api/v1/gallery/${type}?platform=${platform}&limit=${limit}`);
        if (res.ok) {
          const resJson = await res.json() as { data: GalleryItem[] };
          setItems(resJson.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [platform, initialItems, type, limit]);

  const filteredItems = items.filter((item) => !excludeIds.includes(item.id));
  const columnCount = useColumnCount(dense);
  const columns = Array.from({ length: columnCount }, (_, i) => filteredItems.filter((_, index) => index % columnCount === i));

  if (loading) {
    const skeletonClasses = layout === 'carousel'
      ? 'flex overflow-hidden gap-4 px-2 sm:px-0'
      : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-4 px-2 sm:px-0';

    return (
      <div className={`mt-12 w-full animate-pulse ${skeletonClasses}`}>
        {[...Array(limit)].map((_, i) => (
          <div
            key={i}
            className={`aspect-[16/9] bg-slate-100 dark:bg-slate-800 rounded-lg ${layout === 'carousel' ? 'flex-none w-[200px] sm:w-[260px]' : ''}`}
          ></div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) return null;

  const containerClasses = layout === 'carousel'
    ? 'flex overflow-x-auto gap-4 pb-6 px-2 sm:px-0 snap-x snap-mandatory scrollbar-hide -mx-2 sm:mx-0'
    : layout === 'masonry'
      ? `flex flex-row ${dense ? 'gap-1.5 sm:gap-3' : 'gap-3 sm:gap-4'} px-2 sm:px-0`
      : dense
        ? 'grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-1.5 sm:gap-3 px-2 sm:px-0'
        : 'grid grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 px-2 sm:px-0';

  return (
    <section id={id} className={`mt-12 scroll-mt-[80px] ${layout === 'carousel' ? 'overflow-hidden' : ''}`}>
      <div className="flex items-center justify-between mb-5 px-2 sm:px-0">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{title}</h2>
        {type === 'trending' && (
          <button
            onClick={() => router.push(`/trending?locale=${locale}`)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group"
          >
            <span>{menuText[locale]?.viewAllTrending || 'View All'}</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        )}
      </div>
      <div className={containerClasses} style={layout === 'carousel' ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
        <style dangerouslySetInnerHTML={{ __html: '.scrollbar-hide::-webkit-scrollbar { display: none; }' }} />

        {layout === 'masonry' ? (
          columns.map((col, colIdx) => (
            <div key={colIdx} className={`flex-1 flex flex-col ${dense ? 'gap-1.5 sm:gap-3' : 'gap-3 sm:gap-4'}`}>
              {col.map((item) => {
                const resultHref = `/result/${item.id}?locale=${locale}`;
                const onCardClick = () => {
                  trackEvent('gallery_card_click', {
                    platform: item.platform,
                    locale,
                    gallery_section: id,
                    job_id: item.id,
                    source_host: new URL(item.source_url).hostname.replace('www.', ''),
                  });
                  router.push(resultHref);
                };

                const showIcons = platform === 'all' || !hideMeta;

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
                    className="group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer will-change-transform hover:-translate-y-1"
                  >
                    <div className="h-auto relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                      <ThumbnailImage
                        src={item.thumbnail_url}
                        className="w-full h-auto object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute bottom-1 right-1 flex items-center gap-1">
                        {!hideMeta && (
                          <div className="bg-white/95 dark:bg-slate-900/95 px-1 py-0.5 rounded-sm text-[9px] font-bold shadow-sm border border-slate-200/50 flex items-center gap-1 tabular-nums mr-0.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_2px_rgba(34,197,94,0.4)]"></span>
                            {item.access_count > 1000 ? `${(item.access_count / 1000).toFixed(1)}k` : item.access_count}
                          </div>
                        )}
                        {showIcons && (
                          <div className={`${getPlatformBadgeClass(item.platform)} rounded-sm px-1 py-0.5 flex items-center justify-center shadow-sm`}>
                            {PlatformIconMap[item.platform]
                              ? React.createElement(PlatformIconMap[item.platform]!, { className: 'w-2.5 h-2.5 text-white' })
                              : <span className="text-white text-[8px] font-black">{item.platform.slice(0, 2).toUpperCase()}</span>}
                          </div>
                        )}
                        {!hideMeta && (
                          <div className="bg-slate-950/70 text-white text-[9px] font-bold px-1 py-0.5 rounded-sm tabular-nums">
                            {formatDuration(item.duration_sec)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          filteredItems.map((item) => {
            const resultHref = `/result/${item.id}?locale=${locale}`;
            const onCardClick = () => {
              trackEvent('gallery_card_click', {
                platform: item.platform,
                locale,
                gallery_section: id,
                job_id: item.id,
                source_host: new URL(item.source_url).hostname.replace('www.', ''),
              });
              router.push(resultHref);
            };

            const showIcons = platform === 'all' || !hideMeta;

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
                className={`group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer will-change-transform snap-start hover:-translate-y-1 ${layout === 'carousel' ? 'flex-none w-[200px] sm:w-[260px]' : ''}`}
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                  <ThumbnailImage
                    src={item.thumbnail_url}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute bottom-1 right-1 flex items-center gap-1">
                    {!hideMeta && (
                      <div className="bg-white/95 dark:bg-slate-900/95 px-1 py-0.5 rounded-sm text-[9px] font-bold shadow-sm border border-slate-200/50 flex items-center gap-1 tabular-nums mr-0.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_2px_rgba(34,197,94,0.4)]"></span>
                        {item.access_count > 1000 ? `${(item.access_count / 1000).toFixed(1)}k` : item.access_count}
                      </div>
                    )}
                    {showIcons && (
                      <div className={`${getPlatformBadgeClass(item.platform)} rounded-sm px-1 py-0.5 flex items-center justify-center shadow-sm`}>
                        {PlatformIconMap[item.platform]
                          ? React.createElement(PlatformIconMap[item.platform]!, { className: 'w-2.5 h-2.5 text-white' })
                          : <span className="text-white text-[8px] font-black">{item.platform.slice(0, 2).toUpperCase()}</span>}
                      </div>
                    )}
                    {!hideMeta && (
                      <div className="bg-slate-950/70 text-white text-[9px] font-bold px-1 py-0.5 rounded-sm tabular-nums">
                        {formatDuration(item.duration_sec)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}


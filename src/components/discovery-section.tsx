'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/ui';
import { discoveryText, DiscoveryDict } from '@/lib/i18n/discovery';
import type { GalleryItem } from './gallery-section';
import { trackEvent } from '@/lib/analytics/gtag';

function formatDuration(sec?: number): string {
  if (!sec || Number.isNaN(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function DiscoverySection({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [data, setData] = useState<{ pattern: keyof DiscoveryDict; items: GalleryItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscovery() {
      try {
        const res = await fetch('/api/v1/gallery/discover');
        const json = await res.json() as { ok: boolean; data: { pattern: keyof DiscoveryDict; items: GalleryItem[] } };
        if (json.ok) setData(json.data);
      } catch (error) {
        console.error('Discovery fetch failed', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiscovery();
  }, []);

  if (loading) {
    return (
      <div className="mt-16 w-full animate-pulse px-4 sm:px-0">
         <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 mx-auto rounded mb-6"></div>
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[16/9] bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
            ))}
         </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) return null;

  const title = discoveryText[locale][data.pattern] || 'Discovery';

  return (
    <section className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-12 px-2 sm:px-0 scroll-mt-[100px]">
      <div className="flex flex-col items-center mb-6">
         <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-1">Discover</span>
         <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight text-center">{title}</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
        {data.items.slice(0, 12).map((item) => {
          const resultHref = `/result/${item.id}?locale=${locale}`;
          const onCardClick = () => {
             trackEvent('discovery_card_click', {
               platform: item.platform,
               locale,
               pattern: data.pattern,
               job_id: item.id,
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
              className="group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-400/30 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/9] relative bg-slate-100 dark:bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-video.png'; }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function XIcon() { return <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>; }
function TiktokIcon() { return <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"></path></svg>; }
function InstaIcon() { return <svg className="w-2.5 h-2.5 text-white fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>; }
function TelegramIcon() { return <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.762 5.319-1.056 6.887-.125.664-.371.887-.607.909-.513.048-.903-.337-1.4-.663-.777-.51-1.215-.828-1.967-1.323-.869-.57-.306-.883.19-.139 1.3 1.95 2.394 3.606 3.774 5.679.155.234.305.454.455.67.149.222.284.423.415.617.13.194.25.372.361.534.111.162.213.31.305.441.254.364.57 1.258.113 1.875l.136-.182zm-4.962 0zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"></path></svg>; }

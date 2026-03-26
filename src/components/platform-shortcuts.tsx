'use client';

import React from 'react';
import Link from 'next/link';
import { usePlatformUsage } from '@/hooks/use-platform-usage';
import { 
  TiktokIcon, 
  TwitterXIcon, 
  RedditIcon, 
  FacebookIcon, 
  TelegramIcon, 
  PinterestIcon, 
  ThreadsIcon, 
  BlueskyIcon, 
  BilibiliIcon, 
  DiscordIcon, 
  Lemon8Icon 
} from '@/components/platform-icons';

interface PlatformShortcutsProps {
  locale: string;
  labels: Record<string, string>;
}

export function PlatformShortcuts({ locale, labels }: PlatformShortcutsProps) {
  const { getSortedPlatforms } = usePlatformUsage();

  const platformDefinitions = [
    { name: labels.tiktok, id: 'tiktok', color: 'bg-slate-950', icon: TiktokIcon },
    { name: labels.twitter, id: 'twitter', color: 'bg-slate-900', icon: TwitterXIcon },
    { name: labels.reddit, id: 'reddit', color: 'bg-orange-600', icon: RedditIcon },
    { name: labels.facebook, id: 'facebook', color: 'bg-blue-600', icon: FacebookIcon },
    { name: labels.telegram, id: 'telegram', color: 'bg-blue-400', icon: TelegramIcon },
    { name: labels.pinterest, id: 'pinterest', color: 'bg-red-600', icon: PinterestIcon },
    { name: labels.threads, id: 'threads', color: 'bg-slate-900', icon: ThreadsIcon },
    { name: labels.bluesky, id: 'bluesky', color: 'bg-blue-400', icon: BlueskyIcon },
    { name: labels.bilibili, id: 'bilibili', color: 'bg-pink-400', icon: BilibiliIcon },
    { name: labels.discord, id: 'discord', color: 'bg-indigo-500', icon: DiscordIcon },
    { name: labels.lemon8, id: 'lemon8', color: 'bg-yellow-400', icon: Lemon8Icon },
  ];

  const sortedPlatforms = getSortedPlatforms(platformDefinitions);

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-20 max-w-4xl mx-auto">
      {sortedPlatforms.map((p) => {
        const Icon = p.icon;
        return (
          <Link 
            key={p.id}
            href={`/download-${p.id}-video${locale !== 'en' ? `?locale=${locale}` : ''}`} 
            title={p.name}
            className="group flex flex-col items-center gap-2"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${p.color} shadow-sm group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-110 ring-4 ring-transparent group-hover:ring-${p.color.replace('bg-', '')}/20`}>
              <Icon />
            </div>
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {p.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

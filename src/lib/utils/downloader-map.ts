import type { Locale } from '@/lib/i18n/ui';
import type { Platform } from '@/lib/extract/types';

export const DOWNLOADER_MAP: Record<Platform | 'instagram', string> = {
  twitter:   '/download-twitter-video',
  telegram:  '/download-telegram-video',
  tiktok:    '/download-tiktok-video',
  reddit:    '/download-reddit-video',
  facebook:  '/download-facebook-video',
  instagram: '/download-instagram-video',
  pinterest: '/download-pinterest-video',
  threads:   '/download-threads-video',
  bluesky:   '/download-bluesky-video',
  bilibili:  '/download-bilibili-video',
  discord:   '/download-discord-video',
  lemon8:    '/download-lemon8-video',
};

export const DOWNLOADER_CTA: Record<Locale, (platform: string) => string> = {
  en: (p) => `Download ${p.charAt(0).toUpperCase() + p.slice(1)} videos →`,
  ja: (p) => `${p.charAt(0).toUpperCase() + p.slice(1)} 動画を保存する →`,
  ar: (p) => `تنزيل مقاطع ${p.charAt(0).toUpperCase() + p.slice(1)} →`,
  es: (p) => `Descargar videos de ${p.charAt(0).toUpperCase() + p.slice(1)} →`,
  pt: (p) => `Baixar vídeos do ${p.charAt(0).toUpperCase() + p.slice(1)} →`,
  fr: (p) => `Télécharger des vidéos ${p.charAt(0).toUpperCase() + p.slice(1)} →`,
  id: (p) => `Unduh video ${p.charAt(0).toUpperCase() + p.slice(1)} →`,
  hi: (p) => `${p.charAt(0).toUpperCase() + p.slice(1)} वीडियो डाउनलोड करें →`,
  de: (p) => `${p.charAt(0).toUpperCase() + p.slice(1)}-Videos herunterladen →`,
  tr: (p) => `${p.charAt(0).toUpperCase() + p.slice(1)} videolarını indir →`,
};

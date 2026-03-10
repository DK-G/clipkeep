import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://clipkeep.com';
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/status`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/dmca`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/solution/telegram-video-downloader-not-working?locale=en`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}

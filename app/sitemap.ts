import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://clipkeep.net';
  const now = new Date();
  const locales = ['', '?locale=ja', '?locale=ar'];

  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/status', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/download-telegram-video', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/download-twitter-video', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/download-tiktok-video', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/download-instagram-video', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/blog/guide-to-media-archiving', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/legal/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/legal/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/legal/dmca', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/solution/telegram-video-downloader-not-working', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/telegram-trending-videos', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/twitter-trending-videos', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/tiktok-trending-videos', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/instagram-trending-videos', priority: 0.7, changeFrequency: 'daily' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${base}${route.path}${locale}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  return sitemapEntries;
}


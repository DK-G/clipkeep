import { keywordArticles } from '@/lib/blog/keyword-articles';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://clipkeep.net';
  const now = new Date();
  const allLocales = ['', '?locale=ja', '?locale=ar', '?locale=es', '?locale=pt', '?locale=fr', '?locale=id', '?locale=hi', '?locale=de', '?locale=tr'];
  const solutionLocales = ['', '?locale=ar'];

  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const, locales: allLocales },
    { path: '/faq', priority: 0.6, changeFrequency: 'weekly' as const, locales: allLocales },
    { path: '/status', priority: 0.7, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const, locales: allLocales },
    { path: '/download-telegram-video', priority: 0.9, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/download-twitter-video', priority: 0.9, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/download-tiktok-video', priority: 0.8, changeFrequency: 'weekly' as const, locales: allLocales },
    { path: '/download-instagram-video', priority: 0.8, changeFrequency: 'weekly' as const, locales: allLocales },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const, locales: ['', '?locale=es', '?locale=ar'] },
    { path: '/blog/guide-to-media-archiving', priority: 0.9, changeFrequency: 'monthly' as const, locales: allLocales },
    { path: '/legal/terms', priority: 0.5, changeFrequency: 'monthly' as const, locales: allLocales },
    { path: '/legal/privacy', priority: 0.5, changeFrequency: 'monthly' as const, locales: allLocales },
    { path: '/legal/dmca', priority: 0.5, changeFrequency: 'monthly' as const, locales: allLocales },
    { path: '/solution/telegram-video-downloader-not-working', priority: 0.8, changeFrequency: 'weekly' as const, locales: solutionLocales },
    { path: '/telegram-trending-videos', priority: 0.7, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/twitter-trending-videos', priority: 0.7, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/tiktok-trending-videos', priority: 0.7, changeFrequency: 'daily' as const, locales: allLocales },
    { path: '/instagram-trending-videos', priority: 0.7, changeFrequency: 'daily' as const, locales: allLocales },
  ];


  const blogKeywordRoutes = keywordArticles.map((a) => ({
    path: `/blog/${a.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
    locales: ['', '?locale=es', '?locale=ar'],
  }));
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of [...routes, ...blogKeywordRoutes]) {
    for (const locale of route.locales) {
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

import { keywordArticles } from '@/lib/blog/keyword-articles';
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

const coreLocales = ['', '?locale=ja', '?locale=es', '?locale=pt', '?locale=de'];
const enOnly = [''];
const solutionLocales = ['', '?locale=ja'];

const priorityBlogSlugs = new Set([
  'how-to-download-twitter-videos',
  'twitter-video-downloader-2026',
  'twitter-gif-download',
  'tiktok-video-download-no-watermark',
  'how-to-save-tiktok-without-watermark',
  'tiktok-video-downloader-2026',
  'telegram-video-download',
  'telegram-video-downloader-online',
  'telegram-video-download-link',
  'best-twitter-video-downloader-2026',
  'best-tiktok-downloader-without-watermark',
  'video-downloader-safe-or-not',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/trending', priority: 0.8, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/latest', priority: 0.8, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/download-twitter-video', priority: 0.9, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/download-tiktok-video', priority: 0.9, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/download-telegram-video', priority: 0.9, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/trending/twitter', priority: 0.7, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/trending/tiktok', priority: 0.7, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/latest/twitter', priority: 0.7, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/latest/tiktok', priority: 0.7, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const, locales: enOnly },
    { path: '/faq', priority: 0.6, changeFrequency: 'weekly' as const, locales: enOnly },
    { path: '/status', priority: 0.7, changeFrequency: 'daily' as const, locales: enOnly },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const, locales: enOnly },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const, locales: coreLocales },
    { path: '/blog/guide-to-media-archiving', priority: 0.9, changeFrequency: 'monthly' as const, locales: enOnly },
    { path: '/legal/terms', priority: 0.5, changeFrequency: 'monthly' as const, locales: enOnly },
    { path: '/legal/privacy', priority: 0.5, changeFrequency: 'monthly' as const, locales: enOnly },
    { path: '/legal/dmca', priority: 0.5, changeFrequency: 'monthly' as const, locales: enOnly },
    { path: '/solution/telegram-video-downloader-not-working', priority: 0.8, changeFrequency: 'weekly' as const, locales: solutionLocales },
  ];

  const blogKeywordRoutes = keywordArticles
    .filter((article) => priorityBlogSlugs.has(article.slug))
    .map((article) => ({
      path: `/blog/${article.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      locales: coreLocales,
    }));

  const solutionPaths = Array.from(new Set(
    keywordArticles
      .map((a) => a.supportPath)
      .filter((p) => p.startsWith('/solution/'))
  ));

  const solutionRoutes = solutionPaths
    .filter((path) => path !== '/solution/telegram-video-downloader-not-working')
    .map((path) => ({
      path,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
      locales: enOnly,
    }));

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const combinedRoutes = [...routes, ...blogKeywordRoutes, ...solutionRoutes];

  for (const route of combinedRoutes) {
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

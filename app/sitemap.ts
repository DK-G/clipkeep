import type { MetadataRoute } from "next";
import { keywordArticles } from "@/lib/blog/keyword-articles";

const BASE_URL = "https://clipkeep.net";

// All supported locales
const ALL_LOCALES = ["en", "ja", "ar", "es", "pt", "fr", "id", "hi", "de", "tr"] as const;
// Primary locales used for content-heavy pages (blog, solution)
const PRIMARY_LOCALES = ["en", "ja", "es", "pt"] as const;

const DOWNLOADER_PATHS = [
  "/download-twitter-video",
  "/download-tiktok-video",
  "/download-telegram-video",
  "/download-reddit-video",
  "/download-pinterest-video",
  "/download-facebook-video",
  "/download-threads-video",
  "/download-bluesky-video",
  "/download-lemon8-video",
  "/download-bilibili-video",
  "/download-discord-video",
  "/download-instagram-video",
];

const GALLERY_PLATFORMS = [
  "tiktok", "twitter", "reddit", "facebook", "telegram",
  "pinterest", "threads", "bluesky", "bilibili", "discord", "lemon8",
];

const STATIC_PATHS = ["/about", "/faq", "/contact", "/status", "/blog", "/trending", "/latest"];
const LEGAL_PATHS = ["/legal/privacy", "/legal/terms", "/legal/dmca", "/legal/cookies"];

const SOLUTION_SLUGS = [
  "extractor-temporary-limited",
  "telegram-video-downloader-not-working",
  "twitter-video-downloader-not-working",
  "tiktok-video-downloader-not-working",
  "reddit-video-downloader-not-working",
  "facebook-video-downloader-not-working",
  "bilibili-video-downloader-not-working",
  "discord-video-downloader-not-working",
  "instagram-downloader-not-working",
  "video-download-not-working-on-iphone",
  "video-download-not-working-on-android",
  "download-not-working-on-chrome",
  "download-not-working-private-account",
  "how-to-download-without-watermark",
  "video-download-slow",
  "video-downloader-safe-guide",
  "is-video-downloader-legal",
  "video-format-mp4-vs-webm",
  "best-quality-download-settings",
  "twitter-video-download-2026",
  "tiktok-download-2026",
];

function localeUrl(path: string, locale: string): string {
  const base = `${BASE_URL}${path}`;
  if (locale === "en") return base;
  const sep = path.includes("?") ? "&" : "?";
  return `${base}${sep}locale=${locale}`;
}

function makeEntries(
  path: string,
  locales: readonly string[],
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localeUrl(path, locale),
    lastModified: lastModified ?? new Date("2026-04-30"),
    changeFrequency,
    priority,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Home ──────────────────────────────────────────────────────────────────
  entries.push(...makeEntries("/", ALL_LOCALES, 1.0, "daily"));

  // ── Downloader pages ──────────────────────────────────────────────────────
  for (const path of DOWNLOADER_PATHS) {
    entries.push(...makeEntries(path, ALL_LOCALES, 0.9, "weekly"));
  }

  // ── Trending / Latest index ───────────────────────────────────────────────
  entries.push(...makeEntries("/trending", ALL_LOCALES, 0.7, "daily"));
  entries.push(...makeEntries("/latest", ALL_LOCALES, 0.7, "daily"));

  // ── Trending / Latest per platform ───────────────────────────────────────
  for (const platform of GALLERY_PLATFORMS) {
    entries.push(...makeEntries(`/trending/${platform}`, ALL_LOCALES, 0.6, "daily"));
    entries.push(...makeEntries(`/latest/${platform}`, ALL_LOCALES, 0.6, "daily"));
  }

  // ── Static pages ──────────────────────────────────────────────────────────
  for (const path of STATIC_PATHS) {
    entries.push(...makeEntries(path, ALL_LOCALES, 0.5, "monthly"));
  }

  // ── Legal pages (primary locales only) ───────────────────────────────────
  for (const path of LEGAL_PATHS) {
    entries.push(...makeEntries(path, PRIMARY_LOCALES, 0.3, "yearly"));
  }

  // ── Blog articles (primary locales) ──────────────────────────────────────
  // Static guide article
  entries.push(
    ...makeEntries("/blog/guide-to-media-archiving", PRIMARY_LOCALES, 0.7, "monthly"),
  );
  // Dynamic keyword articles
  for (const article of keywordArticles) {
    entries.push(
      ...makeEntries(`/blog/${article.slug}`, PRIMARY_LOCALES, 0.7, "monthly"),
    );
  }

  // ── Solution pages (primary locales) ─────────────────────────────────────
  for (const slug of SOLUTION_SLUGS) {
    entries.push(...makeEntries(`/solution/${slug}`, PRIMARY_LOCALES, 0.6, "monthly"));
  }

  return entries;
}

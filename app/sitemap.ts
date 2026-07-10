import type { MetadataRoute } from "next";
import { keywordArticles } from "@/lib/blog/keyword-articles";
import { buildLocaleAlternates, getLocalizedUrl } from "@/lib/metadata-helper";
import type { Locale } from "@/lib/i18n/ui";
import { pages } from "@/lib/solution-pages/store";
import { loadLiveTopics } from "@/lib/trends/live";

// Live trend topics are written to KV at runtime by the hourly cron, so the
// sitemap must execute per request (no static cache of the KV-sourced section).
export const dynamic = "force-dynamic";

// Only list URLs that are canonical for themselves: the English page plus the
// /ja /pt /ar path versions. Query-param locale views canonicalize to the
// English page, so submitting them would only produce
// "Duplicate, submitted URL not selected as canonical" noise in Search Console.
const CANONICAL_LOCALES = ["en", "ja", "pt", "ar"] as const satisfies readonly Locale[];
const ALL_LOCALES = CANONICAL_LOCALES;
const PRIMARY_LOCALES = CANONICAL_LOCALES;

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

const SOLUTION_SLUGS = Array.from(new Set(pages.map((p) => p.slug)));

function makeEntries(
  path: string,
  locales: readonly Locale[],
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: getLocalizedUrl(path, locale),
    lastModified: lastModified ?? new Date("2026-04-30"),
    changeFrequency,
    priority,
    alternates: {
      languages: buildLocaleAlternates(path).languages,
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // ── Platform status (Track A linkable asset, English-only data page) ──────
  entries.push({
    url: getLocalizedUrl("/platform-status", "en"),
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.6,
  });

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

  // ── Trend topic hubs (柱2 P0-3) ──────────────────────────────────────────
  // Only gate-passing live topics enter the sitemap; thin/below-gate/decayed
  // topics are withheld. loadLiveTopics() is empty-safe (KV miss → no entries),
  // so this section is a no-op until the cron has captured qualifying topics.
  const liveTopics = await loadLiveTopics();
  for (const topic of liveTopics) {
    const path = `/trend/${topic.slug}`;
    const lastModified = new Date(topic.lastTrendedAt);
    const lastMod = Number.isNaN(lastModified.getTime()) ? new Date() : lastModified;
    entries.push(...makeEntries(path, ALL_LOCALES, 0.6, "daily", lastMod));
  }

  return entries;
}

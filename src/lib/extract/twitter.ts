import { isTwitterShortHost, normalizeTwitterInputUrl } from "./twitter-url";
import { normalizeMediaUrl, fetchWithTimeout } from "./m3u8";
import type { ExtractionMedia } from "./types";

interface FXTwitterResponse {
  tweet?: {
    media?: {
      all?: Array<{
        type: string;
        url: string;
        thumbnail_url?: string;
      }>;
    };
  };
  error?: string;
}

const PROVIDER_COOLDOWN_MS = 2 * 60 * 1000;
const providerCooldowns = new Map<string, number>();

function isProviderCoolingDown(provider: string): boolean {
  const until = providerCooldowns.get(provider);
  if (!until) return false;
  if (until <= Date.now()) {
    providerCooldowns.delete(provider);
    return false;
  }
  return true;
}

function markProviderBlocked(provider: string): void {
  providerCooldowns.set(provider, Date.now() + PROVIDER_COOLDOWN_MS);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function buildProxyDownloadUrl(url: string): string {
  return `/api/v1/extract/proxy?url=${encodeURIComponent(url)}&dl=1`;
}

function logTwitterEvent(event: string, payload: Record<string, unknown>): void {
  console.log(JSON.stringify({
    service: "extractor",
    platform: "twitter",
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  }));
}

async function normalizeTwitterMediaUrl(statusId: string, mediaUrl: string): Promise<string | null> {
  const normalized = await normalizeMediaUrl(mediaUrl);
  if (normalized) return normalized;

  // Direct fallback
  const directUrl = `https://d.fxtwitter.com/i/status/${statusId}`;
  try {
    const directRes = await fetchWithTimeout(directUrl, { method: "HEAD", redirect: "follow" });
    if (directRes.ok && /\.mp4(?:$|\?)/i.test(directRes.url)) {
      return directRes.url;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Extracts the status ID from various Twitter/X URL formats.
 */
export function extractStatusId(sourceUrl: string): string | null {
  try {
    const url = new URL(sourceUrl);
    const match = url.pathname.match(/status\/(\d+)/i);
    if (match?.[1]) return match[1];

    const onlyId = url.pathname.replace(/^\//, "").split("/")[0];
    if (/^\d+$/.test(onlyId)) return onlyId;

    return null;
  } catch {
    return null;
  }
}

async function resolveTwitterUrl(input: string): Promise<string> {
  const normalized = normalizeTwitterInputUrl(input);
  const host = new URL(normalized).hostname.toLowerCase();
  if (!isTwitterShortHost(host)) return normalized;

  try {
    const response = await fetchWithTimeout(normalized, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      return normalizeTwitterInputUrl(response.url);
    }
  } catch (error: unknown) {
    console.error("Error resolving X short URL:", getErrorMessage(error));
  }

  throw new Error("SHORT_URL_RESOLVE_FAILED");
}
function findMeta(html: string, key: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

async function scrapeFixer(url: string): Promise<ExtractionMedia[]> {
  const response = await fetchWithTimeout(url, {
    headers: {
      "User-Agent": "TelegramBot (like TwitterBot)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (response.status === 403 || response.status === 429) {
    throw new Error("BOT_CHALLENGED");
  }
  if (response.status === 404) {
    throw new Error("POST_NOT_FOUND");
  }
  if (!response.ok) {
    return [];
  }

  const html = await response.text();
  if (html.includes("cf-challenge") || html.includes("Check your browser")) {
    throw new Error("BOT_CHALLENGED");
  }
  if (html.toLowerCase().includes("this account is private") || html.toLowerCase().includes("post is unavailable")) {
    throw new Error("PRIVATE_OR_RESTRICTED");
  }

  const videoUrl =
    findMeta(html, "og:video") ||
    findMeta(html, "og:video:url") ||
    findMeta(html, "og:video:secure_url") ||
    findMeta(html, "twitter:player:stream");

  const thumbUrl = findMeta(html, "og:image") || findMeta(html, "twitter:image");

  if (videoUrl) {
    return [{ type: "video", url: videoUrl, downloadUrl: buildProxyDownloadUrl(videoUrl), thumbUrl: thumbUrl || undefined, sourcePath: "fixer" }];
  }
  if (thumbUrl) {
    return [{ type: "image", url: thumbUrl, downloadUrl: buildProxyDownloadUrl(thumbUrl), sourcePath: "fixer" }];
  }

  return [];
}

/**
 * Enhanced Twitter/X extraction with path-based fallback and error classification.
 */
export async function extractTwitter(sourceUrl: string): Promise<ExtractionMedia[]> {
  const resolvedUrl = await resolveTwitterUrl(sourceUrl);
  const statusId = extractStatusId(resolvedUrl);
  if (!statusId) {
    throw new Error("INVALID_X_URL");
  }

  const startTime = Date.now();
  logTwitterEvent("extract_start", { statusId });
  let sawBotChallenge = false;
  let rawMedia: ExtractionMedia[] = [];

  // 1. Try FX-API
  if (!isProviderCoolingDown("fx-api")) try {
    const apiRes = await fetchWithTimeout(`https://api.fxtwitter.com/i/status/${statusId}`, { cache: "no-store" });
    if (apiRes.status === 403 || apiRes.status === 429) {
      sawBotChallenge = true;
      markProviderBlocked("fx-api");
    } else if (apiRes.status === 404) {
      throw new Error("POST_NOT_FOUND");
    } else if (apiRes.ok) {
      const data = await apiRes.json() as FXTwitterResponse;
      if (data.tweet?.media?.all?.length) {
        rawMedia = data.tweet.media.all.map((media): ExtractionMedia => {
          const mappedType = media.type === "video" || media.type === "gif" ? "video" : "image";
          return {
            type: mappedType,
            url: media.url,
            thumbUrl: media.thumbnail_url || undefined,
            sourcePath: "api",
          };
        });
      } else {
        const errorText = data.error?.toLowerCase() || "";
        if (errorText.includes("private")) throw new Error("PRIVATE_OR_RESTRICTED");
        if (errorText.includes("not found") || errorText.includes("deleted")) throw new Error("POST_NOT_FOUND");
      }
    }
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    if (["POST_NOT_FOUND", "PRIVATE_OR_RESTRICTED"].includes(msg)) throw error;
    logTwitterEvent("provider_failed", { statusId, provider: "fx-api", error: msg });
  }

  // 2. Try Direct Fallback if API failed or returned no media
  if (rawMedia.length === 0 && !isProviderCoolingDown("fx-direct")) try {
    const directUrl = `https://d.fxtwitter.com/i/status/${statusId}`;
    const directRes = await fetchWithTimeout(directUrl, { method: "HEAD", redirect: "follow" });
    if (directRes.status === 403 || directRes.status === 429) {
      sawBotChallenge = true;
      markProviderBlocked("fx-direct");
    } else if (directRes.status === 404) {
      throw new Error("POST_NOT_FOUND");
    } else if (directRes.ok && /twimg\.com/.test(directRes.url)) {
      rawMedia = [{ type: "video", url: directRes.url, sourcePath: "direct" }];
    }
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    if (msg === "POST_NOT_FOUND") throw error;
    logTwitterEvent("provider_failed", { statusId, provider: "fx-direct", error: msg });
  }

  // 3. Try Fixer/Scraper
  if (rawMedia.length === 0) {
    const candidates = [
      `https://fxtwitter.com/i/status/${statusId}`,
      `https://vxtwitter.com/i/status/${statusId}`,
      `https://fixupx.com/i/status/${statusId}`,
    ];
    for (const candidate of candidates) {
      if (isProviderCoolingDown(`fixer:${candidate}`)) continue;
      try {
        const media = await scrapeFixer(candidate);
        if (media.length > 0) {
          rawMedia = media;
          break;
        }
      } catch (error: unknown) {
        const msg = getErrorMessage(error);
        logTwitterEvent("provider_failed", { statusId, provider: candidate, error: msg });
        if (msg === "BOT_CHALLENGED") markProviderBlocked(`fixer:${candidate}`);
      }
    }
  }

  // 4. FINAL NORMALIZATION PASS (Crucial: Resolves m3u8 for all providers)
  if (rawMedia.length > 0) {
    const normalized = await Promise.all(rawMedia.map(async (item): Promise<ExtractionMedia | null> => {
      if (item.type !== "video") {
        return { ...item, downloadUrl: buildProxyDownloadUrl(item.url) };
      }
      const normalizedUrl = await normalizeTwitterMediaUrl(statusId, item.url);
      if (!normalizedUrl) {
        logTwitterEvent("candidate_dropped", { statusId, reason: "m3u8_unresolved", url: item.url });
        return null;
      }
      return {
        ...item,
        url: normalizedUrl,
        downloadUrl: buildProxyDownloadUrl(normalizedUrl),
      };
    }));

    const filtered = normalized.filter((item): item is ExtractionMedia => item !== null);
    if (filtered.length > 0) {
      logTwitterEvent("extract_success", { statusId, durationMs: Date.now() - startTime, mediaCount: filtered.length });
      return filtered;
    }
  }

  if (sawBotChallenge) throw new Error("BOT_CHALLENGED");
  throw new Error("MEDIA_NOT_FOUND");
}



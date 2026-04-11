import { isTwitterShortHost, normalizeTwitterInputUrl } from "./twitter-url";

export interface TwitterMedia {
  type: "video" | "audio" | "image";
  url: string;
  downloadUrl?: string;
  thumbUrl?: string;
  sourcePath?: "api" | "direct" | "fixer";
}

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
    const response = await fetch(normalized, {
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

async function scrapeFixer(url: string): Promise<TwitterMedia[]> {
  const response = await fetch(url, {
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
export async function extractTwitter(sourceUrl: string): Promise<TwitterMedia[]> {
  const resolvedUrl = await resolveTwitterUrl(sourceUrl);
  const statusId = extractStatusId(resolvedUrl);
  if (!statusId) {
    throw new Error("INVALID_X_URL");
  }

  const startTime = Date.now();
  console.log(`[Twitter] Starting stabilized extraction for ID: ${statusId}`);
  let sawBotChallenge = false;

  if (!isProviderCoolingDown("fx-api")) try {
    const apiRes = await fetch(`https://api.fxtwitter.com/i/status/${statusId}`, { cache: "no-store" });

    if (apiRes.status === 403 || apiRes.status === 429) {
      sawBotChallenge = true;
      markProviderBlocked("fx-api");
      throw new Error("BOT_CHALLENGED");
    }
    if (apiRes.status === 404) {
      throw new Error("POST_NOT_FOUND");
    }

    if (apiRes.ok) {
      const data = await apiRes.json() as FXTwitterResponse;
      if (data.tweet?.media?.all?.length) {
        console.log(`[Twitter] Success via API path (${Date.now() - startTime}ms)`);
        return data.tweet.media.all.map((media) => ({
          type: media.type === "video" || media.type === "gif" ? "video" : "image",
          url: media.url,
          downloadUrl: buildProxyDownloadUrl(media.url),
          thumbUrl: media.thumbnail_url || undefined,
          sourcePath: "api",
        }));
      }

      const errorText = data.error?.toLowerCase() || "";
      if (errorText.includes("private")) {
        throw new Error("PRIVATE_OR_RESTRICTED");
      }
      if (errorText.includes("not found") || errorText.includes("deleted")) {
        throw new Error("POST_NOT_FOUND");
      }
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    if (["POST_NOT_FOUND", "PRIVATE_OR_RESTRICTED"].includes(errorMessage)) {
      throw error;
    }
    if (errorMessage === "BOT_CHALLENGED") sawBotChallenge = true;
    console.error("[Twitter] API path failed:", errorMessage);
  }

  if (!isProviderCoolingDown("fx-direct")) try {
    const directUrl = `https://d.fxtwitter.com/i/status/${statusId}`;
    const directRes = await fetch(directUrl, { method: "HEAD", redirect: "follow" });

    if (directRes.status === 403 || directRes.status === 429) {
      sawBotChallenge = true;
      markProviderBlocked("fx-direct");
      throw new Error("BOT_CHALLENGED");
    }
    if (directRes.status === 404) {
      throw new Error("POST_NOT_FOUND");
    }

    if (directRes.ok && (directRes.url.includes("twimg.com") || directRes.url.includes("video.twimg.com") || directRes.url.includes("pbs.twimg.com"))) {
      console.log(`[Twitter] Success via Direct path (${Date.now() - startTime}ms)`);
      return [{ type: "video", url: directRes.url, downloadUrl: buildProxyDownloadUrl(directRes.url), sourcePath: "direct" }];
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    if (["POST_NOT_FOUND"].includes(errorMessage)) {
      throw error;
    }
    if (errorMessage === "BOT_CHALLENGED") sawBotChallenge = true;
    console.error("[Twitter] Direct path failed:", errorMessage);
  }

  const candidates = [
    `https://fxtwitter.com/i/status/${statusId}`,
    `https://vxtwitter.com/i/status/${statusId}`,
    `https://fixupx.com/i/status/${statusId}`,
  ];

  let lastError = "MEDIA_NOT_FOUND";
  for (const candidate of candidates) {
    const providerKey = `fixer:${candidate}`;
    if (isProviderCoolingDown(providerKey)) continue;
    try {
      const media = await scrapeFixer(candidate);
      if (media.length > 0) {
        console.log(`[Twitter] Success via Fixer path (${candidate}) (${Date.now() - startTime}ms)`);
        return media;
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.warn(`[Twitter] Fixer candidate ${candidate} failed:`, errorMessage);
      if (errorMessage === "BOT_CHALLENGED") {
        sawBotChallenge = true;
        markProviderBlocked(providerKey);
      }
      if (["POST_NOT_FOUND", "PRIVATE_OR_RESTRICTED"].includes(errorMessage)) {
        lastError = errorMessage;
      }
    }
  }

  if (sawBotChallenge) throw new Error("BOT_CHALLENGED");
  throw new Error(lastError);
}



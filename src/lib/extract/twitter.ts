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
const FETCH_TIMEOUT_MS = 10000;

type FetchInit = RequestInit & { timeoutMs?: number };

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

async function fetchWithTimeout(url: string, init: FetchInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? FETCH_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function isM3u8ByUrl(url: string): boolean {
  return /\.m3u8(?:$|\?)/i.test(url);
}

function getContentType(value: string | null): string {
  return (value || "").split(";")[0].trim().toLowerCase();
}

async function probeContentType(url: string): Promise<string | null> {
  try {
    const head = await fetchWithTimeout(url, { method: "HEAD", redirect: "follow" });
    if (head.ok) {
      const ct = getContentType(head.headers.get("content-type"));
      if (ct) return ct;
    }
  } catch {
    // fall back to range GET
  }

  try {
    const get = await fetchWithTimeout(url, {
      method: "GET",
      redirect: "follow",
      headers: { Range: "bytes=0-0" },
    });
    if (get.ok || get.status === 206) {
      const ct = getContentType(get.headers.get("content-type"));
      if (ct) return ct;
    }
  } catch {
    // ignore probe errors
  }
  return null;
}

function isM3u8ContentType(contentType: string | null): boolean {
  return contentType === "application/x-mpegurl" || contentType === "application/vnd.apple.mpegurl";
}

function joinM3u8Url(baseUrl: string, line: string): string {
  try {
    return new URL(line, baseUrl).toString();
  } catch {
    return line;
  }
}

async function resolveM3u8ToMp4(playlistUrl: string): Promise<string | null> {
  const res = await fetchWithTimeout(playlistUrl, {
    method: "GET",
    redirect: "follow",
    headers: { Accept: "application/vnd.apple.mpegurl,text/plain,*/*" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const text = await res.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  const directMp4 = lines.find((line) => /\.mp4(?:$|\?)/i.test(line));
  if (directMp4) {
    return joinM3u8Url(playlistUrl, directMp4);
  }

  const childPlaylist = lines.find((line) => /\.m3u8(?:$|\?)/i.test(line));
  if (childPlaylist) {
    const nested = joinM3u8Url(playlistUrl, childPlaylist);
    const nestedRes = await fetchWithTimeout(nested, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "application/vnd.apple.mpegurl,text/plain,*/*" },
      cache: "no-store",
    });
    if (!nestedRes.ok) return null;
    const nestedText = await nestedRes.text();
    const nestedLines = nestedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
    const nestedMp4 = nestedLines.find((line) => /\.mp4(?:$|\?)/i.test(line));
    if (nestedMp4) {
      return joinM3u8Url(nested, nestedMp4);
    }
  }

  return null;
}

async function normalizeTwitterMediaUrl(statusId: string, mediaUrl: string): Promise<string | null> {
  if (!isM3u8ByUrl(mediaUrl)) {
    const contentType = await probeContentType(mediaUrl);
    if (!isM3u8ContentType(contentType)) return mediaUrl;
  }

  const resolvedFromPlaylist = await resolveM3u8ToMp4(mediaUrl);
  if (resolvedFromPlaylist) {
    return resolvedFromPlaylist;
  }

  const directUrl = `https://d.fxtwitter.com/i/status/${statusId}`;
  try {
    const directRes = await fetchWithTimeout(directUrl, { method: "HEAD", redirect: "follow" });
    if (directRes.ok && /\.mp4(?:$|\?)/i.test(directRes.url)) {
      return directRes.url;
    }
  } catch {
    // ignore direct fallback errors
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

async function scrapeFixer(url: string): Promise<TwitterMedia[]> {
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
export async function extractTwitter(sourceUrl: string): Promise<TwitterMedia[]> {
  const resolvedUrl = await resolveTwitterUrl(sourceUrl);
  const statusId = extractStatusId(resolvedUrl);
  if (!statusId) {
    throw new Error("INVALID_X_URL");
  }

  const startTime = Date.now();
  logTwitterEvent("extract_start", { statusId });
  let sawBotChallenge = false;

  if (!isProviderCoolingDown("fx-api")) try {
    const apiRes = await fetchWithTimeout(`https://api.fxtwitter.com/i/status/${statusId}`, { cache: "no-store" });

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
        const normalizedMedia: Array<TwitterMedia | null> = await Promise.all(data.tweet.media.all.map(async (media): Promise<TwitterMedia | null> => {
          const mappedType = media.type === "video" || media.type === "gif" ? "video" : "image";
          if (mappedType !== "video") {
            return {
              type: "image" as const,
              url: media.url,
              downloadUrl: buildProxyDownloadUrl(media.url),
              thumbUrl: media.thumbnail_url || undefined,
              sourcePath: "api" as const,
            };
          }
          const normalizedUrl = await normalizeTwitterMediaUrl(statusId, media.url);
          if (!normalizedUrl) {
            logTwitterEvent("candidate_dropped", {
              statusId,
              reason: "m3u8_unresolved",
              candidateUrl: media.url,
            });
            return null;
          }
          return {
            type: "video" as const,
            url: normalizedUrl,
            downloadUrl: buildProxyDownloadUrl(normalizedUrl),
            thumbUrl: media.thumbnail_url || undefined,
            sourcePath: "api" as const,
          };
        }));
        const filtered = normalizedMedia.filter((item): item is TwitterMedia => item !== null);
        if (filtered.length > 0) {
          logTwitterEvent("extract_success", {
            statusId,
            sourcePath: "api",
            durationMs: Date.now() - startTime,
            mediaCount: filtered.length,
          });
          return filtered;
        }
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
    logTwitterEvent("provider_failed", {
      statusId,
      provider: "fx-api",
      error: errorMessage,
    });
  }

  if (!isProviderCoolingDown("fx-direct")) try {
    const directUrl = `https://d.fxtwitter.com/i/status/${statusId}`;
    const directRes = await fetchWithTimeout(directUrl, { method: "HEAD", redirect: "follow" });

    if (directRes.status === 403 || directRes.status === 429) {
      sawBotChallenge = true;
      markProviderBlocked("fx-direct");
      throw new Error("BOT_CHALLENGED");
    }
    if (directRes.status === 404) {
      throw new Error("POST_NOT_FOUND");
    }

    if (directRes.ok && (directRes.url.includes("twimg.com") || directRes.url.includes("video.twimg.com") || directRes.url.includes("pbs.twimg.com"))) {
      logTwitterEvent("extract_success", {
        statusId,
        sourcePath: "direct",
        durationMs: Date.now() - startTime,
        mediaCount: 1,
      });
      return [{ type: "video", url: directRes.url, downloadUrl: buildProxyDownloadUrl(directRes.url), sourcePath: "direct" }];
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    if (["POST_NOT_FOUND"].includes(errorMessage)) {
      throw error;
    }
    if (errorMessage === "BOT_CHALLENGED") sawBotChallenge = true;
    logTwitterEvent("provider_failed", {
      statusId,
      provider: "fx-direct",
      error: errorMessage,
    });
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
        logTwitterEvent("extract_success", {
          statusId,
          sourcePath: "fixer",
          provider: candidate,
          durationMs: Date.now() - startTime,
          mediaCount: media.length,
        });
        return media;
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      logTwitterEvent("provider_failed", {
        statusId,
        provider: candidate,
        error: errorMessage,
      });
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



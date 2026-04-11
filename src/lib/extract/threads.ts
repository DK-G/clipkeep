import type { ExtractionMedia } from "./types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function buildProxyDownloadUrl(url: string): string {
  return "/api/v1/extract/proxy?url=" + encodeURIComponent(url) + "&dl=1";
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

export function normalizeThreadsUrl(inputUrl: string): string {
  const parsed = new URL(inputUrl.trim());
  parsed.protocol = "https:";
  parsed.search = "";
  parsed.hash = "";

  if (!["www.threads.net", "threads.net", "www.threads.com", "threads.com"].includes(parsed.hostname)) {
    throw new Error("UNSUPPORTED_URL");
  }

  parsed.hostname = "www.threads.com";

  const isHandlePost = /^\/@[^/]+\/post\/[^/]+$/i.test(parsed.pathname);
  const isShortcode = /^\/t\/[^/]+$/i.test(parsed.pathname);
  if (!isHandlePost && !isShortcode) {
    throw new Error("UNSUPPORTED_URL");
  }

  return `${parsed.origin}${parsed.pathname}`;
}

export async function extractThreads(url: string): Promise<ExtractionMedia[]> {
  try {
    const normalizedUrl = normalizeThreadsUrl(url);
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }
    if (response.status === 403) {
      throw new Error("ANTI_BOT_BLOCKED");
    }
    if (response.status === 401) {
      throw new Error("PRIVATE_OR_RESTRICTED");
    }
    if (response.status === 404) {
      throw new Error("POST_NOT_FOUND");
    }
    if (!response.ok) {
      throw new Error("UPSTREAM_TEMPORARY_FAILURE");
    }

    const html = await response.text();
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes("login") && lowerHtml.includes("threads")) {
      throw new Error("PRIVATE_OR_RESTRICTED");
    }
    if ((lowerHtml.includes("age") && lowerHtml.includes("restricted")) || lowerHtml.includes("age gate")) {
      throw new Error("AGE_GATED");
    }

    const videoUrl =
      findMeta(html, "og:video") ||
      findMeta(html, "og:video:url") ||
      findMeta(html, "og:video:secure_url");
    const thumbUrl = findMeta(html, "og:image") || findMeta(html, "twitter:image");
    const title = findMeta(html, "og:title") || findMeta(html, "twitter:title") || undefined;

    if (videoUrl) {
      return [{
        type: "video",
        url: videoUrl,
        downloadUrl: buildProxyDownloadUrl(videoUrl),
        thumbUrl: thumbUrl || undefined,
        title,
        sourcePath: "threads-og-video",
      }];
    }

    if (thumbUrl) {
      return [{
        type: "image",
        url: thumbUrl,
        downloadUrl: buildProxyDownloadUrl(thumbUrl),
        thumbUrl: thumbUrl || undefined,
        title,
        sourcePath: "threads-og-image",
      }];
    }

    if (findMeta(html, "og:title") || findMeta(html, "twitter:title")) {
      throw new Error("UPSTREAM_FORMAT_CHANGED");
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Threads extraction failed:", getErrorMessage(error));
    throw error;
  }
}

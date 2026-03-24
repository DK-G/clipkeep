import type { ExtractionMedia } from "./types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function normalizeBlueskyUrl(inputUrl: string): string {
  const parsed = new URL(inputUrl.trim());
  parsed.protocol = "https:";
  parsed.search = "";
  parsed.hash = "";

  if (parsed.hostname !== "bsky.app") {
    throw new Error("UNSUPPORTED_URL");
  }
  if (!/^\/profile\/[^/]+\/post\/[^/]+$/i.test(parsed.pathname)) {
    throw new Error("UNSUPPORTED_URL");
  }

  return `${parsed.origin}${parsed.pathname}`;
}

export async function extractBluesky(url: string): Promise<ExtractionMedia[]> {
  try {
    const normalizedUrl = normalizeBlueskyUrl(url);
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    if (response.status === 403 || response.status === 429) {
      throw new Error("UPSTREAM_TEMPORARY_FAILURE");
    }
    if (response.status === 404) {
      throw new Error("POST_NOT_FOUND");
    }
    if (!response.ok) {
      throw new Error("UPSTREAM_TEMPORARY_FAILURE");
    }

    const html = await response.text();
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes("not found")) {
      throw new Error("POST_NOT_FOUND");
    }

    const videoUrl = html.match(/<meta[^>]+property="og:video:url"[^>]+content="([^"]+)"/)?.[1]
      || html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];
    const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];

    if (videoUrl) {
      return [{
        type: "video",
        url: videoUrl,
        thumbUrl,
        title,
        sourcePath: "bluesky-og-video",
      }];
    }

    if (thumbUrl) {
      return [{
        type: "image",
        url: thumbUrl,
        thumbUrl,
        title,
        sourcePath: "bluesky-og-image",
      }];
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Bluesky extraction failed:", getErrorMessage(error));
    throw error;
  }
}


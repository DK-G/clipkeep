import type { ExtractionMedia } from "./types";

const PUBLIC_API_BASE = "https://public.api.bsky.app/xrpc";

type BlueskyUrlParts = {
  normalizedUrl: string;
  handle: string;
  postId: string;
};

type ResolveHandleResponse = {
  did?: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseBlueskyUrl(inputUrl: string): BlueskyUrlParts {
  const parsed = new URL(inputUrl.trim());
  parsed.protocol = "https:";
  parsed.search = "";
  parsed.hash = "";

  if (parsed.hostname === "www.bsky.app") {
    parsed.hostname = "bsky.app";
  }
  if (parsed.hostname !== "bsky.app") {
    throw new Error("UNSUPPORTED_URL");
  }

  const match = parsed.pathname.match(/^\/profile\/([^/]+)\/post\/([^/]+)$/i);
  if (!match) {
    throw new Error("UNSUPPORTED_URL");
  }

  return {
    normalizedUrl: `${parsed.origin}${parsed.pathname}`,
    handle: decodeURIComponent(match[1]),
    postId: decodeURIComponent(match[2]),
  };
}

async function resolveHandleToDid(handle: string): Promise<string> {
  const endpoint = `${PUBLIC_API_BASE}/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;
  const response = await fetch(endpoint, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ClipKeep/1.0; +https://clipkeep.net)",
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("POST_NOT_FOUND");
  }
  if (response.status === 403 || response.status === 429) {
    throw new Error("UPSTREAM_TEMPORARY_FAILURE");
  }
  if (!response.ok) {
    throw new Error("UPSTREAM_TEMPORARY_FAILURE");
  }

  const payload = await response.json() as ResolveHandleResponse;
  if (!payload.did) {
    throw new Error("POST_NOT_FOUND");
  }

  return payload.did;
}

function collectUrls(node: unknown, found: { videoUrl?: string; imageUrl?: string; thumbUrl?: string; title?: string }): void {
  if (!node || typeof node !== "object") {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectUrls(item, found);
    }
    return;
  }

  const record = node as Record<string, unknown>;

  const candidateTextKeys = ["title", "text", "alt"];
  for (const key of candidateTextKeys) {
    const value = record[key];
    if (!found.title && typeof value === "string" && value.trim()) {
      found.title = value.trim();
      break;
    }
  }

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && value.startsWith("http")) {
      const lowerKey = key.toLowerCase();
      const lowerValue = value.toLowerCase();

      if (!found.videoUrl && (lowerKey.includes("playlist") || lowerValue.includes("video.bsky.app") || lowerValue.endsWith(".m3u8"))) {
        found.videoUrl = value;
      } else if (!found.imageUrl && (lowerKey.includes("fullsize") || lowerValue.includes("cdn.bsky.app/img") || lowerValue.includes("com.atproto.sync.getblob"))) {
        found.imageUrl = value;
      } else if (!found.thumbUrl && (lowerKey.includes("thumb") || lowerKey.includes("thumbnail"))) {
        found.thumbUrl = value;
      }
    } else {
      collectUrls(value, found);
    }
  }
}

async function extractViaPublicApi(handle: string, postId: string): Promise<ExtractionMedia[]> {
  const did = await resolveHandleToDid(handle);
  const uri = `at://${did}/app.bsky.feed.post/${postId}`;
  const endpoint = `${PUBLIC_API_BASE}/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=0&parentHeight=0`;
  const response = await fetch(endpoint, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ClipKeep/1.0; +https://clipkeep.net)",
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("POST_NOT_FOUND");
  }
  if (response.status === 403 || response.status === 429) {
    throw new Error("UPSTREAM_TEMPORARY_FAILURE");
  }
  if (!response.ok) {
    throw new Error("UPSTREAM_TEMPORARY_FAILURE");
  }

  const payload = await response.json() as unknown;
  const found: { videoUrl?: string; imageUrl?: string; thumbUrl?: string; title?: string } = {};
  collectUrls(payload, found);

  if (found.videoUrl) {
    return [{
      type: "video",
      url: found.videoUrl,
      thumbUrl: found.thumbUrl || found.imageUrl,
      title: found.title,
      sourcePath: "bluesky-public-api-video",
    }];
  }

  if (found.imageUrl) {
    return [{
      type: "image",
      url: found.imageUrl,
      thumbUrl: found.thumbUrl || found.imageUrl,
      title: found.title,
      sourcePath: "bluesky-public-api-image",
    }];
  }

  return [];
}

async function extractViaHtml(normalizedUrl: string): Promise<ExtractionMedia[]> {
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

  const extractMeta = (property: string): string | undefined => {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }
    return undefined;
  };

  const videoUrl = extractMeta("og:video:url") || extractMeta("og:video");
  const thumbUrl = extractMeta("og:image");
  const title = extractMeta("og:title");

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

  return [];
}

export async function extractBluesky(url: string): Promise<ExtractionMedia[]> {
  try {
    const { normalizedUrl, handle, postId } = parseBlueskyUrl(url);

    try {
      const apiResults = await extractViaPublicApi(handle, postId);
      if (apiResults.length > 0) {
        return apiResults;
      }
    } catch (error: unknown) {
      console.warn("Bluesky public API extraction failed:", getErrorMessage(error));
      if (getErrorMessage(error) === "POST_NOT_FOUND") {
        throw error;
      }
    }

    const htmlResults = await extractViaHtml(normalizedUrl);
    if (htmlResults.length > 0) {
      return htmlResults;
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Bluesky extraction failed:", getErrorMessage(error));
    throw error;
  }
}

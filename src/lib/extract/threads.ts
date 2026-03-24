import type { ExtractionMedia } from "./types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function normalizeThreadsUrl(inputUrl: string): string {
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

    if (response.status === 403 || response.status === 429) {
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

    const videoUrl = html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];
    const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];

    if (videoUrl) {
      return [{
        type: "video",
        url: videoUrl,
        thumbUrl,
        title,
        sourcePath: "threads-og-video",
      }];
    }

    if (thumbUrl) {
      return [{
        type: "image",
        url: thumbUrl,
        thumbUrl,
        title,
        sourcePath: "threads-og-image",
      }];
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Threads extraction failed:", getErrorMessage(error));
    throw error;
  }
}


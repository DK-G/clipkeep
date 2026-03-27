import type { ExtractionMedia } from "./types";

function buildProxyDownloadUrl(url: string): string {
  return `/api/v1/extract/proxy?url=${encodeURIComponent(url)}&dl=1`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function normalizeLemon8Url(inputUrl: string): Promise<string> {
  const parsed = new URL(inputUrl.trim());
  parsed.protocol = "https:";

  if (parsed.hostname === "v.lemon8-app.com") {
    const response = await fetch(parsed.toString(), { method: "HEAD", redirect: "follow" });
    if (!response.ok) {
      throw new Error("SHORT_URL_RESOLVE_FAILED");
    }
    return normalizeLemon8Url(response.url);
  }

  if (!parsed.hostname.endsWith("lemon8-app.com")) {
    throw new Error("UNSUPPORTED_URL");
  }

  parsed.search = "";
  parsed.hash = "";
  parsed.pathname = parsed.pathname.replace(/\/$/, "");
  if (parsed.pathname.split("/").filter(Boolean).length < 2) {
    throw new Error("UNSUPPORTED_URL");
  }

  return `${parsed.origin}${parsed.pathname}`;
}

export async function extractLemon8(url: string): Promise<ExtractionMedia[]> {
  try {
    const normalizedUrl = await normalizeLemon8Url(url);
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
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
    if (lowerHtml.includes("region") && lowerHtml.includes("not available")) {
      throw new Error("REGION_RESTRICTED");
    }
    if (lowerHtml.includes("not found") || lowerHtml.includes("content unavailable")) {
      throw new Error("POST_NOT_FOUND");
    }

    const videoUrl = html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];
    const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];

    if (videoUrl) {
      return [{
        type: "video",
        url: videoUrl,
        downloadUrl: buildProxyDownloadUrl(videoUrl),
        thumbUrl,
        title,
        sourcePath: "lemon8-og-video",
      }];
    }

    if (thumbUrl) {
      return [{
        type: "image",
        url: thumbUrl,
        downloadUrl: buildProxyDownloadUrl(thumbUrl),
        thumbUrl,
        title,
        sourcePath: "lemon8-og-image",
      }];
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Lemon8 extraction failed:", getErrorMessage(error));
    throw error;
  }
}

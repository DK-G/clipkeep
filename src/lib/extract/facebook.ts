import type { ExtractionMedia } from "./types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function decodeEscapedUrl(value: string): string {
  return value.replace(/\\u0025/g, "%").replace(/\\\//g, "/").replace(/\\/g, "");
}

async function normalizeFacebookUrl(inputUrl: string): Promise<string> {
  const parsed = new URL(inputUrl.trim());
  parsed.protocol = "https:";

  if (parsed.hostname === "fb.watch") {
    const response = await fetch(parsed.toString(), { method: "HEAD", redirect: "follow" });
    if (!response.ok) {
      throw new Error("POST_NOT_FOUND");
    }
    return normalizeFacebookUrl(response.url);
  }

  if (!["www.facebook.com", "facebook.com", "m.facebook.com", "fb.com"].includes(parsed.hostname)) {
    throw new Error("UNSUPPORTED_URL");
  }

  parsed.hostname = "www.facebook.com";
  parsed.hash = "";

  const isWatch = parsed.pathname === "/watch" && parsed.searchParams.get("v");
  const isShare = /^\/share\/v\//i.test(parsed.pathname);
  const isReel = /^\/reel\//i.test(parsed.pathname);
  const isVideo = /^\/[^/]+\/videos\//i.test(parsed.pathname);
  const isPost = /\/posts\//i.test(parsed.pathname);

  if (!isWatch && !isShare && !isReel && !isVideo && !isPost) {
    throw new Error("UNSUPPORTED_URL");
  }

  if (isWatch) {
    return `https://www.facebook.com/watch/?v=${parsed.searchParams.get("v")}`;
  }

  parsed.search = "";
  return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}`;
}

export async function extractFacebook(url: string): Promise<ExtractionMedia[]> {
  try {
    const normalizedUrl = await normalizeFacebookUrl(url);
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (response.status === 401) {
      throw new Error("LOGIN_WALL");
    }
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
    if (lowerHtml.includes("log in or sign up") || lowerHtml.includes("you must log in")) {
      throw new Error("LOGIN_WALL");
    }
    if (lowerHtml.includes("content isn't available") || lowerHtml.includes("this page isn't available")) {
      throw new Error("POST_NOT_FOUND");
    }

    const videoUrl = html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1]
      || html.match(/<meta[^>]+property="og:video:url"[^>]+content="([^"]+)"/)?.[1]
      || html.match(/"video_url":"([^"]+)"/)?.[1];
    const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];

    if (videoUrl) {
      return [{
        type: "video",
        url: decodeEscapedUrl(videoUrl),
        thumbUrl,
        title,
        sourcePath: "facebook-og-video",
      }];
    }

    throw new Error("VIDEO_URL_NOT_RESOLVED");
  } catch (error: unknown) {
    console.error("Facebook extraction failed:", getErrorMessage(error));
    throw error;
  }
}


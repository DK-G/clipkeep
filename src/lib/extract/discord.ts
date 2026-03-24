import type { ExtractionMedia } from "./types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function normalizeDiscordUrl(inputUrl: string): string {
  const parsed = new URL(inputUrl.trim());
  parsed.protocol = "https:";

  if (parsed.hostname === "cdn.discordapp.com" || parsed.hostname === "media.discordapp.net") {
    return parsed.toString();
  }

  parsed.search = "";
  parsed.hash = "";
  if (parsed.hostname !== "discord.com") {
    throw new Error("UNSUPPORTED_URL");
  }
  if (!/^\/channels\//i.test(parsed.pathname)) {
    throw new Error("UNSUPPORTED_URL");
  }

  return `${parsed.origin}${parsed.pathname}`;
}

function inferDiscordMediaType(url: string): "video" | "image" {
  return /(\.mp4|\.webm|\.mov)(\?|$)/i.test(url) ? "video" : "image";
}

export async function extractDiscord(url: string): Promise<ExtractionMedia[]> {
  try {
    const normalizedUrl = normalizeDiscordUrl(url);
    const parsed = new URL(normalizedUrl);

    if (parsed.hostname === "cdn.discordapp.com" || parsed.hostname === "media.discordapp.net") {
      return [{
        type: inferDiscordMediaType(normalizedUrl),
        url: normalizedUrl,
        thumbUrl: inferDiscordMediaType(normalizedUrl) === "image" ? normalizedUrl : undefined,
        title: "Discord Media",
        sourcePath: "discord-direct-cdn",
      }];
    }

    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    if (response.status === 403 || response.status === 401) {
      throw new Error("PRIVATE_OR_RESTRICTED");
    }
    if (response.status === 404) {
      throw new Error("POST_NOT_FOUND");
    }
    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }
    if (!response.ok) {
      throw new Error("UPSTREAM_TEMPORARY_FAILURE");
    }

    const html = await response.text();
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes("access denied") || lowerHtml.includes("missing access")) {
      throw new Error("ACCESS_DENIED");
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
        sourcePath: "discord-og-video",
      }];
    }

    if (thumbUrl) {
      return [{
        type: "image",
        url: thumbUrl,
        thumbUrl,
        title,
        sourcePath: "discord-og-image",
      }];
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Discord extraction failed:", getErrorMessage(error));
    throw error;
  }
}


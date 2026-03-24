/**
 * Utility for extracting direct media links from public Telegram posts.
 */

export type TelegramMedia = {
  type: "video" | "image";
  url: string;
  thumbUrl?: string;
  title?: string;
  sourcePath?: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Normalizes a Telegram post URL to its embed-compatible form.
 */
export function normalizeTelegramUrl(url: string): string {
  const parsed = new URL(url.trim());
  parsed.protocol = "https:";

  if (parsed.hostname === "telegram.me") {
    parsed.hostname = "t.me";
  }

  const keepSingle = parsed.searchParams.has("single");
  parsed.search = "";

  if (parsed.pathname.startsWith("/s/")) {
    parsed.pathname = parsed.pathname.replace(/^\/s\//, "/");
  }

  parsed.pathname = parsed.pathname.replace(/\/$/, "");

  if (parsed.pathname.startsWith("/c/") || parsed.pathname === "" || parsed.pathname.split("/").filter(Boolean).length < 2) {
    throw new Error("UNSUPPORTED_URL");
  }

  parsed.searchParams.set("embed", "1");
  if (keepSingle) {
    parsed.searchParams.set("single", "1");
  }

  return parsed.toString();
}

function decodeHtmlUrl(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/\\\//g, "/")
    .replace(/&quot;/g, '"');
}

/**
 * Extracts media sources from Telegram embed HTML.
 */
export async function extractTelegram(sourceUrl: string): Promise<TelegramMedia[]> {
  const embedUrl = normalizeTelegramUrl(sourceUrl);

  try {
    const response = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.status === 403 || response.status === 401) {
      throw new Error("PRIVATE_OR_RESTRICTED");
    }
    if (response.status === 404) {
      throw new Error("MESSAGE_NOT_FOUND");
    }
    if (!response.ok) {
      throw new Error("UPSTREAM_TEMPORARY_FAILURE");
    }

    const html = await response.text();
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes("post not found") || lowerHtml.includes("message not found")) {
      throw new Error("MESSAGE_NOT_FOUND");
    }
    if (lowerHtml.includes("private channel") || lowerHtml.includes("private group") || lowerHtml.includes("you can view and join")) {
      throw new Error("PRIVATE_OR_RESTRICTED");
    }

    const mediaItems: TelegramMedia[] = [];
    const seenUrls = new Set<string>();

    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+property="twitter:title"[^>]+content="([^"]+)"/i)?.[1]
      || undefined;

    const globalThumbRaw = html.match(/background-image:url\(['"]?([^'")]+)['"]?\)/i)?.[1]
      || html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      || undefined;
    const globalThumb = globalThumbRaw ? decodeHtmlUrl(globalThumbRaw) : undefined;

    const videoPatterns = [
      /<video[^>]+src="([^"]+)"/gi,
      /<source[^>]+src="([^"]+)"/gi,
    ];

    for (const pattern of videoPatterns) {
      const matches = html.matchAll(pattern);
      for (const match of matches) {
        const mediaUrl = match[1] ? decodeHtmlUrl(match[1]) : "";
        if (mediaUrl && !seenUrls.has(mediaUrl)) {
          seenUrls.add(mediaUrl);
          mediaItems.push({
            type: "video",
            url: mediaUrl,
            thumbUrl: globalThumb,
            title,
            sourcePath: "telegram-embed-video",
          });
        }
      }
    }

    const imagePatterns = [
      /<a[^>]+class="[^"]*tgme_widget_message_photo_wrap[^"]*"[^>]+style="[^"]*background-image:url\(['"]?([^'")]+)['"]?\)/gi,
      /<img[^>]+src="([^"]+)"[^>]+class="[^"]*tgme_widget_message_photo[^"]*"/gi,
    ];

    if (mediaItems.length === 0) {
      for (const pattern of imagePatterns) {
        const matches = html.matchAll(pattern);
        for (const match of matches) {
          const imageUrl = match[1] ? decodeHtmlUrl(match[1]) : "";
          if (imageUrl && !seenUrls.has(imageUrl)) {
            seenUrls.add(imageUrl);
            mediaItems.push({
              type: "image",
              url: imageUrl,
              thumbUrl: imageUrl,
              title,
              sourcePath: "telegram-embed-image",
            });
          }
        }
      }
    }

    if (mediaItems.length === 0) {
      throw new Error("MEDIA_NOT_FOUND");
    }

    return mediaItems;
  } catch (error: unknown) {
    console.error("Error in extractTelegram:", getErrorMessage(error));
    throw error;
  }
}

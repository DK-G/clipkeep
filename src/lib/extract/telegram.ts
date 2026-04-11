/**
 * Utility for extracting direct media links from public Telegram posts.
 */

export type TelegramMedia = {
  type: "video" | "image";
  url: string;
  downloadUrl?: string;
  thumbUrl?: string;
  title?: string;
  text?: string;
  authorName?: string;
  authorHandle?: string;
  publishedAt?: string;
  groupIndex?: number;
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
  const host = parsed.hostname.toLowerCase();

  if (host !== "t.me" && host !== "telegram.me") {
    throw new Error("UNSUPPORTED_URL");
  }

  if (host === "telegram.me") {
    parsed.hostname = "t.me";
  }

  const keepSingle = parsed.searchParams.has("single");
  const keepMediaTimestamp = parsed.searchParams.get("media_timestamp");
  parsed.search = "";

  if (parsed.pathname.startsWith("/s/")) {
    parsed.pathname = parsed.pathname.replace(/^\/s\//, "/");
  }

  parsed.pathname = parsed.pathname.replace(/\/$/, "");
  const match = parsed.pathname.match(/^\/([A-Za-z0-9_]{5,})\/(\d+)$/);
  if (!match || parsed.pathname.startsWith("/c/")) {
    throw new Error("UNSUPPORTED_URL");
  }

  parsed.searchParams.set("embed", "1");
  if (keepSingle) {
    parsed.searchParams.set("single", "1");
  }
  if (keepMediaTimestamp) {
    parsed.searchParams.set("media_timestamp", keepMediaTimestamp);
  }

  return parsed.toString();
}

function decodeHtmlUrl(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/\\\//g, "/")
    .replace(/&quot;/g, '"');
}

function decodeHtmlText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#10;/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value: string): string {
  return decodeHtmlText(value.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "));
}

function buildProxyUrl(mediaUrl: string): string {
  return `/api/v1/extract/proxy?url=${encodeURIComponent(mediaUrl)}&dl=1`;
}

function getTelegramMetadata(html: string): {
  title?: string;
  text?: string;
  authorName?: string;
  authorHandle?: string;
  publishedAt?: string;
  thumbUrl?: string;
} {
  const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1]
    || html.match(/<meta[^>]+property="twitter:title"[^>]+content="([^"]+)"/i)?.[1]
    || undefined;

  const textBlock = html.match(/<div[^>]+class="[^"]*tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
  const text = textBlock ? stripHtml(textBlock) : undefined;

  const authorName = html.match(/<a[^>]+class="[^"]*tgme_widget_message_author_name[^"]*"[^>]*>([\s\S]*?)<\/a>/i)?.[1]
    || html.match(/<div[^>]+class="[^"]*tgme_widget_message_author[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    || undefined;

  const authorHref = html.match(/<a[^>]+class="[^"]*tgme_widget_message_author_name[^"]*"[^>]+href="([^"]+)"/i)?.[1];
  const authorHandle = authorHref?.match(/t\.me\/([^/?#]+)/i)?.[1];
  const publishedAt = html.match(/<time[^>]+datetime="([^"]+)"/i)?.[1] || undefined;

  const globalThumbRaw = html.match(/background-image:url\(['"]?([^'")]+)['"]?\)/i)?.[1]
    || html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
    || undefined;
  const thumbUrl = globalThumbRaw ? decodeHtmlUrl(globalThumbRaw) : undefined;

  return {
    title: title ? decodeHtmlText(title) : undefined,
    text,
    authorName: authorName ? stripHtml(authorName) : undefined,
    authorHandle,
    publishedAt,
    thumbUrl,
  };
}

/**
 * Extracts media sources from Telegram embed HTML.
 */
export async function extractTelegram(sourceUrl: string): Promise<TelegramMedia[]> {
  const embedUrl = normalizeTelegramUrl(sourceUrl);
  const originalUrl = new URL(sourceUrl.trim());
  const preferSingle = originalUrl.searchParams.has("single");
  const mediaTimestamp = originalUrl.searchParams.get("media_timestamp");

  try {
    const response = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.status === 429) {
      throw new Error("RATE_LIMITED");
    }
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
    if (lowerHtml.includes("too many requests") || lowerHtml.includes("retry later")) {
      throw new Error("RATE_LIMITED");
    }
    if (lowerHtml.includes("post not found") || lowerHtml.includes("message not found")) {
      throw new Error("MESSAGE_NOT_FOUND");
    }
    if (lowerHtml.includes("private channel") || lowerHtml.includes("private group") || lowerHtml.includes("you can view and join")) {
      throw new Error("PRIVATE_OR_RESTRICTED");
    }

    const metadata = getTelegramMetadata(html);
    const mediaItems: TelegramMedia[] = [];
    const seenUrls = new Set<string>();
    let groupIndex = 0;

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
            downloadUrl: buildProxyUrl(mediaUrl),
            thumbUrl: metadata.thumbUrl,
            title: metadata.text || metadata.title,
            text: metadata.text,
            authorName: metadata.authorName,
            authorHandle: metadata.authorHandle,
            publishedAt: metadata.publishedAt,
            groupIndex: groupIndex++,
            sourcePath: mediaTimestamp ? "telegram-embed-video-media-timestamp" : "telegram-embed-video",
          });
        }
      }
    }

    const imagePatterns = [
      /<a[^>]+class="[^"]*tgme_widget_message_photo_wrap[^"]*"[^>]+style="[^"]*background-image:url\(['"]?([^'")]+)['"]?\)/gi,
      /<img[^>]+src="([^"]+)"[^>]+class="[^"]*tgme_widget_message_photo[^"]*"/gi,
    ];

    for (const pattern of imagePatterns) {
      const matches = html.matchAll(pattern);
      for (const match of matches) {
        const imageUrl = match[1] ? decodeHtmlUrl(match[1]) : "";
        if (imageUrl && !seenUrls.has(imageUrl)) {
          seenUrls.add(imageUrl);
          mediaItems.push({
            type: "image",
            url: imageUrl,
            downloadUrl: buildProxyUrl(imageUrl),
            thumbUrl: imageUrl,
            title: metadata.text || metadata.title,
            text: metadata.text,
            authorName: metadata.authorName,
            authorHandle: metadata.authorHandle,
            publishedAt: metadata.publishedAt,
            groupIndex: groupIndex++,
            sourcePath: mediaTimestamp ? "telegram-embed-image-media-timestamp" : "telegram-embed-image",
          });
        }
      }
    }

    if (mediaItems.length === 0) {
      const ogVideoUrl = html.match(/<meta[^>]+property="og:video(?::url|:secure_url)?"[^>]+content="([^"]+)"/i)?.[1];
      if (ogVideoUrl) {
        const mediaUrl = decodeHtmlUrl(ogVideoUrl);
        mediaItems.push({
          type: "video",
          url: mediaUrl,
          downloadUrl: buildProxyUrl(mediaUrl),
          thumbUrl: metadata.thumbUrl,
          title: metadata.text || metadata.title,
          text: metadata.text,
          authorName: metadata.authorName,
          authorHandle: metadata.authorHandle,
          publishedAt: metadata.publishedAt,
          groupIndex: groupIndex++,
          sourcePath: "telegram-og-video-fallback",
        });
      }
    }

    if (mediaItems.length === 0 && metadata.thumbUrl) {
      mediaItems.push({
        type: "image",
        url: metadata.thumbUrl,
        downloadUrl: buildProxyUrl(metadata.thumbUrl),
        thumbUrl: metadata.thumbUrl,
        title: metadata.text || metadata.title,
        text: metadata.text,
        authorName: metadata.authorName,
        authorHandle: metadata.authorHandle,
        publishedAt: metadata.publishedAt,
        groupIndex: groupIndex++,
        sourcePath: "telegram-og-image-fallback",
      });
    }

    if (mediaItems.length === 0) {
      if (metadata.text || metadata.authorName || metadata.title) {
        throw new Error("UPSTREAM_FORMAT_CHANGED");
      }
      throw new Error("MEDIA_NOT_FOUND");
    }

    if (preferSingle && mediaItems.length > 1) {
      return [mediaItems[0]];
    }

    return mediaItems;
  } catch (error: unknown) {
    console.error("Error in extractTelegram:", getErrorMessage(error));
    throw error;
  }
}

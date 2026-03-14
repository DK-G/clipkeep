/**
 * Utility for extracting direct media links from public Telegram posts.
 */

export type TelegramMedia = {
  type: "video" | "image";
  url: string;
  thumbUrl?: string;
};

/**
 * Normalizes a Telegram URL to its embed version.
 */
export function normalizeTelegramUrl(url: string): string {
  const clean = url.trim().replace(/\/$/, "");
  if (clean.includes("?embed=1")) return clean;
  return `${clean}?embed=1`;
}

/**
 * Extracts all media sources (videos/images) from Telegram embed HTML.
 */
export async function extractTelegram(sourceUrl: string): Promise<TelegramMedia[]> {
  const embedUrl = normalizeTelegramUrl(sourceUrl);

  try {
    const response = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Telegram fetch failed: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const mediaItems: TelegramMedia[] = [];

    // 1. Scan for all video elements
    // Pattern: <video[^>]+src="([^"]+)"
    const videoMatches = html.matchAll(/<video[^>]+src="([^"]+)"/gi);
    for (const match of videoMatches) {
      if (match[1]) {
        mediaItems.push({
          type: "video",
          url: match[1],
        });
      }
    }

    // 2. Scan for thumbnails/images if needed
    // In albums, videos might be represented as <a> with background-image and a play icon.
    // We try to find the direct video links first as they are most accurate.
    
    // 3. Fallback for albums if no <video> tag is directly found (unlikely in embed but possible)
    if (mediaItems.length === 0) {
      // Find all source tags
      const sourceMatches = html.matchAll(/<source[^>]+src="([^"]+)"/gi);
      for (const match of sourceMatches) {
        if (match[1]) {
          mediaItems.push({
            type: "video",
            url: match[1],
          });
        }
      }
    }

    // 4. Try to associate thumbnails with media items
    // This is tricky in a single pass, so we'll look for general background-images as potential thumbnails
    const thumbMatch = html.match(/background-image:url\(['"]([^'"]+)['"]\)/i);
    const globalThumb = thumbMatch ? thumbMatch[1] : undefined;

    return mediaItems.map(item => ({
      ...item,
      thumbUrl: item.thumbUrl || globalThumb
    }));

  } catch (error) {
    console.error("Error in extractTelegram:", error);
    return [];
  }
}

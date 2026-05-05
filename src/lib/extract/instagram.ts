import type { ExtractionMedia } from "./types";
import { normalizeMediaUrl } from "./m3u8";

/**
 * Utility for extracting Instagram media using public fixers/proxies.
 */



/**
 * Resolves Instagram short URLs (ig.me) to canonical URLs.
 */
export async function resolveInstagramUrl(url: string): Promise<string> {
  if (!url.includes("ig.me") && !url.includes("on.instagram.com")) {
    return url;
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      // Remove query parameters to get the clean canonical URL
      const finalUrl = new URL(response.url);
      finalUrl.search = "";
      return finalUrl.toString();
    }
  } catch (error) {
    console.error("Error resolving Instagram URL:", error);
  }

  return url;
}

/**
 * Extracts Instagram media using ddinstagram.com (InstaFix).
 * It provides an easy way to scrape the direct media link from the OG tags.
 */
export async function extractInstagram(sourceUrl: string): Promise<ExtractionMedia[]> {
  try {
    const resolvedUrl = await resolveInstagramUrl(sourceUrl);
    
    // List of fixer domains in order of preference
    const fixers = ["ddinstagram.com", "instafix.app"];
    
    for (const domain of fixers) {
      const fixUrl = resolvedUrl.replace("instagram.com", domain);
      try {
        const response = await fetch(fixUrl, {
          headers: {
            "User-Agent": "TelegramBot",
          },
        });

        if (response.ok) {
          const html = await response.text();
          const videoMatch = html.match(/<meta property="og:video" content="([^"]+)"/i);
          const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
          const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
          const title = titleMatch?.[1];

          if (videoMatch?.[1]) {
            const videoUrl = videoMatch[1];
            const normalizedUrl = await normalizeMediaUrl(videoUrl);
            if (normalizedUrl) {
              return [{
                type: "video",
                url: normalizedUrl,
                downloadUrl: `/api/v1/extract/proxy?url=${encodeURIComponent(normalizedUrl)}&dl=1`,
                thumbUrl: imageMatch?.[1],
                title,
                sourcePath: `instagram-fixer-${domain}`,
              }];
            }
          }

          if (imageMatch?.[1]) {
            const imageUrl = imageMatch[1];
            return [{
              type: "image",
              url: imageUrl,
              downloadUrl: `/api/v1/extract/proxy?url=${encodeURIComponent(imageUrl)}&dl=1`,
              thumbUrl: imageUrl,
              title,
              sourcePath: `instagram-fixer-${domain}`,
            }];
          }
        }
      } catch (e) {
        console.warn(`Instagram fixer ${domain} failed:`, e);
      }
    }

    return [];
  } catch (error) {
    console.error("Error in extractInstagram:", error);
    throw error;
  }
}


/**
 * Utility for extracting Instagram media using public fixers/proxies.
 */

export type InstagramMedia = {
  type: "video" | "image";
  url: string;
  thumbUrl?: string;
};

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
export async function extractInstagram(sourceUrl: string): Promise<InstagramMedia[]> {
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
          const mediaItems: InstagramMedia[] = [];

          const videoMatch = html.match(/<meta property="og:video" content="([^"]+)"/i);
          if (videoMatch && videoMatch[1]) {
            mediaItems.push({
              type: "video",
              url: videoMatch[1],
            });
          }

          const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
          if (imageMatch && imageMatch[1] && mediaItems.length === 0) {
            mediaItems.push({
              type: "image",
              url: imageMatch[1],
            });
          }

          if (mediaItems.length > 0) {
            if (mediaItems[0].type === "video" && imageMatch && imageMatch[1]) {
              mediaItems[0].thumbUrl = imageMatch[1];
            }
            return mediaItems;
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


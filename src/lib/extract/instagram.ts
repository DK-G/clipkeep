/**
 * Utility for extracting Instagram media using public fixers/proxies.
 */

export type InstagramMedia = {
  type: "video" | "image";
  url: string;
  thumbUrl?: string;
};

/**
 * Extracts Instagram media using ddinstagram.com (InstaFix).
 * It provides an easy way to scrape the direct media link from the OG tags.
 */
export async function extractInstagram(sourceUrl: string): Promise<InstagramMedia[]> {
  try {
    // InstaFix (ddinstagram) is a reliable way to get the direct video link
    const fixUrl = sourceUrl.replace("instagram.com", "ddinstagram.com");
    
    const response = await fetch(fixUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Instagram fetch failed: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const mediaItems: InstagramMedia[] = [];

    // Check for video first
    const videoMatch = html.match(/<meta property="og:video" content="([^"]+)"/i);
    if (videoMatch && videoMatch[1]) {
      mediaItems.push({
        type: "video",
        url: videoMatch[1],
      });
    }

    // Check for image if no video or as supplemental
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (imageMatch && imageMatch[1] && mediaItems.length === 0) {
      mediaItems.push({
        type: "image",
        url: imageMatch[1],
      });
    }

    // Associate image as thumbnail for video
    if (mediaItems.length > 0 && mediaItems[0].type === "video" && imageMatch && imageMatch[1]) {
      mediaItems[0].thumbUrl = imageMatch[1];
    }

    return mediaItems;
  } catch (error) {
    console.error("Error in extractInstagram:", error);
    return [];
  }
}

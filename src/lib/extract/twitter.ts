export type TwitterMedia = {
  type: "video" | "audio" | "image";
  url: string;
  thumbUrl?: string;
};

/**
 * Extracts Twitter/X media by scraping metadata from "fixer" services (fxtwitter/vxtwitter).
 * This approach uses a crawler-like User-Agent to retrieve the same direct media links
 * used for social media link unfurling.
 */
export async function extractTwitter(sourceUrl: string): Promise<TwitterMedia[]> {
  try {
    const url = new URL(sourceUrl);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Extract status ID from URL
    let statusId = "";
    if (pathParts.includes("status")) {
      statusId = pathParts[pathParts.indexOf("status") + 1];
    } else if (pathParts.length === 1 && /^\d+$/.test(pathParts[0])) {
      // Direct ID
      statusId = pathParts[0];
    }

    if (!statusId) {
      throw new Error("Invalid Twitter status URL");
    }

    // Use fxtwitter.com for scraping. It is generally very robust with metadata.
    // Use TelegramBot User-Agent to trigger SSR of meta tags.
    const scrapeUrl = `https://fxtwitter.com/i/status/${statusId}`;
    
    console.log(`Scraping Twitter metadata from: ${scrapeUrl}`);
    
    const res = await fetch(scrapeUrl, {
      headers: {
        "User-Agent": "TelegramBot (like TwitterBot)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      throw new Error(`Twitter fixer service failed with status ${res.status}`);
    }

    const html = await res.text();
    const results: TwitterMedia[] = [];

    // Helper to find meta tags
    const findMeta = (property: string) => {
      const regex = new RegExp(`<meta\\s+(?:property|name)="${property}"\\s+content="([^"]+)"`, "i") ||
                    new RegExp(`<meta\\s+content="([^"]+)"\\s+(?:property|name)="${property}"`, "i");
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    // Extract Video
    const videoUrl = findMeta("og:video") || findMeta("og:video:url") || findMeta("twitter:player:stream");
    const thumbUrl = findMeta("og:image") || findMeta("twitter:image");

    if (videoUrl) {
      results.push({
        type: "video",
        url: videoUrl,
        thumbUrl: thumbUrl || undefined,
      });
    } else if (thumbUrl) {
      // Fallback to image if no video found
      results.push({
        type: "image",
        url: thumbUrl,
      });
    }

    console.log(`Extracted ${results.length} media items from Twitter.`);
    return results;
  } catch (error) {
    console.error("Twitter extraction error:", error);
    return [];
  }
}

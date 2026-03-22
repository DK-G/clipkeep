export async function extractDiscord(url: string) {
  try {
    // If it's a direct CDN link, just return it
    if (url.includes("cdn.discordapp.com") || url.includes("media.discordapp.net")) {
      const type = (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov")) ? "video" : "image";
      return [{
        type: type as "video" | "image",
        url: url,
        thumbUrl: url,
        title: "Discord Media"
      }];
    }

    // Otherwise, try to fetch the page (if it's a public message link)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    if (!response.ok) return [];

    const html = await response.text();
    const videoUrl = html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];
    const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
    const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];

    if (videoUrl) {
      return [{
        type: "video" as const,
        url: videoUrl,
        thumbUrl: thumbUrl,
        title: title
      }];
    }

    if (thumbUrl) {
      return [{
        type: "image" as const,
        url: thumbUrl,
        thumbUrl: thumbUrl,
        title: title
      }];
    }

    return [];
  } catch (error) {
    console.error("Discord extraction failed:", error);
    return [];
  }
}

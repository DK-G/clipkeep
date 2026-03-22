export async function extractThreads(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) return [];

    const html = await response.text();
    
    // Threads (Meta) often blocks standard scraping, but sometimes OG tags work
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
    console.error("Threads extraction failed:", error);
    return [];
  }
}

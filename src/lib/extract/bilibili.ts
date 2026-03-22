export async function extractBilibili(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) return [];

    const html = await response.text();
    
    // Bilibili often doesn't have a direct MP4 in og:video on the main page
    // But it has og:image and og:title
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
    console.error("Bilibili extraction failed:", error);
    return [];
  }
}

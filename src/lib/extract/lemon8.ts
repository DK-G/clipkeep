export async function extractLemon8(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
      },
    });

    if (!response.ok) return [];

    const html = await response.text();
    
    // Extract og:video (Lemon8 usually has it for video posts)
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
    console.error("Lemon8 extraction failed:", error);
    return [];
  }
}

export async function extractReddit(url: string) {
  try {
    // Reddit often needs a fixer like rxddit.com to get reliable OG tags
    const fixerUrl = url.replace(/reddit\.com/, "rxddit.com");

    const response = await fetch(fixerUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
      },
    });

    if (!response.ok) return [];

    const html = await response.text();
    
    // Simple OG tag extraction from rxddit
    const videoUrl = html.match(/<meta[^>]+property="og:video:url"[^>]+content="([^"]+)"/)?.[1] 
                  || html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1]
                  || html.match(/<meta[^>]+property="twitter:player:stream"[^>]+content="([^"]+)"/)?.[1];
    
    // Sometimes rxddit returns a direct file URL in og:video
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

    // Fallback to original page if rxddit failed
    if (!videoUrl) {
      const originalResponse = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
        },
      });
      if (originalResponse.ok) {
        const originalHtml = await originalResponse.text();
        const originalVideo = originalHtml.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];
        const originalThumb = originalHtml.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
        
        if (originalVideo) {
          return [{
            type: "video" as const,
            url: originalVideo,
            thumbUrl: originalThumb,
            title: title
          }];
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Reddit extraction failed:", error);
    return [];
  }
}

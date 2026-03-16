/**
 * Utility for extracting TikTok media without watermarks using public APIs/Fixers.
 */

export type TikTokMedia = {
  type: "video";
  url: string;
  thumbUrl?: string;
  title?: string;
};

interface TikWMResponse {
  code: number;
  msg: string;
  data?: {
    play?: string;
    wmplay?: string;
    cover?: string;
    title?: string;
  };
}

/**
 * Extracts TikTok media using the TikWM public API.
 * This is a reliable third-party API that provides watermark-free videos.
 */
export async function extractTikTok(sourceUrl: string): Promise<TikTokMedia[]> {
  try {
    // Try TikWM API first
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(sourceUrl)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      const data = await response.json() as TikWMResponse;
      if (data && data.code === 0 && data.data) {
        const videoUrl = data.data.play || data.data.wmplay;
        const thumbUrl = data.data.cover;
        const title = data.data.title;

        if (videoUrl) {
          return [{
            type: "video",
            url: videoUrl,
            thumbUrl: thumbUrl,
            title: title
          }];
        }
      }
    }

    // Fallback: Try a fixer service if the API fails
    // vxtiktok is a known fixer
    const fixerUrl = sourceUrl.replace("tiktok.com", "vxtiktok.com");
    const fixerResponse = await fetch(fixerUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    });

    if (fixerResponse.ok) {
        const html = await fixerResponse.text();
        const videoMatch = html.match(/<meta property="og:video" content="([^"]+)"/i);
        if (videoMatch && videoMatch[1]) {
            return [{
                type: "video",
                url: videoMatch[1],
            }];
        }
    }

    return [];
  } catch (error) {
    console.error("Error in extractTikTok:", error);
    return [];
  }
}

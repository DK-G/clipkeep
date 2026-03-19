/**
 * Utility for extracting TikTok media without watermarks using public APIs/Fixers.
 */

export type TikTokMedia = {
  type: "video" | "image";
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
 * Resolves TikTok short URLs (vt.tiktok.com, vm.tiktok.com) to their canonical video URL.
 */
async function resolveTikTokUrl(url: string): Promise<string> {
  if (!url.includes("vt.tiktok.com") && !url.includes("vm.tiktok.com")) {
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
    console.error("Error resolving TikTok URL:", error);
  }

  return url;
}

/**
 * Extracts TikTok media using the TikWM public API.
 * This is a reliable third-party API that provides watermark-free videos.
 */
export async function extractTikTok(sourceUrl: string): Promise<TikTokMedia[]> {
  try {
    const resolvedUrl = await resolveTikTokUrl(sourceUrl);
    
    // Try TikWM API first
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(resolvedUrl)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text) as TikWMResponse;
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
        } else {
          console.warn("TikWM API returned non-zero code or empty data:", data);
        }
      } catch (e) {
        console.warn("TikWM API returned invalid JSON. Start of response:", text.substring(0, 100), e);
      }
    } else {
      console.warn("TikWM API request failed with status:", response.status);
    }

    // Fallback: Try kktiktok (vxtiktok successor)
    const kkUrl = resolvedUrl.replace("tiktok.com", "kktiktok.com");
    try {
      const kkResponse = await fetch(kkUrl, {
        headers: { "User-Agent": "TelegramBot" },
      });
      if (kkResponse.ok) {
        const contentType = kkResponse.headers.get("content-type") || "";
        if (contentType.includes("video/")) {
          // If the fallback directly returns the video stream, use the final URL
          return [{
            type: "video",
            url: kkResponse.url || kkUrl,
          }];
        }
        
        const html = await kkResponse.text();
        const videoMatch = html.match(/<meta property="og:video" content="([^"]+)"/i);
        if (videoMatch && videoMatch[1]) {
          return [{
            type: "video",
            url: videoMatch[1],
          }];
        }
      }
    } catch (e) {
      console.warn("kktiktok fallback error:", e);
    }

    return [];
  } catch (error) {
    console.error("Error in extractTikTok:", error);
    throw error; // Rethrow to let store.ts catch it and log detailed warning
  }
}

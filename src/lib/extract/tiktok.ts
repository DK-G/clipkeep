/**
 * Utility for extracting TikTok media without watermarks using public APIs/Fixers.
 */

export type TikTokMedia = {
  type: "video" | "image";
  url: string;
  downloadUrl?: string;
  thumbUrl?: string;
  title?: string;
  sourcePath?: string;
};

interface TikWMResponse {
  code: number;
  msg: string;
  data?: {
    play?: string;
    wmplay?: string;
    cover?: string;
    title?: string;
    images?: string[];
  };
}

type LovetikLink = {
  t?: string;
  a?: string;
};

type LovetikResponse = {
  status?: string;
  links?: LovetikLink[] | unknown;
  cover?: string;
  desc?: string;
};

const PROVIDER_COOLDOWN_MS = 2 * 60 * 1000;
const providerCooldowns = new Map<string, number>();

function isProviderCoolingDown(provider: string): boolean {
  const until = providerCooldowns.get(provider);
  if (!until) return false;
  if (until <= Date.now()) {
    providerCooldowns.delete(provider);
    return false;
  }
  return true;
}

function markProviderBlocked(provider: string): void {
  providerCooldowns.set(provider, Date.now() + PROVIDER_COOLDOWN_MS);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function buildProxyDownloadUrl(url: string): string {
  return `/api/v1/extract/proxy?url=${encodeURIComponent(url)}&dl=1`;
}

/**
 * Resolves TikTok short URLs (vt.tiktok.com, vm.tiktok.com) to their canonical video URL.
 */
async function resolveTikTokUrl(url: string): Promise<string> {
  const normalizedInput = normalizeTikTokInputUrl(url);
  const host = new URL(normalizedInput).hostname.toLowerCase();
  if (!isTikTokShortHost(host)) return normalizedInput;

  try {
    const response = await fetch(normalizedInput, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      return normalizeTikTokInputUrl(response.url);
    }
  } catch (error: unknown) {
    console.error("Error resolving TikTok URL:", getErrorMessage(error));
  }

  throw new Error("SHORT_URL_RESOLVE_FAILED");
}


/**
 * Extracts TikTok media using public APIs/fixers.
 */
export async function extractTikTok(sourceUrl: string): Promise<TikTokMedia[]> {
  const startTime = Date.now();
  let sawAntiBot = false;

  try {
    const resolvedUrl = await resolveTikTokUrl(sourceUrl);
    console.log(`[TikTok] Resolved URL: ${resolvedUrl}`);

    if (!isProviderCoolingDown("tikwm")) {
      try {
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(resolvedUrl)}`;
        const response = await fetch(apiUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (response.status === 403 || response.status === 429) {
          sawAntiBot = true;
          markProviderBlocked("tikwm");
          throw new Error("ANTI_BOT_BLOCKED");
        }

        if (response.ok) {
          const data = await response.json() as TikWMResponse;
          if (data.code === 0 && data.data) {
            // Priority 1: Slideshow (Multi-image)
            if (data.data.images && data.data.images.length > 0) {
              console.log(`[TikTok] Success via TikWM Slideshow (${Date.now() - startTime}ms)`);
              return data.data.images.map(imageUrl => ({
                type: "image",
                url: imageUrl,
                downloadUrl: buildProxyDownloadUrl(imageUrl),
                thumbUrl: data.data?.cover,
                title: data.data?.title,
                sourcePath: "tikwm-slideshow",
              }));
            }

            // Priority 2: Video
            const videoUrl = data.data.play || data.data.wmplay;
            if (videoUrl) {
              console.log(`[TikTok] Success via TikWM Video (${Date.now() - startTime}ms)`);
              return [{
                type: "video",
                url: videoUrl,
                downloadUrl: buildProxyDownloadUrl(videoUrl),
                thumbUrl: data.data.cover,
                title: data.data.title,
                sourcePath: "tikwm-video",
              }];
            }
          }

          if (data.msg?.toLowerCase().includes("private")) {
            throw new Error("PRIVATE_POST");
          }
        }
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        if (errorMessage === "PRIVATE_POST") {
          throw error;
        }
        if (errorMessage !== "ANTI_BOT_BLOCKED") {
          console.warn("[TikTok] TikWM path failed:", errorMessage);
        }
      }
    }

    // vxtiktok fallback removed (service is down)

    // Lovetik fallback (good for slideshows/carousels)
    try {
      const loveApi = `https://lovetik.com/api/ajax/search`;
      const loveRes = await fetch(loveApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: `q=${encodeURIComponent(resolvedUrl)}`,
      });

      if (loveRes.status === 403 || loveRes.status === 429) {
        sawAntiBot = true;
        markProviderBlocked("lovetik");
      } else if (loveRes.ok) {
        const data = (await loveRes.json()) as LovetikResponse;
        if (data.status === "ok" && data.links) {
          const links: LovetikLink[] = Array.isArray(data.links) ? data.links : [];
          const images = links
            .filter((l): l is LovetikLink & { a: string } => l.t === "Image" && typeof l.a === "string" && l.a.length > 0)
            .map((l) => ({
              type: "image" as const,
              url: l.a,
              downloadUrl: buildProxyDownloadUrl(l.a),
              thumbUrl: data.cover,
              title: data.desc,
              sourcePath: "lovetik-image",
            }));

          if (images.length > 0) {
            console.log(`[TikTok] Success via Lovetik Slideshow (${Date.now() - startTime}ms)`);
            return images;
          }

          const video = links.find((l) => l.t === "Video" || l.t === "Video(Watermark)");
          if (video?.a) {
            console.log(`[TikTok] Success via Lovetik Video (${Date.now() - startTime}ms)`);
            return [{
              type: "video",
              url: video.a,
              downloadUrl: buildProxyDownloadUrl(video.a),
              thumbUrl: data.cover,
              title: data.desc,
              sourcePath: "lovetik-video",
            }];
          }
        }
      }
    } catch (error: unknown) {
      console.warn("[TikTok] Lovetik fallback failed:", getErrorMessage(error));
    }

    const kkUrl = resolvedUrl.replace("tiktok.com", "kktiktok.com");
    if (!isProviderCoolingDown("kktiktok")) try {
      const kkResponse = await fetch(kkUrl, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
        },
      });
      if (kkResponse.status === 403 || kkResponse.status === 429) {
        sawAntiBot = true;
        markProviderBlocked("kktiktok");
        throw new Error("ANTI_BOT_BLOCKED");
      }

      if (kkResponse.ok) {
        const html = await kkResponse.text();
        const videoUrl = html.match(/<meta[^>]+property="og:video:url"[^>]+content="([^"]+)"/)?.[1]
          || html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];

        if (videoUrl) {
          const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
          const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];
          console.log(`[TikTok] Success via kktiktok OG meta (${Date.now() - startTime}ms)`);
          return [{
            type: "video",
            url: videoUrl,
            downloadUrl: buildProxyDownloadUrl(videoUrl),
            thumbUrl,
            title,
            sourcePath: "kktiktok-og",
          }];
        }
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage === "ANTI_BOT_BLOCKED") sawAntiBot = true;
      console.warn("kktiktok fallback failed:", errorMessage);
    }

    if (sawAntiBot) throw new Error("ANTI_BOT_BLOCKED");
    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    if (["PRIVATE_POST", "ANTI_BOT_BLOCKED", "SHORT_URL_RESOLVE_FAILED", "MEDIA_NOT_FOUND"].includes(errorMessage)) {
      throw error;
    }
    console.error("Error in extractTikTok:", errorMessage);
    throw error;
  }
}

import { isTikTokShortHost, normalizeTikTokInputUrl } from "./tiktok-url";

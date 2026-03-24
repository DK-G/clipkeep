import puppeteer from "@cloudflare/puppeteer";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ExtractionMedia } from "./types";

type BrowserEnv = {
  BROWSER?: unknown;
  browser_rendering?: unknown;
};

type JsonLdValue = string | { url?: string } | Array<string | { url?: string }>;

type JsonLdNode = {
  [key: string]: unknown;
  "@type"?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  name?: string;
  image?: JsonLdValue;
};

type PinterestVideoVariant = {
  url?: string;
};

type PinterestVideoList = {
  V_720P?: PinterestVideoVariant;
  V_HLSV3?: PinterestVideoVariant;
  V_HLSV4?: PinterestVideoVariant;
  [key: string]: unknown;
};

type BrowserExtractionResult = {
  title?: string;
  videoUrl?: string | null;
  thumbUrl?: string | null;
};

type PinterestWindow = Window & {
  __PINTEREST_APP_STATE__?: unknown;
};

function readJsonLdImage(image: JsonLdValue | undefined): string | null {
  if (!image) {
    return null;
  }
  if (typeof image === "string") {
    return image;
  }
  if (Array.isArray(image)) {
    const first = image[0];
    if (typeof first === "string") {
      return first;
    }
    return first?.url || null;
  }
  return image.url || null;
}

/**
 * Extracts media metadata using Cloudflare Browser Rendering.
 * This is used as a fallback for platforms that block standard server-side fetch requests.
 */
export async function extractWithBrowser(url: string): Promise<ExtractionMedia[]> {
  const cloudflare = await getCloudflareContext();
  const env = cloudflare?.env as BrowserEnv | undefined;
  const browserBinding = env?.BROWSER || env?.browser_rendering;

  if (!browserBinding) {
    console.warn(`[Browser] No browser binding found. Keys: ${Object.keys(env || {})}`);
    return [];
  }

  console.log(`[Browser] Launching browser for URL: ${url}`);
  const startTime = Date.now();
  const browser = await puppeteer.launch(browserBinding as never).catch((error: unknown) => {
    console.error("[Browser] Failed to launch puppeteer:", error);
    throw error;
  });
  console.log(`[Browser] Launch successful in ${Date.now() - startTime}ms`);

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1");

    console.log(`[Browser] Navigating to ${url}...`);
    const navStartTime = Date.now();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    console.log(`[Browser] Navigation completed (DOM) in ${Date.now() - navStartTime}ms`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const metadata = await page.evaluate((): BrowserExtractionResult => {
      const results: BrowserExtractionResult = {
        title: document.title,
        videoUrl: null,
        thumbUrl: null,
      };

      const getMeta = (props: string[]): string | null => {
        for (const prop of props) {
          const element = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          if (element) {
            return element.getAttribute("content");
          }
        }
        return null;
      };

      const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of Array.from(ldScripts)) {
        try {
          const parsed = JSON.parse(script.textContent || "{}") as JsonLdNode | JsonLdNode[];
          const videoNode = Array.isArray(parsed)
            ? parsed.find((item) => item["@type"] === "VideoObject")
            : parsed["@type"] === "VideoObject"
              ? parsed
              : undefined;

          if (videoNode) {
            if (videoNode.contentUrl) results.videoUrl = videoNode.contentUrl;
            if (videoNode.thumbnailUrl) results.thumbUrl = videoNode.thumbnailUrl;
            if (videoNode.name) results.title = videoNode.name;
          }

          const imageValue = Array.isArray(parsed) ? undefined : readJsonLdImage(parsed.image);
          if (imageValue && !results.thumbUrl) {
            results.thumbUrl = imageValue;
          }
        } catch {
          continue;
        }
      }

      const pinterestWindow = window as PinterestWindow;
      if (!results.videoUrl && pinterestWindow.__PINTEREST_APP_STATE__) {
        try {
          const findVideo = (obj: unknown): string | null => {
            if (!obj || typeof obj !== "object") return null;
            const record = obj as Record<string, unknown>;
            if (record.video_list && typeof record.video_list === "object") {
              const list = record.video_list as PinterestVideoList;
              return list.V_720P?.url || list.V_HLSV3?.url || list.V_HLSV4?.url || null;
            }
            for (const value of Object.values(record)) {
              const found = findVideo(value);
              if (found) return found;
            }
            return null;
          };

          const pinterestVideo = findVideo(pinterestWindow.__PINTEREST_APP_STATE__);
          if (pinterestVideo) {
            results.videoUrl = pinterestVideo;
          }
        } catch {
          // ignore
        }
      }

      if (!results.videoUrl) {
        results.videoUrl = getMeta(["og:video:url", "og:video", "twitter:player:stream", "twitter:player", "og:video:secure_url"]);
      }
      if (!results.thumbUrl) {
        results.thumbUrl = getMeta(["og:image", "twitter:image", "og:image:src", "og:image:secure_url"]);
      }
      const metaTitle = getMeta(["og:title", "twitter:title", "title"]);
      if (metaTitle) {
        results.title = metaTitle;
      }

      return results;
    });

    console.log(`Browser extraction for ${url} completed:`, {
      hasVideo: !!metadata.videoUrl,
      hasThumb: !!metadata.thumbUrl,
      title: metadata.title?.substring(0, 30),
    });

    if (metadata.videoUrl) {
      return [{
        type: "video",
        url: metadata.videoUrl,
        thumbUrl: metadata.thumbUrl || undefined,
        title: metadata.title || undefined,
        sourcePath: "browser-video",
      }];
    }

    if (metadata.thumbUrl) {
      return [{
        type: "image",
        url: metadata.thumbUrl,
        thumbUrl: metadata.thumbUrl,
        title: metadata.title || undefined,
        sourcePath: "browser-image",
      }];
    }

    return [];
  } catch (error: unknown) {
    console.error("Browser extraction failed:", error);
    return [];
  } finally {
    await browser.close().catch((error: unknown) => console.error("Error closing browser:", error));
  }
}


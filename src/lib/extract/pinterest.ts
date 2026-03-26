import type { ExtractionMedia } from "./types";

interface PinterestImageCandidate {
  url?: string;
  width?: number;
  height?: number;
}

interface PinterestVideoCandidate {
  url?: string;
  width?: number;
  height?: number;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function decodeHtml(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\\\//g, "/");
}

function normalizePinterestUrl(pinUrl: string): string {
  const parsed = new URL(pinUrl.trim());
  parsed.protocol = "https:";

  if (parsed.hostname === "pin.it") {
    return parsed.toString();
  }

  parsed.search = "";
  parsed.hash = "";
  parsed.pathname = parsed.pathname.replace(/\/$/, "");

  if (!/\/pin\/\d+$/i.test(parsed.pathname)) {
    throw new Error("UNSUPPORTED_URL");
  }

  return `${parsed.origin}${parsed.pathname}/`;
}

function collectObjectsByKey(root: unknown, key: string): unknown[] {
  const results: unknown[] = [];
  const stack: unknown[] = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (Array.isArray(current)) {
      for (const item of current) {
        stack.push(item);
      }
      continue;
    }

    const record = current as Record<string, unknown>;
    if (key in record) {
      results.push(record[key]);
    }

    for (const value of Object.values(record)) {
      stack.push(value);
    }
  }

  return results;
}

function collectPinCandidates(root: unknown): Array<Record<string, unknown>> {
  const candidates: Array<Record<string, unknown>> = [];
  const stack: unknown[] = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (Array.isArray(current)) {
      for (const item of current) {
        stack.push(item);
      }
      continue;
    }

    const record = current as Record<string, unknown>;
    const hasImages = typeof record.images === "object" && record.images !== null;
    const hasVideos = typeof record.videos === "object" && record.videos !== null;
    const hasStory = typeof record.story_pin_data === "object" && record.story_pin_data !== null;
    if (hasImages || hasVideos || hasStory) {
      candidates.push(record);
    }

    for (const value of Object.values(record)) {
      stack.push(value);
    }
  }

  return candidates;
}

function pickBestImage(images: unknown): PinterestImageCandidate | null {
  if (!images || typeof images !== "object") {
    return null;
  }

  const imageRecord = images as Record<string, unknown>;
  const preferredKeys = ["orig", "originals", "564x", "736x", "474x"];
  for (const key of preferredKeys) {
    const candidate = imageRecord[key];
    if (candidate && typeof candidate === "object") {
      const image = candidate as PinterestImageCandidate;
      if (image.url) {
        return image;
      }
    }
  }

  let best: PinterestImageCandidate | null = null;
  for (const candidate of Object.values(imageRecord)) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }
    const image = candidate as PinterestImageCandidate;
    if (!image.url) {
      continue;
    }
    if (!best || (image.width || 0) > (best.width || 0)) {
      best = image;
    }
  }

  return best;
}

function pickBestVideo(videoList: unknown): PinterestVideoCandidate | null {
  if (!videoList || typeof videoList !== "object") {
    return null;
  }

  const list = videoList as Record<string, unknown>;
  let bestMp4: PinterestVideoCandidate | null = null;
  let bestAny: PinterestVideoCandidate | null = null;

  for (const candidate of Object.values(list)) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }
    const video = candidate as PinterestVideoCandidate;
    if (!video.url) {
      continue;
    }

    if (!bestAny || (video.height || 0) > (bestAny.height || 0)) {
      bestAny = video;
    }
        const isMp4 = /\.mp4(\?|$)/i.test(video.url);
    if (isMp4 && (!bestMp4 || (video.height || 0) > (bestMp4.height || 0))) {
      bestMp4 = video;
    }
  }

  return bestMp4 || bestAny;
}

function extractFromPinCandidate(pin: Record<string, unknown>): ExtractionMedia[] {
  const title = typeof pin.seo_title === "string"
    ? pin.seo_title
    : typeof pin.grid_title === "string"
      ? pin.grid_title
      : typeof pin.title === "string"
        ? pin.title
        : "Pinterest Media";

  const mainImage = pickBestImage(pin.images);
  const media: ExtractionMedia[] = [];

  // 1. Check for Story/Idea Pin (Multi-page)
  if (pin.story_pin_data && typeof pin.story_pin_data === "object") {
    const storyData = pin.story_pin_data as Record<string, unknown>;
    const pages = Array.isArray(storyData.pages) ? storyData.pages : [];
    
    for (const page of pages) {
      if (!page || typeof page !== "object") continue;
      const pageRecord = page as Record<string, unknown>;
      
      // Try video in page
      const pageVideo = pickBestVideo(pageRecord.video);
      if (pageVideo?.url) {
        media.push({
          type: "video",
          url: pageVideo.url,
          quality: pageVideo.height ? `${pageVideo.height}p` : "high",
          title,
          thumbUrl: pickBestImage(pageRecord.images)?.url || mainImage?.url,
          sourcePath: "pinterest-story-page-video",
        });
        continue; // Primary media for page found
      }

      // Try image in page
      const pageImage = pickBestImage(pageRecord.images);
      if (pageImage?.url) {
        media.push({
          type: "image",
          url: pageImage.url,
          quality: pageImage.width ? `${pageImage.width}w` : "original",
          title,
          thumbUrl: pageImage.url,
          sourcePath: "pinterest-story-page-image",
        });
        continue;
      }

      // Check blocks if no direct media
      if (Array.isArray(pageRecord.blocks)) {
        for (const block of pageRecord.blocks) {
          if (!block || typeof block !== "object") continue;
          const blockRecord = block as Record<string, unknown>;
          
          const blockVideo = pickBestVideo(blockRecord.video);
          if (blockVideo?.url) {
            media.push({
              type: "video",
              url: blockVideo.url,
              quality: blockVideo.height ? `${blockVideo.height}p` : "high",
              title,
              thumbUrl: mainImage?.url,
              sourcePath: "pinterest-story-block-video",
            });
          } else {
            const blockImage = pickBestImage(blockRecord.images);
            if (blockImage?.url) {
              media.push({
                type: "image",
                url: blockImage.url,
                quality: blockImage.width ? `${blockImage.width}w` : "original",
                title,
                thumbUrl: blockImage.url,
                sourcePath: "pinterest-story-block-image",
              });
            }
          }
        }
      }
    }
  }

  // 2. Fallback to main video/image if no story data or story data was empty
  if (media.length === 0) {
    if (pin.videos && typeof pin.videos === "object") {
      const videos = pin.videos as Record<string, unknown>;
      const bestVideo = pickBestVideo(videos.video_list);
      if (bestVideo?.url) {
        media.push({
          type: "video",
          url: bestVideo.url,
          quality: bestVideo.height ? `${bestVideo.height}p` : "high",
          title,
          thumbUrl: mainImage?.url,
          sourcePath: "pinterest-native-video",
        });
      }
    }

    if (media.length === 0 && mainImage?.url) {
      media.push({
        type: "image",
        url: mainImage.url,
        quality: mainImage.width ? `${mainImage.width}w` : "original",
        title,
        thumbUrl: mainImage.url,
        sourcePath: "pinterest-native-image",
      });
    }
  }

  return media;
}

function extractEmbeddedJson(html: string): ExtractionMedia[] {
  const scriptMatches = Array.from(
    html.matchAll(/<script[^>]*(?:id="(?:initial-state|__PWS_DATA__)"|type="application\/json")[^>]*>([\s\S]*?)<\/script>/gi)
  );

  for (const match of scriptMatches) {
    const rawJson = match[1]?.trim();
    if (!rawJson) {
      continue;
    }

    try {
      const parsed = JSON.parse(decodeHtml(rawJson)) as unknown;
      const candidates = collectPinCandidates(parsed);
      for (const candidate of candidates) {
        const result = extractFromPinCandidate(candidate);
        if (result.length > 0) {
          return result;
        }
      }

      const pinResources = collectObjectsByKey(parsed, "PinResource");
      for (const resource of pinResources) {
        const resourceCandidates = collectPinCandidates(resource);
        for (const candidate of resourceCandidates) {
          const result = extractFromPinCandidate(candidate);
          if (result.length > 0) {
            return result;
          }
        }
      }
    } catch {
      continue;
    }
  }

  return [];
}

type PinterestPinResourceResponse = {
  resource_response?: {
    data?: Record<string, unknown>;
  };
};

async function extractViaPinResource(pinId: string): Promise<ExtractionMedia[]> {

  const apiData = {
    options: {
      field_set_key: "unauth_react_main_pin",
      id: pinId,
    },
  };
  const apiUrl = `https://www.pinterest.com/resource/PinResource/get/?data=${encodeURIComponent(JSON.stringify(apiData))}`;

  const headers = {
    "X-Pinterest-PWS-Handler": "www/signup.js",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  try {
    const res = await fetch(apiUrl, { headers });
    if (res.ok) {
      const data = (await res.json()) as PinterestPinResourceResponse;
      const pinData = data.resource_response?.data;
      if (pinData && typeof pinData === "object") {
        const extracted = extractFromPinCandidate(pinData as Record<string, unknown>);
        if (extracted.length > 0) {
          return extracted;
        }
        console.warn(`[Pinterest] PinResource returned no downloadable MP4/image for pin ${pinId}`);
      }
    }
  } catch (error) {
    console.warn("[Pinterest] PinResource API failed:", getErrorMessage(error));
  }
  return [];
}

/**
 * Pinterest Extraction (public pin page + embedded JSON)
 */
export async function extractPinterest(pinUrl: string): Promise<ExtractionMedia[]> {
  try {
    let normalizedUrl = normalizePinterestUrl(pinUrl);
    if (normalizedUrl.includes("pin.it")) {
      const headRes = await fetch(normalizedUrl, { method: "HEAD", redirect: "follow" });
      if (!headRes.ok) {
        throw new Error("PIN_NOT_FOUND");
      }
      normalizedUrl = normalizePinterestUrl(headRes.url);
    }

    const pinIdMatch = normalizedUrl.match(/\/pin\/(\d+)/i);
    const pinId = pinIdMatch ? pinIdMatch[1] : null;

    if (pinId) {
      console.log(`[Pinterest] Trying PinResource API for ID: ${pinId}`);
      const apiResults = await extractViaPinResource(pinId);
      if (apiResults.length > 0) {
        return apiResults;
      }
    }

    console.log(`[Pinterest] Falling back to HTML parsing for: ${normalizedUrl}`);
    const response = await fetch(normalizedUrl, {
      headers: {
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.pinterest.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.status === 403 || response.status === 429) {
      throw new Error("ANTI_BOT_BLOCKED");
    }
    if (response.status === 404) {
      throw new Error("PIN_NOT_FOUND");
    }
    if (!response.ok) {
      throw new Error("PIN_DATA_NOT_FOUND");
    }

    const html = await response.text();
    const results = extractEmbeddedJson(html);
    if (results.length > 0) {
      return results;
    }

    throw new Error("PIN_DATA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("[Pinterest] Extraction error:", getErrorMessage(error));
    throw error;
  }
}


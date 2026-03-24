import type { ExtractionMedia } from "./types";

interface BilibiliViewResponse {
  code?: number;
  data?: {
    bvid?: string;
    cid?: number;
    pic?: string;
    title?: string;
  };
}

interface BilibiliPlayUrlResponse {
  code?: number;
  data?: {
    durl?: Array<{
      url?: string;
    }>;
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function extractBvidFromUrl(url: string): string | null {
  const match = url.match(/video\/(BV[A-Za-z0-9]+)/i);
  return match ? match[1] : null;
}

export async function extractBilibili(url: string): Promise<ExtractionMedia[]> {
  try {
    let targetUrl = url;
    if (url.includes("b23.tv")) {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      targetUrl = res.url;
    }

    const bvid = extractBvidFromUrl(targetUrl);

    if (!bvid) {
      console.warn(`[Bilibili] Could not extract BVID from URL: ${targetUrl}`);
      throw new Error("CID_NOT_RESOLVED");
    }

    // Step 1: Use the web-interface/view API to get video metadata (cid, thumb, title)
    // This avoids scraping the HTML page which is often a CAPTCHA bot-detection page.
    const viewRes = await fetch(
      `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://www.bilibili.com/",
        },
      }
    );

    if (viewRes.status === 412 || viewRes.status === 429) {
      throw new Error("RATE_LIMITED");
    }

    if (!viewRes.ok) {
      throw new Error("CID_NOT_RESOLVED");
    }

    const viewData = await viewRes.json() as BilibiliViewResponse;

    if (viewData.code === -404 || viewData.code === -403) {
      throw new Error("MEDIA_NOT_FOUND");
    }
    if (viewData.code === -101 || viewData.code === -401) {
      throw new Error("LOGIN_WALL");
    }
    if (viewData.code === -412) {
      throw new Error("RATE_LIMITED");
    }
    if (viewData.code !== 0) {
      throw new Error("CID_NOT_RESOLVED");
    }

    const cid = viewData.data?.cid;
    const thumbUrl = viewData.data?.pic;
    const title = viewData.data?.title;

    if (!cid) {
      console.warn(`[Bilibili] API returned no CID for BVID=${bvid}`);
      throw new Error("CID_NOT_RESOLVED");
    }

    console.log(`[Bilibili] Got BVID=${bvid}, CID=${cid} from API`);

    // Step 2: Use the playurl API to get the video stream URL
    const apiParams = new URLSearchParams({
      bvid,
      cid: String(cid),
      qn: "80", // 1080p; falls back gracefully
      otype: "json",
      platform: "html5",
      high_quality: "1",
    });

    const apiRes = await fetch(
      `https://api.bilibili.com/x/player/playurl?${apiParams.toString()}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://www.bilibili.com/",
        },
      }
    );

    if (apiRes.status === 401 || apiRes.status === 403) {
      throw new Error("LOGIN_WALL");
    }
    if (apiRes.status === 412 || apiRes.status === 429) {
      throw new Error("RATE_LIMITED");
    }

    if (apiRes.ok) {
      const data = await apiRes.json() as BilibiliPlayUrlResponse;

      if (data.code === -101 || data.code === -401) {
        throw new Error("LOGIN_WALL");
      }
      if (data.code === -412) {
        throw new Error("RATE_LIMITED");
      }

      const durl = data.data?.durl?.[0];
      if (durl?.url) {
        return [{
          type: "video",
          url: durl.url,
          quality: "1080p",
          thumbUrl,
          title,
          sourcePath: "bilibili-playurl-api",
        }];
      }
    }

    throw new Error("VIDEO_URL_NOT_RESOLVED");
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    if (["CID_NOT_RESOLVED", "LOGIN_WALL", "VIDEO_URL_NOT_RESOLVED", "RATE_LIMITED", "MEDIA_NOT_FOUND"].includes(errorMessage)) {
      throw error;
    }
    console.error("Bilibili extraction failed:", errorMessage);
    throw error;
  }
}


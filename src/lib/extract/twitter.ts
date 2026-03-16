export type TwitterMedia = {
  type: "video" | "audio" | "image";
  url: string;
  thumbUrl?: string;
};

function extractStatusId(sourceUrl: string): string | null {
  try {
    const url = new URL(sourceUrl);
    const match = url.pathname.match(/status\/(\d+)/i);
    if (match?.[1]) return match[1];

    const onlyId = url.pathname.replaceAll('/', '');
    if (/^\d+$/.test(onlyId)) return onlyId;
    return null;
  } catch {
    return null;
  }
}

function findMeta(html: string, key: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["'][^>]*>`, 'i'),
  ];

  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

async function scrapeFixer(url: string): Promise<TwitterMedia[]> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'TelegramBot (like TwitterBot)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const html = await res.text();

  const videoUrl =
    findMeta(html, 'og:video') ||
    findMeta(html, 'og:video:url') ||
    findMeta(html, 'og:video:secure_url') ||
    findMeta(html, 'twitter:player:stream');

  const thumbUrl = findMeta(html, 'og:image') || findMeta(html, 'twitter:image');

  if (videoUrl) {
    return [{ type: 'video', url: videoUrl, thumbUrl: thumbUrl || undefined }];
  }

  if (thumbUrl) {
    return [{ type: 'image', url: thumbUrl }];
  }

  return [];
}

interface FXTwitterResponse {
  tweet?: {
    media?: {
      all?: Array<{
        type: string;
        url: string;
        thumbnail_url?: string;
      }>;
    };
  };
}

/**
 * extractTwitter via multiple strategies: API, Direct, and Fixer.
 */
export async function extractTwitter(sourceUrl: string): Promise<TwitterMedia[]> {
  const statusId = extractStatusId(sourceUrl);
  if (!statusId) return [];

  // Strategy 1: api.fxtwitter.com (JSON API)
  try {
    const apiRes = await fetch(`https://api.fxtwitter.com/i/status/${statusId}`);
    if (apiRes.ok) {
      const data = await apiRes.json() as FXTwitterResponse;
      if (data.tweet?.media?.all && data.tweet.media.all.length > 0) {
        return data.tweet.media.all.map((m) => ({
          type: m.type === 'video' || m.type === 'gif' ? 'video' : 'image',
          url: m.url,
          thumbUrl: m.thumbnail_url || undefined
        }));
      }
    }
  } catch (e) {
    console.error("FXTwitter API Error:", e);
  }

  // Strategy 2: d.fxtwitter.com (Direct Redirect)
  try {
    const directUrl = `https://d.fxtwitter.com/i/status/${statusId}`;
    const directRes = await fetch(directUrl, { method: 'HEAD', redirect: 'follow' });
    if (directRes.ok && directRes.url.includes('twimg.com')) {
      return [{ type: 'video', url: directRes.url }];
    }
  } catch (e) {
    console.error("FXTwitter Direct Error:", e);
  }

  // Strategy 3: HTML Scraper Fallback
  const candidates = [
    `https://fxtwitter.com/i/status/${statusId}`,
    `https://vxtwitter.com/i/status/${statusId}`,
    `https://fixupx.com/i/status/${statusId}`,
  ];

  for (const c of candidates) {
    try {
      const media = await scrapeFixer(c);
      if (media.length > 0) return media;
    } catch {
      // try next candidate
    }
  }

  return [];
}

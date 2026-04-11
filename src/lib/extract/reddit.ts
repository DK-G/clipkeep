import type { ExtractionMedia } from "./types";

interface RedditListingResponse {
  data?: {
    children?: Array<{
      data?: RedditPostData;
    }>;
  };
}

interface RedditGalleryItem {
  s?: { u?: string };
  p?: Array<{ u?: string }>;
}

interface RedditPostData {
  title?: string;
  thumbnail?: string;
  url?: string;
  is_gallery?: boolean;
  gallery_data?: {
    items?: Array<{ media_id: string }>;
  };
  media_metadata?: Record<string, RedditGalleryItem>;
  secure_media?: {
    reddit_video?: {
      fallback_url?: string;
      hls_url?: string;
      dash_url?: string;
    };
  };
  media?: {
    reddit_video?: {
      fallback_url?: string;
      hls_url?: string;
      dash_url?: string;
    };
  };
  over_18?: boolean;
  removed_by_category?: string | null;
}

export function normalizeRedditUrl(url: string): string {
  const parsed = new URL(url);
  const hostname = parsed.hostname.toLowerCase();
  const isRedditHost = hostname === "reddit.com"
    || hostname === "www.reddit.com"
    || hostname === "old.reddit.com";
  const isShortHost = hostname === "redd.it";

  if (!isRedditHost && !isShortHost) {
    throw new Error("INVALID_REDDIT_URL");
  }

  if (isShortHost) {
    parsed.search = "";
    return parsed.toString();
  }

  parsed.hostname = "www.reddit.com";
  parsed.search = "";
  return parsed.toString();
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function scrapeRedditFixer(url: string): Promise<ExtractionMedia[]> {
  const candidates = [
    url.replace("reddit.com", "rxddit.com"),
    url.replace("reddit.com", "spedit.com"),
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
        },
      });

      if (response.status === 403 || response.status === 429) {
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      const videoUrl = html.match(/<meta[^>]+property="og:video:url"[^>]+content="([^"]+)"/)?.[1]
        || html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/)?.[1];
      const thumbUrl = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1];
      const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1];

      if (videoUrl) {
        return [{
          type: "video",
          url: videoUrl,
          thumbUrl,
          title,
          sourcePath: `fixer-${new URL(candidate).hostname}`,
        }];
      }
    } catch (error: unknown) {
      console.warn(`[Reddit] Fixer ${candidate} failed:`, getErrorMessage(error));
    }
  }

  return [];
}

export async function extractReddit(url: string): Promise<ExtractionMedia[]> {
  const startTime = Date.now();

  try {
    const normalizedUrl = normalizeRedditUrl(url);
    console.log(`[Reddit] Starting extraction for: ${normalizedUrl}`);

    const fixerResults = await scrapeRedditFixer(normalizedUrl);
    if (fixerResults.length > 0) {
      console.log(`[Reddit] Success via Fixer path (${Date.now() - startTime}ms)`);
      return fixerResults;
    }

    try {
      const jsonUrl = normalizedUrl.endsWith("/")
        ? `${normalizedUrl.slice(0, -1)}.json`
        : `${normalizedUrl}.json`;

      // Try old.reddit.com for .json to bypass potential 404s on newer layout
      const oldJsonUrl = jsonUrl.replace("www.reddit.com", "old.reddit.com");
      let response = await fetch(oldJsonUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        // Fallback to current URL if old.reddit fails
        response = await fetch(jsonUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
          },
        });
      }

      if (response.status === 403) {
        throw new Error("PRIVATE_OR_RESTRICTED");
      }
      if (response.status === 404) {
        throw new Error("MEDIA_NOT_FOUND");
      }

      if (response.ok) {
        const data = await response.json() as RedditListingResponse[];
        const post = data?.[0]?.data?.children?.[0]?.data;

        if (post?.over_18) {
          throw new Error("AGE_GATED");
        }
        if (post?.removed_by_category) {
          throw new Error("MEDIA_NOT_FOUND");
        }

        if (post) {
          const title = post.title;
          const thumbUrl = post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : undefined;
          const videoUrl = post.secure_media?.reddit_video?.fallback_url
            || post.media?.reddit_video?.fallback_url;

          if (videoUrl) {
            console.log(`[Reddit] Success via JSON API Native Video (${Date.now() - startTime}ms)`);
            return [{
              type: "video",
              url: videoUrl,
              thumbUrl,
              title,
              sourcePath: "reddit-json-native",
            }];
          }

          if (post.is_gallery && post.media_metadata) {
            const media: ExtractionMedia[] = [];
            const items = post.gallery_data?.items || Object.keys(post.media_metadata).map(id => ({ media_id: id }));

            for (const item of items) {
              const metadata = post.media_metadata[item.media_id];
              if (metadata?.s?.u) {
                media.push({
                  type: "image",
                  url: metadata.s.u.replace(/&amp;/g, "&"),
                  thumbUrl: metadata.p?.[0]?.u?.replace(/&amp;/g, "&"),
                  title,
                  sourcePath: "reddit-json-gallery",
                });
              }
            }

            if (media.length > 0) {
              console.log(`[Reddit] Success via JSON API Gallery (${Date.now() - startTime}ms)`);
              return media;
            }
          }

          if (post.url && post.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            console.log(`[Reddit] Success via JSON API Single Image (${Date.now() - startTime}ms)`);
            return [{
              type: "image",
              url: post.url,
              thumbUrl,
              title,
              sourcePath: "reddit-json-image",
            }];
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (["PRIVATE_OR_RESTRICTED", "MEDIA_NOT_FOUND", "AGE_GATED"].includes(errorMessage)) {
        throw error;
      }
      console.warn("[Reddit] JSON API path failed:", errorMessage);
    }

    throw new Error("MEDIA_NOT_FOUND");
  } catch (error: unknown) {
    console.error("Reddit extraction failed:", getErrorMessage(error));
    throw error;
  }
}


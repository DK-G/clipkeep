const TWITTER_CANONICAL_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
  "m.twitter.com",
  "mobile.twitter.com",
]);

const TWITTER_SHORT_HOSTS = new Set(["t.co"]);

function extractStatusIdFromUrl(url: URL): string | null {
  const pathname = url.pathname;
  
  // Standard status patterns
  const patterns = [
    /\/[^/]+\/status\/(\d+)/i,
    /\/i\/web\/status\/(\d+)/i,
    /\/i\/status\/(\d+)/i,
    /\/status\/(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = pathname.match(pattern);
    if (match?.[1]) return match[1];
  }

  // Intent patterns (search params)
  const tweetId = url.searchParams.get("tweet_id") || url.searchParams.get("in_reply_to");
  if (tweetId && /^\d+$/.test(tweetId)) return tweetId;

  return null;
}

function normalizeBaseUrl(input: string): URL {
  const parsed = new URL(input.trim());
  parsed.protocol = "https:";
  parsed.hash = "";
  return parsed;
}

export function isTwitterShortHost(hostname: string): boolean {
  return TWITTER_SHORT_HOSTS.has(hostname.toLowerCase());
}

export function normalizeTwitterInputUrl(input: string): string {
  const parsed = normalizeBaseUrl(input);
  const host = parsed.hostname.toLowerCase();

  if (isTwitterShortHost(host)) {
    parsed.search = "";
    return parsed.toString();
  }

  if (!TWITTER_CANONICAL_HOSTS.has(host)) {
    throw new Error("UNSUPPORTED_HOST");
  }

  const statusId = extractStatusIdFromUrl(parsed);
  if (!statusId) {
    // Check if it's a profile URL or home page to give a better error later
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length <= 1) {
      throw new Error("X_PROFILE_URL_NOT_SUPPORTED");
    }
    throw new Error("INVALID_X_STATUS_URL");
  }

  return `https://x.com/i/status/${statusId}`;
}


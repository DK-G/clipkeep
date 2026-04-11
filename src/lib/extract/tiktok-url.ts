const TIKTOK_CANONICAL_HOSTS = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
]);

const TIKTOK_SHORT_HOSTS = new Set([
  "vt.tiktok.com",
  "vm.tiktok.com",
]);

function normalizeBaseUrl(input: string): URL {
  const parsed = new URL(input.trim());
  parsed.protocol = "https:";
  parsed.hash = "";
  return parsed;
}

export function isTikTokShortHost(hostname: string): boolean {
  return TIKTOK_SHORT_HOSTS.has(hostname.toLowerCase());
}

export function normalizeTikTokInputUrl(input: string): string {
  const parsed = normalizeBaseUrl(input);
  const host = parsed.hostname.toLowerCase();

  if (isTikTokShortHost(host)) {
    parsed.search = "";
    return parsed.toString();
  }

  if (!TIKTOK_CANONICAL_HOSTS.has(host)) {
    throw new Error("INVALID_TIKTOK_URL");
  }

  if (!/^\/@[^/]+\/video\/\d+/.test(parsed.pathname)) {
    throw new Error("INVALID_TIKTOK_URL");
  }

  parsed.search = "";
  return parsed.toString();
}


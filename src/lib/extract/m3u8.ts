
const FETCH_TIMEOUT_MS = 10000;

export type FetchInit = RequestInit & { timeoutMs?: number };

export async function fetchWithTimeout(url: string, init: FetchInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? FETCH_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export function isM3u8ByUrl(url: string): boolean {
  return /\.m3u8(?:$|\?)/i.test(url);
}

export function isM3u8ContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const ct = contentType.split(";")[0].trim().toLowerCase();
  return ct === "application/x-mpegurl" || ct === "application/vnd.apple.mpegurl";
}

export async function probeContentType(url: string): Promise<string | null> {
  try {
    const head = await fetchWithTimeout(url, { method: "HEAD", redirect: "follow" });
    if (head.ok) {
      return head.headers.get("content-type");
    }
  } catch {
    // ignore
  }

  try {
    const get = await fetchWithTimeout(url, {
      method: "GET",
      redirect: "follow",
      headers: { Range: "bytes=0-0" },
    });
    if (get.ok || get.status === 206) {
      return get.headers.get("content-type");
    }
  } catch {
    // ignore
  }
  return null;
}

function joinM3u8Url(baseUrl: string, line: string): string {
  try {
    return new URL(line, baseUrl).toString();
  } catch {
    return line;
  }
}

export async function resolveM3u8ToMp4(playlistUrl: string, depth = 0): Promise<string | null> {
  if (depth > 2) return null;

  try {
    const res = await fetchWithTimeout(playlistUrl, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "application/vnd.apple.mpegurl,text/plain,*/*" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const text = await res.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));

    const mp4s = lines.filter((line) => /\.mp4(?:$|\?)/i.test(line));
    if (mp4s.length > 0) {
      // Prefer higher resolution if possible (simple heuristic: longer URLs often have more metadata)
      const bestMp4 = mp4s.sort((a, b) => b.length - a.length)[0];
      return joinM3u8Url(playlistUrl, bestMp4);
    }

    const playlists = lines.filter((line) => /\.m3u8(?:$|\?)/i.test(line));
    for (const childPlaylist of playlists) {
      const nested = joinM3u8Url(playlistUrl, childPlaylist);
      const resolved = await resolveM3u8ToMp4(nested, depth + 1);
      if (resolved) return resolved;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Normalizes a media URL, resolving m3u8 playlists to mp4 if necessary.
 * Returns null if the URL is an unresolved m3u8.
 */
export async function normalizeMediaUrl(mediaUrl: string): Promise<string | null> {
  if (!isM3u8ByUrl(mediaUrl)) {
    const contentType = await probeContentType(mediaUrl);
    if (!isM3u8ContentType(contentType)) return mediaUrl;
  }

  // Resolve playlist
  const resolvedFromPlaylist = await resolveM3u8ToMp4(mediaUrl);
  if (resolvedFromPlaylist) {
    if (/\.mp4(?:$|\?)/i.test(resolvedFromPlaylist)) {
      return resolvedFromPlaylist;
    }
  }

  return null;
}

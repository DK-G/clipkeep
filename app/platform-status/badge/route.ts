// Track B-1 (link magnet) — embeddable live status badge (shields-style SVG).
// Reads the KV-cached snapshot via getPlatformStatuses() so it is cheap to embed.
import { getPlatformStatuses, overallStatus, type ProbeStatus } from '@/lib/platform-status/probes';

export const dynamic = 'force-dynamic';

const COLOR: Record<ProbeStatus, string> = {
  operational: '#4c1',
  limited: '#dfb317',
  down: '#e05d44',
};

const RIGHT_LABEL: Record<ProbeStatus, string> = {
  operational: 'operational',
  limited: 'limited',
  down: 'down',
};

const LEFT_LABEL = 'clipkeep';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function badge(status: ProbeStatus): string {
  const right = RIGHT_LABEL[status];
  const color = COLOR[status];
  // Rough text metrics (~6.2px/char at 11px font) + padding.
  const leftW = Math.round(LEFT_LABEL.length * 6.2 + 10);
  const rightW = Math.round(right.length * 6.2 + 12);
  const total = leftW + rightW;
  const leftMid = leftW / 2;
  const rightMid = leftW + rightW / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="clipkeep: ${right}">
  <linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="r"><rect width="${total}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftW}" height="20" fill="#555"/>
    <rect x="${leftW}" width="${rightW}" height="20" fill="${color}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${leftMid}" y="15" fill="#010101" fill-opacity=".3">${esc(LEFT_LABEL)}</text>
    <text x="${leftMid}" y="14">${esc(LEFT_LABEL)}</text>
    <text x="${rightMid}" y="15" fill="#010101" fill-opacity=".3">${esc(right)}</text>
    <text x="${rightMid}" y="14">${esc(right)}</text>
  </g>
</svg>`;
}

export async function GET(): Promise<Response> {
  let status: ProbeStatus = 'operational';
  try {
    const snapshot = await getPlatformStatuses();
    status = overallStatus(snapshot.results);
  } catch {
    // If probing fails entirely, show "down" rather than a misleading green.
    status = 'down';
  }

  return new Response(badge(status), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}

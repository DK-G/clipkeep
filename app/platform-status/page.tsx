import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site-url';
import {
  getPlatformStatuses,
  getStatusHistory,
  computeUptime,
  overallStatus,
  ALSO_SUPPORTED,
  type ProbeStatus,
} from '@/lib/platform-status/probes';

// Live probes run per request (cached in KV ~10 min inside getPlatformStatuses).
export const dynamic = 'force-dynamic';

const PATH = '/platform-status';
const CANONICAL = `${SITE_URL}${PATH}`;
const BADGE_URL = `${SITE_URL}${PATH}/badge`;
const TITLE = 'ClipKeep Download Status — Live Platform Availability';
const DESCRIPTION =
  'Live availability of the video platforms ClipKeep can download from — Twitter/X, Telegram, Reddit, and Threads — probed from our servers and refreshed every ~10 minutes. Free, open data you can cite or embed.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    // English-only data asset: every locale view canonicalizes to the English URL.
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: CANONICAL,
      type: 'website',
      siteName: 'ClipKeep',
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

const STATUS_META: Record<ProbeStatus, { label: string; pill: string; dot: string }> = {
  operational: { label: 'Operational', pill: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  limited: { label: 'Limited', pill: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  down: { label: 'Down', pill: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
};

const OVERALL_TEXT: Record<ProbeStatus, string> = {
  operational: 'All monitored platforms operational',
  limited: 'Some platforms are rate-limited or degraded',
  down: 'Partial outage detected on a monitored platform',
};

function StatusPill({ status }: { status: ProbeStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.pill}`}>
      <span className={`h-2 w-2 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export default async function PlatformStatusPage() {
  const [snapshot, history] = await Promise.all([getPlatformStatuses(), getStatusHistory()]);
  const overall = overallStatus(snapshot.results);
  const uptime = computeUptime(history);
  const checkedAt = new Date(snapshot.checkedAt);
  const checkedAtLabel = Number.isNaN(checkedAt.getTime()) ? 'unknown' : checkedAt.toUTCString();

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'ClipKeep Video Platform Download Status',
    description: DESCRIPTION,
    url: CANONICAL,
    creator: { '@type': 'Organization', name: 'ClipKeep', url: SITE_URL },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    dateModified: snapshot.checkedAt,
    variableMeasured: snapshot.results.map((r) => `${r.label} availability`),
  };

  const embedHtml = `<a href="${CANONICAL}"><img src="${BADGE_URL}" alt="ClipKeep download status" /></a>`;
  const embedMarkdown = `[![ClipKeep download status](${BADGE_URL})](${CANONICAL})`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm">
          <Link href="/" className="opacity-70 hover:opacity-100 hover:underline">← ClipKeep home</Link>
        </nav>

        <h1 className="text-2xl font-bold sm:text-3xl">Download Status</h1>
        <p className="mt-2 opacity-70">
          Live availability of the platforms ClipKeep downloads from. Probed from our servers and
          cached for ~10 minutes.
        </p>

        {/* Overall banner */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border p-4">
          <span className={`h-3 w-3 rounded-full ${STATUS_META[overall].dot}`} />
          <span className="font-semibold">{OVERALL_TEXT[overall]}</span>
          <span className="ml-auto text-xs opacity-60">Last checked: {checkedAtLabel}</span>
        </div>

        {/* Live table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left opacity-70">
                <th className="py-2 pr-4 font-medium">Platform</th>
                <th className="py-2 pr-4 font-medium">Upstream</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Uptime</th>
                <th className="py-2 pr-4 font-medium">HTTP</th>
                <th className="py-2 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.results.map((r) => {
                const u = uptime[r.platform];
                return (
                  <tr key={r.platform} className="border-b">
                    <td className="py-3 pr-4 font-medium">{r.label}</td>
                    <td className="py-3 pr-4 opacity-70">{r.upstream}</td>
                    <td className="py-3 pr-4"><StatusPill status={r.status} /></td>
                    <td className="py-3 pr-4 tabular-nums opacity-70">{u && u.pct != null ? `${u.pct}%` : '—'}</td>
                    <td className="py-3 pr-4 tabular-nums opacity-70">{r.httpStatus ?? '—'}</td>
                    <td className="py-3 tabular-nums opacity-70">{r.latencyMs != null ? `${r.latencyMs} ms` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs opacity-60">
          {history.length > 0
            ? `Uptime = operational share of the last ${history.length} automated check${history.length === 1 ? '' : 's'} (every ~6h).`
            : 'Uptime history is being collected — the first automated checks appear here within a day.'}
        </p>
        <p className="mt-1 text-xs opacity-60">
          Also supported (live probes expanding): {ALSO_SUPPORTED.join(', ')}.
        </p>

        {/* Methodology */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">How this is measured</h2>
          <p className="mt-2 text-sm opacity-70">
            Every ~10 minutes we send one request to each platform&apos;s public upstream endpoint from
            our servers and record the HTTP status and latency. <strong>Operational</strong> means the
            upstream is reachable and responding as expected. Note that some platforms (Reddit, Threads)
            routinely return 403/429 to datacenter IP addresses — that is expected and does not by itself
            mean a real download will fail. This page reflects upstream reachability, not a guarantee for
            any specific video.
          </p>
        </section>

        {/* Embed (Track B-1: link magnet) */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Embed this status</h2>
          <p className="mt-2 text-sm opacity-70">Add a live ClipKeep status badge to your site or README:</p>
          <p className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BADGE_URL} alt="ClipKeep download status badge" width={160} height={20} />
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border p-3 text-xs"><code>{embedHtml}</code></pre>
          <pre className="mt-2 overflow-x-auto rounded-md border p-3 text-xs"><code>{embedMarkdown}</code></pre>
        </section>

        {/* Internal links */}
        <section className="mt-10 border-t pt-6 text-sm">
          <h2 className="font-semibold">If a download isn&apos;t working</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/solution/twitter-video-downloader-not-working" className="text-blue-600 hover:underline">Twitter / X downloader not working</Link></li>
            <li><Link href="/solution/telegram-video-downloader-not-working" className="text-blue-600 hover:underline">Telegram downloader not working</Link></li>
            <li><Link href="/solution/reddit-video-downloader-not-working" className="text-blue-600 hover:underline">Reddit downloader not working</Link></li>
            <li><Link href="/solution/tiktok-video-downloader-not-working" className="text-blue-600 hover:underline">TikTok downloader not working</Link></li>
          </ul>
        </section>
      </main>
    </>
  );
}

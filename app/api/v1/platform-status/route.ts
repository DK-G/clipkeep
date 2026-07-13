// Public, machine-readable distribution of the platform-status data (Track A).
// This is the Dataset `distribution.contentUrl` — a stable JSON file external
// tools, bloggers, and Google Dataset Search can fetch and cite. CORS-open and
// short-cached; the same KV-cached snapshot the HTML page renders.
import { getPlatformStatuses, getStatusHistory } from '@/lib/platform-status/probes';
import { buildStatusExport } from '@/lib/platform-status/export';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [snapshot, history] = await Promise.all([getPlatformStatuses(), getStatusHistory()]);
  const data = buildStatusExport(snapshot, history);

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Open data: allow any site/tool to fetch and cite it.
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  });
}

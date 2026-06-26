import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PATH_LOCALES = new Set(['ja', 'pt', 'ar']);
const PUBLIC_FILE = /\.[^/]+$/;

// Canonical host derived from the deploy's own NEXT_PUBLIC_SITE_URL (inlined at
// build time). In production this is clipkeep.net; in the test deploy it is the
// test worker's own *.workers.dev URL, so the test environment is never affected.
const CANONICAL_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clipkeep.net').host;
  } catch {
    return 'clipkeep.net';
  }
})();

// Duplicate-content guard: the production worker is also reachable on its default
// *.workers.dev subdomain, which serves a full duplicate of the site. A cross-domain
// canonical is only a hint Google may ignore, so 301-redirect page requests from any
// non-canonical workers.dev host to the canonical origin to consolidate indexing.
function redirectNonCanonicalHost(request: NextRequest): NextResponse | null {
  const host = request.headers.get('host');
  if (!host || host === CANONICAL_HOST || !host.endsWith('.workers.dev')) {
    return null;
  }
  const { pathname, search } = request.nextUrl;
  const target = new URL(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://clipkeep.net'}${pathname}${search}`);
  return NextResponse.redirect(target, 301);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const canonicalRedirect = redirectNonCanonicalHost(request);
  if (canonicalRedirect) {
    return canonicalRedirect;
  }

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (!locale || !PATH_LOCALES.has(locale)) {
    return NextResponse.next();
  }

  const rewrittenPath = `/${segments.slice(1).join('/')}`;
  const url = request.nextUrl.clone();
  url.pathname = rewrittenPath === '/' ? '/' : rewrittenPath.replace(/\/+$/, '') || '/';
  url.searchParams.set('locale', locale);

  searchParams.forEach((value, key) => {
    if (key !== 'locale' && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)'],
};

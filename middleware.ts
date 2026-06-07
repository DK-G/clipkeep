import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PATH_LOCALES = new Set(['ja', 'pt', 'ar']);
const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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

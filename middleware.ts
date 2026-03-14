import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ja', 'ar'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip if we are accessing internal Next.js files or static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // If locale is already explicitly set in URL, don't do anything
  if (searchParams.has('locale')) {
    return NextResponse.next();
  }

  // Otherwise, detect language from headers
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = DEFAULT_LOCALE;

  if (acceptLanguage) {
    // Basic parsing of accept-language header: "ja,en-US;q=0.9,en;q=0.8"
    const languages = acceptLanguage
      .split(',')
      .map((langStr: string) => langStr.split(';')[0].trim().toLowerCase().split('-')[0]);

    for (const lang of languages) {
      if (SUPPORTED_LOCALES.includes(lang)) {
        detectedLocale = lang;
        break;
      }
    }
  }

  // Redirect to the same URL but with the detected locale
  const url = request.nextUrl.clone();
  url.searchParams.set('locale', detectedLocale);
  
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

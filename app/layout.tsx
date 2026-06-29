import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { HeaderShell } from '@/components/header-shell';
import { Footer } from '@/components/footer';
import { LocaleUpdater } from '@/components/locale-updater';
import { AnalyticsPageView } from '@/components/analytics-page-view';
import { AdDiagnostics } from '@/components/analytics/ad-diagnostics';
import { GrowthLoopTracker } from '@/components/analytics/growth-loop-tracker';
import { SITE_URL } from '@/lib/site-url';
import { SUPPORTED_LOCALES } from '@/lib/metadata-helper';

import './globals.css';
 
const siteUrl = SITE_URL;
const gaId = process.env.NEXT_PUBLIC_GA_ID;
 
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ClipKeep',
    template: '%s | ClipKeep',
  },
  description: 'ClipKeep is an SNS media extraction hub focused on practical workflows and solution guidance.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ClipKeep',
  },
  openGraph: {
    title: 'ClipKeep',
    description: 'SNS media extraction workflows with multilingual solution guidance.',
    url: siteUrl,
    siteName: 'ClipKeep',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClipKeep',
    description: 'SNS media extraction workflows with multilingual solution guidance.',
    creator: '@clipkeep',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
};
 
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ClipKeep',
  url: siteUrl,
  inLanguage: [...SUPPORTED_LOCALES],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
};
 
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ClipKeep',
  url: siteUrl,
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Suspense fallback={null}>
          <LocaleUpdater />
        </Suspense>

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" data-cfasync="false" />
            <Script id="ga-init" strategy="afterInteractive" data-cfasync="false">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${gaId}', { send_page_view: false });`}
            </Script>
            <Suspense fallback={null}>
              <AnalyticsPageView gaId={gaId} />
            </Suspense>
            <GrowthLoopTracker />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        
        <Suspense fallback={<header className="h-16 border-b border-gray-100" />}>
          <HeaderShell />
        </Suspense>

        {children}
        <Footer />

        <AdDiagnostics />
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { HeaderShell } from '@/components/header-shell';
import { Footer } from '@/components/footer';
import { LocaleUpdater } from '@/components/locale-updater';

import './globals.css';
 
const siteUrl = 'https://clipkeep.net';
const gaId = process.env.NEXT_PUBLIC_GA_ID;
 
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ClipKeep',
    template: '%s | ClipKeep',
  },
  description: 'ClipKeep is an SNS media extraction hub focused on practical workflows and solution guidance.',
  alternates: {
    canonical: '/',
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
  verification: {
    other: {
      'google-adsense-account': 'ca-pub-5877075056686035',
    },
  },
};
 
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ClipKeep',
  url: siteUrl,
  inLanguage: ['en', 'ar', 'ja', 'es', 'pt', 'fr', 'id', 'hi', 'de', 'tr'],
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5877075056686035"
          crossOrigin="anonymous"
        />
        <Suspense fallback={null}>
          <LocaleUpdater />
        </Suspense>

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        
        <Suspense fallback={<header className="h-16 border-b border-gray-100" />}>
          <HeaderShell />
        </Suspense>

        {children}
        <Footer />

        {/* Monetag: In-Page Push */}
        <Script id="monetag-in-page-push" strategy="afterInteractive">
          {`(function(s){s.dataset.zone='10760541',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
        {/* Monetag: Vignette */}
        <Script id="monetag-vignette" strategy="afterInteractive">
          {`(function(s){s.dataset.zone='10760542',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>

        {/* Cloudflare Turnstile */}
        <Script 
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

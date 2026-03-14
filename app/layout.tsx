import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = 'https://clipkeep.com';
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
    languages: {
      en: '/?locale=en',
      ar: '/?locale=ar',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'ClipKeep',
    description: 'SNS media extraction workflows with multilingual solution guidance.',
    url: siteUrl,
    siteName: 'ClipKeep',
    type: 'website',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ClipKeep',
  url: siteUrl,
  inLanguage: ['en', 'ar'],
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ClipKeep',
  url: siteUrl,
};

import { LanguageSwitcher } from '@/components/language-switcher';
import { Footer } from '@/components/footer';
import { AdsterraAds } from '@/components/ads/adsterra';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <AdsterraAds />
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
        
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div style={{ maxWidth: 980, margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: 20, fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>
              ClipKeep
            </Link>
            <Suspense fallback={<div className="w-20 h-8 bg-gray-50 animate-pulse rounded-md" />}>
              <LanguageSwitcher />
            </Suspense>
          </div>
        </header>

        {children}
        <Footer />
      </body>
    </html>
  );
}

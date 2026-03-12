import Link from 'next/link';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
        {children}
        <footer style={{ maxWidth: 980, margin: '32px auto 24px', padding: '0 24px', fontSize: 13, color: '#555' }}>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/cookies">Cookies</Link>
            <Link href="/legal/dmca">DMCA</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/status">Status</Link>
          </nav>
          <p style={{ margin: 0 }}>Ads, when enabled, are labeled as sponsored content.</p>
        </footer>
      </body>
    </html>
  );
}

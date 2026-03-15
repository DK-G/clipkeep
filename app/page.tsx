import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ClipKeep Home | SNS Downloader Hub',
  description: 'ClipKeep home hub for Twitter, Telegram, and TikTok downloader tools, weekly ranking, and recent downloads.',
  alternates: {
    canonical: '/',
  },
};

const cardClass =
  'block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm sm:text-base font-medium text-gray-800 no-underline hover:border-blue-300 hover:bg-blue-50 transition';

const badgeClass =
  'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700';

const sectionCardClass =
  'rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">ClipKeep</h1>
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600">
          SNS動画ダウンローダーへの案内ページです。用途に応じて各ページへ進んでください。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
          <span className={badgeClass}>X (Twitter)</span>
          <span className={badgeClass}>TikTok</span>
          <span className={badgeClass}>Telegram</span>
        </div>
      </header>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">SNS Tools & Feeds</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900">Telegram</h3>
            <div className="grid gap-2.5">
              <Link href="/download-telegram-video" className={cardClass}>Downloader</Link>
              <Link href="/telegram-trending-videos" className={cardClass}>Weekly Ranking</Link>
              <Link href="/telegram-latest-videos" className={cardClass}>Recent Downloads</Link>
            </div>
          </div>

          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900">X (Twitter)</h3>
            <div className="grid gap-2.5">
              <Link href="/download-twitter-video" className={cardClass}>Downloader</Link>
              <Link href="/twitter-trending-videos" className={cardClass}>Weekly Ranking</Link>
              <Link href="/twitter-latest-videos" className={cardClass}>Recent Downloads</Link>
            </div>
          </div>

          <div className={sectionCardClass}>
            <h3 className="mb-3 text-lg font-bold text-gray-900">TikTok</h3>
            <div className="grid gap-2.5">
              <Link href="/download-tiktok-video" className={cardClass}>Downloader</Link>
              <Link href="/tiktok-trending-videos" className={cardClass}>Weekly Ranking</Link>
              <Link href="/tiktok-latest-videos" className={cardClass}>Recent Downloads</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Site Information</h2>
        <ul className="mt-3 list-disc pl-5 leading-8 text-sm sm:text-base text-gray-700">
          <li><Link href="/sitemap.xml" className="hover:text-blue-700">Sitemap</Link></li>
          <li><Link href="/status" className="hover:text-blue-700">Service Status</Link></li>
          <li><Link href="/legal/terms" className="hover:text-blue-700">Terms of Service</Link></li>
          <li><Link href="/legal/privacy" className="hover:text-blue-700">Privacy Policy</Link></li>
          <li><Link href="/legal/cookies" className="hover:text-blue-700">Cookie Policy</Link></li>
          <li><Link href="/legal/dmca" className="hover:text-blue-700">DMCA / Copyright</Link></li>
          <li><Link href="/contact" className="hover:text-blue-700">Contact</Link></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Notes</h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-600">
          トップページでは抽出機能を提供しません。抽出は各専用ダウンローダーページから行ってください。
        </p>
      </section>
    </main>
  );
}


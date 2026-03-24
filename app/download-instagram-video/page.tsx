
import { normalizeLocale, menuText } from '@/lib/i18n/ui';

export default async function Page({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const sp = await searchParams;
  const locale = normalizeLocale(sp.locale);
  const menu = menuText[locale];
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        'name': 'Under Maintenance | ClipKeep',
        'url': `https://clipkeep.net/download-instagram-video?locale=${locale}`
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': menu.downloads,
            'item': 'https://clipkeep.net/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Instagram',
            'item': `https://clipkeep.net/download-instagram-video?locale=${locale}`
          }
        ]
      }
    ]
  };
  
  const messages = {
    en: "This service is currently under maintenance or temporarily disabled.",
    ja: "このサービスは現在メンテナンス中か、一時的に停止しています。",
  };
  const msg = messages[locale as keyof typeof messages] || messages.en;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4">Under Maintenance</h1>
        <p className="text-slate-600 dark:text-slate-400">{msg}</p>
        <a href={`/?locale=${locale}`} className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Back to Home
        </a>
      </div>
    </div>
    </>
  );
}

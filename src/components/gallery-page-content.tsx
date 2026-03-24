'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Platform } from '@/lib/extract/types';
import { Locale, galleryPages, menuText } from '@/lib/i18n/ui';
import { GallerySection, GalleryItem } from '@/components/gallery-section';
import { SEOContent } from '@/components/seo-content';
import { VideoSchema } from '@/components/video-schema';

interface GalleryPageContentProps {
  platform: Platform;
  locale: Locale;
  type: 'trending' | 'latest';
}

const ctaText: Record<
  Locale,
  {
    pageNotFound: string;
    nextSteps: string;
    tryDownloader: string;
    downloaderBody: string;
    openDownloader: (platform: Platform) => string;
    exploreMore: string;
    exploreBody: string;
    openRelated: (type: 'trending' | 'latest', rankings: string, latest: string) => string;
  }
> = {
  en: {
    pageNotFound: 'Page not found',
    nextSteps: 'Next Steps',
    tryDownloader: 'Try the Downloader',
    downloaderBody: 'Ready to save a specific clip? Go directly to the platform downloader.',
    openDownloader: (platform) => `Open ${platform.toUpperCase()} Downloader`,
    exploreMore: 'Explore More Discovery Pages',
    exploreBody: 'Continue browsing related media from the same platform.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  ja: {
    pageNotFound: 'ページが見つかりません',
    nextSteps: '次のアクション',
    tryDownloader: 'ダウンローダーを使う',
    downloaderBody: '保存したい動画がある場合は、各プラットフォームの専用ダウンローダーへ進んでください。',
    openDownloader: (platform) => `${platform.toUpperCase()} ダウンローダーを開く`,
    exploreMore: '関連ページを見る',
    exploreBody: '同じプラットフォームの関連メディアを引き続き閲覧できます。',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  ar: {
    pageNotFound: 'الصفحة غير موجودة',
    nextSteps: 'الخطوات التالية',
    tryDownloader: 'جرب أداة التنزيل',
    downloaderBody: 'هل تريد حفظ مقطع محدد؟ انتقل مباشرة إلى أداة تنزيل المنصة.',
    openDownloader: (platform) => `افتح أداة تنزيل ${platform.toUpperCase()}`,
    exploreMore: 'استكشف صفحات إضافية',
    exploreBody: 'واصل تصفح الوسائط ذات الصلة من نفس المنصة.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  es: {
    pageNotFound: 'Página no encontrada',
    nextSteps: 'Siguientes pasos',
    tryDownloader: 'Probar el descargador',
    downloaderBody: '¿Quieres guardar un clip específico? Ve directo al descargador de la plataforma.',
    openDownloader: (platform) => `Abrir descargador de ${platform.toUpperCase()}`,
    exploreMore: 'Explorar más páginas',
    exploreBody: 'Sigue viendo contenido relacionado de la misma plataforma.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  pt: {
    pageNotFound: 'Página não encontrada',
    nextSteps: 'Próximos passos',
    tryDownloader: 'Usar o downloader',
    downloaderBody: 'Quer salvar um clipe específico? Acesse direto o downloader da plataforma.',
    openDownloader: (platform) => `Abrir downloader de ${platform.toUpperCase()}`,
    exploreMore: 'Explorar mais páginas',
    exploreBody: 'Continue navegando por mídias relacionadas da mesma plataforma.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  fr: {
    pageNotFound: 'Page introuvable',
    nextSteps: 'Étapes suivantes',
    tryDownloader: 'Essayer le téléchargeur',
    downloaderBody: 'Vous voulez enregistrer un clip précis ? Ouvrez directement le téléchargeur de la plateforme.',
    openDownloader: (platform) => `Ouvrir le téléchargeur ${platform.toUpperCase()}`,
    exploreMore: 'Explorer plus de pages',
    exploreBody: 'Continuez à parcourir les médias liés de la même plateforme.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  id: {
    pageNotFound: 'Halaman tidak ditemukan',
    nextSteps: 'Langkah berikutnya',
    tryDownloader: 'Coba downloader',
    downloaderBody: 'Ingin menyimpan klip tertentu? Buka langsung downloader platform.',
    openDownloader: (platform) => `Buka downloader ${platform.toUpperCase()}`,
    exploreMore: 'Jelajahi halaman lain',
    exploreBody: 'Lanjutkan melihat media terkait dari platform yang sama.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  hi: {
    pageNotFound: 'पेज नहीं मिला',
    nextSteps: 'अगले कदम',
    tryDownloader: 'डाउनलोडर इस्तेमाल करें',
    downloaderBody: 'कोई खास क्लिप सेव करनी है? सीधे प्लेटफॉर्म डाउनलोडर पर जाएं।',
    openDownloader: (platform) => `${platform.toUpperCase()} डाउनलोडर खोलें`,
    exploreMore: 'और पेज देखें',
    exploreBody: 'उसी प्लेटफॉर्म से जुड़ा कंटेंट देखते रहें।',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  de: {
    pageNotFound: 'Seite nicht gefunden',
    nextSteps: 'Nächste Schritte',
    tryDownloader: 'Downloader nutzen',
    downloaderBody: 'Möchten Sie einen bestimmten Clip speichern? Öffnen Sie direkt den Downloader der Plattform.',
    openDownloader: (platform) => `${platform.toUpperCase()} Downloader öffnen`,
    exploreMore: 'Weitere Seiten entdecken',
    exploreBody: 'Durchsuchen Sie weitere passende Medien derselben Plattform.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
  tr: {
    pageNotFound: 'Sayfa bulunamadı',
    nextSteps: 'Sonraki adımlar',
    tryDownloader: 'İndiriciyi kullan',
    downloaderBody: 'Belirli bir klibi kaydetmek ister misiniz? Doğrudan platform indiricisine gidin.',
    openDownloader: (platform) => `${platform.toUpperCase()} indiricisini aç`,
    exploreMore: 'Daha fazla sayfa keşfet',
    exploreBody: 'Aynı platformdaki ilgili medyayı incelemeye devam edin.',
    openRelated: (type, rankings, latest) => (type === 'trending' ? latest : rankings),
  },
};

function downloaderPath(platform: Platform): string {
  if (platform === 'twitter') return '/download-twitter-video';
  if (platform === 'telegram') return '/download-telegram-video';
  return '/download-tiktok-video';
}

function oppositeFeed(type: 'trending' | 'latest', platform: Platform): string {
  const base = `/${platform}`;
  return type === 'trending' ? `${base}-latest-videos` : `${base}-trending-videos`;
}

export function GalleryPageContent({ platform, locale, type }: GalleryPageContentProps) {
  const pageKey = `${type}${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
  const dict = galleryPages[locale]?.[pageKey] || galleryPages.en?.[pageKey];
  const menu = menuText[locale] || menuText.en;
  const t = ctaText[locale] || ctaText.en;

  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const endpoint = type === 'trending' ? 'trending' : 'recent';
      const res = await fetch(`/api/v1/gallery/${endpoint}?platform=${platform}&limit=24`);
      const json = (await res.json()) as { ok: boolean; data: GalleryItem[] };
      if (json.ok) {
        setItems(json.data);
      }
    }
    fetchItems();
  }, [platform, type]);

  if (!dict) return <div className="p-20 text-center">{t.pageNotFound}</div>;

  const toolHref = `${downloaderPath(platform)}?locale=${locale}`;
  const feedHref = `${oppositeFeed(type, platform)}?locale=${locale}`;
  const baseUrl = 'https://clipkeep.net';
  const pagePath = `/${platform}-${type}-videos${locale === 'en' ? '' : `?locale=${locale}`}`;
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: dict.title,
        description: dict.description,
        url: `${baseUrl}${pagePath}`,
      },
      {
        '@type': 'ItemList',
        name: dict.title,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/result/${item.id}${locale === 'en' ? '' : `?locale=${locale}`}`,
        })),
      },
    ],
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <VideoSchema items={items} />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-4">{dict.title}</h1>
        <p className="text-xl text-gray-500 dark:text-slate-400 max-w-3xl mx-auto">{dict.subtitle}</p>
      </div>

      <GallerySection
        platform={platform}
        locale={locale}
        title={type === 'trending' ? menu.rankings : menu.latest}
        initialItems={items}
        limit={24}
        hideMeta={false}
        dense={false}
        layout="masonry"
      />

      <section className="mt-12 max-w-4xl mx-auto rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">{t.nextSteps}</h2>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">{t.tryDownloader}</h3>
        <p className="text-gray-600 dark:text-slate-400 mb-3">{t.downloaderBody}</p>
        <Link href={toolHref} className="text-blue-600 font-semibold hover:underline">
          {t.openDownloader(platform)}
        </Link>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mt-6 mb-2">{t.exploreMore}</h3>
        <p className="text-gray-600 dark:text-slate-400 mb-3">{t.exploreBody}</p>
        <Link href={feedHref} className="text-blue-600 font-semibold hover:underline">
          {t.openRelated(type, menu.rankings, menu.latest)}
        </Link>
      </section>

      <SEOContent content={dict.seoContent || ''} />
    </main>
  );
}

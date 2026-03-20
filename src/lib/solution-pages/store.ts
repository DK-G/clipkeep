import type { Locale } from "@/lib/i18n/ui";

export type SolutionSection = {
  id: string;
  heading: string;
  body: string;
};

export type SolutionPage = {
  slug: string;
  locale: Locale;
  title: string;
  sections: SolutionSection[];
  cta: {
    label: string;
    href: string;
  };
};

const locales: Locale[] = ["en", "ja", "ar", "es", "pt", "fr", "id", "hi", "de", "tr"];

const telegramGuide: Record<Locale, { title: string; s1: string; s2: string; cta: string }> = {
  en: { title: "Telegram Video Downloader Not Working", s1: "Use a valid public Telegram post or channel link.", s2: "Temporary upstream limits may resolve within a few minutes.", cta: "Try Telegram Downloader" },
  ja: { title: "Telegram動画が保存できない場合", s1: "公開されているTelegram投稿またはチャンネルURLを使用してください。", s2: "一時的な制限は数分で解消する場合があります。", cta: "Telegramダウンローダーを試す" },
  ar: { title: "مشكلة في تنزيل فيديو تيليجرام", s1: "استخدم رابط منشور أو قناة Telegram عامة وصالحة.", s2: "قد تختفي القيود المؤقتة خلال بضع دقائق.", cta: "جرّب تنزيل تيليجرام" },
  es: { title: "El descargador de Telegram no funciona", s1: "Usa un enlace publico valido de Telegram.", s2: "Las limitaciones temporales pueden resolverse en pocos minutos.", cta: "Probar descargador de Telegram" },
  pt: { title: "Downloader do Telegram nao funciona", s1: "Use um link publico valido do Telegram.", s2: "Limitacoes temporarias podem normalizar em alguns minutos.", cta: "Testar downloader do Telegram" },
  fr: { title: "Le telechargeur Telegram ne fonctionne pas", s1: "Utilisez un lien Telegram public et valide.", s2: "Les limitations temporaires peuvent disparaitre en quelques minutes.", cta: "Essayer le telechargeur Telegram" },
  id: { title: "Pengunduh Telegram tidak berfungsi", s1: "Gunakan tautan Telegram publik yang valid.", s2: "Pembatasan sementara biasanya pulih dalam beberapa menit.", cta: "Coba pengunduh Telegram" },
  hi: { title: "Telegram downloader kaam nahi kar raha", s1: "Valid public Telegram post ya channel link ka upyog karein.", s2: "Temporary limits kuch minute me normal ho sakte hain.", cta: "Telegram downloader azmayein" },
  de: { title: "Telegram-Downloader funktioniert nicht", s1: "Verwenden Sie einen gultigen offentlichen Telegram-Link.", s2: "Temporare Limits konnen sich in wenigen Minuten auflosen.", cta: "Telegram-Downloader testen" },
  tr: { title: "Telegram indirici calismiyor", s1: "Gecerli ve herkese acik bir Telegram baglantisi kullanin.", s2: "Gecici kisitlar birkac dakika icinde duzelebilir.", cta: "Telegram indiriciyi dene" },
};

const twitterGuide: Record<Locale, { title: string; s1: string; s2: string; cta: string }> = {
  en: { title: "Twitter Video Downloader Not Working", s1: "Private or restricted posts cannot be processed.", s2: "Use a direct tweet URL without tracking parameters.", cta: "Try Twitter Downloader" },
  ja: { title: "Twitter動画が保存できない場合", s1: "非公開または制限付き投稿は処理できません。", s2: "追跡パラメータなしの直接URLを使用してください。", cta: "Twitterダウンローダーを試す" },
  ar: { title: "مشكلة في تنزيل فيديو تويتر", s1: "لا يمكن معالجة المنشورات الخاصة أو المقيّدة.", s2: "استخدم رابط التغريدة المباشر بدون معاملات تتبع.", cta: "جرّب تنزيل تويتر" },
  es: { title: "El descargador de Twitter no funciona", s1: "Las publicaciones privadas o restringidas no se pueden procesar.", s2: "Usa la URL directa del tweet sin parametros de seguimiento.", cta: "Probar descargador de Twitter" },
  pt: { title: "Downloader do Twitter nao funciona", s1: "Posts privados ou restritos nao podem ser processados.", s2: "Use a URL direta do tweet sem parametros de rastreamento.", cta: "Testar downloader do Twitter" },
  fr: { title: "Le telechargeur Twitter ne fonctionne pas", s1: "Les publications privees ou restreintes ne peuvent pas etre traitees.", s2: "Utilisez l URL directe du tweet sans parametres de suivi.", cta: "Essayer le telechargeur Twitter" },
  id: { title: "Pengunduh Twitter tidak berfungsi", s1: "Posting privat atau terbatas tidak dapat diproses.", s2: "Gunakan URL tweet langsung tanpa parameter pelacakan.", cta: "Coba pengunduh Twitter" },
  hi: { title: "Twitter downloader kaam nahi kar raha", s1: "Private ya restricted posts process nahi ho sakte.", s2: "Tracking parameter ke bina direct tweet URL ka upyog karein.", cta: "Twitter downloader azmayein" },
  de: { title: "Twitter-Downloader funktioniert nicht", s1: "Private oder eingeschrankte Beitrage konnen nicht verarbeitet werden.", s2: "Verwenden Sie die direkte Tweet-URL ohne Tracking-Parameter.", cta: "Twitter-Downloader testen" },
  tr: { title: "Twitter indirici calismiyor", s1: "Ozel veya kisitli gonderiler islenemez.", s2: "Takip parametresi olmadan dogrudan tweet URLsi kullanin.", cta: "Twitter indiriciyi dene" },
};

const degradedGuide: Record<Locale, { title: string; s1: string; cta: string }> = {
  en: { title: "Extractor Temporarily Limited", s1: "Service is in degraded mode. Retry after the suggested wait time.", cta: "Check Service Status" },
  ja: { title: "抽出機能は一時的に制限中", s1: "現在は負荷軽減モードです。案内された待機時間後に再試行してください。", cta: "サービス状況を確認" },
  ar: { title: "الخدمة محدودة مؤقتًا", s1: "الخدمة تعمل في وضع التخفيف. أعد المحاولة بعد المهلة المقترحة.", cta: "تحقق من حالة الخدمة" },
  es: { title: "Extractor temporalmente limitado", s1: "El servicio esta en modo degradado. Reintenta tras el tiempo sugerido.", cta: "Ver estado del servicio" },
  pt: { title: "Extractor temporariamente limitado", s1: "O servico esta em modo degradado. Tente novamente apos o tempo sugerido.", cta: "Ver status do servico" },
  fr: { title: "Extracteur temporairement limite", s1: "Le service est en mode degrade. Reessayez apres le delai suggere.", cta: "Voir l etat du service" },
  id: { title: "Extractor dibatasi sementara", s1: "Layanan sedang dalam mode degradadasi. Coba lagi setelah waktu yang disarankan.", cta: "Lihat status layanan" },
  hi: { title: "Extractor temporary limited", s1: "Service degraded mode me hai. Suggested wait ke baad dobara try karein.", cta: "Service status dekhen" },
  de: { title: "Extractor vorubergehend eingeschrankt", s1: "Der Dienst lauft im Degraded-Mode. Bitte nach der vorgeschlagenen Wartezeit erneut versuchen.", cta: "Service-Status prufen" },
  tr: { title: "Extractor gecici olarak sinirli", s1: "Hizmet degrade modunda calisiyor. Onerilen bekleme suresinden sonra tekrar deneyin.", cta: "Servis durumunu kontrol et" },
};

const pages: SolutionPage[] = [
  ...locales.map((locale) => ({
    slug: "telegram-video-downloader-not-working",
    locale,
    title: telegramGuide[locale].title,
    sections: [
      { id: "s1", heading: "Step 1", body: telegramGuide[locale].s1 },
      { id: "s2", heading: "Step 2", body: telegramGuide[locale].s2 },
    ],
    cta: { label: telegramGuide[locale].cta, href: "/download-telegram-video" },
  })),
  ...locales.map((locale) => ({
    slug: "twitter-video-downloader-not-working",
    locale,
    title: twitterGuide[locale].title,
    sections: [
      { id: "s1", heading: "Step 1", body: twitterGuide[locale].s1 },
      { id: "s2", heading: "Step 2", body: twitterGuide[locale].s2 },
    ],
    cta: { label: twitterGuide[locale].cta, href: "/download-twitter-video" },
  })),
  ...locales.map((locale) => ({
    slug: "extractor-temporary-limited",
    locale,
    title: degradedGuide[locale].title,
    sections: [{ id: "s1", heading: "Status", body: degradedGuide[locale].s1 }],
    cta: { label: degradedGuide[locale].cta, href: "/status" },
  })),
];

export function findSolutionPage(slug: string, locale: Locale): SolutionPage | undefined {
  return pages.find((p) => p.slug === slug && p.locale === locale)
    ?? pages.find((p) => p.slug === slug && p.locale === "en");
}

export type Locale = "en" | "ar";

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

const pages: SolutionPage[] = [
  {
    slug: "telegram-video-downloader-not-working",
    locale: "en",
    title: "Telegram Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Check the link format", body: "Use a valid public Telegram post or channel link." },
      { id: "s2", heading: "Retry after a short delay", body: "Temporary upstream limits may resolve within a few minutes." }
    ],
    cta: { label: "Try Telegram Extractor", href: "/extractor/telegram" }
  },
  {
    slug: "telegram-video-downloader-not-working",
    locale: "ar",
    title: "مشكلة في تنزيل فيديو تيليجرام",
    sections: [
      { id: "s1", heading: "تحقق من صيغة الرابط", body: "استخدم رابطًا عامًا صالحًا من تيليجرام." },
      { id: "s2", heading: "أعد المحاولة بعد قليل", body: "قد تختفي قيود المصدر المؤقتة خلال دقائق." }
    ],
    cta: { label: "جرّب أداة تيليجرام", href: "/ar/extractor/telegram" }
  },
  {
    slug: "twitter-video-downloader-not-working",
    locale: "en",
    title: "Twitter Video Downloader Not Working",
    sections: [
      { id: "s1", heading: "Confirm the post is public", body: "Private or restricted posts cannot be processed." },
      { id: "s2", heading: "Use direct tweet URL", body: "Shortened or tracking links may fail validation." }
    ],
    cta: { label: "Try Twitter Extractor", href: "/extractor/twitter" }
  },
  {
    slug: "twitter-video-downloader-not-working",
    locale: "ar",
    title: "مشكلة في تنزيل فيديو تويتر",
    sections: [
      { id: "s1", heading: "تأكد أن التغريدة عامة", body: "لا يمكن معالجة المنشورات الخاصة أو المقيّدة." },
      { id: "s2", heading: "استخدم رابط التغريدة المباشر", body: "قد تفشل الروابط المختصرة في التحقق." }
    ],
    cta: { label: "جرّب أداة تويتر", href: "/ar/extractor/twitter" }
  },
  {
    slug: "extractor-temporary-limited",
    locale: "en",
    title: "Extractor Temporarily Limited",
    sections: [{ id: "s1", heading: "Service is in degraded mode", body: "Please retry after the suggested wait time." }],
    cta: { label: "Check Service Health", href: "/api/v1/health" }
  },
  {
    slug: "extractor-temporary-limited",
    locale: "ar",
    title: "الخدمة محدودة مؤقتًا",
    sections: [{ id: "s1", heading: "الخدمة في وضع تقليل الأحمال", body: "يرجى إعادة المحاولة بعد المهلة المقترحة." }],
    cta: { label: "تحقق من حالة الخدمة", href: "/api/v1/health" }
  }
];

export function findSolutionPage(slug: string, locale: Locale): SolutionPage | undefined {
  return pages.find((p) => p.slug === slug && p.locale === locale);
}
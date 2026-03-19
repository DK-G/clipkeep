'use client';

import { normalizeLocale, localeDir } from '@/lib/i18n/ui';

interface Props {
  localeParam?: string;
}

export function AboutContentClient({ localeParam }: Props) {
  const locale = normalizeLocale(localeParam);
  const dir = localeDir(locale);

  const texts = {
    en: {
      title: "About ClipKeep",
      body: "ClipKeep is a leading-edge media extraction hub designed to help users archive high-quality video content from platforms like Twitter (X), Telegram, and TikTok. Our mission is to provide a fast, secure, and privacy-focused solution for digital curators and researchers around the world.",
      visionTitle: "Our Vision",
      visionBody: "We believe in a free and open internet where users have the right to keep their favorite digital moments offline. ClipKeep aims to bridge the gap between dynamic social streams and permanent personal archives.",
      whyUsTitle: "Why ClipKeep?",
      whyUsBody: "Unlike other tools that require account access or invasive cookies, ClipKeep operates purely on public links. Powered by Cloudflare, our infrastructure ensures low latency and high stability for every extraction job.",
    },
    ja: {
      title: "ClipKeep について",
      body: "ClipKeepは、Twitter (X)、Telegram、TikTokなどの主要プラットフォームから高品質なメディアをアーカイブするための最先端の抽出ハブです。私たちの使命は、世界中のデジタルクリエイターやリサーチャーに、高速かつ安全でプライバシーを重視したソリューションを提供することです。",
      visionTitle: "私たちのビジョン",
      visionBody: "ユーザーがお気に入りのデジタルコンテンツをオフラインで保管する権利を持つべきだと考えています。ClipKeepは、流動的なSNSストリームと、永続的な個人アーカイブとの架け橋となることを目指しています。",
      whyUsTitle: "なぜ ClipKeep なのか？",
      whyUsBody: "アカウントへのアクセスやCookieを要求する他のツールとは異なり、ClipKeepは公開リンクのみで動作します。Cloudflareを活用したインフラにより、あらゆる抽出リクエストに対して低遅延と高い安定性を保証します。",
    },
    ar: {
      title: "حول ClipKeep",
      body: "ClipKeep هو مركز متطور لاستخراج الوسائط مصمم لمساعدة المستخدمين على أرشفة محتوى الفيديو عالي الجودة من منصات مثل تويتر (X) وتيليجرام وتيك توك. مهمتنا هي توفير حل سريع وآمن يركز على الخصوصية للمنسقين الرقميين والباحثين حول العالم.",
      visionTitle: "رؤيتنا",
      visionBody: "نحن نؤمن بإنترنت حر ومفتوح حيث يحق للمستخدمين الاحتفاظ بلحظاتهم الرقمية المفضلة دون اتصال بالإنترنت. يهدف ClipKeep إلى سد الفجوة بين التدفقات الاجتماعية الديناميكية والأرشيفات الشخصية الدائمة.",
      whyUsTitle: "لماذا ClipKeep؟",
      whyUsBody: "على عكس الأدوات الأخرى التي تتطلب الوصول إلى الحساب أو ملفات تعريف الارتباط الغازية، يعمل ClipKeep بشكل نقي على الروابط العامة. مدعومة بـ Cloudflare، تضمن بنيتنا التحتية زمن انتقال منخفض واستقرارًا عاليًا لكل مهمة استخراج.",
    }
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-6 tracking-tight">{t.title}</h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {t.body}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">{t.visionTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">
            {t.visionBody}
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">{t.whyUsTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">
            {t.whyUsBody}
          </p>
        </section>
      </div>

      <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl text-center border border-blue-100 dark:border-blue-800/50">
        <p className="text-blue-800 dark:text-blue-300 font-semibold tracking-wide uppercase text-sm">
          ClipKeep is a project committed to utility, transparency, and high-performance SNS archiving.
        </p>
      </div>
    </main>
  );
}

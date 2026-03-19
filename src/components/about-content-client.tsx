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
      title: 'About ClipKeep',
      body: 'ClipKeep helps you organize and preserve publicly shared media from supported social platforms. We focus on practical workflows for personal archiving, research, and reference use.',
      visionTitle: 'What We Aim For',
      visionBody: 'We design ClipKeep so users can keep important online media accessible over time, even when platform interfaces or content availability change.',
      whyUsTitle: 'How ClipKeep Works',
      whyUsBody: 'ClipKeep processes public links and focuses on clear extraction flows. The service is built for reliability and consistent response performance.',
      projectNote: 'ClipKeep is built around utility, transparency, and stable SNS archiving workflows.',
    },
    ja: {
      title: 'ClipKeep について',
      body: 'ClipKeep は、対応するSNS上で公開されているメディアを整理・保存するためのサービスです。個人アーカイブや調査用途で使いやすい、実務的な導線を重視しています。',
      visionTitle: '目指していること',
      visionBody: 'プラットフォームの仕様変更や公開状況の変化があっても、必要な記録に継続してアクセスできる状態を保つことを目標にしています。',
      whyUsTitle: 'ClipKeep の仕組み',
      whyUsBody: '公開リンクを起点に処理し、分かりやすい抽出フローを提供します。安定性と応答性を重視した構成で運用しています。',
      projectNote: 'ClipKeep は、実用性・透明性・安定したSNSアーカイブ運用を重視して開発しています。',
    },
    ar: {
      title: 'حول ClipKeep',
      body: 'يساعدك ClipKeep على تنظيم وحفظ الوسائط المنشورة علنًا من المنصات الاجتماعية المدعومة. نركز على سير عمل عملي يناسب الأرشفة الشخصية والبحث والاستخدام المرجعي.',
      visionTitle: 'ما الذي نسعى إليه',
      visionBody: 'نطوّر ClipKeep بحيث تظل الوسائط المهمة متاحة مع مرور الوقت، حتى عند تغيّر واجهات المنصات أو سياسات النشر.',
      whyUsTitle: 'كيف يعمل ClipKeep',
      whyUsBody: 'يعتمد ClipKeep على الروابط العامة ويوفر مسار استخراج واضحًا. تم بناء الخدمة لتحقيق الاستقرار وسرعة الاستجابة بشكل متسق.',
      projectNote: 'تم تطوير ClipKeep مع التركيز على الفائدة العملية والشفافية واستقرار أرشفة محتوى SNS.',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-6 tracking-tight">{t.title}</h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">{t.body}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">{t.visionTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">{t.visionBody}</p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">{t.whyUsTitle}</h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-lg">{t.whyUsBody}</p>
        </section>
      </div>

      <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl text-center border border-blue-100 dark:border-blue-800/50">
        <p className="text-blue-800 dark:text-blue-300 font-semibold tracking-wide uppercase text-sm">{t.projectNote}</p>
      </div>
    </main>
  );
}

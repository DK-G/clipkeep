import Link from 'next/link';
import { localeDir, normalizeLocale, type Locale } from '@/lib/i18n/ui';

type BlogSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: Array<{ label: string; body: string }>;
};

type BlogDict = {
  editorialGuide: string;
  title: string;
  byline: string;
  lastUpdatedLabel: string;
  readTime: string;
  intro: string;
  sections: BlogSection[];
  ctaTitle: string;
  ctaBeforeLink: string;
  ctaLink: string;
  ctaAfterLink: string;
  footer: string;
};

const blogText: Record<Locale, BlogDict> = {
  en: {
    editorialGuide: 'Editorial Guide',
    title: 'The Ultimate Guide to Digital Media Archiving: Preserving Social Experiences in 2026',
    byline: 'By ClipKeep Editorial Team',
    lastUpdatedLabel: 'Last Updated',
    readTime: '15 min read',
    intro:
      'In an era where digital content is often transient, the ability to store and preserve media from social platforms like Telegram, X, and TikTok has become a critical skill for digital archivists, researchers, and families alike.',
    sections: [
      {
        heading: '1. The Ephemeral Dilemma: Why Archive Now?',
        paragraphs: [
          'Social media platforms are the modern-day libraries of Alexandria: vast, chaotic, and profoundly fragile. Every day, thousands of videos, threads, and high-resolution images are deleted, shadow-banned, or lost due to platform policy changes or server migrations.',
          'Archiving is not just about keeping files; it is about preserving context. A Telegram video shared in a community group might contain a tutorial that becomes unavailable tomorrow. A thread on X might be the only record of a live event. By taking the proactive step of media extraction, you ensure that the content you value remains under your control.',
        ],
      },
      {
        heading: '2. Essential Components of a Modern Media Archive',
        paragraphs: [
          'To build a robust personal archive, you need a systematic approach that goes beyond one-off downloads. Consider a media-focused version of the 3-2-1 backup rule:',
        ],
        bullets: [
          { label: '3 Copies', body: 'Keep at least three copies of your most valuable media.' },
          { label: '2 Different Formats', body: 'Store on two different media types (for example SSD and cloud storage).' },
          { label: '1 Off-Site Location', body: 'Keep one copy in a physically separate location.' },
        ],
      },
      {
        heading: '3. Mastering the Telegram Ecosystem',
        paragraphs: [
          'Telegram has become a major channel for high-fidelity media sharing. Unlike many platforms, Telegram often preserves original file quality. But accessing this media outside the official client can still be difficult.',
          'Extraction strategy: when using tools like ClipKeep for Telegram, prefer direct stream paths whenever possible. This helps avoid unnecessary recompression and preserves quality for long-term archiving.',
        ],
      },
      {
        heading: '4. The X (Twitter) Transformation',
        paragraphs: [
          'As Twitter evolved into X, media delivery architecture changed significantly. For archivists, this means staying current with CDN link behavior. Many posts now rely on segmented streaming (HLS), making simple right-click saving unreliable.',
          'Use extraction workflows that can normalize these segments into a single playable asset for long-term compatibility.',
        ],
      },
      {
        heading: '5. Ethics and Legality in the Age of Sharing',
        paragraphs: [
          'Ethics and legality are the most important pillars of archiving. Personal use, educational research, and transformative use can each be treated differently depending on jurisdiction.',
          'Respect original creators. Archiving should support preservation, not unauthorized redistribution. We recommend a preserve-with-respect approach: keep records for legitimate personal purposes while honoring creator rights.',
        ],
      },
    ],
    ctaTitle: 'Start Your Archive Today',
    ctaBeforeLink: 'Ready to take the first step? Head over to our ',
    ctaLink: 'Main Extraction Tool',
    ctaAfterLink:
      ' to begin building your personal library. Whether it is your first Telegram save or your thousandth TikTok archive, ClipKeep is here to keep the process seamless and secure.',
    footer:
      '© 2026 ClipKeep Editorial. All rights reserved. Part of our commitment to digital literacy and media preservation.',
  },
  ja: {
    editorialGuide: '編集ガイド',
    title: 'デジタルメディア保存の実践ガイド: 2026年にSNS体験を残すために',
    byline: 'ClipKeep 編集部',
    lastUpdatedLabel: '最終更新',
    readTime: '読了目安 15分',
    intro:
      'デジタルコンテンツが短命になりやすい今、Telegram・X・TikTokのようなSNS上のメディアを適切に保存する力は、研究者や制作者、一般ユーザーにとって重要なスキルになっています。',
    sections: [
      {
        heading: '1. いま保存すべき理由',
        paragraphs: [
          'SNSは巨大で動きの速い情報基盤ですが、同時に非常に壊れやすい場所でもあります。動画・投稿・高解像度画像は、規約変更や配信方式の変更で突然見られなくなることがあります。',
          '保存の本質は、ファイルそのものだけでなく文脈を残すことです。コミュニティ内で共有されたTelegram動画や、出来事を記録したXの投稿は、後から代替が効かない一次情報になる場合があります。',
        ],
      },
      {
        heading: '2. 個人アーカイブの基本設計',
        paragraphs: ['単発ダウンロードではなく、再利用できる運用ルールを先に作るのが重要です。3-2-1バックアップをSNSメディア向けに適用してください。'],
        bullets: [
          { label: '3つのコピー', body: '重要なメディアは最低3つ保持する。' },
          { label: '2種類の保存先', body: '例: SSDとクラウドのように性質の異なる保存先へ分散する。' },
          { label: '1つは別拠点', body: '物理的に離れた場所に1つ保持する。' },
        ],
      },
      {
        heading: '3. Telegram保存の要点',
        paragraphs: [
          'Telegramは高品質メディアが流通しやすい一方で、公式クライアント外から扱うと手順が複雑になることがあります。',
          'ClipKeepのような抽出ツールでは、可能なら直接ストリームに近い経路を選ぶことで再圧縮リスクを下げられます。長期保存ではこの差が効きます。',
        ],
      },
      {
        heading: '4. X (Twitter) 側の変化に追従する',
        paragraphs: [
          'Xでは配信方式が継続的に更新され、分割配信（HLS）前提の投稿も増えています。右クリック保存だけでは再現しづらいケースが増えています。',
          '分割データを安定的に再生可能な形へまとめられる抽出経路を選ぶと、将来の再利用性が高まります。',
        ],
      },
      {
        heading: '5. 倫理と法務を先に固める',
        paragraphs: [
          '保存行為の扱いは、私的利用・研究利用・二次利用で法的評価が変わります。必ず自分の管轄のルールを確認してください。',
          'ClipKeepでは「保存はするが権利は尊重する」という方針を推奨します。無断再配布は避け、必要な範囲で適切に記録を残す運用が安全です。',
        ],
      },
    ],
    ctaTitle: '今日からアーカイブを始める',
    ctaBeforeLink: '最初の一歩として、',
    ctaLink: 'メイン抽出ツール',
    ctaAfterLink: ' から運用を開始してください。初めての保存でも、継続的な記録運用でも、ClipKeepが安定したフローを提供します。',
    footer: '© 2026 ClipKeep Editorial. All rights reserved. デジタルリテラシーとメディア保存の向上に取り組んでいます。',
  },
  ar: {
    editorialGuide: 'دليل تحريري',
    title: 'الدليل العملي لأرشفة الوسائط الرقمية في 2026',
    byline: 'فريق ClipKeep التحريري',
    lastUpdatedLabel: 'آخر تحديث',
    readTime: 'مدة القراءة 15 دقيقة',
    intro:
      'في عالم تتغير فيه المحتويات الرقمية بسرعة، أصبحت القدرة على حفظ وسائط Telegram وX وTikTok مهارة أساسية للباحثين وصنّاع المحتوى والمستخدمين العاديين.',
    sections: [
      {
        heading: '1. لماذا يجب الأرشفة الآن؟',
        paragraphs: [
          'منصات التواصل ضخمة وسريعة، لكنها هشة. قد تختفي الفيديوهات والمنشورات بسبب تغييرات السياسات أو البنية التقنية.',
          'الأرشفة لا تعني حفظ الملف فقط، بل حفظ السياق أيضًا. بعض المقاطع أو المنشورات تمثل سجلًا مهمًا لا يمكن تعويضه لاحقًا.',
        ],
      },
      {
        heading: '2. مكونات الأرشيف الشخصي المتين',
        paragraphs: ['اعتمد منهجية ثابتة بدل التنزيل العشوائي. طبّق قاعدة 3-2-1 بنسختها المناسبة لوسائط SNS.'],
        bullets: [
          { label: '3 نسخ', body: 'احتفظ بثلاث نسخ على الأقل من المواد المهمة.' },
          { label: 'وسيلتا تخزين مختلفتان', body: 'مثل SSD مع تخزين سحابي.' },
          { label: 'نسخة خارج الموقع', body: 'احتفظ بنسخة في مكان مختلف فعليًا.' },
        ],
      },
      {
        heading: '3. التعامل مع نظام Telegram',
        paragraphs: [
          'Telegram منصة قوية لمشاركة الوسائط عالية الجودة، لكن استخراجها خارج التطبيق الرسمي قد يكون معقدًا.',
          'عند الإمكان، استخدم مسارات البث المباشر لتقليل إعادة الضغط والحفاظ على الجودة عند الأرشفة طويلة المدى.',
        ],
      },
      {
        heading: '4. التحول في X (Twitter)',
        paragraphs: [
          'مع تغييرات X المتواصلة، أصبحت بعض الوسائط تعتمد على البث المجزأ (HLS)، ما يجعل الحفظ التقليدي أقل فعالية.',
          'يفضّل استخدام مسار استخراج يحوّل الأجزاء إلى ملف قابل للتشغيل بشكل مستقر مستقبلًا.',
        ],
      },
      {
        heading: '5. الاعتبارات القانونية والأخلاقية',
        paragraphs: [
          'التعامل القانوني يختلف حسب الغرض (شخصي/بحثي/إعادة استخدام) وحسب الدولة.',
          'احترم حقوق المنشئ دائمًا. الهدف من الأرشفة هو الحفظ المسؤول وليس إعادة التوزيع دون تصريح.',
        ],
      },
    ],
    ctaTitle: 'ابدأ أرشفتك اليوم',
    ctaBeforeLink: 'لبداية عملية ومنظمة، انتقل إلى ',
    ctaLink: 'أداة الاستخراج الرئيسية',
    ctaAfterLink: ' وابدأ بناء مكتبتك الرقمية بخطوات واضحة وآمنة.',
    footer: '© 2026 ClipKeep Editorial. جميع الحقوق محفوظة. ضمن التزامنا برفع الثقافة الرقمية وحفظ المحتوى.',
  },
  es: {} as BlogDict,
  pt: {} as BlogDict,
  fr: {} as BlogDict,
  id: {} as BlogDict,
  hi: {} as BlogDict,
  de: {} as BlogDict,
  tr: {} as BlogDict,
};

for (const locale of ['es', 'pt', 'fr', 'id', 'hi', 'de', 'tr'] as const) {
  blogText[locale] = blogText.en;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MediaArchivingGuidePage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = blogText[locale] ?? blogText.en;
  const dir = localeDir(locale);
  const lastUpdated = '2026-03-12';

  return (
    <main dir={dir} className="max-w-[860px] mx-auto px-6 py-[60px] font-sans text-slate-900 dark:text-slate-100 leading-relaxed bg-white dark:bg-slate-950">
      <header className="mb-16 text-center">
        <p className="text-[0.9rem] uppercase tracking-[0.1em] font-semibold text-slate-500 dark:text-slate-400 mb-3">{t.editorialGuide}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight underline-offset-8 decoration-blue-500/30 mb-6 text-slate-950 dark:text-white leading-[1.1]">
          {t.title}
        </h1>
        <div className="flex justify-center items-center gap-4 text-slate-500 dark:text-slate-400 text-base">
          <span>{t.byline}</span>
          <span>•</span>
          <span>{t.lastUpdatedLabel}: {lastUpdated}</span>
          <span>•</span>
          <span>{t.readTime}</span>
        </div>
      </header>

      <section className="mb-12">
        <p className="text-xl text-slate-700 dark:text-slate-300 italic leading-relaxed">{t.intro}</p>
      </section>

      {t.sections.map((section, index) => (
        <section key={index} className="mb-12 space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{section.heading}</h2>
          {section.paragraphs?.map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul className="list-disc pl-8 space-y-3">
              {section.bullets.map((item, bIndex) => (
                <li key={bIndex}><strong>{item.label}:</strong> {item.body}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="mb-12 bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">{t.ctaTitle}</h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
          {t.ctaBeforeLink}
          <Link href={`/?locale=${locale}`} className="text-blue-600 dark:text-blue-400 font-bold underline decoration-2">{t.ctaLink}</Link>
          {t.ctaAfterLink}
        </p>
      </section>

      <footer className="mt-24 pt-10 border-t border-slate-100 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>{t.footer}</p>
      </footer>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKeywordArticle, getRelatedKeywordArticles, keywordArticles, type BlogLocale } from '@/lib/blog/keyword-articles';
import { normalizeLocale } from '@/lib/i18n/ui';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function toBlogLocale(input: string | null | undefined): BlogLocale {
  const n = normalizeLocale(input);
  if (n === 'es' || n === 'ar') return n;
  return 'en';
}

function text(locale: BlogLocale) {
  if (locale === 'ar') {
    return {
      quickAnswer: 'الإجابة السريعة',
      steps: 'الخطوات',
      safety: 'السلامة والقانون',
      fails: 'أخطاء شائعة',
      ctaMain: 'جرّب ClipKeep الآن',
      ctaSupport: 'صفحة المساعدة',
      related: 'مواضيع مرتبطة',
      jumpTool: 'الانتقال إلى أداة التنزيل',
      jumpSupport: 'فتح دليل الحل',
      compareHint: 'لمقارنة الخيارات يمكنك مراجعة FAQ أيضًا.',
    };
  }
  if (locale === 'es') {
    return {
      quickAnswer: 'Respuesta rápida',
      steps: 'Pasos',
      safety: 'Seguridad y legalidad',
      fails: 'Errores frecuentes',
      ctaMain: 'Probar ClipKeep ahora',
      ctaSupport: 'Página de ayuda',
      related: 'Lecturas relacionadas',
      jumpTool: 'Ir al descargador',
      jumpSupport: 'Abrir guía de solución',
      compareHint: 'Para comparar opciones, revisa también el FAQ.',
    };
  }
  return {
    quickAnswer: 'Quick answer',
    steps: 'Steps',
    safety: 'Safety and legal notes',
    fails: 'Common failures',
    ctaMain: 'Use ClipKeep now',
    ctaSupport: 'Help page',
    related: 'Related reads',
    jumpTool: 'Open downloader',
    jumpSupport: 'Open solution guide',
    compareHint: 'For side-by-side options, also check the FAQ.',
  };
}

function buildIntro(keyword: string, locale: BlogLocale): string {
  if (locale === 'ar') return `في هذا الدليل نغطي كلمة البحث: ${keyword} ونوضح أسرع طريقة عملية باستخدام ClipKeep مع روابط مباشرة للأداة.`;
  if (locale === 'es') return `En esta guía cubrimos la búsqueda "${keyword}" y mostramos el flujo más directo con ClipKeep, con enlaces directos al descargador.`;
  return `This guide targets the keyword "${keyword}" and explains the fastest practical workflow with ClipKeep, including direct downloader links.`;
}

function stepLines(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['افتح المنشور وانسخ الرابط.', 'افتح صفحة الأداة المناسبة في ClipKeep.', 'الصق الرابط وابدأ الاستخراج.', 'احفظ الملف وتحقق من الجودة.'];
  if (locale === 'es') return ['Abre la publicación y copia el enlace.', 'Abre la herramienta correspondiente en ClipKeep.', 'Pega el enlace y ejecuta la extracción.', 'Guarda el archivo y verifica la calidad.'];
  return ['Open the source post and copy the URL.', 'Open the matching ClipKeep tool page.', 'Paste URL and run extraction.', 'Save the file and verify quality.'];
}

function failLines(locale: BlogLocale): string[] {
  if (locale === 'ar') return ['الرابط غير صالح أو خاص.', 'قيود مؤقتة من المنصة.', 'مشكلة اتصال أو متصفح.'];
  if (locale === 'es') return ['URL inválida o privada.', 'Restricción temporal de plataforma.', 'Problema de red o navegador.'];
  return ['Invalid or private URL.', 'Temporary platform restriction.', 'Browser or network issue.'];
}

export async function generateStaticParams() {
  return keywordArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const p = await params;
  const sp = await searchParams;
  const locale = toBlogLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const article = getKeywordArticle(p.slug);
  if (!article) {
    return { title: 'Blog | ClipKeep' };
  }

  const kw = article.keyword[locale];
  const base = 'https://clipkeep.net';
  const path = `/blog/${article.slug}`;
  const url = `${base}${path}${locale === 'en' ? '' : `?locale=${locale}`}`;

  return {
    title: `${kw} | ClipKeep`,
    description: buildIntro(kw, locale),
    alternates: {
      canonical: url,
      languages: {
        en: `${base}${path}`,
        es: `${base}${path}?locale=es`,
        ar: `${base}${path}?locale=ar`,
      },
    },
  };
}

export default async function BlogKeywordPage({ params, searchParams }: Props) {
  const p = await params;
  const sp = await searchParams;
  const locale = toBlogLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const article = getKeywordArticle(p.slug);
  if (!article) notFound();

  const t = text(locale);
  const kw = article.keyword[locale];
  const intro = buildIntro(kw, locale);
  const steps = stepLines(locale);
  const fails = failLines(locale);
  const q = locale === 'en' ? '' : `?locale=${locale}`;
  const related = getRelatedKeywordArticles(article.slug, article.category, 3);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <article className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-50">{kw}</h1>
        <p className="mt-3 text-gray-700 dark:text-slate-300">{intro}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`${article.toolPath}${q}`} className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">
            {t.jumpTool}
          </Link>
          <Link href={`${article.supportPath}${q}`} className="inline-flex items-center rounded-lg border border-blue-300 px-4 py-2 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800">
            {t.jumpSupport}
          </Link>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.quickAnswer}</h2>
          <p className="mt-2 text-gray-700 dark:text-slate-300">{intro}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.steps}</h2>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-gray-700 dark:text-slate-300">
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-slate-950 p-4">
          <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">{t.ctaMain}</h2>
          <div className="mt-2 flex flex-col gap-2">
            <Link href={`${article.toolPath}${q}`} className="text-blue-700 hover:underline">{article.toolPath}</Link>
            <Link href={`${article.supportPath}${q}`} className="text-blue-700 hover:underline">{article.supportPath}</Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.safety}</h2>
          <p className="mt-2 text-gray-700 dark:text-slate-300">
            {locale === 'ar'
              ? 'احترم حقوق النشر وشروط المنصة. هذا المحتوى لأغراض الحفظ الشخصي المسؤول.'
              : locale === 'es'
                ? 'Respeta derechos de autor y términos de la plataforma. Usa el flujo para archivo personal responsable.'
                : 'Respect copyright and platform terms. Use this workflow for responsible personal archiving.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.fails}</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700 dark:text-slate-300">
            {fails.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">{t.compareHint}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t.related}</h2>
          <ul className="mt-2 list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
            {related.map((r) => (
              <li key={r.slug}><Link href={`/blog/${r.slug}${q}`} className="hover:underline">{r.keyword[locale]}</Link></li>
            ))}
            <li><Link href={`/blog/guide-to-media-archiving?locale=${locale}`} className="hover:underline">/blog/guide-to-media-archiving</Link></li>
            <li><Link href={`/faq${q}`} className="hover:underline">/faq</Link></li>
          </ul>
        </section>
      </article>
    </main>
  );
}
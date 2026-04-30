'use client';

import Link from 'next/link';
import { contactText, normalizeLocale, localeDir, type Locale } from '@/lib/i18n/ui';

interface Props {
  localeParam?: string;
}

const feedbackLabels: Record<Locale, { title: string; body: string; action: string }> = {
  en: { title: 'Feedback',        body: 'Found a bug or have a feature request? Let us know via email — all reports are reviewed.',                       action: 'Send feedback' },
  ja: { title: 'フィードバック',   body: 'バグ報告や機能リクエストはメールでお送りください。すべての報告を確認しています。',                                   action: 'フィードバックを送る' },
  ar: { title: 'تعليقات',          body: 'وجدت خطأً أو لديك طلب ميزة؟ أخبرنا عبر البريد الإلكتروني — يتم مراجعة جميع التقارير.',                        action: 'إرسال تعليق' },
  es: { title: 'Comentarios',      body: '¿Encontraste un error o tienes una sugerencia? Escríbenos — revisamos todos los reportes.',                     action: 'Enviar comentario' },
  pt: { title: 'Feedback',         body: 'Encontrou um bug ou tem uma sugestão? Entre em contato — todos os relatórios são revisados.',                    action: 'Enviar feedback' },
  fr: { title: 'Retours',          body: 'Vous avez trouvé un bug ou une idée ? Écrivez-nous — tous les retours sont examinés.',                          action: 'Envoyer un retour' },
  id: { title: 'Masukan',          body: 'Menemukan bug atau punya permintaan fitur? Hubungi kami — semua laporan ditinjau.',                             action: 'Kirim masukan' },
  hi: { title: 'फ़ीडबैक',          body: 'बग मिला या फ़ीचर रिक्वेस्ट है? ईमेल करें — सभी रिपोर्ट की समीक्षा की जाती है।',                              action: 'फ़ीडबैक भेजें' },
  de: { title: 'Feedback',         body: 'Fehler gefunden oder eine Idee? Schreiben Sie uns — alle Meldungen werden geprüft.',                            action: 'Feedback senden' },
  tr: { title: 'Geri bildirim',    body: 'Bir hata mı buldunuz veya öneriniz mi var? Bize yazın — tüm raporlar incelenir.',                              action: 'Geri bildirim gönder' },
};

export function ContactContentClient({ localeParam }: Props) {
  const locale = normalizeLocale(localeParam);
  const dir = localeDir(locale);
  const t = contactText[locale] || contactText.en;
  const fb = feedbackLabels[locale] || feedbackLabels.en;

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-6 tracking-tight">{t.title}</h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Support email */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">{t.emailLabel}</h2>
          <a href="mailto:support@clipkeep.net" className="text-blue-600 dark:text-blue-400 font-bold hover:underline break-all">
            support@clipkeep.net
          </a>
        </section>

        {/* Feedback */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">{fb.title}</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">{fb.body}</p>
          <a href="mailto:support@clipkeep.net?subject=Feedback" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            {fb.action} →
          </a>
        </section>

        {/* DMCA */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">{t.dmcaTitle}</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">{t.dmcaBody}</p>
          <Link href={`/legal/dmca${locale !== 'en' ? `?locale=${locale}` : ''}`} className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
            DMCA Policy →
          </Link>
        </section>
      </div>

      {/* Service updates */}
      <section className="bg-gray-50 dark:bg-slate-900/50 p-10 rounded-3xl text-center border border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">{t.socialTitle}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-2">{t.socialBody}</p>
        <span className="text-slate-400 dark:text-slate-500 text-sm">{t.comingSoon}</span>
      </section>
    </main>
  );
}

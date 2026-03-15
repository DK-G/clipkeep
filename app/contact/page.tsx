'use client';

import { useSearchParams } from 'next/navigation';
import { normalizeLocale, localeDir } from '@/lib/i18n/ui';
import { Suspense } from 'react';

function ContactContent() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);

  const texts = {
    en: {
      title: "Contact Us",
      subtitle: "Have questions or feedback? We're here to help.",
      emailLabel: "Support Email",
      dmcaTitle: "DMCA / Copyright",
      dmcaBody: "For copyright inquiries or DMCA takedown requests, please email us directly with the relevant links and documentation.",
      socialTitle: "Social Channels",
      socialBody: "Follow our development updates and service status on our social channels.",
    },
    ja: {
      title: "お問い合わせ",
      subtitle: "質問やフィードバックなど、お気軽にお問い合わせください。",
      emailLabel: "サポートメール",
      dmcaTitle: "著作権 / DMCA",
      dmcaBody: "著作権に関するお問い合わせやDMCA削除依頼については、該当するURLと資料を添えて直接メールでお送りください。",
      socialTitle: "ソーシャルメディア",
      socialBody: "開発の進捗やサービスの稼働状況は、SNS等でもご確認いただけます。",
    }
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <main dir={dir} className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{t.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.emailLabel}</h2>
          <p className="text-blue-600 font-bold text-xl select-all">support@clipkeep.net</p>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.dmcaTitle}</h2>
          <p className="text-gray-600">
            {t.dmcaBody}
          </p>
        </section>
      </div>

      <section className="mt-12 bg-gray-50 p-10 rounded-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.socialTitle}</h2>
        <p className="text-gray-600 mb-6">{t.socialBody}</p>
        <div className="flex justify-center gap-6">
           <span className="text-gray-400 font-medium">Coming soon...</span>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading...</div>}>
      <ContactContent />
    </Suspense>
  );
}

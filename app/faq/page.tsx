import Link from 'next/link';

export default function FAQPage() {
  const lastUpdated = '2026-03-12';

  const faqs = [
    {
      question: "What is ClipKeep?",
      answer: "ClipKeep is a high-performance media extraction utility designed to help users archive and preserve content from social platforms like Telegram, X (Twitter), and TikTok for personal use."
    },
    {
      question: "Is ClipKeep free to use?",
      answer: "Yes, ClipKeep is currently free to use. We aim to provide a low-threshold utility for media preservation while maintaining high performance through our Cloudflare-backed infrastructure."
    },
    {
      question: "How do I use the downloader?",
      answer: "Simply paste the URL of the media post into the input field on our home page, select the platform, and click 'Submit'. ClipKeep will process the link and provide you with a direct archive link."
    },
    {
      question: "Which platforms are supported?",
      answer: "We currently offer priority support for Telegram and X (Twitter). Support for TikTok and other platforms is currently in development and will be rolled out systematically."
    },
    {
      question: "Do you store the videos I download?",
      answer: "No. ClipKeep operates as an extraction hub. We process the requests in real-time and provide you with the necessary metadata to access the media. We do not maintain a permanent archive of user-extracted media."
    },
    {
      question: "Why am I seeing a 'Service Degraded' message?",
      answer: "To ensure reliability for all users, we monitor our system load in real-time. If there is an unusual spike in traffic or technical maintenance is required, we may temporarily limit request frequency to ensure service stability."
    },
    {
      question: "Is it legal to download videos?",
      answer: "ClipKeep is intended for personal, archival, and educational use. Users are responsible for ensuring that their use of extracted media complies with local laws and the terms of service of the respective platforms. We urge all users to respect the intellectual property rights of content creators."
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-50 mb-4 tracking-tight">Frequently Asked Questions</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">Last updated: {lastUpdated}</p>

      <div className="flex flex-col gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="p-8 border border-gray-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-3">{faq.question}</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 p-10 bg-gray-50 dark:bg-slate-900/50 rounded-3xl text-center border border-gray-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-4">Still have questions?</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">If you couldn{"'"}t find the answer you were looking for, feel free to reach out to our team.</p>
        <Link href="/contact" className="inline-block px-8 py-3 bg-gray-900 dark:bg-blue-600 text-white dark:text-white rounded-full font-bold hover:bg-gray-800 dark:hover:bg-blue-500 transition-colors shadow-lg">Contact Support</Link>
      </section>
    </main>
  );
}

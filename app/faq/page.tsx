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

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2.5rem' }}>Last updated: {lastUpdated}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ padding: '24px', border: '1px solid #f0f0f0', borderRadius: '16px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '12px', color: '#000', fontWeight: 600 }}>{faq.question}</h2>
            <p style={{ margin: 0, color: '#444' }}>{faq.answer}</p>
          </div>
        ))}
      </div>

      <section style={{ marginTop: '4rem', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginTop: 0 }}>Still have questions?</h2>
        <p style={{ color: '#666' }}>If you couldn{"'"}t find the answer you were looking for, feel free to reach out to our team.</p>
        <Link href="/contact" style={{ display: 'inline-block', marginTop: '12px', padding: '10px 24px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 500 }}>Contact Support</Link>
      </section>
    </main>
  );
}

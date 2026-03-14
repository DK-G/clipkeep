import Link from 'next/link';

export default function AboutPage() {
  const lastUpdated = '2026-03-12';

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>About ClipKeep</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>Last updated: {lastUpdated}</p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
        <p>
          ClipKeep was founded with a simple yet powerful goal: <strong>Helping users preserve digital memories safely and efficiently.</strong> In an era of ephemeral content and evolving privacy landscapes, we believe that individuals should have the tools to archive media from social platforms for educational, archival, and personal use.
        </p>
        <p>
          We focus on building high-performance, privacy-centric utility tools that simplify the process of media extraction without compromising on security or user experience.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>The ClipKeep Philosophy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Privacy First</h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>We don{"'"}t track your downloads or store sensitive metadata. Your activity remains your own.</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Performance</h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Powered by Cloudflare Workers and Durable Objects to ensure fast, low-latency processing.</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Transparency</h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Clear status updates, open communication regarding service degradation, and honest policies.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Why We Do This</h2>
        <p>
          Digital content is fragile. Whether it{"'"}s a tutorial on Telegram, a creative thread on X, or a memorable moment on TikTok, the platforms that host our content aren{"'"}t always permanent. ClipKeep empowers creators, researchers, and casual users to take control of their digital footprint.
        </p>
        <p>
          We are committed to maintaining a service that respects the intellectual property rights of creators while providing a necessary bridge for media preservation.
        </p>
      </section>

      <div style={{ marginTop: '4rem', padding: '30px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '16px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Need help or have questions?</p>
        <Link href="/contact" style={{ display: 'inline-block', marginTop: '12px', padding: '10px 24px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 500 }}>Visit our Contact Page</Link>
      </div>
    </main>
  );
}

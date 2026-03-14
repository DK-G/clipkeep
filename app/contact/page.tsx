export default function ContactPage() {
  const lastUpdated = '2026-03-12';

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Contact Us</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2.5rem' }}>Last updated: {lastUpdated}</p>

      <div style={{ backgroundColor: '#f9f9f9', padding: '32px', borderRadius: '16px', marginBottom: '3rem' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>We{"'"}re here to help</h2>
        <p>
          Whether you have a technical question, a business inquiry, or just want to provide feedback on how we can improve ClipKeep, our team is ready to listen. We strive to respond to all legitimate inquiries within 24-48 business hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#000', marginBottom: '16px', fontWeight: 600 }}>Support & Assistance</h3>
          <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#555' }}>For help with media extraction or site functionality:</p>
          <a href="mailto:support@clipkeep.com" style={{ fontSize: '1.1rem', color: '#000', fontWeight: 600, textDecoration: 'none' }}>support@clipkeep.com</a>
        </section>

        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#000', marginBottom: '16px', fontWeight: 600 }}>Abuse / DMCA Inquiries</h3>
          <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#555' }}>For copyright concerns or reporting abuse:</p>
          <a href="mailto:abuse@clipkeep.com" style={{ fontSize: '1.1rem', color: '#000', fontWeight: 600, textDecoration: 'none' }}>abuse@clipkeep.com</a>
        </section>

        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#000', marginBottom: '16px', fontWeight: 600 }}>Privacy & Data Policy</h3>
          <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#555' }}>For questions regarding data usage or deletion requests:</p>
          <a href="mailto:privacy@clipkeep.com" style={{ fontSize: '1.1rem', color: '#000', fontWeight: 600, textDecoration: 'none' }}>privacy@clipkeep.com</a>
        </section>

        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#000', marginBottom: '16px', fontWeight: 600 }}>Business & Partnerships</h3>
          <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#555' }}>For collaboration or media inquiries:</p>
          <a href="mailto:biz@clipkeep.com" style={{ fontSize: '1.1rem', color: '#000', fontWeight: 600, textDecoration: 'none' }}>biz@clipkeep.com</a>
        </section>
      </div>

      <div style={{ marginTop: '4rem', padding: '24px', border: '1px solid #eee', borderRadius: '12px', fontSize: '0.9rem', color: '#777' }}>
        <p style={{ margin: 0 }}>
          <strong>Note on Response Times:</strong> We are a small, focused team. While we read every message, we prioritize security-related and critical support inquiries. Thank you for your patience and for being part of the ClipKeep community.
        </p>
      </div>
    </main>
  );
}

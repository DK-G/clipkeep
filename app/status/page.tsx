export default function StatusPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Service Status</h1>
      <p>Live API health: <a href="/api/v1/health">/api/v1/health</a></p>

      <h2>Current</h2>
      <p>All core services are operating normally.</p>

      <h2>Incident Templates</h2>

      <section style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <h3>Partial Degradation</h3>
        <p>
          We are experiencing elevated failures in extraction requests. Some requests may return temporary limits.
          We are actively mitigating this issue.
        </p>
        <p>Next update: within 30 minutes.</p>
      </section>

      <section style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <h3>Scheduled Maintenance</h3>
        <p>
          Scheduled maintenance is in progress. Extraction and API response times may be temporarily affected.
          We will post completion updates on this page.
        </p>
        <p>Planned window: 00:00-01:00 UTC.</p>
      </section>

      <section style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
        <h3>Major Outage</h3>
        <p>
          We are currently experiencing a major outage affecting core extraction functionality.
          Our team is investigating and recovery actions are underway.
        </p>
        <p>Next update: within 15 minutes.</p>
      </section>
    </main>
  );
}

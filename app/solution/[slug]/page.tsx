'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { localeDir, normalizeLocale, solutionText } from '@/lib/i18n/ui';
import { trackEvent } from '@/lib/analytics/gtag';

type Locale = 'en' | 'ar';

type SolutionResponse = {
  requestId: string;
  locale: Locale;
  data: {
    slug: string;
    locale: Locale;
    title: string;
    sections: Array<{
      id: string;
      heading: string;
      body: string;
    }>;
    cta: {
      label: string;
      href: string;
    };
  };
};

type ApiError = {
  requestId: string;
  error: {
    code: string;
    message: string;
  };
};

export default function SolutionPage() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const locale = normalizeLocale(search.get('locale'));
  const l = solutionText[locale];
  const dir = localeDir(locale);
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<SolutionResponse['data'] | null>(null);

  const ctaHref = useMemo(() => {
    if (!page) return '#';
    if (page.cta.href.startsWith('/ar/') || page.cta.href.startsWith('/api/')) return page.cta.href;
    if (locale === 'ar' && page.cta.href.startsWith('/')) return `/ar${page.cta.href}`;
    return page.cta.href;
  }, [locale, page]);

  useEffect(() => {
    trackEvent('solution_view', { slug, locale });
  }, [slug, locale]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/v1/solution-pages/${slug}?locale=${locale}`, { method: 'GET' });
        const payload = (await res.json()) as SolutionResponse | ApiError;

        if (!res.ok || !('data' in payload)) {
          if (!cancelled) setError(l.notFound);
          return;
        }

        if (!cancelled) setPage(payload.data);
      } catch {
        if (!cancelled) setError(l.networkError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [l.networkError, l.notFound, locale, slug]);

  return (
    <main dir={dir} style={{ maxWidth: 860, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      {loading && <p>{l.loading}</p>}

      {!loading && error && (
        <section style={{ border: '1px solid #f0c0c0', borderRadius: 10, padding: 16, background: '#fff8f8' }}>
          <h1 style={{ marginTop: 0 }}>{l.title}</h1>
          <p>{error}</p>
        </section>
      )}

      {!loading && page && (
        <>
          <section style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16, background: '#fafafa' }}>
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>{page.title}</h1>
            <p style={{ margin: 0, color: '#444' }}>{l.heroSubtitle}</p>
          </section>

          <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{l.quickAnswer}</h2>
            <p>{page.sections[0]?.body ?? l.quickFallback}</p>
          </section>

          <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{l.stepByStep}</h2>
            <ol>
              {page.sections.map((section) => (
                <li key={section.id} style={{ marginBottom: 10 }}>
                  <strong>{section.heading}</strong>
                  <div>{section.body}</div>
                </li>
              ))}
            </ol>
          </section>

          <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{l.trustSafety}</h2>
            <p>{l.trustBody}</p>
          </section>

          <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{l.internalLinks}</h2>
            <p>
              <a href={ctaHref}>{page.cta.label}</a>
            </p>
          </section>
        </>
      )}
    </main>
  );
}

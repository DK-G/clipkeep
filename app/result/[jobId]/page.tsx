export const runtime = 'edge';

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { localeDir, normalizeLocale, resultText } from '@/lib/i18n/ui';
import { DegradedBanner } from '@/components/degraded-banner';
import { trackEvent } from '@/lib/analytics/gtag';

type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';
type DegradedReason = 'manual' | 'error_ratio' | 'queue_wait' | 'active_jobs' | 'recovered' | 'none';

type JobQueuedResponse = {
  requestId: string;
  data: {
    jobId: string;
    status: 'queued' | 'processing';
    progress: number;
  };
};

type JobCompletedResponse = {
  requestId: string;
  data: {
    jobId: string;
    status: 'completed';
    media: Array<{
      mediaId: string;
      type: 'video' | 'audio' | 'image';
      quality: string;
      downloadUrl: string;
      expiresAt: string;
    }>;
    warnings: string[];
  };
};

type ApiError = {
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: {
      jobId?: string;
    };
  };
};

type HealthResponse = {
  degraded: boolean;
  data: {
    degradedReason: DegradedReason;
  };
};

export default function ResultPage() {
  const params = useParams<{ jobId: string }>();
  const search = useSearchParams();
  const locale = normalizeLocale(search.get('locale'));
  const l = resultText[locale];
  const dir = localeDir(locale);
  const jobId = params.jobId;

  const [status, setStatus] = useState<JobStatus>('queued');
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState(l.loading);
  const [downloads, setDownloads] = useState<JobCompletedResponse['data']['media']>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [degraded, setDegraded] = useState<{ isDegraded: boolean; reason: DegradedReason }>({ isDegraded: false, reason: 'none' });

  const retrySolutionSlug = useMemo(() => 'telegram-video-downloader-not-working', []);

  useEffect(() => {
    trackEvent('result_view', { locale, jobId });
  }, [jobId, locale]);

  useEffect(() => {
    let cancelled = false;
    const loadHealth = async () => {
      try {
        const res = await fetch('/api/v1/health', { method: 'GET' });
        const payload = (await res.json()) as HealthResponse;
        if (!cancelled && res.ok) {
          setDegraded({ isDegraded: payload.degraded, reason: payload.data.degradedReason });
        }
      } catch {
        // no-op
      }
    };
    loadHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMessage(l.loading);
  }, [l.loading]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/extract/jobs/${jobId}`, { method: 'GET' });
        const payload = (await res.json()) as JobQueuedResponse | JobCompletedResponse | ApiError;

        if (!res.ok || !('data' in payload)) {
          if (!cancelled) {
            setStatus('failed');
            setMessage(l.failedToLoad);
          }
          return;
        }

        if (payload.data.status === 'completed') {
          if (!cancelled) {
            setStatus('completed');
            setDownloads(payload.data.media);
            setWarnings(payload.data.warnings);
            setMessage(l.completed);
            trackEvent('extract_completed', { locale, jobId, mediaCount: payload.data.media.length });
          }
          return;
        }

        if (!cancelled) {
          setStatus(payload.data.status);
          setProgress(payload.data.progress);
          setMessage(l.polling(payload.data.status));
          timer = window.setTimeout(poll, 1200);
        }
      } catch {
        if (!cancelled) {
          setStatus('failed');
          setMessage(l.networkError);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [jobId, l, locale]);

  return (
    <main dir={dir} style={{ maxWidth: 860, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      {degraded.isDegraded && <DegradedBanner locale={locale} reason={degraded.reason} />}

      <h1 style={{ marginBottom: 8 }}>{l.title}</h1>
      <p style={{ marginTop: 0, color: '#444' }}>{l.jobIdLabel}: {jobId}</p>

      <section style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16, background: '#fafafa' }}>
        <h2 style={{ marginTop: 0 }}>{l.statusLabel}</h2>
        <p>{message}</p>
        <ul>
          <li>{l.stateLabel}: {status}</li>
          <li>{l.progressLabel}: {progress}%</li>
        </ul>
      </section>

      {status === 'completed' && (
        <section style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{l.downloads}</h2>
          {downloads.length === 0 ? (
            <p>{l.noMedia}</p>
          ) : (
            <ul>
              {downloads.map((m) => (
                <li key={m.mediaId}>
                  {m.type} / {m.quality}: <a href={m.downloadUrl}>{m.downloadUrl}</a>
                </li>
              ))}
            </ul>
          )}
          {warnings.length > 0 && (
            <>
              <h3>{l.warnings}</h3>
              <ul>
                {warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {status === 'failed' && (
        <section style={{ marginTop: 16, border: '1px solid #f0c0c0', borderRadius: 10, padding: 16, background: '#fff8f8' }}>
          <h2 style={{ marginTop: 0 }}>{l.needHelp}</h2>
          <p>
            {l.checkSolution}: <a href={`/solution/${retrySolutionSlug}?locale=${locale}`}>/solution/{retrySolutionSlug}</a>
          </p>
        </section>
      )}
    </main>
  );
}

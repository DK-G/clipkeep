'use client';

import { degradedText, Locale } from '@/lib/i18n/ui';

type DegradedReason = 'manual' | 'error_ratio' | 'queue_wait' | 'active_jobs' | 'recovered' | 'none';

type Props = {
  locale: Locale;
  reason: DegradedReason;
  helpSlug?: string;
  retryAfterSec?: number;
};

export function DegradedBanner({ locale, reason, helpSlug = 'extractor-temporary-limited', retryAfterSec }: Props) {
  const l = degradedText[locale];
  const reasonText = l.reasons[reason] ?? l.reasons.none;

  return (
    <section style={{ border: '1px solid #f3c27a', borderRadius: 10, padding: 12, background: '#fff8ea', marginBottom: 14 }}>
      <strong>{l.title}</strong>
      <p style={{ margin: '6px 0' }}>{l.body}</p>
      <p style={{ margin: '6px 0' }}>{l.reasonLabel}: {reasonText}</p>
      {typeof retryAfterSec === 'number' && <p style={{ margin: '6px 0' }}>{l.retryAfter}: {retryAfterSec}s</p>}
      <a href={`/solution/${helpSlug}?locale=${locale}`}>{l.openGuide}</a>
    </section>
  );
}


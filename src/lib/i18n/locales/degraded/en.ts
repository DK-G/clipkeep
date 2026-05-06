import type { DegradedDict } from '../../types';

export const en: DegradedDict = {
    title: 'Extractor is in degraded mode',
    body: 'Some extraction requests are temporarily limited.',
    reasonLabel: 'Reason',
    retryAfter: 'Suggested retry after',
    openGuide: 'Open recovery guide',
    reasons: {
      manual: 'Manual override',
      error_ratio: 'High upstream error ratio',
      queue_wait: 'Queue wait is too high',
      active_jobs: 'Too many active jobs',
      recovered: 'Recovered',
      none: 'Monitoring',
    },
  };

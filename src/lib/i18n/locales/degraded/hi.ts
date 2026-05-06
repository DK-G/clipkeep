import type { DegradedDict } from '../../types';

export const hi: DegradedDict = {
    title: 'सीमित सेवा',
    body: 'उच्च ट्रैफिक।',
    reasonLabel: 'कारण',
    retryAfter: 'फिर से प्रयास करें',
    openGuide: 'गाइड खोलें',
    reasons: {
      manual: 'मैनुअल',
      error_ratio: 'त्रुटि',
      queue_wait: 'कतार',
      active_jobs: 'सक्रिय',
      recovered: 'सुधार',
      none: 'कोई नहीं',
    },
  };

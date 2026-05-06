import type { DegradedDict } from '../../types';

export const ja: DegradedDict = {
    title: 'サービス制限モード',
    body: '現在一部のリクエストが制限されています。',
    reasonLabel: '理由',
    retryAfter: '推奨される再試行時間',
    openGuide: 'リカバリーガイドを開く',
    reasons: {
      manual: '手動オーバーライド',
      error_ratio: 'エラー率の上昇',
      queue_wait: '待機時間の超過',
      active_jobs: '同時処理数の上限',
      recovered: '復旧済み',
      none: '監視中',
    },
  };

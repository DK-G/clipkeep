import type { StatusDict } from '../../types';

export const ja: StatusDict = {
    title: "稼働状況",
    liveHealth: "APIの正常性",
    currentTitle: "現在",
    currentBody: "全ての主要サービスは正常に動作しています。",
    incidentTitle: "過去のインシデント",
    partialDegradation: {
      title: "一部機能制限",
      body: "現在、メディアの抽出リクエストで断続的なエラーが発生しています。エンジニアが調査および修正を行っています。",
      nextUpdate: "次回の更新：30分以内"
    },
    scheduledMaintenance: {
      title: "定期メンテナンス",
      body: "現在サービス向上のため定期メンテナンスを行っています。一部の機能に影響が出る場合があります。",
      window: "予定時間：00:00-01:00 UTC"
    },
    majorOutage: {
      title: "重大な障害",
      body: "現在システム全体に及ぶ重大な障害が発生しています。復旧に向けて全力で作業中です。",
      nextUpdate: "次回の更新：15分以内"
    }
  };

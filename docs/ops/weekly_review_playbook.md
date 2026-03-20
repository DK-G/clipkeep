# 週次レビュー運用（順位 / CTR / CVR）

最終更新: 2026-03-20

## 目的
- 週次で `順位 / CTR / CVR` を同じフォーマットで記録し、改善を継続する。
- KPI変動を必ず次週アクションに接続する。

## 実施タイミング
- 毎週1回（推奨: 月曜）
- 所要: 30-45分

## 参加ロール
- リリース責任者
- 障害一次対応者
- SEO/コンテンツ担当

## 事前準備（5-10分）
- GA4: `download_click`, `blog_cta_click`, `gallery_card_click`, `extract_completed`
- Search Console: locale別（en/es/ar）の主要クエリ順位・CTR
- 先週のアクション実施結果

## 週次レビュー記録テンプレート

### 1. 期間
- 対象週: YYYY-MM-DD 〜 YYYY-MM-DD
- 比較週: YYYY-MM-DD 〜 YYYY-MM-DD

### 2. KPIサマリー
| Metric | This Week | Last Week | WoW | 判定 |
|---|---:|---:|---:|---|
| Search CTR (en) | | | | |
| Search CTR (es) | | | | |
| Search CTR (ar) | | | | |
| Gallery→Download CTR | | | | |
| Blog CTA CTR | | | | |
| CVR (`extract_completed / download_click`) | | | | |

### 3. 順位監視（主要クエリ Top10）
| Locale | Query | Landing | Position | Prev Position | Diff | Action |
|---|---|---|---:|---:|---:|---|
| | | | | | | |

### 4. 問題/障害サマリー
- 5xx率:
- 429率:
- degraded発動件数:
- 影響ページ:

### 5. 先週アクションの結果
| Action | Owner | Status | KPI Impact | Note |
|---|---|---|---|---|
| | | | | |

### 6. 今週の課題 Top3
1. 
2. 
3. 

### 7. 次週アクション（必須）
| Priority | Action | Owner | Due | Success Metric |
|---|---|---|---|---|
| P1 | | | | |
| P2 | | | | |
| P3 | | | | |

## 判定ルール（簡易）
- 優先対応（P1）
  - Search CTR が前週比 -20%以下
  - または CVR が前週比 -15%以下
- 要観察（P2）
  - Search CTR が前週比 -10%〜-20%
  - または 順位が +3 以上悪化
- 維持（P3）
  - 変動軽微、またはデータ量不足

## 会議アウトプット
- `今週の課題Top3`
- `次週アクション`（担当者 / 期限 / 成功指標）
- `しきい値変更有無`（Rate limit / WAF）

## 関連ドキュメント
- `docs/infra/locale_flow_ctr_report_definition.md`
- `docs/ops/search_query_landing_monitoring_sheet.md`
- `docs/ops/ga4_weekly_review_template.md`

# Weekly Review Record #001

日付: 2026-03-20
対象週: 2026-03-13 〜 2026-03-19
比較週: 2026-03-06 〜 2026-03-12
担当: SEO / Product / Ops

## 1. KPIサマリー

| Metric | This Week | Last Week | WoW | 判定 |
|---|---:|---:|---:|---|
| Search CTR (en) | TBD | TBD | TBD | Pending |
| Search CTR (es) | TBD | TBD | TBD | Pending |
| Search CTR (ar) | TBD | TBD | TBD | Pending |
| Gallery→Download CTR | TBD | TBD | TBD | Pending |
| Blog CTA CTR | TBD | TBD | TBD | Pending |
| CVR (`extract_completed / download_click`) | TBD | TBD | TBD | Pending |

## 2. 順位監視（主要クエリ Top10）

| Locale | Query | Landing | Position | Prev Position | Diff | Action |
|---|---|---|---:|---:|---:|---|
| en | TBD | TBD | TBD | TBD | TBD | TBD |
| es | TBD | TBD | TBD | TBD | TBD | TBD |
| ar | TBD | TBD | TBD | TBD | TBD | TBD |

## 3. 障害サマリー
- 5xx率: TBD
- 429率: TBD
- degraded発動件数: TBD
- 影響ページ: TBD

## 4. 先週アクション結果

| Action | Owner | Status | KPI Impact | Note |
|---|---|---|---|---|
| SEO記事拡充（keyword別） | Team | Done | TBD | 全カテゴリ実装済み |
| 記事CTAイベント計測 | Team | Done | TBD | `blog_cta_click`導入済み |
| 構造化データ追加 | Team | Done | TBD | HowTo/FAQ/ItemList反映 |

## 5. 今週の課題 Top3
1. `en / es / ar` で初回実測値を取得してベースラインを確定する
2. 問題系記事の `problem` CTAクリック率を確認し導線品質を評価する
3. 比較記事の `compare` CTAクリック分布を測定する

## 6. 次週アクション

| Priority | Action | Owner | Due | Success Metric |
|---|---|---|---|---|
| P1 | GA4 + Search Console から実測値を入力しTBDを解消 | Owner | 2026-03-23 | KPI表のTBDを0件 |
| P1 | locale別にCTR低下ページ3件を特定して修正案作成 | SEO | 2026-03-24 | 改善候補3件の起票 |
| P2 | problem/compare CTAのクリック率閾値を定義 | Product | 2026-03-24 | 閾値ドキュメント化 |

## 7. 参照
- `docs/ops/weekly_review_playbook.md`
- `docs/infra/locale_flow_ctr_report_definition.md`
- `docs/ops/search_query_landing_monitoring_sheet.md`

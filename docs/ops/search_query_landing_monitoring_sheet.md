# Search Query x Landing Monitoring Sheet (ClipKeep)

最終更新: 2026-03-20

## 目的
- Search Consoleのクエリ変動を、ランディングページ単位で週次監視する。
- `ja / pt / ar / hi / id / tr` などのマイナー言語SEOで、どこに機会損失が起きているかを早期検知する。

## 監視対象
- 期間: 直近7日（比較: 前週7日）
- 件数: 上位20クエリ（locale別）
- 指標: `clicks`, `impressions`, `ctr`, `position`

## 取得手順（毎週）
1. Search Consoleで `clipkeep.net` プロパティを開く
2. `検索パフォーマンス` -> 検索タイプ `ウェブ`
3. 自動取得では `npm run analytics:gsc` を実行し、`docs/analytics/latest-gsc-*.csv` を確認する
4. 手動確認する場合は、フィルタで `ページ` を `contains ?locale=ja` などにして上位20クエリを抽出
5. `ja`, `pt`, `ar`, `hi`, `id`, `tr` を優先して同じ手順を実行
6. 下記テンプレートへ記録し、前週比を算出

## 記録テンプレート

### JA
| Query | Landing Page | Clicks | Impressions | CTR | Position | WoW CTR | WoW Position | Action |
|---|---|---:|---:|---:|---:|---:|---:|---|
| | | | | | | | | |

### PT
| Query | Landing Page | Clicks | Impressions | CTR | Position | WoW CTR | WoW Position | Action |
|---|---|---:|---:|---:|---:|---:|---:|---|
| | | | | | | | | |

### AR
| Query | Landing Page | Clicks | Impressions | CTR | Position | WoW CTR | WoW Position | Action |
|---|---|---:|---:|---:|---:|---:|---:|---|
| | | | | | | | | |

### HI / ID / TR
| Query | Landing Page | Clicks | Impressions | CTR | Position | WoW CTR | WoW Position | Action |
|---|---|---:|---:|---:|---:|---:|---:|---|
| | | | | | | | | |

## 判定ルール
- 優先改善（High）
  - `WoW CTR <= -20%` かつ `Impressions >= 100`
  - または `Position` が前週より `+3` 以上悪化
- 監視継続（Mid）
  - `WoW CTR` が `-10% ~ -20%`
- 維持（Low）
  - 変動が軽微、または `Impressions < 100`

## 推奨アクション
- CTR悪化:
  - 該当ランディングの `title / description` を locale別に改善
- Position悪化:
  - 内部リンク追加（blog -> tool / solution）
  - 本文の検索意図適合を再調整
- Clicks低下:
  - 比較記事・問題系記事から該当ランディングへの導線を強化

## 週次サマリー（5分）
- 最も悪化したlocale:
- 悪化クエリTop3:
- 次週の修正対象ページTop3:

## 保存ルール
- 週次記録は `docs/ops/weekly_review_playbook.md` の会議アウトプットに要約を転記する。

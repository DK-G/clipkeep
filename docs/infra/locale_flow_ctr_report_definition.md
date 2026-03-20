# Locale Flow / CTR Report Definition (ClipKeep)

最終更新: 2026-03-20

## 目的
- `en / es / ar` ごとの流入品質と導線CTRを同一フォーマットで週次比較する。
- 改善対象localeを定量的に特定し、UI/文言/導線改善の優先順位を決める。

## 対象範囲
- ページ: `/`, `/download-*`, `/blog/*`, `/solution/*`, `/faq`
- locale: `en`, `es`, `ar`
- 期間: 直近7日（週次） + 前週比較

## データソース
- GA4
  - `session_start`
  - `gallery_card_click`
  - `download_click`
  - `similar_click`
  - `blog_cta_click`
- Search Console
  - クエリ/ページ別 `impressions`, `clicks`, `ctr`, `position`

## ディメンション定義
- `locale`
- `platform`（twitter / tiktok / telegram）
- `gallery_section`（trending / latest）
- `page_path`
- `source` / `medium`（流入判定）

## 指標定義（必須）
- Sessions: `session_start`
- Search Clicks: Search Console `clicks`
- Search Impressions: Search Console `impressions`
- Search CTR: `clicks / impressions`
- Gallery→Download CTR: `download_click / gallery_card_click`
- Download→Similar CTR: `similar_click / download_click`
- Blog CTA CTR: `blog_cta_click / blog article pageviews`

## レポート構成（週次）
1. Locale Summary
- `en / es / ar` の Sessions / Search CTR / Gallery→Download CTR を横並び

2. Locale x Platform Funnel
- localeごとに `gallery_card_click -> download_click -> similar_click`
- 各ステップの離脱率を表示

3. Locale x Blog CTA
- `blog_cta_click` を `cta_position`（header / main / problem / compare）別に比較
- locale別に上位記事slugを抽出

4. Locale x Search Landing
- Search Consoleで locale別に上位ランディングページを10件
- 各ページの `ctr` と `position` を表示

## 判定基準（週次）
- 改善対象locale（優先）
  - Search CTR が3locale中最下位
  - かつ Gallery→Download CTR が前週比 -10%以下
- 追加調査locale
  - Blog CTA CTR が前週比 -15%以下
  - または `problem` CTA比率が急増（トラブル需要上昇）

## アクションルール
- Search CTR低下:
  - 該当localeの title/description を見直し（主要流入ページから）
- Gallery→Download CTR低下:
  - CTA文言、カード要素、ファーストビュー導線をA/B候補化
- Blog CTA CTR低下:
  - 記事内CTA配置（header/main/problem/compare）を優先順で調整

## 出力フォーマット（保存先）
- 週次結果: `docs/ops/weekly_review_playbook.md` の週次記録へ追記
- 必須記録項目:
  - locale別KPI（3指標）
  - 悪化要因の仮説（1-2件）
  - 次週改善タスク（最大3件）

## 受け入れ条件
- `en / es / ar` の同一フォーマット比較表が毎週作成できる
- 最低1件の改善タスクがKPI差分に紐づいて起票される

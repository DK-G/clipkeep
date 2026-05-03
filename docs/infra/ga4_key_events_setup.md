# GA4 Key Events Setup (ClipKeep)

最終更新: 2026-03-15

## 目的
実装済みイベントを GA4 側でキーイベント化し、週次で改善判断できる状態にする。

対象イベント（実装済み）:
- `extract_submit`
- `processing_complete`
- `download_actual_start`
- `error_displayed`
- `blog_cta_click`
- `result_related_click`
- `gallery_card_click`

## 前提
- `NEXT_PUBLIC_GA_ID` が本番で有効
- [https://clipkeep.net](https://clipkeep.net) で GA タグが配信されている
- 反映済みコミット: `2b4d997`

## 手順（GA4 管理画面）
1. GA4 の対象プロパティを開く
2. 左メニュー `管理` -> `データ表示` -> `イベント`
3. 下記イベントが一覧に出るまで本番で実際に操作する
   - `extract_submit`
   - `processing_complete`
   - `download_actual_start`
   - `error_displayed`
   - `blog_cta_click`
   - `result_related_click`
   - `gallery_card_click`
4. まず `extract_submit`, `processing_complete`, `download_actual_start` を `キーイベントとしてマーク` する
5. `error_displayed`, `blog_cta_click`, `result_related_click`, `gallery_card_click` は日次/週次分析イベントとして監視する
6. 左メニュー `レポート` -> `リアルタイム` でイベント発火を確認

## 推奨カスタム定義
`管理` -> `データ表示` -> `カスタム定義` で追加:

イベントスコープ（推奨）:
- `platform`
- `locale`
- `jobId`
- `job_id`
- `gallery_section`
- `media_type`
- `quality`
- `from_job_id`
- `to_job_id`
- `source_host`

注意:
- 追加後、標準レポートに反映されるまで最大24時間程度かかる

## 確認シナリオ（本番操作）
1. `/download-twitter-video?locale=en` または `/download-tiktok-video?locale=en` を開く
2. 公開投稿URLを貼り付けて抽出する（`extract_submit`）
3. 結果が返ることを確認する（`processing_complete`）
4. 結果ページでダウンロードを開始する（`download_actual_start`）
5. 関連/最新リンクをクリックする（`result_related_click`）
6. ブログ記事からCTAをクリックする（`blog_cta_click`）
7. リアルタイムレポートでイベントが観測されることを確認

## 運用ルール
- デプロイ後は `npm run check:release` 実行
- 日次レビューでは `extract_submit`, `processing_complete`, `download_actual_start`, `error_displayed` を確認
- 週次レビューでは `processing_complete / extract_submit` と `download_actual_start / processing_complete` を確認
- 2週連続で `download_actual_start / processing_complete` が低下したら結果ページまたはダウンロード導線改善を起票

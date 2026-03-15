# GA4 Key Events Setup (ClipKeep)

最終更新: 2026-03-15

## 目的
実装済みイベントを GA4 側でキーイベント化し、週次で改善判断できる状態にする。

対象イベント（実装済み）:
- `download_click`
- `similar_click`
- `gallery_card_click`

## 前提
- `NEXT_PUBLIC_GA_ID` が本番で有効
- [https://clipkeep.net](https://clipkeep.net) で GA タグが配信されている
- 反映済みコミット: `2b4d997`

## 手順（GA4 管理画面）
1. GA4 の対象プロパティを開く
2. 左メニュー `管理` -> `データ表示` -> `イベント`
3. 下記イベントが一覧に出るまで本番で実際に操作する
   - `download_click`
   - `similar_click`
   - `gallery_card_click`
4. 各イベントのトグルで `キーイベントとしてマーク` を有効化
5. 左メニュー `レポート` -> `リアルタイム` でイベント発火を確認

## 推奨カスタム定義
`管理` -> `データ表示` -> `カスタム定義` で追加:

イベントスコープ（推奨）:
- `platform`
- `locale`
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
1. `/twitter-trending-videos?locale=en` を開く
2. カードを1回クリック（`gallery_card_click`）
3. 結果ページで DL ボタンを1回クリック（`download_click`）
4. Similar Videos のカードを1回クリック（`similar_click`）
5. リアルタイムレポートで3イベントが観測されることを確認

## 運用ルール
- デプロイ後は `npm run check:release` 実行
- 週次レビュー時に 3イベントの件数と比率を確認
- 2週連続で `similar_click / download_click` 比率が低下したらUI導線改善を起票

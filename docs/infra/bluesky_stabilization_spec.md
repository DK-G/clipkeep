# Bluesky Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Bluesky only

## 1. Goal

Bluesky は現行の抽出ロジックが軽く、全面改修よりも安定化の整理が先に効く。

目的:

- 現行の公開ページ抽出を維持する
- 失敗分類と URL 正規化を追加しやすくする
- 監視と cache を入れやすくする

## 2. Current Path

現行コード: [bluesky.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\bluesky.ts)

現在の抽出:

1. 対象 URL をそのまま fetch
2. HTML の `og:video:url` または `og:video` を抽出
3. 無ければ `og:image`
4. `og:title` を補助的に使う

補足:

- 現行は public page 依存だが、Bluesky には official oEmbed と ATProto ベースの media model がある
- ただし MVP では public-page extractor を維持する

## 3. Scope

MVP で対象にするもの:

- 公開 Bluesky post URL
- 単体 video post
- 単体 image post

対象外:

- login required content
- thread 全体
- quote 全展開
- 複数メディアの完全再現

## 4. Main Risks

現行実装から見えるリスク:

1. `og:*` タグだけに依存している
2. URL 正規化がない
3. 失敗分類が無い
4. public page 構造変化に弱い
5. video は HLS や blob model の理解不足で取りこぼしやすい
6. image CDN では CORS 制約が絡む場合がある

## 5. Stability Policy

Bluesky は複雑な fallback を増やす前に、今の path を安定運用できる形にする。

やること:

- post URL の正規化
- success / failed cache
- error code 分類
- path 成功率ログ

## 6. Supported Input

受け付ける URL:

- `https://bsky.app/profile/{handle}/post/{id}`

対象外:

- profile top
- feed
- thread listing
- login only content

## 7. URL Normalization

正規化ルール:

1. `bsky.app/profile/{handle}/post/{id}` 形式のみ受ける
2. 不要クエリ除去
3. post 単位で cache key 生成
4. `handle + postId` を内部識別子として保持

設計上の注意:

- handle は変更されうるため、将来的には DID ベース識別を扱える形が望ましい

## 8. Fallback Policy

MVP では複雑な複線化はしない。

抽出順:

1. public HTML OG tags
2. 必要なら browser fallback

browser fallback は常用しない。

将来候補:

- oEmbed や public XRPC の利用で structured path を増やす
- ただし MVP では DOM / HTML path を維持する

## 9. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `POST_NOT_FOUND`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `UPSTREAM_FORMAT_CHANGED`
- `UPSTREAM_TEMPORARY_FAILURE`
- `HLS_ONLY`
- `CORS_BLOCKED`

## 10. Cache Policy

保存対象:

- normalized URL
- handle
- postId
- media URL
- thumb URL
- media type
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

## 11. Download Policy

download は proxy を通せる形を保つ。

理由:

- upstream URL 失効対策
- referer / direct exposure 抑制

補足:

- image は CDN CORS 制約に触れる可能性があるため、proxy は特に有効
- video は HLS 前提に近づくと downloader 設計が変わるため、MVP では単純 path を優先

## 12. Logging

必要ログ:

- input URL
- normalized URL
- handle
- postId
- cache hit / miss
- final media type
- final status
- error code
- processing time

## 13. MVP Boundary

MVP でやること:

1. 現行 public HTML path を維持
2. URL 正規化
3. error code 分類
4. success / failed cache
5. path 成功率ログ
6. image / video の成功率を分けて観測

MVP でやらないこと:

- thread 全体抽出
- gallery 完全対応
- 専用 extractor service
- custom HLS reconstruction

## 14. Key Design Rule

Bluesky は「軽い public page 抽出」を壊さないことを優先し、失敗の見える化と URL 管理を先に整える。

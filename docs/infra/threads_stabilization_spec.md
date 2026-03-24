# Threads Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Threads only

## 1. Goal

Threads は Meta 系の制約が強いため、MVP では現行の public page 抽出を壊さず、対応境界を明確にする。

目的:

- 現行 `og:*` 抽出を前提に整理する
- 無理な対象を早期に落とす
- 失敗分類と cache を追加しやすくする

## 2. Current Path

現行コード: [threads.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\threads.ts)

現在の抽出:

1. 対象 URL を fetch
2. `og:video` を探す
3. 無ければ `og:image`
4. `og:title` を補助で使う

補足:

- Threads では `threads.com` / `threads.net` の両方が現れる可能性がある
- official oEmbed は存在するが、backend extractor の主経路にはしない

## 3. Scope

MVP で対象にするもの:

- 公開 Threads post URL
- 単体動画 post
- 単体画像 post

対象外:

- login required content
- private or restricted profile
- thread 全体
- 複数メディア完全再現

## 4. Main Risks

1. Meta 側の anti-bot や page behavior 変動に弱い
2. `og:*` タグのみ依存
3. login wall や region / age gate に弱い
4. 画像だけ拾って success になりやすい
5. CDN media URL が短時間で失効しやすい

## 5. Stability Policy

Threads は feature を広げない。

方針:

- public page 抽出 path を維持
- success / failed cache を追加
- error code を分ける
- browser fallback は常用しない

## 6. Supported Input

受け付ける URL:

- `https://www.threads.net/@user/post/{id}`
- `https://www.threads.com/@user/post/{id}`
- `https://www.threads.com/t/{shortcode}`
- `https://www.threads.net/t/{shortcode}`

対象外:

- profile top
- replies list
- login only content

## 7. URL Normalization

正規化ルール:

1. post URL 形式のみ受ける
2. 不要クエリを削除
3. `user + postId` を内部識別子として保持

補足:

- `shortcode` 形式も許容する
- `.com` / `.net` は canonical へ寄せる

## 8. Success Criteria

MVP success:

- 動画 URL か画像 URL のどちらかを download 対象として返せる

ただし、将来的に Threads で「画像はよいが動画が不安定」という状態が続くなら、video success 条件だけ別管理にする。

## 9. Fallback Policy

抽出順:

1. public HTML OG path
2. 必要なら browser fallback

browser fallback は最終手段であり、常用しない。

将来候補:

- hidden JSON や oEmbed を補助経路にする余地はある
- ただし MVP では public-page metadata path を維持する

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `POST_NOT_FOUND`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `UPSTREAM_FORMAT_CHANGED`
- `UPSTREAM_TEMPORARY_FAILURE`
- `DOWNLOAD_EXPIRED`
- `ANTI_BOT_BLOCKED`

## 11. Cache Policy

保存対象:

- normalized URL
- post id
- media URL
- thumb URL
- media type
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

## 12. Download Policy

download は proxy 前提に寄せる。

理由:

- media URL の失効
- referer / exposure 制御

追加方針:

- media URL は長期保存前提にしない
- extract 成功時は必要に応じて即取得または短TTLで扱う

## 13. Logging

必要ログ:

- input URL
- normalized URL
- post id
- media type
- final status
- error code
- processing time

## 14. MVP Boundary

MVP でやること:

1. 現行 public HTML path を維持
2. URL 正規化
3. error code 分類
4. success / failed cache
5. `.com` / `.net` / shortcode を canonical 化

MVP でやらないこと:

- Threads API ベース全面移行
- 専用 extractor service
- thread 全体取得
- whole-account scraping

## 15. Key Design Rule

Threads は「軽量な公開ページ抽出を維持しつつ、失敗を正しく扱う」ことを優先する。

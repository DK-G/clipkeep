# Bilibili Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Bilibili only

## 1. Goal

Bilibili は現行実装が最小限で、安定化の前に「何を成功とみなすか」を整理する必要がある。

目的:

- 現行の公開ページ抽出の限界を明示する
- 動画抽出成功条件を定義する
- 無理な対象を MVP から外す

## 2. Current Path

現行コード: [bilibili.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\bilibili.ts)

現在の抽出:

1. 対象 URL を fetch
2. `og:video` を探す
3. 無ければ `og:image`
4. `og:title` を補助で使う

問題:

- Bilibili では `og:video` が直 MP4 でないことが多い
- 結果として thumbnail だけ返るケースが起きやすい
- `BV` だけでは足りず、実際の media 解決には `cid` が必要になることが多い

## 3. Scope

MVP で対象にするもの:

- 公開 Bilibili video URL
- 単体動画ページ

対象外:

- login required content
- premium / region restricted content
- live
- bangumi / series の完全対応
- playlist / multi-part の完全対応
- 1080p / 4K など cookie 前提の高画質対応

## 4. Main Risks

1. `og:video` が直接ダウンロードに使えない
2. 公開ページだけでは安定して media URL が取れない
3. 署名や cookie を前提とする経路がある可能性
4. 画像しか返せない成功もどきが起きやすい
5. 高頻度取得で 412 などの anti-scraping 制限に触れうる

## 5. Stability Policy

Bilibili は「今すぐ高機能化」ではなく、MVP での成功条件を厳しくする。

方針:

- 動画 URL が取れた時だけ video success
- thumbnail のみ取得は image success ではなく、用途を分けて扱う
- 動画抽出不可なら明示的に失敗扱いにする方が UX がよい場合がある

将来方向:

- 公開ページ metadata から、WBI 前提 API 取得へ段階的に寄せる余地はある
- ただし MVP では signed API や cookie 運用は scope 外に置く

## 6. Supported Input

受け付ける URL:

- `https://www.bilibili.com/video/{bvid}`

対象外:

- search
- user profile
- live
- bangumi episode

## 7. URL Normalization

正規化ルール:

1. video URL 形式のみ受ける
2. 不要クエリ削除
3. `BV id` を内部識別子として保持
4. cache key は normalized URL または `BV id`

補足:

- multi-part を扱うなら `cid` も必要になる
- bangumi は `ep` / `season` 系へ分岐するため MVP では除外する

## 8. Success Criteria

MVP の成功条件:

- download 可能な video URL を 1 件返せる

補助情報:

- title
- thumbnail

`og:image` だけ取れた場合は、成功として扱うか失敗として扱うかを仕様で固定する必要がある。  
ClipKeep の主用途を考えると、Bilibili では `thumbnail only` を失敗扱いに寄せる方が自然である。

## 9. Fallback Policy

MVP では複雑な複線化を避ける。

候補:

1. public page metadata
2. browser fallback

ただし browser fallback でも直ダウンロード URL に到達できないなら、無理に成功扱いしない。

MVP 補足:

- browser fallback で player iframe に到達できても、それだけでは download success とはみなさない

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `MEDIA_NOT_FOUND`
- `VIDEO_URL_NOT_RESOLVED`
- `PRIVATE_OR_RESTRICTED`
- `UPSTREAM_FORMAT_CHANGED`
- `RATE_LIMITED`
- `CID_NOT_RESOLVED`

## 11. Cache Policy

保存対象:

- normalized URL
- BV id
- resolved video URL
- thumbnail
- title
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

## 12. Download Policy

動画 URL が取れた場合のみ download API を出す。

thumbnail しか無い場合:

- result UI で「動画取得不可」を返す
- thumbnail を補助表示には使ってよい

## 13. Logging

必要ログ:

- input URL
- normalized URL
- BV id
- video resolved / not resolved
- thumbnail found / not found
- final status
- error code
- processing time

## 14. MVP Boundary

MVP でやること:

1. URL 正規化
2. success 条件の厳格化
3. failed cache
4. 動画 URL 未解決時の明示エラー

MVP でやらないこと:

- Bilibili 専用 extractor service
- cookie / signed API への本格対応
- bangumi / live 対応
- DASH audio/video muxing

## 15. Key Design Rule

Bilibili は「一見取れたように見える thumbnail success」を避け、ダウンロード可能な動画 URL が取れた時だけ成功とみなす。

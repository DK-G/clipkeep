# TikTok Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: TikTok only

## 1. Goal

TikTok は現行で外部 fixer / API 依存が強く、安定化の中心は抽出ロジック刷新ではなく、依存の揺れを制御することにある。

目的:

- 現行の `TikWM -> kktiktok` 経路を維持する
- 短縮 URL 解決を安定化する
- 失敗分類と cache を整備する

## 2. Current Path

現行コード: [tiktok.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\tiktok.ts)

現在の抽出:

1. `vt.tiktok.com` / `vm.tiktok.com` を HEAD redirect で正規化
2. `TikWM API` を呼ぶ
3. 失敗時は `kktiktok` fallback
4. `og:video` があれば採用

補足:

- 現行 path は「自前で TikTok を解読する」のではなく、第三者 upstream の可用性に依存する
- したがって安定化の中心は upstream 観測と失敗制御である

## 3. Scope

MVP で対象にするもの:

- 公開 TikTok video URL

対象外:

- private post
- login required content
- gallery / image post の完全対応
- sound only 抽出
- 高度な no-watermark 保証

## 4. Main Risks

1. 第三者 API / fixer 依存が強い
2. 短縮 URL 解決で HEAD が拒否される可能性
3. no-watermark 要件は upstream の変動に非常に弱い
4. Akamai などの anti-bot 制約を受けやすい
5. TikTok 側の暗号パラメータ更新で第三者 upstream が急に壊れる

## 5. Stability Policy

TikTok は Telegram のように内製抽出へ寄せず、現行 path の失敗を制御する。

方針:

- 短縮 URL 正規化を維持
- primary / secondary upstream を分けて記録
- no-watermark に拘りすぎず、download 可否を優先する
- error code と failed cache を整備する
- anti-bot や 403 / 429 を upstream failure として切り分ける

## 6. Supported Input

受け付ける URL:

- `https://www.tiktok.com/@user/video/{id}`
- `https://vt.tiktok.com/...`
- `https://vm.tiktok.com/...`

対象外:

- profile top
- playlist
- private content

## 7. URL Normalization

正規化ルール:

1. short URL は canonical video URL に解決
2. クエリ除去
3. video id を内部識別子として保持
4. cache key は normalized URL

補足:

- canonical 形は `https://www.tiktok.com/@user/video/{id}` を基準とする

## 8. Fallback Policy

抽出順:

1. short URL resolve
2. TikWM API
3. kktiktok
4. 失敗

browser fallback は MVP では不要。

補足:

- headless browser と stealth plugin による突破は理論上ありうるが、MVP では scope 外とする

## 9. Success Criteria

MVP success:

- ダウンロード可能な video URL を 1 件返せる

`no watermark` は副次条件であり、MVP success の必須条件とは切り分けて観測する。

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `SHORT_URL_RESOLVE_FAILED`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `UPSTREAM_TEMPORARY_FAILURE`
- `UPSTREAM_FORMAT_CHANGED`
- `NO_WATERMARK_UNAVAILABLE`
- `ANTI_BOT_BLOCKED`
- `RATE_LIMITED`

## 11. Cache Policy

保存対象:

- normalized URL
- video id
- chosen upstream
- resolved media URL
- thumb URL
- title
- ttl

TTL:

- success cache: `1h` から `12h`
- failed cache: `10m` から `30m`

補足:

- TikTok 由来 media URL は短時間で失効する可能性があるため、cache は長く持ちすぎない

## 12. Download Policy

download は proxy 前提。

理由:

- media URL 失効
- referer や bot 制約の吸収
- 直リンク露出抑制

## 13. Logging

必要ログ:

- input URL
- normalized URL
- short resolve success / fail
- TikWM success / fail
- kktiktok success / fail
- anti-bot blocked / not blocked
- final status
- error code
- processing time

## 14. MVP Boundary

MVP でやること:

1. 現行 upstream path を維持
2. short URL 正規化
3. error code 分類
4. success / failed cache
5. upstream path 別ログ
6. anti-bot / 403 / 429 の分類

MVP でやらないこと:

- TikTok 直解析への全面移行
- 専用 extractor service
- gallery 完全対応
- watermark 除去の保証

## 15. Key Design Rule

TikTok は「no-watermark を絶対保証する」より、「どの upstream で成功 / 失敗したかを見える化し、再試行戦略を制御する」を優先する。

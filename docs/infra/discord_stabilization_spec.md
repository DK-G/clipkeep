# Discord Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Discord only

## 1. Goal

Discord は一般公開メッセージの取得制約が強いため、安定化の主眼は「何を正式対応とするか」を絞ることにある。

目的:

- 現行の直 CDN リンク対応を安定パスとして扱う
- 公開メッセージリンク対応は限定的に扱う
- 対象外ケースを早期に落とす

## 2. Current Path

現行コード: [discord.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\discord.ts)

現在の抽出:

1. `cdn.discordapp.com` または `media.discordapp.net` なら即返す
2. それ以外は URL を fetch
3. HTML の `og:video` または `og:image` を見る

補足:

- 実運用上は URL の `ex` `is` `hm` など署名付きクエリを保持できるかが重要

## 3. Scope

MVP で正式対応とするもの:

- `cdn.discordapp.com` の直 attachment URL
- `media.discordapp.net` の直 media URL

MVP で限定対応または非対応:

- 公開メッセージ URL
- ログインや権限を要するメッセージ
- サーバ参加前提のリンク

## 4. Main Risks

1. Discord message URL は公開でも安定的に取れないことがある
2. CDN URL でも寿命や access 条件が変動する可能性がある
3. HTML meta 依存の公開リンク対応は壊れやすい
4. 期限切れ URL は 404 ではなく access denied 相当で落ちることがある
5. invalid request の多発で Cloudflare 側 rate limit に触れる

## 5. Stability Policy

Discord は feature を広げない。

方針:

- 直 CDN URL を主成功パスとする
- message URL は best-effort に留める
- 対応不可時は早期に明示失敗とする

## 6. Supported Input

正式対応:

- `https://cdn.discordapp.com/...`
- `https://media.discordapp.net/...`

限定対応:

- `https://discord.com/channels/...`

非対応:

- 認証必須のメッセージ
- guild 参加必須リンク
- invite / server / channel top

## 7. URL Normalization

正規化ルール:

1. 直 CDN URL はクエリ含めて保持
2. media URL は元 URL を canonical とみなす
3. message URL はクエリ除去
4. host 制限を必須にする

補足:

- direct CDN URL は query を落とすと壊れるので、署名付きパラメータを完全保持する

## 8. Success Criteria

MVP success:

- 直ダウンロード可能な Discord CDN URL を返せる

message URL の OG 抽出は補助扱いとする。

補足:

- `media.discordapp.net` は画像系の変換配信であることがあるため、raw attachment とは分けて扱う

## 9. Fallback Policy

抽出順:

1. direct CDN path
2. public message page OG path
3. 失敗

browser fallback は MVP では不要。

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `DIRECT_URL_EXPIRED`
- `UPSTREAM_TEMPORARY_FAILURE`
- `ACCESS_DENIED`
- `RATE_LIMITED`

## 11. Cache Policy

保存対象:

- normalized URL
- media type
- title
- ttl

TTL:

- success cache: `1h` から `12h`
- failed cache: `10m` から `30m`

## 12. Download Policy

Discord は直 URL でも proxy 前提に寄せる。

理由:

- URL 失効
- access 制御の変化
- attachment 配信の一貫性

追加方針:

- URL を保存するだけでなく、可能なら早期に取得して自前保存へ寄せる

## 13. Logging

必要ログ:

- input URL
- normalized URL
- direct path / message path
- final status
- error code
- processing time

## 14. MVP Boundary

MVP でやること:

1. direct CDN path を正式対応
2. message URL は限定対応
3. error code 分類
4. success / failed cache
5. signed query 保持の厳格化

MVP でやらないこと:

- Discord API 連携
- 認証付き message access
- browser fallback
- URL refresh 機構

## 15. Key Design Rule

Discord は「何でも取る」ではなく、「直 CDN リンクだけは安定して扱う」に寄せる。

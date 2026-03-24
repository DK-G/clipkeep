# Lemon8 Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Lemon8 only

## 1. Goal

Lemon8 は ByteDance 系であり、TikTok と似た制約を持つ可能性が高い。MVP では現行の公開ページ抽出を維持し、対象境界を明確にする。

目的:

- 現行 `og:video / og:image` 抽出を前提に整理する
- URL 失効や CDN 制約を考慮する
- 失敗分類と cache を入れやすくする

## 2. Current Path

現行コード: [lemon8.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\lemon8.ts)

現在の抽出:

1. モバイル UA で対象 URL を fetch
2. `og:video` を探す
3. 無ければ `og:image`
4. `og:title` を補助で使う

補足:

- Lemon8 には short URL と long URL の両方がある
- 現行 path は mobile UA 前提で public metadata を取る軽量構成

## 3. Scope

MVP で対象にするもの:

- 公開 Lemon8 post URL
- 単体動画 post
- 単体画像 post

対象外:

- login required content
- profile top
- multi-item 完全再現
- 非公開または地域制限コンテンツ

## 4. Main Risks

1. ByteDance 系 CDN URL が期限付きである可能性
2. `og:*` 依存が構造変化に弱い
3. モバイル UA でしか metadata が安定しない可能性
4. 動画より画像の方が成功しやすく、成功率に偏りが出る可能性
5. hidden API に寄せると破壊的変更リスクが上がる

## 5. Stability Policy

Lemon8 は機能を広げず、既存 path の安定運用を優先する。

方針:

- モバイル UA 前提を維持
- success / failed cache を追加
- media URL 失効前提で proxy を使う
- error code を分ける
- hidden API や app 内部挙動への依存は避ける

## 6. Supported Input

受け付ける URL:

- 公開 Lemon8 post URL

対象外:

- profile top
- search
- app deep link

補足:

- short URL は canonical long URL へ解決してから処理する

## 7. URL Normalization

正規化ルール:

1. 不要クエリ削除
2. canonical post URL に統一
3. post 単位で cache key を生成

補足:

- `v.lemon8-app.com/...` の short URL を long URL に寄せる

## 8. Success Criteria

MVP success:

- 動画 URL または画像 URL を download 対象として返せる

ただし video は失効しやすい可能性があるため、download 成功率は別指標で見る。

## 9. Fallback Policy

抽出順:

1. mobile public HTML path
2. browser fallback

browser fallback は常用しない。

補足:

- hidden API の逆解析は MVP scope 外に置く

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `DOWNLOAD_EXPIRED`
- `UPSTREAM_FORMAT_CHANGED`
- `UPSTREAM_TEMPORARY_FAILURE`
- `SHORT_URL_RESOLVE_FAILED`
- `REGION_RESTRICTED`

## 11. Cache Policy

保存対象:

- normalized URL
- media URL
- thumb URL
- media type
- title
- ttl

TTL:

- success cache: `1h` から `12h`
- failed cache: `10m` から `30m`

## 12. Download Policy

download は proxy 前提。

理由:

- URL 失効
- direct exposure 抑制
- referer や UA 条件吸収

## 13. Logging

必要ログ:

- input URL
- normalized URL
- mobile path success / fail
- final media type
- final status
- error code
- processing time

## 14. MVP Boundary

MVP でやること:

1. モバイル UA public path 維持
2. URL 正規化
3. error code 分類
4. success / failed cache
5. short URL の canonical 化

MVP でやらないこと:

- Lemon8 専用 extractor service
- hidden API ベース全面移行
- multi-item 完全対応
- app internals の深い reverse engineering

## 15. Key Design Rule

Lemon8 は ByteDance 系の URL 失効リスクを前提に、抽出成功だけでなく download 成功まで含めて評価する。

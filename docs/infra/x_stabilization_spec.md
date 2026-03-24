# X Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: X / Twitter only

## 1. Goal

ClipKeep の X 抽出は現状で一定程度ダウンロードできているため、目的は全面改修ではない。

この仕様の目的は次の 2 点に絞る。

- 現行の抽出成功率を維持しつつ失敗率を下げる
- 外部依存の変動に強い運用と観測を整える

MVP の対象は現行と同じく公開投稿 URL の動画 / 画像抽出とする。

## 2. Strategy

X は Telegram のように別 extractor へ大きく分離しない。

理由:

- 現状で既にダウンロード可能なルートがある
- 大規模な作り直しはコストに対してリターンが小さい
- 問題は「取得不能」より「外部依存の不安定さ」の比重が大きい

方針:

- 既存多段 fallback を維持する
- fallback 順序と失敗分類を明確化する
- 監視と切替をしやすくする

## 3. Current Extraction Path

現行コード: [twitter.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\twitter.ts)

現在の抽出順:

1. `api.fxtwitter.com` JSON API
2. `d.fxtwitter.com` direct redirect
3. fixer HTML scrape
   - `fxtwitter.com`
   - `vxtwitter.com`
   - `fixupx.com`

この順序自体は維持する。

## 4. Supported Input

受け付ける URL:

- `https://x.com/.../status/{id}`
- `https://twitter.com/.../status/{id}`
- `https://www.twitter.com/.../status/{id}`
- `https://mobile.twitter.com/.../status/{id}`

MVP で非対応:

- private account
- login required post
- spaces
- DM
- quote / thread 全件取得
- 動画以外の全添付を完全再現すること

## 5. URL Normalization

正規化ルール:

1. `twitter.com` と `x.com` を内部表現で統一
2. `status/{id}` を必須とする
3. `?s=20` など不要クエリは削除
4. キャッシュキーは `platform + normalized_url`

最重要キーは URL 全体ではなく `statusId` とする。

補足:

- `pbs.twimg.com` の直 media URL は `format` などの必要パラメータが欠けるとメディア実体ではなく HTML に落ちることがある
- そのため、直 media URL を扱う場合も URL 形状の検証が必要

## 6. Architecture

現行の `createJob -> waitUntil -> extractTwitter -> D1 polling` を維持する。

Worker の責務:

- URL 検証
- statusId 抽出
- job 管理
- fallback 実行
- 結果の保存
- download / proxy 配信

追加するのは大規模な別 extractor ではなく、以下の運用機能である。

- fallback 経路別の成功 / 失敗ログ
- upstream 切替しやすい設定
- failure cache

## 7. Extraction Contract

既存の `/api/v1/extract/prepare` と `/api/v1/extract/jobs/:jobId` をそのまま使う。

X 専用 API は増やさない。

## 8. Fallback Policy

抽出順序は固定する。

1. API route
2. redirect route
3. HTML route

早い経路から試す理由:

- API は最も軽い
- redirect は payload を読まずに直リンクを得られる場合がある
- HTML scrape は最後の救済

各経路の扱い:

### 8.1 API route

成功条件:

- HTTP 200
- media 配列が存在
- 各 media に有効 URL がある

失敗条件:

- network error
- 4xx / 5xx
- 空 media
- 形式崩れ
- anti-bot challenge page

### 8.2 Redirect route

成功条件:

- final URL が `twimg.com` 系
- content candidate が video と見なせる

失敗条件:

- `HEAD` 自体を upstream が拒否
- redirect chain 途中で遮断
- 画像 / HTML に落ちる
- Cloudflare challenge や bot check に吸われる

### 8.3 HTML route

成功条件:

- `og:video`, `og:video:url`, `og:video:secure_url`, `twitter:player:stream` のいずれか取得
- もしくは `og:image` を画像として取得

失敗条件:

- meta 欠落
- HTML 構造変化
- anti-bot で別ページ返却

補足:

- fixer / mirror 系は Cloudflare challenge に入ると一気に成功率が落ちる
- そのため HTML route は最終救済として扱い、安定主経路にはしない

## 9. Stabilization Rules

大規模改修は避け、以下を安定化要件とする。

1. fallback ごとに成否をログ化する
2. 一時的失敗と恒久的失敗を分ける
3. 同一 URL の短時間連続失敗には failed cache を置く
4. success path を観測し、最も成功率の高い経路を見える化する
5. proxy 配信で hotlink 制限や referer 制約を吸収する
6. fixer 側 challenge 率を path 指標として見る

## 10. Failure Classification

内部エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `POST_NOT_FOUND`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `UPSTREAM_TEMPORARY_FAILURE`
- `UPSTREAM_FORMAT_CHANGED`
- `RATE_LIMITED`
- `DOWNLOAD_EXPIRED`
- `BOT_CHALLENGED`

分類方針:

- 再試行して意味があるもの
  - `UPSTREAM_TEMPORARY_FAILURE`
  - `RATE_LIMITED`
- 再試行しても意味が薄いもの
  - `INVALID_URL`
  - `UNSUPPORTED_URL`
  - `POST_NOT_FOUND`
  - `PRIVATE_OR_RESTRICTED`

## 11. Cache Policy

目的:

- 同一投稿の再取得コスト削減
- 外部 upstream へのアクセス回数削減
- 一時失敗時の過剰再試行防止

保存対象:

- normalized URL
- statusId
- chosen upstream path
- extracted media URL
- thumbnail URL
- media type
- createdAt
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

再解析条件:

- success cache 期限切れ
- proxy / download 時の upstream 失効
- media URL が 403 / 404

注意:

- X 由来トークンや guest access を自前管理する実装は、MVP では scope 外に置く
- 現段階では既存 fixer 依存経路を前提にし、token scraping までは踏み込まない

## 12. Download and Proxy Policy

X は upstream 直リンクだけでなく、配信制約を吸収するため proxy を前提にする。

推奨:

1. UI では download API を見せる
2. 内部で proxy または redirect を使い分ける
3. `Content-Disposition: attachment`
4. 必要なら Referer / User-Agent を Worker 側で補う

追加方針:

- media URL を長期 canonical とみなさない
- 直 media URL は decay しうる前提で cache TTL を短めに保つ

## 13. Logging

最低限保存する項目:

- input URL
- normalized URL
- statusId
- cache hit / miss
- chosen path
- API success / fail
- redirect success / fail
- HTML success / fail
- challenge detected / not detected
- processing time
- final status
- error code

ここは実装より運用で効く。

## 14. Monitoring

X は仕様変更ではなく upstream 依存の揺れが主因なので、監視を重視する。

見るべき指標:

- path ごとの成功率
- 24h の全体成功率
- 失敗コード分布
- `MEDIA_NOT_FOUND` と `UPSTREAM_FORMAT_CHANGED` の比率
- average processing time

アラート基準例:

- 全体成功率が 24h で一定値を下回る
- 特定 path が急激に 0% 近くへ落ちる
- 同一 upstream の失敗が短時間に集中する

## 15. Security

必須:

- Turnstile
- IP 単位レート制限
- 1 request / 1 URL
- X / Twitter ドメイン以外拒否
- proxy 対象ドメイン制限

## 16. UI Requirements

補助文言:

- `Public X posts only`
- `Private or login-only posts are not supported`
- `Some posts may fail temporarily because of upstream restrictions`

失敗時は「壊れた」ではなく、再試行可能性を伝える。

例:

- `This X post could not be processed right now. Please try again later.`

## 17. MVP Boundary

MVP でやること:

1. 現行 fallback を維持
2. 失敗分類を整理
3. success / failed cache を追加
4. path ごとの観測を追加
5. proxy 前提を明確化
6. challenge page 検知を追加

MVP でやらないこと:

- 公式 API ベースへの全面移行
- 専用 extractor service 新設
- thread 全体抽出
- 複数 variant の高度選択

## 18. Key Design Rule

X は「作り直す」のではなく、「今動いている経路を可視化し、壊れ方を制御する」。

最適化対象は抽出ロジックそのものより、fallback 制御、キャッシュ、失敗分類、監視である。

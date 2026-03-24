# Telegram Extractor Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Telegram only

## 1. Goal

ClipKeep で Telegram の公開投稿 URL を入力すると、対象メディアを抽出し、ブラウザからダウンロードできるようにする。

MVP では対象を絞る。

- 対応対象: 公開チャンネルの投稿 URL
- 最優先メディア: 単体動画 1 件
- 次点: 画像 1 件、ファイル 1 件

MVP の狙いは「広く取る」ことではなく、「狭くても安定して取れる」こととする。

## 2. Non-Goals

初期段階では以下を狙わない。

- 非公開チャンネル
- 招待制グループ
- 個人チャット
- Telegram ログインを必要とする URL
- 複数メディア投稿の完全対応
- 複数画質選択
- 無制限の大容量ファイル対応
- 外部埋め込みサービスの救済

## 3. Architecture

Telegram 抽出は Cloudflare Worker 単体で完結させない。

- Web / Worker API: URL 受付、検証、ジョブ管理、結果配信、ダウンロード制御
- D1 / KV: ジョブ状態、キャッシュメタデータ、エラーログ
- R2: 実ファイルの短期保存
- Telegram extractor service: Telegram Client API を使った実取得

役割分担:

- Cloudflare: 表側 API、Bot 対策、レート制限、状態管理、ダウンロード配信
- Telegram extractor: Telegram との実通信、投稿解決、メディア取得、R2 保存

## 4. Runtime Decision

Telegram extractor は Worker ではなく別実行基盤に置く。

候補:

- Node.js service with gramjs
- Python service with Telethon
- TDLib based worker

この仕様では実装の具体は固定しないが、前提は共通とする。

- MTProto client ベース
- サービス用セッションを安全に保管
- 外部公開しない内部サービス

MTProto を前提にする理由:

- Bot API では大きなファイル取得に限界がある
- public web embed parsing だけでは DOM 変更や large-file 欠落に弱い
- MTProto client は Telegram native client に近い経路を使えるため、MVP の安定性要件に合う

## 5. Supported Input

MVP では投稿 URL のみを受け付ける。

受け付ける例:

- `https://t.me/channel_name/123`
- `https://telegram.me/channel_name/123`
- `https://t.me/s/channel_name/123`
- `https://t.me/channel_name/123?single`

MVP では受け付けない例:

- `https://t.me/channel_name`
- `https://t.me/+xxxxxxxx`
- `tg://...`
- private / invite-only URL

`channel URL` 単体は対象外とする。必ず投稿番号付き URL が必要。

補足:

- `?single` は grouped media から単一メディアだけを対象化する入力として有効なので、MVP でも受理してよい。
- `t.me/c/<channel_id>/<id>` は private membership 前提になるため、MVP では非対応とする。

## 6. URL Normalization

正規化ルール:

1. `telegram.me` は `t.me` に統一
2. クエリ文字列は除去
3. 末尾スラッシュは除去
4. `/s/` は内部表現を通常投稿 URL に寄せる
5. `?single` は単一対象指定として保持する
6. 正規化後のキーを `platform + normalized_url` で扱う

キャッシュキー:

- `sha256(normalized_url)`

## 7. User Flow

1. ユーザーが Telegram 投稿 URL を入力
2. Web が `/api/v1/extract/prepare` を呼ぶ
3. Worker が URL 検証と正規化を行う
4. キャッシュヒットなら `ready` を即返す
5. 未ヒットなら job を `queued` で作成
6. extractor が job を処理して Telegram から取得
7. extractor が R2 保存と D1 更新を行う
8. フロントが `/api/v1/extract/jobs/{jobId}` をポーリング
9. `ready` になったら download API を表示

## 8. API Contract

ClipKeep 既存契約に寄せる。Telegram 専用 API を増やすより、可能な限り既存 `/api/v1/extract/*` に乗せる。

### 8.1 Prepare

Endpoint:

- `POST /api/v1/extract/prepare`

Request:

```json
{
  "url": "https://t.me/example_channel/123",
  "platform": "telegram",
  "locale": "en",
  "turnstileToken": "token"
}
```

Success:

```json
{
  "ok": true,
  "data": {
    "jobId": "tg_xxxxx",
    "status": "queued",
    "pollAfterMs": 1200
  }
}
```

### 8.2 Job Status

Endpoint:

- `GET /api/v1/extract/jobs/:jobId`

States:

- `queued`
- `processing`
- `completed`
- `failed`
- `expired`

MVP では API 出力上 `completed` を返し、UI 上は `ready` と等価に扱ってよい。

Completed example:

```json
{
  "ok": true,
  "data": {
    "id": "tg_xxxxx",
    "platform": "telegram",
    "status": "completed",
    "variants": [
      {
        "url": "/api/v1/download/tg_xxxxx",
        "quality": "original",
        "ext": "mp4",
        "type": "video"
      }
    ],
    "warnings": []
  }
}
```

Failed example:

```json
{
  "ok": true,
  "data": {
    "id": "tg_xxxxx",
    "platform": "telegram",
    "status": "failed",
    "variants": [],
    "warnings": [
      "This Telegram post is private or unavailable."
    ]
  }
}
```

### 8.3 Download

Endpoint:

- `GET /api/v1/download/:jobId`

Preferred behavior:

1. Worker validates job state and expiry
2. Worker serves from R2 or redirects to a signed R2 URL
3. `Content-Disposition: attachment`
4. `Range` support is recommended

`direct Telegram CDN URL` をそのまま長時間フロントに露出する設計は避ける。

## 9. State Model

ジョブ状態:

- `queued`: Worker が job を受付済み
- `processing`: extractor が処理中
- `completed`: R2 保存済み、ダウンロード可能
- `failed`: 再試行なしで失敗
- `expired`: キャッシュや R2 オブジェクトが期限切れ

State transitions:

- `queued -> processing`
- `processing -> completed`
- `processing -> failed`
- `completed -> expired`

## 10. Storage Model

最低限保持する情報:

- `jobId`
- `platform`
- `normalizedUrl`
- `status`
- `createdAt`
- `updatedAt`
- `errorCode`
- `errorMessage`
- `r2Key`
- `fileName`
- `mimeType`
- `fileSize`
- `ttl`
- `cacheKey`
- `retryCount`

## 11. Telegram Extractor Responsibilities

extractor service の責務:

1. job を受け取る
2. 正規化 URL から対象メッセージを解決する
3. 投稿から対象メディアを特定する
4. サイズ制限を先に判定する
5. 取得成功時は R2 に保存する
6. D1 に `completed` を反映する
7. 失敗時は `failed` とエラーコードを反映する

追加要件:

8. 高頻度取得を避けるため download pacing を入れる
9. 一時失敗時に再投入できるよう queue 状態を永続化する

MVP の対象メディア:

- 動画 1 件

後続で追加:

- 画像 1 件
- ファイル 1 件

## 12. File Size Policy

サイズ制限は仕様として明記する。

MVP 例:

- `<= 500MB`: 対応
- `> 500MB`: `FILE_TOO_LARGE`

途中でサイズ超過が判明した場合も `failed` に落とす。

補足:

- Telegram web 由来の URL は短時間で失効する可能性がある
- slow download による失効を避けるため、MVP では web URL の長時間再利用を前提にしない

## 13. Cache Policy

目的:

- Telegram 側アクセス削減
- 応答高速化
- 再取得コスト削減

保存先:

- メタデータ: D1 or KV
- 実ファイル: R2

TTL:

- 短中期
- 例: `24h` から `7d`

再利用条件:

- 同一 `normalized_url`
- `completed` かつ期限内
- R2 オブジェクト存在

再解析条件:

- `expired`
- R2 オブジェクト欠落
- ダウンロード時の検証失敗

queue 運用:

- interrupted download は user 再入力頼みではなく、extractor queue 側で retry 管理する

## 14. Retry Policy

再試行条件を曖昧にしない。

- `EXTRACTOR_UNAVAILABLE`: 再試行可
- `RATE_LIMITED`: バックオフ再試行可
- `PRIVATE_OR_RESTRICTED`: 再試行しない
- `MESSAGE_NOT_FOUND`: 再試行しない
- `FILE_TOO_LARGE`: 再試行しない

Telegram 特有の注意:

- 高頻度取得は Telegram 側レート制限に触れやすい
- retry は即時多発ではなく、download delay を入れて逐次的に処理する

同一 URL の failed cache は短く持つ。

- 例: `10m` から `1h`

## 15. Error Model

内部エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `PRIVATE_OR_RESTRICTED`
- `MESSAGE_NOT_FOUND`
- `MEDIA_NOT_FOUND`
- `FILE_TOO_LARGE`
- `RATE_LIMITED`
- `EXTRACTOR_UNAVAILABLE`
- `DOWNLOAD_EXPIRED`
- `INTERNAL_ERROR`

ユーザー表示は変換する。

例:

- `PRIVATE_OR_RESTRICTED` -> `This Telegram post is private or unavailable.`
- `FILE_TOO_LARGE` -> `This file is larger than the current size limit.`
- `EXTRACTOR_UNAVAILABLE` -> `The Telegram extractor is temporarily unavailable.`

## 16. Security

必須:

- Cloudflare Turnstile
- IP 単位レート制限
- 1 request / 1 URL
- Telegram ドメイン以外拒否
- ダウンロード URL の期限管理

内部通信:

- Worker と extractor 間は internal bearer token または HMAC 署名を必須化
- extractor は public internet に露出しない
- Telegram session は暗号化保管

追加運用:

- extractor は max concurrent downloads を低く固定して開始する
- 初期値は 1 本直列でもよい

## 17. Logging

保存したいログ:

- input URL
- normalized URL
- cache hit / miss
- processing time
- result status
- error code
- file size band
- retry count
- extractor route used

保存しないもの:

- Telegram session secret
- 認証情報
- 不要な個人識別情報

## 18. UI Requirements

入力欄プレースホルダ:

- `https://t.me/channel_name/123`

補助文言:

- `Public Telegram posts only`
- `Large files may be unsupported`
- `Private channels are not supported`

処理中:

- `Telegram link is being analyzed...`

成功表示:

- filename
- estimated size
- download button

失敗表示:

- user-friendly reason
- retry button

## 19. MVP Boundary

MVP で満たすべき条件:

1. 公開チャンネル投稿 URL を受け付ける
2. 単体動画 1 件を安定して取得できる
3. サイズ制限を UI と API に明示できる
4. 同一 URL 再取得でキャッシュが効く
5. 失敗時に理由が出る
6. Bot 対策とレート制限が効く

MVP でやらないこと:

- 公開グループ対応
- アルバム全件対応
- 複数画質対応
- 音声抽出

MVP 補足:

- `?single` 付き URL は単一メディア対象として扱ってよい
- public channel post URL + single video download を最優先とする

## 20. Recommended Directory Split

```text
apps/
  web/
  worker-api/

services/
  telegram-extractor/

packages/
  shared-types/
  shared-utils/
```

## 21. Key Design Rule

Cloudflare は受付と配信に徹し、Telegram extractor は実取得に専念する。

MVP は「公開チャンネルの投稿 URL から、単体動画 1 件を安定取得する」ことに固定する。

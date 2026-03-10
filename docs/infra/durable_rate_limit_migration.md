# Durable Objects レート制限移行ガイド

## 現状
- `/api/v1/extract/prepare` は `src/lib/rate-limit/extract.ts` を経由してレート制限を判定。
- 既定は in-memory（単一プロセス）実装。

## 追加済みフック
- 環境変数 `RATE_LIMIT_DO_ENDPOINT` が設定されると、in-memory の代わりにHTTP経由で分散レート制限判定を実行。
- エンドポイント応答仕様:
  - request: `{ key, windowMs, limit }`
  - response: `{ limited: boolean, retryAfterSec: number }`

## Phase（移行手順）
1. Durable Object Worker 実装（カウンタ保持）
2. `RATE_LIMIT_DO_ENDPOINT` を本番/ステージングへ設定
3. 統合テストで `429` を確認
4. 安定後に in-memory をフォールバック専用へ維持

## 注意
- 現在このリポジトリでは DO本体は未デプロイ。
- 先にCloudflare側で Worker/Binding を作成し、`RATE_LIMIT_DO_ENDPOINT` を供給する。

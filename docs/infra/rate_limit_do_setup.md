# Rate Limit DO Worker Setup

## 1. Deploy Worker
```powershell
cd C:\dev\portfolio\web\clipkeep
npx wrangler deploy -c wrangler.rate-limit.toml
```

## 2. Get Worker URL
- Deploy後に表示される URL を控える（例: `https://clipkeep-rate-limit.<subdomain>.workers.dev`）。

## 3. Set App Env
- Next.js / Pages 側に環境変数を設定:
  - `RATE_LIMIT_DO_ENDPOINT=https://clipkeep-rate-limit.<subdomain>.workers.dev`

## 4. Verify
- `POST /api/v1/extract/prepare` を高頻度で叩き、429と `retryAfterSec` が返ることを確認。
- 既存テスト:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\api_integration_tests.ps1
```

## Notes
- DO未設定時は `src/lib/rate-limit/extract.ts` が in-memory fallback を使用する。
- 本設定は `wrangler.rate-limit.toml` を使う独立Worker構成。

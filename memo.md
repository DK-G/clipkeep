PS C:\dev\portfolio\web\clipkeep> npm run dev

> clipkeep@0.1.0 dev
> next dev

   ▲ Next.js 15.2.1
   - Local:        http://localhost:3000
   - Network:      http://172.26.9.154:3000

 ✓ Starting...
 ✓ Ready in 2.4s
 ○ Compiling /api/v1/health ...
 ✓ Compiled /api/v1/health in 2.3s (376 modules)
 GET /api/v1/health 200 in 2590ms
 ⚠ Your page app/page.tsx did not have a root layout. We created app\layout.tsx for you.
 ○ Compiling / ...
 ✓ Compiled / in 1078ms (684 modules)
 GET / 200 in 1226ms
 PS C:\dev\portfolio\web\clipkeep> powershell -ExecutionPolicy Bypass -File .\scripts\api_integration_tests.ps1
if : The term 'if' is not recognized as the name of a cmdlet, function, script file,
 or operable program. Check the spelling of the name, or if a path was included, ver
ify that the path is correct and try again.
At C:\dev\portfolio\web\clipkeep\scripts\api_integration_tests.ps1:40 char:15
+       Body = (if ($resp.Content) { $resp.Content | ConvertFrom-Json } ...
+               ~~
    + CategoryInfo          : ObjectNotFound: (if:String) [], ParentContainsErrorRe
   cordException
    + FullyQualifiedErrorId : CommandNotFoundException

PS C:\dev\portfolio\web\clipkeep> powershell -ExecutionPolicy Bypass -File .\scripts\e2e_flow_check.ps1
if : The term 'if' is not recognized as the name of a cmdlet, function, script file,
 or operable program. Check the spelling of the name, or if a path was included, ver
ify that the path is correct and try again.
At C:\dev\portfolio\web\clipkeep\scripts\e2e_flow_check.ps1:27 char:96
+ ... Code = [int]$resp.StatusCode; Raw = $resp.Content; Body = (if ($resp. ...
+                                                                ~~
    + CategoryInfo          : ObjectNotFound: (if:String) [], ParentContainsErrorRe
   cordException
    + FullyQualifiedErrorId : CommandNotFoundException
## 2026-03-12 Post-Deploy実行ログ（Codex実行）

### 1) 本番API統合テスト
- 実行:
  - `scripts/api_integration_tests.ps1 -BaseUrl https://clipkeep-web.liminality-3110.workers.dev/api/v1`
- 結果:
  - PASS=10 / FAIL=1 / SKIP=0
  - FAIL: `RateLimit 429 case`（40リクエスト内で429未観測）

### 2) 本番E2Eフロー
- 実行:
  - `scripts/e2e_flow_check.ps1 -WebBaseUrl https://clipkeep-web.liminality-3110.workers.dev -ApiBaseUrl https://clipkeep-web.liminality-3110.workers.dev/api/v1`
- 結果:
  - PASS=5 / FAIL=0 / SKIP=1

### 3) 法務/問い合わせページ到達確認
- `/legal/terms` 200
- `/legal/privacy` 200
- `/legal/cookies` 200
- `/legal/dmca` 200
- `/contact` 200

### メモ
- Post-deploy planのうち「ダウンロード動作確認」「法務ページ公開確認」は概ね達成。
- 429挙動は本番しきい値最適化（またはテスト条件見直し）が必要。

## 2026-03-12 429調整ステップ進捗
- `scripts/rate_limit_probe.ps1` を追加。
- 本番プローブ結果:
  - 429 observed on attempt=31
  - source/limit/windowMs は未表示（= 新レスポンス詳細が未反映）
- 解釈:
  - レート制限自体は動作。
  - ただし、最新コード（details.source等）を含むデプロイが未反映。

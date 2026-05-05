clipkeep.net ad tags
NativeBanner
By default, Native Banners are set to 4 images in a row. To customize yours, go to the Websites page, find the Native Banner, and click EDIT next to it
NativeBanner_1
NATIVE ASYNC
<script async="async" data-cfasync="false" src="https://pl28916543.effectivegatecpm.com/f17b1c25b3e406196dcf4a0ac7fd392b/invoke.js"></script>
<div id="container-f17b1c25b3e406196dcf4a0ac7fd392b"></div>

Popunder
Popunder_1
JS SYNC (NO ADBLOCK BYPASS)
<script src="https://pl28915034.effectivegatecpm.com/e3/85/b8/e385b8653df6d49480f4caab7d312227.js"></script>

SocialBar
SocialBar_1
JS SYNC (NO ADBLOCK BYPASS)
<script src="https://pl28916536.effectivegatecpm.com/93/a3/05/93a305874ff7aa9542dff8f824db8e76.js"></script>

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

## 2026-03-12 429最適化の最終確認
- `npm run cf:deploy` 実施（Version ID: `88097e46-a90a-4628-ae52-40ac69f3ea88`）
- `rate_limit_probe.ps1` 結果:
  - 429 observed on attempt=31
  - source=fallback / limit=30 / windowMs=60000
- `api_integration_tests.ps1`（本番URL）結果:
  - PASS=11 / FAIL=0 / SKIP=0

### 評価
- 40リクエスト以内の429到達要件は満たした。
- DO endpoint自体は応答可能だが、現時点の判定sourceはfallbackのまま。

## 2026-03-12 AdSense運用適用メモ
- `adsense_ban_prevention.md` を基準に運用導線を実装。
- フッターに法務リンクを追加（Terms/Privacy/Cookies/DMCA/Contact/Status）。
- Privacyポリシーに広告/Cookie/同意制御を追記。
- `docs/ops/adsense_go_live_checklist.md` を追加。

## Growth Loop (Analytics & Insights)

### 1) データの取得と分析
- 実行: `npm run growth`
- 内容:
    - GA4から最新の集計レポートを取得 (`docs/analytics/`)
    - ターミナルに「グロース・インサイト（転換率の要約）」を表示
- 頻度: 開発の節目や、新機能のリリース翌日などに実行

### 2) 開発中のデバッグログ制御
- ブラウザのコンソールで以下を実行すると、分析イベントのログを非表示にできます。
  - `localStorage.setItem('clipkeep_analytics_silent', 'true')`
- 再表示する場合:
  - `localStorage.removeItem('clipkeep_analytics_silent')`

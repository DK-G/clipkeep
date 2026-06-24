# Analytics Auth Recovery & Expiry Resilience

最終更新: 2026-06-25

このドキュメントは ClipKeep の計測パイプライン（GA4 / Search Console / URL Inspection）の
**認証失効への対処**と、無人運用を可能にする**サービスアカウント化の調査・準備**をまとめる。
日次グロースループの「計測復旧＋失効耐性」タスクの正本。

関連: `AGENTS.md`（Definition of Done / Launch-Phase KPI Gate）、
`docs/strategy/growth-strategy.md`（北極星）、週次レビュー `docs/ops/weekly_review_2026-06-24.md`。

---

## 1. 何が起きるか（失敗モード）

計測スクリプト（`fetch-ga4-report.mjs` / `fetch-gsc-report.mjs` /
`fetch-gsc-index-coverage.mjs`）は共有の OAuth リフレッシュトークン
（`.secrets/ga4-oauth-token.json`）で動く。これが**失効・取り消し**されると
Google が `invalid_grant`（"Token has been expired or revoked."）を返す。

```
[analytics][WARN] ga4: OAuth refresh token has expired or been revoked (invalid_grant).
[analytics][WARN] ga4: measurement is BLOCKED — fresh data could not be fetched.
[analytics][WARN] ga4: Run `npm run analytics:ga4:login` ...
```

失効の典型原因:
- リフレッシュトークンの長期未使用（Google は一定期間で失効させる）。
- アカウント側でのアクセス取り消し / パスワード変更 / セキュリティイベント。
- OAuth クライアントが「テスト中」公開ステータスの場合、リフレッシュトークンは **7 日**で失効する。

## 2. 失効検知の仕組み（2026-06-25 実装）

`scripts/lib/analytics-auth.mjs` が共有の分類・WARN・ステータス出力を担う。

- 各 exporter は `getAccessToken` で OAuth → サービスアカウントの順に試し、
  全滅したら **`AnalyticsAuthError`**（`kind`: `token_revoked` / `token_incomplete` /
  `no_credentials`）を投げる。以前のように不透明な
  `ENOENT ... ga4-service-account.json` で落ちない。
- 失効時は `[analytics][WARN]` バナー（原因＋復旧手順）を出力し、
  **`docs/analytics/auth-status.json`**（gitignore 済みのローカルマーカー）に
  `{ blocked: true, scopes: { ga4: { ok:false, kind, summary, remediation, checkedAt } } }`
  を書く。
- `run-growth-review.mjs` は GA4 がブロックされたら（GSC/URL Inspection は同じ
  資格情報なので）残りの fetch をスキップし、**キャッシュ済みデータでサマリだけ描画**し、
  最後に統合バナーを出して **exit 1**。
- `growth-summary.mjs` は冒頭に **🔐 ANALYTICS AUTH** ブロックを出し、
  「数値はキャッシュ（fresh ではない）」と明示する。

### 日次 / 週次の読み取り方

- 機械可読: `docs/analytics/auth-status.json` の `blocked` を見る（`true` ならブロック）。
- 目視: `npm run growth:review` 出力の `[analytics][WARN]` または
  `MEASUREMENT BLOCKED` バナー。
- ブロック時は daily log を **`status: blocked`** とし、理由（OAuth 失効）と
  復旧手順（下記）を記録して終了する（数値を fresh として扱わない）。

## 3. 即時復旧（手動・ブラウザ必須）

このPCで:

```
npm run analytics:ga4:login
```

- GA4 プロパティ `528376605` と Search Console `sc-domain:clipkeep.net` の**両方**に
  権限を持つ Google アカウントでログインする。
- 要求スコープ: `analytics.readonly` ＋ `webmasters.readonly`。
- 成功後 `npm run growth:review` を再実行し、🔐 ANALYTICS AUTH が `OK` になることを確認。

> 無人実行（cron / scheduled task）ではブラウザ対話ができないため**この手順は自動化不可**。
> だからこそ §4 のサービスアカウント化が恒久対策になる。

## 4. 恒久対策の調査: サービスアカウント化（unattended-friendly）

目的: ブラウザ対話なしで失効しない資格情報に移行する。コード側は既に
`.secrets/ga4-service-account.json` があれば JWT 方式（RS256 self-signed）で
OAuth トークンを取得するフォールバックを実装済み（`getServiceAccountAccessToken`）。
**準備が整えば追加実装なしで自動的に使われる。**

### 4.1 API 対応状況（調査結果）

| API | サービスアカウント対応 | 必要な権限付与 |
|---|---|---|
| GA4 Data API（`analyticsdata`） | ✅ 対応 | GA4 プロパティ 528376605 に SA の email を「閲覧者」で追加 |
| Search Console API（`webmasters` / Search Analytics） | ✅ 対応 | Search Console の `sc-domain:clipkeep.net` に SA の email を「フル」または「制限付き」ユーザーで追加 |
| URL Inspection API | ✅ 対応（GSC ユーザー権限を継承） | 上記 GSC ユーザー追加で同時に有効 |

→ 3 系統すべて SA で代替可能。GA4/GSC の scope は現状 OAuth と同じ
（`analytics.readonly` / `webmasters.readonly`）。

### 4.2 準備手順（ユーザー作業 — 1 回のみ）

1. Google Cloud Console（OAuth クライアントと同一プロジェクト推奨）で
   **サービスアカウントを作成**。
2. そのSAで **JSON キー**を発行（`type: service_account`、`client_email`、`private_key` を含む）。
3. GA4 管理 → プロパティのアクセス管理 → SA の `client_email` を**閲覧者**で追加。
4. Search Console → 設定 → ユーザーと権限 → SA の `client_email` を追加。
5. JSON キーを **`D:\dev\repos\clipkeep\.secrets\ga4-service-account.json`** に置く
   （`.secrets/` は gitignore 済み・このPCローカルのみ）。
   - 既定パスを上書きしたい場合は `.env.analytics.local` か環境変数
     `GOOGLE_APPLICATION_CREDENTIALS` で指定可能（`loadConfig` が解決）。
6. `npm run growth:review` を実行。OAuth が失効していても SA フォールバックで
   fresh データを取得し、🔐 ANALYTICS AUTH が `OK` になることを確認。

### 4.3 移行後の挙動

- OAuth トークンが有効ならそのまま使う（SA は OAuth 失敗時のフォールバック）。
- OAuth 失効時に SA があれば**自動で**取得継続 → 無人運用でもブロックされない。
- どちらも無い/壊れている場合のみ `no_credentials` ブロックとして WARN を出す。

> セキュリティ: SA キーは強力なので `.secrets/` の外に出さない・コミットしない。
> 不要になったら Cloud Console でキーを失効させる。最小権限（読み取り専用ロール）を維持。

## 5. チェックリスト（復旧オペレーション）

- [ ] `docs/analytics/auth-status.json` の `blocked` を確認
- [ ] ブロックなら daily log を `status: blocked` ＋ 原因＋手順で記録
- [ ] 即時復旧: `npm run analytics:ga4:login`（手動・ブラウザ）
- [ ] 恒久対策: §4 の SA キーを `.secrets/ga4-service-account.json` に配置
- [ ] `npm run growth:review` 再実行 → 🔐 ANALYTICS AUTH = OK を確認

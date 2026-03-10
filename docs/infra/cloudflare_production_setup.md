# Cloudflare本番セットアップ手順（ClipKeep）

## 0. 前提
- 対象リポジトリ: `C:\dev\portfolio\web\clipkeep`
- 本番ドメインが取得済み
- CloudflareアカウントとWranglerログイン済み

## 1. Cloudflare Pagesプロジェクト作成
1. Cloudflare Dashboard > Workers & Pages > Create application > Pages > Connect to Git。
2. 対象リポジトリを選択し、Production branch を `main`（または `prod`）に設定。
3. Build設定:
- Framework preset: `Next.js`
- Build command: `npm run build`
- Build output: 自動検出（Next.js）

## 2. D1本番DB作成
1. Dashboard > Storage & Databases > D1 > Create database。
2. DB名を `clipkeep-db` として作成。
3. `database_id` を控える。
4. `wrangler.toml` の D1 binding (`DB`) に本番 `database_id` を設定。

## 3. 本番マイグレーション適用
```powershell
cd C:\dev\portfolio\web\clipkeep
npm run d1:migrate:remote
```
- 実行後、主要テーブルが作成されていることを確認。

## 4. Secrets / Environment Variables設定
Pages > Settings > Environment variables で Production に設定:
- `RATE_LIMIT_DO_ENDPOINT` = デプロイ済みDO Worker URL
- `NEXT_PUBLIC_SITE_URL` = `https://<本番ドメイン>`
- `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`（導入時）

必要に応じて Wrangler Secret:
```powershell
npx wrangler secret put <KEY>
```

## 5. ドメイン接続
1. Pages project > Custom domains で本番ドメインを追加。
2. `apex` / `www` のどちらを正規化するか決め、301統一。
3. SSL/TLS が `Full (strict)` で有効化されていることを確認。

## 6. デプロイ確認チェック
- `/` が200
- `/solution/<slug>` が200
- `POST /api/v1/extract/prepare` が202または429
- `GET /api/v1/solution-pages/<slug>?locale=en` が200
- `GET /api/v1/solution-pages/<missing>` が404

## 7. リリース直後チェック（30分）
- 5xx率の急上昇がない
- 429率が異常高騰していない
- statusページの導線が有効
- 主要イベント（extract_submit / extract_completed / solution_view）が計測される

## 8. ロールバック最低手順
1. Pagesで直前の安定デプロイを再アクティブ化。
2. 必要に応じて `RATE_LIMIT_DO_ENDPOINT` を既知安定版へ戻す。
3. statusページで障害告知を更新。

## 参考
- `docs/infra/d1_migration.md`
- `docs/infra/rate_limit_do_setup.md`
- `docs/infra/external_prerequisites.md`

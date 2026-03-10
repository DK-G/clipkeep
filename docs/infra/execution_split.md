# 実行分担表（外部作業 / Codex作業）

## 目的
- 「あなたが外部で行う作業」と「Codexがローカルで即実行する作業」を分離し、待ち時間を最小化する。

## 進め方（固定フロー）
1. あなたが外部コンソール作業を1ステップ実施。
2. 実行結果を `memo.md` に貼る。
3. 私がローカル反映・検証・文書更新を実施。
4. 次ステップへ進む。

## A. あなたが外部で実施する項目
1. Cloudflare Pages 作成
- 実施: DashboardでPagesプロジェクトを作成し、Git接続とProduction branch設定。
- 記録: プロジェクト名、branch、build設定。

2. Cloudflare D1 本番DB作成
- 実施: `clipkeep-db` を作成し、`database_id` を取得。
- 記録: DB名、database_id（機密扱い不要範囲）。

3. Pages本番環境変数/Secrets設定
- 実施:
  - `RATE_LIMIT_DO_ENDPOINT`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_GA_ID`（導入時）
- 記録: 設定キー一覧（値は伏せても可）。

4. カスタムドメイン接続
- 実施: `apex/www` の正規化、SSL/TLS確認。
- 記録: 正規URL、301方針。

5. 運用体制の確定
- 実施: リリース責任者、障害一次対応者を決定。
- 記録: 役割と担当名（またはイニシャル）。

## B. 私（Codex）が実施する項目
1. 設定反映（ローカル）
- `wrangler.toml` への `database_id` 反映。
- 必要な `.env` / docs の更新。

2. CLI実行（可能な範囲）
- `npm run d1:migrate:remote`（環境依存、実行可否を都度確認）。
- API/E2Eテスト、lintの再実行（実行環境制約がある場合は結果受領で反映）。

3. 文書更新
- `docs/infra/external_prerequisites.md`
- `task.md`
- `diff.md`
- `Changelog.md`

4. 不整合修正
- 設定漏れ、ルート不整合、テスト失敗の修正。

## C. いま最優先であなたがやること
1. Pages作成完了
2. D1作成完了（database_id取得）
3. その結果を `memo.md` に貼る

## D. `memo.md` に貼るテンプレ
```text
[Cloudflare Pages]
project_name:
production_branch:
build_command:

[Cloudflare D1]
db_name:
database_id:

[Pages env]
RATE_LIMIT_DO_ENDPOINT: set/not_set
NEXT_PUBLIC_SITE_URL: set/not_set
NEXT_PUBLIC_GA_ID: set/not_set

[Domain]
primary_url:
redirect_policy:
```

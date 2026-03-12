# 変更報告書 (Diff)

## 1. 変更目的
- 本番で429しきい値を調整可能にし、DO連携有無を可視化する。

## 2. 変更概要
- 更新ファイル:
  - `src/lib/rate-limit/extract.ts`
  - `app/api/v1/extract/prepare/route.ts`
  - `.env.example`
  - `docs/infra/rate_limit_do_setup.md`
  - `diff.md`（本ファイル）
  - `Changelog.md`

## 3. 実施内容
- レート制限の `limit/windowMs` を環境変数化。
- 429レスポンスに `source/do|fallback` と `limit/windowMs` を追加。
- 運用手順書に調整パラメータと検証観点を追加。

## 4. 次の作業
- 本番環境変数に `RATE_LIMIT_LIMIT` / `RATE_LIMIT_WINDOW_MS` を設定して再デプロイ。
- 本番テストで `error.details.source=do` を確認し、429到達を再検証。

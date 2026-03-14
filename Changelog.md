## 2026-03-14 Telegram Extraction & Job Persistence Fix

### 概要
- テレグラムの動画抽出ロジックをモックから、埋め込みウィジェット解析による実データ抽出へ更新。
- サーバーレス環境（Cloudflare Workers）でのジョブデータ保持問題を解決するため、ジョブストアをD1データベースへ移行。
- Cloudflareの `waitUntil` を導入し、レスポンス返却後のバックグラウンド処理の完遂を保証。
- Next.js 15 / OpenNext の `getCloudflareContext` に対応した非同期データベースアクセスを実装。

---

## 2026-03-12（CL-0053） Rate Limiting & Proxy Fix

### 概要
- Durable Objectを利用したレート制限が動作しない問題を修正。
- Cloudflare Worker間の通信制限 (Error 1042) を解消するため `global_fetch_strictly_public` フラグを有効化。
- `extract.ts` 内での環境変数アクセスを関数スコープへ移動し、ランタイム初期化の信頼性を向上。

---

## 2026-03-12（CL-0052） AdSense運用適用（導線/文言/チェック）

### 概要
- 共有フッターに法務リンクと広告ラベル方針を追加。
- Privacyポリシーを広告運用前提の内容へ更新。
- `adsense_go_live_checklist.md` を追加して日次/週次運用を定義。

### レビュー結果（レビュー後に追記）
- 結果: 未レビュー
- コメント:
  - 広告枠実装後に最終UXレビューを実施。

---

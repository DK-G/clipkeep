# 作業タスクリスト: ClipKeep

## 作業中 (In Progress)
- [ ] 429しきい値の本番最適化（RateLimitテスト再設計含む）
- [ ] AdSense運用ルール適用
- [ ] 広告実装（軽量配置 + CWV確認）
- [ ] AR UI最終仕上げ（RTL/文言/SEO）

## 未着手 (To Do)
- [ ] Phase4 TikTokバックログのP1項目から着手

## 完了 (Done)
- [x] Phase 1設計確定
- [x] P2-01 API基盤セットアップ
- [x] 計画修正: FactItems不要 / SNS優先順 Telegram -> X -> TikTok後回し
- [x] memo 26行目以降の参考サイト方針を計画書へ反映
- [x] P2-02: 抽出ジョブAPI実装（`POST /extract/prepare`, `GET /extract/jobs/{jobId}`）
- [x] P2-03: Solution Page API実装（`GET /solution-pages/{slug}` + locale対応）
- [x] P2-05: D1スキーマ適用（`db_schema.sql` migration, local apply済み）
- [x] P2-07: degraded判定モジュール実装（閾値/復帰条件/manual override）
- [x] P2-08: Extractor UI実装（Telegram -> X）
- [x] P2-09: Result UI実装（queued/processing/completed/failed）
- [x] P2-10: Solution Page UI実装（template準拠）
- [x] P2-11: EN/AR i18n + RTL実装
- [x] P2-12: degraded UI実装（banner、503時フォールバック導線）
- [x] P2-13: API統合テスト（最終: PASS=11 FAIL=0 SKIP=0）
- [x] P2-14: E2Eフロー確認（最終: PASS=4 FAIL=0 SKIP=2）
- [x] P2-15: extract APIレート制限（429）実装
- [x] P2-16: TikTok対応をPhase4用バックログ化
- [x] P2-17: Durable Objects移行フック追加（`RATE_LIMIT_DO_ENDPOINT`）
- [x] P2-18: TikTok Phase4バックログ 優先度/見積もり整理
- [x] P2-19: RateLimit DO Worker雛形実装（Cloudflare deploy可能）
- [x] P2-20: lint スクリプトとESLint設定を追加
- [x] P2-21: RateLimit DO Worker デプロイ + endpoint疎通確認
- [x] P2-22: E2E 500不具合修正（`solution` / `result` ページ復元）
- [x] P2-23: 運用Runbook追加（WAF/Bot, D1復旧, 週次レビュー, SNS規約チェック）
- [x] P2-24: Cloudflare本番セットアップ手順書追加
- [x] P2-25: OpenNextデプロイ設定修正（`cf:build` / `wrangler.toml`）
- [x] P2-26: Post-deploy実行計画と広告/AR運用文書化
- [x] P2-27: 本番URLでのE2E/法務到達確認

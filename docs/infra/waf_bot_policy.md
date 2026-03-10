# WAF / Bot対策方針（ClipKeep）

## 目的
- 抽出APIとSolutionページの可用性を維持し、過負荷や悪性トラフィックを抑制する。

## 適用対象
- `/api/v1/extract/prepare`
- `/api/v1/extract/jobs/*`
- `/api/v1/solution-pages/*`

## 基本方針
- 1段目: アプリ側レート制限（429）
- 2段目: Cloudflare WAF Managed Rules
- 3段目: Bot対策（Bot Fight Mode / Super Bot Fight Mode）

## 推奨ルール
- `extract/prepare` はIP + UA単位で厳しめに制限。
- 同一IPから短時間に高頻度アクセスが続く場合はチャレンジ付与。
- 明確な悪性シグネチャはブロック、判定グレーはManaged Challenge。

## 監視KPI
- 429率
- WAF Block/Challenge件数
- API 5xx率
- 平均応答時間（P95）

## 運用
- しきい値は週次レビューで調整。
- 誤検知が発生した場合は該当ルールを一時緩和し、再発防止ルールを追加。

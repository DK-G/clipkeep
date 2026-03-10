# プロジェクトロードマップ: ClipKeep

## 現在地
- 現在フェーズ: Phase 2（Tool MVP 実装）
- 直近ゴール: Telegram / X の安定運用と Solution導線の改善。

## Phase 1: 基本設計とMVP仕様確定
- [x] MVP境界の確定（Telegram/X先行、TikTok後回し）
- [x] 情報設計（EN/AR、RTL、URL/slugルール）
- [x] API I/O契約（抽出要求、レスポンス、エラーコード）
- [x] Cloudflare構成方針（Pages / D1 / Durable Objects）
- [x] 非機能要件（速度目標、可用性、観測性）
- [x] 参考サイト観察ログ作成（UI/SEO/UX/RTL観点）

## Phase 2: Tool MVP 実装
- [x] Telegram 抽出導線の最小実装
- [x] X 抽出導線の最小実装
- [x] URL検証、候補取得、保存導線のUI実装
- [x] 失敗時エラー導線（原因別）実装
- [x] 手動テストケース整備（正常/異常）

## Phase 3: AISO Solution Layer
- [x] 問題解決ページテンプレート実装（How-to / Not working）
- [x] 内部リンク構造とSEO見出し設計の反映
- [x] 多言語運用（EN/AR）と更新運用フロー定義
- [ ] CTA導線のAB観測ポイント定義
- [x] SEOページ設計を 100ページ構成まで拡張

## Phase 4: TikTok Expansion（Backlog）

### 優先度P1（先に着手）
- [ ] TikTok URLバリデーション仕様追加（`prepare` API） [S]
- [ ] TikTok extractor adapter 実装（job作成/進捗/結果） [L]
- [ ] TikTok Result UI（品質別DL候補） [M]

### 優先度P2（次段）
- [ ] TikTok failure taxonomy 定義（private/region/rate-limit等） [M]
- [ ] TikTok solution pages（EN/AR）追加 [L]
- [ ] TikTok degraded時のfallback導線検証 [S]

### 優先度P3（仕上げ）
- [ ] TikTok向け API統合テストケース追加 [M]`r`n- [x] RateLimit DO Worker雛形作成（Phase4前に本番適用可能） [M]
- [ ] TikTok向け E2Eケース追加 [M]
- [ ] TikTok SEO波次（20ページ）初版 [M]

### 見積もり基準
- [S]: 0.5-1.0日
- [M]: 1-3日
- [L]: 3-5日

### Exit Criteria (Phase 4)
- TikTok 抽出導線が Telegram/X と同等品質で稼働する。
- 失敗ケースの回復導線が整備される。
- EN/ARの主要TikTokクエリに対する解決ページが接続される。

## MVP の完了条件
- EN/AR で Telegram/X 抽出導線が稼働する。
- 主要問題ページが抽出導線と接続される。
- degraded モードの動作基準が定義・検証済みである。

## Epic Overview

### Epic: Telegram First Extractor
- 関連 Phase: Phase 2
- 概要: Telegram 抽出導線を先行リリースする。

### Epic: X Extractor
- 関連 Phase: Phase 2
- 概要: X 抽出導線をTelegramの実装知見で展開する。

### Epic: Solution SEO Foundation
- 関連 Phase: Phase 3
- 概要: 解決ページ群を検索意図ベースで整備する。

### Epic: TikTok Expansion
- 関連 Phase: Phase 4
- 概要: TikTok を後続バックログとして計画管理し、段階導入する。


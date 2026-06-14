# 作業タスクリスト: ClipKeep

## 戦略バックログ（日次ループはここの先頭から1件選ぶ。優先順位は週次レビューが管理）

正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日）

1. [ ] 計測: `scripts/growth-summary.mjs` に北極星 `ad_script_load`（zone別）の28日集計を追加し、growth:review 出力に表示する ← **GA4認証は2026-06-15に復旧確認済みでブロック解除、次ループで実行可能**
2. [x] 柱1/TikTok-SEO: 「TikTok 保存できない/ロゴなし保存」solution ページ（en/ja）— 既存で充足を確認（`tiktok-video-downloader-not-working` / `how-to-download-without-watermark` 全ロケール、本番200）。home title は汎用表記で TikTok 虚偽なし、かつ TikTok extractor は実装済み（`src/lib/extract/tiktok.ts`）で実態と整合 → 修正不要（2026-06-13 確認）
3. [x] 柱1: ja Solution ページの内容充足（X/Reddit/Telegram 中心）— X/Reddit/Telegram の「保存できない」ページの ja 本文を拡充し s3 を追加（2026-06-13, ver a5c183d2）
4. [x] 柱1: pt Solution ページの内容充足 — Telegram/Twitter/Reddit の pt「não funciona」3ページを内容充足（s1/s2拡充+s3追加、旧ASCII表記をアクセント付きに修正）（2026-06-14, ver 3fa084d6, 本番200/canonical/hreflang/s3確認）
5. [ ] 柱1: ar Solution ページの内容充足（RTL 目視確認込み）
6. [ ] 柱2: トレンド鮮度ページ生成パイプラインの設計（trending cron のデータから「{トレンド} video download」系ページを生成する方式を bythink で設計し、設計文書を docs/strategy/ に出す）
7. [ ] OPS-1残: blog / about / contact / legal / status の canonical を metadata-helper 方式に統一
8. [ ] 柱1: Schema.org（FAQ/HowTo）の ja/pt/ar 実装
9. [ ] OPS-1残: workers.dev 配信の重複対策（canonical が clipkeep.net を指すことを本番確認）

## 作業中 (In Progress)
- [/] OPS-1: 獲得ゼロ問題の是正（2026-06-12 診断に基づく）
    - [x] 原因診断: 未デプロイ（/ja/ 404・旧sitemap）、hreflang全言語同一URL、?locale= canonical畳み込み、GA4認証失効、weekly review未記入
    - [x] main を本番デプロイし `/ja` 200 と path-based sitemap を本番確認（2026-06-12, ver 708c8fc4）
    - [x] canonical/hreflang の矛盾を修正（自己参照 canonical、hreflang は en/ja/pt/ar のみ、sitemap から ?locale= を全廃 5,486→508 URL）
    - [x] GA4/GSC 認証復旧（2026-06-15 確認: `.secrets/ga4-oauth-token.json` 有効、`npm run analytics:ga4` / `analytics:gsc` 両方成功・実データ取得。失効時は `npm run analytics:ga4:login` で再ログイン）
    - [ ] GSC で sitemap 再送信とカバレッジ確認（インデックス除外理由の一次データ取得）
    - [ ] ホーム title から未対応の TikTok を除去し実態と一致させる
    - [ ] workers.dev 配信の重複対策（canonical は clipkeep.net を指すことを本番で確認）
    - [ ] blog / about / contact / legal / status の canonical を metadata-helper 方式に統一（現状 ?locale= 自己参照 canonical が残存）
- [/] Phase 3.5: 収益最大化向けSEO多言語展開（ja / pt / ar）
    - [ ] プラットフォーム×言語のロングテールキーワードマップ作成（検索需要・競合弱さ・広告収益性・実装リスクで優先度付け）
    - [ ] ja/pt/ar 向け Solution ページの内容充足（X/Reddit/Telegram中心、TikTok除外）
    - [x] 各ロケールの `<title>` / `<meta description>` をlocaleファイルに追加
    - [x] hreflangタグの実装（`/ja/`, `/pt/`, `/ar/` URLパス対応）
    - [x] Sitemap の hreflang alternates 追加
    - [ ] Schema.org（FAQ/HowTo）の多言語実装

## 完了 (Done)
- [x] Phase 1: Local Download History
    - [x] Create `useHistory` custom hook
    - [x] Build `HistorySection` component
    - [x] Integrate history saving in `ResultClient`
    - [x] Add multilingual support in `ui.ts`
- [x] Phase 2: Dynamic Platform Shortcuts
    - [x] Create `usePlatformUsage` hook
    - [x] Build `PlatformShortcuts` client component
    - [x] Replace hardcoded links on homepage
    - [x] Integrate usage tracking in `ResultClient`
- [x] Phase 3: Programmatic SEO / Solution Layer
    - [x] 問題解決ページテンプレート実装
    - [x] 内部リンク構造とSEO見出し設計の反映
    - [x] 多言語運用（10言語）と更新運用フロー定義
    - [x] SEOページ設計を 100ページ構成まで拡張
- [x] PUBLIC-1: Git公開準備として `.env` を追跡対象から外し、`.gitignore` でローカル環境ファイルを除外
- [x] P2-29: AdSense運用ルール適用（フッター法務導線 + Privacy更新 + 運用チェックシート）
- [x] P2-28: 429しきい値調整と本番再検証（PASS=11）
- [x] P2-27: 本番URLでのE2E/法務到達確認
- [x] P2-26: Post-deploy実行計画と広告/AR運用文書化
- [x] P2-25: OpenNextデプロイ設定修正（`cf:build` / `wrangler.toml`）

## 更新メモ
- 2026-06-15: **GA4/GSC 認証は失効していないことを確認（バックログ#1のブロック解除）**。`npm run analytics:ga4`（Pages5/events16/acquisition4）と `npm run analytics:gsc`（property `sc-domain:clipkeep.net`、Query/page13/pages8）が両方成功し実データ取得。`.secrets/ga4-oauth-token.json` 有効・refresh 機能。task.md の「GA4認証復旧待ち」は古い情報だったため OPS-1 の該当項目を [x] に更新。再失効時の手順: このPCで `npm run analytics:ga4:login`（GA4プロパティ528376605 と GSC clipkeep.net の両権限を持つGoogleアカウントでログイン、scope=analytics.readonly+webmasters.readonly）。
- 2026-06-15: **TikTok extractor 方針変更（ユーザー判断・選択肢A）**。戦略文書とコードの不整合（文書「extractor 作らない」 vs 既存稼働 `src/lib/extract/tiktok.ts`）を解消。extractor を**存続**させ文書を実態に整合：`docs/strategy/growth-strategy.md` 決定事項1・柱1・ガードレールを改訂、`docs/core/RoadMap.md` Phase 4 を「抽出導線稼働中」に更新、本「無期限延期」節を解除。規約リスクは承認のうえ許容、fixer 安定性は週次監視。
- 2026-06-14: 日次ループ。柱1の pt Solution「não funciona」(Telegram/Twitter/Reddit) を内容充足（s1/s2拡充+s3追加、旧ASCII表記をアクセント付き表記に修正、見出しをptローカライズ、ver 3fa084d6、本番200/self-canonical/hreflang/s3確認、リリースゲート PASS=29/FAIL=0）。バックログ#1(ad_script_load zone別)は GA4 認証復旧待ちで継続スキップ。次は#5 ar Solution 内容充足（RTL目視込み）。詳細は docs/ops/daily/2026-06-14.md。
- 2026-06-13: 日次ループ。柱1の ja Solution「保存できない」(X/Reddit/Telegram) を内容充足（s1/s2拡充+s3追加、ver a5c183d2、本番200確認）。バックログ#1(ad_script_load zone別)は zone ディメンション再取得が要GA4認証復旧（ブロック中）のためスキップ、#2は既充足を確認。デプロイ前リグレッション（gallery `VALID_PLATFORMS` から reddit 脱落で `?platform=reddit` が400／46059c0 の reconcile 起因）を発見し復帰修正、リリースゲートを PASS=29/FAIL=0 に回復。要人間判断: 戦略文書は「TikTok extractor 作らない」だがコードに既存稼働（詳細は docs/ops/daily/2026-06-13.md）。
- 2026-06-12: 「全く伸びない」原因診断を実施。最大要因は①改修が本番未反映（デプロイギャップ）②本番の hreflang/canonical が全言語同一URLでインデックス2件のみ③GA4認証失効で計測不能。対策として AGENTS.md に Definition of Done（デプロイ+本番検証必須）と Launch-Phase KPI Gate（北極星=インデックス数/GSC impressions、CVR微調整凍結）を追加。playbook 先頭にも同ゲートを追記。
- 2026-06-08: `/ja` `/pt` `/ar` path を `middleware.ts` で既存 `?locale=` ルーティングへ rewrite し、`layout` / `faq` / `trending` / `latest` / `solution` の alternates と `app/sitemap.ts` を path-based hreflang に更新。
- 2026-06-08: `src/lib/i18n/locales/solution/{ja,pt,ar}.ts` に locale metadata 文言を追加。`npm run typecheck` / `npm run lint` / `npm run build` 成功。
- 2026-06-03: `docs/core/RoadMap.md` の現在地に合わせ、作業中タスクを Phase 3.5 SEO多言語展開と Phase 4 TikTok Expansion に整理。
- 2026-06-03: TikTok Expansion は無期限延期。作業中タスクから除外。
- 2026-06-03: TikTok は公式規約上の商用利用・自動アクセス・無断ダウンロード/転載リスクが残るため、延期を維持。
- 2026-06-03: Phase 3.5 を収益最大化目的に合わせ、優先順位をキーワード設計・ページ充足・CTR改善・多言語SEO基盤の順に再整理。

## TikTok（無期限延期は 2026-06-15 解除 — extractor 稼働中）
方針: extractor 存続＋SEO 両輪（`docs/strategy/growth-strategy.md` 決定事項1）。抽出導線は本番稼働済み。
- [x] TikTok URLバリデーション仕様追加（`prepare` API） — `src/lib/extract/tiktok-url.ts`
- [x] TikTok extractor adapter 実装（job作成/進捗/結果） — `src/lib/extract/tiktok.ts`
- [x] TikTok Result UI（品質別DL候補） — 共通 result 導線で稼働
- [ ] TikTok failure taxonomy 定義（private/region/rate-limit等）※品質向上タスク（任意）
- [ ] TikTok向け API統合テストケース追加 ※品質向上タスク（任意）
- [ ] TikTok向け E2Eケース追加 ※品質向上タスク（任意）

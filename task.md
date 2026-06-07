# 作業タスクリスト: ClipKeep

## 作業中 (In Progress)
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
- 2026-06-08: `/ja` `/pt` `/ar` path を `middleware.ts` で既存 `?locale=` ルーティングへ rewrite し、`layout` / `faq` / `trending` / `latest` / `solution` の alternates と `app/sitemap.ts` を path-based hreflang に更新。
- 2026-06-08: `src/lib/i18n/locales/solution/{ja,pt,ar}.ts` に locale metadata 文言を追加。Codex sandbox では `node.exe` が `Access is denied` のため `npm run lint` / `build` / `typecheck` は未実行。
- 2026-06-03: `docs/core/RoadMap.md` の現在地に合わせ、作業中タスクを Phase 3.5 SEO多言語展開と Phase 4 TikTok Expansion に整理。
- 2026-06-03: TikTok Expansion は無期限延期。作業中タスクから除外。
- 2026-06-03: TikTok は公式規約上の商用利用・自動アクセス・無断ダウンロード/転載リスクが残るため、延期を維持。
- 2026-06-03: Phase 3.5 を収益最大化目的に合わせ、優先順位をキーワード設計・ページ充足・CTR改善・多言語SEO基盤の順に再整理。

## 無期限延期 (Deferred Indefinitely)
- [ ] Phase 4: TikTok Expansion
    - [ ] TikTok URLバリデーション仕様追加（`prepare` API）
    - [ ] TikTok extractor adapter 実装（job作成/進捗/結果）
    - [ ] TikTok Result UI（品質別DL候補）
    - [ ] TikTok failure taxonomy 定義（private/region/rate-limit等）
    - [ ] TikTok向け API統合テストケース追加
    - [ ] TikTok向け E2Eケース追加

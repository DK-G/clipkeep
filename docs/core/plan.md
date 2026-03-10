# ClipKeep 仕様書

## 1. 目的とスコープ

### 1.1 目的
- SNS 上の動画・画像などのメディア取得課題を、実用的なツールと解決ガイドで一体的に解決する。
- AISO / SEO を前提に、検索流入から実行までの導線を最短化する。
- 英語・アラビア語（RTL）を軸に多言語展開できる基盤を構築する。

### 1.2 主な機能
- SNS 別メディア抽出導線（まず Telegram、次に X）。
- 問題解決ページ（"動かない" / "保存できない" 等）による解決導線。
- 非ログイン・高負荷時の degraded モード。

### 1.3 MVP (最小実用製品) のスコープ
- Telegram / X の基本抽出フロー（EN/AR）。
- 主要な問題解決ページ一式。
- RTL レイアウト対応を含む多言語 UI 基盤。

### 1.4 スコープ外
- TikTok 対応（Phase 4 backlog で管理し、MVP後に段階導入）。
- 全 SNS の同時対応。
- 高度な編集機能（トリミング等）。

## 2. 設計原則・基本方針
- SEO/AISO ファーストで、各ページが明確な検索意図を持つこと。
- 体験品質を維持しつつ、負荷時は degraded モードでコスト制御すること。
- 多言語は文言翻訳だけでなく、RTL 表示品質まで含めて担保すること。
- SNS downloader は単一サイト模倣ではなく、複数競合の長所合成で設計すること。

## 3. 参考サイト戦略（memo反映）

### 3.1 直接競合ベンチマーク
- SnapInsta: トップUI / SNS別ページ構成 / 広告配置
- SSSTwitter: 多言語構造 / SEO記事構造
- SaveFrom: SNS hub 情報設計
- SnapTik: TikTok特化UX（後続フェーズ向け）

### 3.2 SEO構造参考
- HowToGeek / WikiHow の HowTo 記事構造（見出し、FAQ、導線）

### 3.3 UI/UX参考
- Y2mate / 9xbuddy の「入力 -> DL」最短導線

### 3.4 RTL参考
- Aljazeera / ArabyTools の RTL UI 実装パターン

### 3.5 観察ポイント（共通）
- UI: 入力欄、CTA、広告位置
- SEO: slug構造、見出し、FAQ
- UX: 入力からDLまでのクリック数

## 4. 全体フロー・ユーザーシナリオ
- ユーザーが検索経由で問題解決ページに到達する。
- 該当 SNS の抽出導線で URL 入力し、メディア候補を取得する。
- 結果ページで品質や注意事項を確認し、保存を実行する。

## 5. 機能要件

### 5.1 メディア抽出導線
- SNS 別に入力・検証・結果表示の UI を提供する。
- 失敗時は原因別の解決導線へ遷移させる。
- 優先対応順は Telegram -> X -> TikTok。

### 5.2 AISO/SEO 問題解決ページ
- "How to" / "Not working" 系ページを多言語で提供する。
- 構造化された見出しと内部リンクで検索意図を網羅する。
- 目標として SEOページ設計を段階的に拡張（初期20 -> 中期100）。

### 5.3 degraded モード
- 非ログインや高負荷時に機能を段階的に縮退させる。
- 主要導線（検索 -> 解決 -> 実行）は維持する。

## 6. データモデル (概略)
- `ExtractorJob`:
  - `id`, `platform`, `source_url`, `status`, `progress`, `result_payload`, `created_at`, `updated_at`
- `SolutionPage`:
  - `id`, `slug`, `locale`, `title`, `body`, `seo_meta`

## 7. 技術スタック
- フロントエンド: Next.js (SSR, i18n, RTL 対応)
- バックエンド: Node.js / FastAPI
- データ基盤: Cloudflare D1
- リアルタイム/状態管理: Cloudflare Durable Objects
- 配信: Cloudflare Pages

## 8. 用語
- AISO: AI Search Optimization
- degraded モード: 負荷/コスト制約下での縮退運用モード


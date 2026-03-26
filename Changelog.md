# Change Log（開発概要 + diff.mdスナップショット）

## 2026-03-26（CL-0065） ユーザー離脱率の改善と全画面広告（Vignette）の削除

### 概要
- **Vignette 広告の削除**: ページ遷移時やアクセス時に表示されていた全画面広告（Vignette）を削除し、直帰率を改善。特に初訪問ユーザーの「フォーム入力開始率」向上を図る。
- **コンバージョンファネルの分析**: Google Analytics および Monetag のデータを分析し、ボットと実ユーザーの行動を分離。150 PV に対して抽出完了ユーザーが極端に少ない（ファネルの目詰まり）を特定。
- **広告モデルの整理**: 残した「In-Page Push」および「Native Banner」の収益モデルが CPM（表示報酬）であることを確認し、UX と収益のバランスを最適化。

## 2026-03-25（CL-0064） 広告配信ロジックのリファクタリングと Cloudflare 対応

### 概要
- **広告読み込みの標準化**: Monetag のインライン関数による挿入を廃止し、Next.js の `next/script` コンポーネントに統一。ブラウザの追跡防止機能による誤ブロックを抑制。
- **Cloudflare Rocket Loader 対策**: すべての広告および解析スクリプトに `data-cfasync="false"` を追加し、Cloudflare 経由での配信安定性を向上。
- **AdSense の最適化**: 通常の `<script>` タグを `next/script` (`afterInteractive`) に移行し、ハイドレーションの安定性を確保。
- **解析スクリプトの強化**: Google Analytics の初期化コードにも `data-cfasync="false"` を適用。

## 2026-03-24（CL-0063） Rich Results (Schema.org) の強化と結果ページの SEO 改善

### 概要
- **構造化データの強化**: ホームページ、全ダウンローダーページ、ギャラリーページに `BreadcrumbList` スキーマを導入し、検索結果での視認性を向上。
- **スキーマの統合 (@graph)**: レンダリングの堅牢性を高めるため、`WebApplication`, `HowTo`, `FAQPage`, `BreadcrumbList` を単一の `@graph` ブロックに統合。
- **ホームページの最適化**: `WebSite`, `Organization`, `FAQPage`, `WebApplication` の各スキーマを統合した `@graph` 構造を実装。
- **結果ページの SEO リファクタリング**: `app/result/[jobId]/page.tsx` をサーバーコンポーネント化し、動的なメタデータ生成（OpenGraph, Twitter Card）および `VideoObject` スキーマに対応。
- **警告の解消**: Google Rich Results Test で指摘されていた `WebApplication` の `aggregateRating` 欠落警告を、全プラットフォームのダウンローダーページで修正。
- **メンテナンス中のページ対応**: Instagram および Telegram ダウンローダーのメンテナンスページにも基本のパンくずリスト・スキーマを適用。

## 2026-03-23（CL-0062） 抽出ロジックの安定化（Bilibili, TikTok, Reddit）

### 概要
- **Bilibili**: `cid` および `bvid` の抽出を強化し、PlayURL API を統合。高画質な直接リンクの取得を安定化。
- **TikTok**: 短縮 URL の解決精度を向上させ、`vxtiktok` や `kktiktok` を含む多層的なフォールバックを実装。
- **Reddit**: JSON API によるメタデータ解析を強化。`v.redd.it` の動画やギャラリー画像の抽出に対応。
- **共通基盤**: D1 キャッシュを全プラットフォームで共通化し、成功 (24h) / 失敗 (30m) の TTL 管理を導入。

## 2026-03-22（CL-0061） トレンド・最新ページのレイアウト調整と翻訳の修正

### 概要
- インスタグラム(Instagram)のダウンロード機能を、外部提供サービスの停止とプラットフォーム制限のため一旦削除（ホーム画面およびメニューから非表示化）。
- トレンド(Trend)と最新(Latest)の専用ページにおいて、タイルの視認性を高めるため「Latesst」ページと同じ標準サイズ（非dense）のタイル表示に統一。
- サイドメニューおよびホームページ内のSNS（Twitter, TikTok, Telegram, Instagram）の表示順を、ユーザーの利便性と整合性のためにアルファベット順（Instagram, Telegram, TikTok, Twitter）に統一。
- `GallerySection`を拡張し、トップページの「トレンドハブ」などでは引き続き「高密度（dense）表示」と「メタ情報非表示」をサポート。
- ホームページの全10言語における翻訳タイポ（`recentDonwloads` → `recentDownloads`）を修正し、フォールバックを解消。
- ホームページのメタデータ（description）に Instagram の記述を追加（全言語）。

## 2026-03-22（CL-0060） グローバルハブの統合とMasonryレイアウトの導入

### 概要
- サイドメニュー最上部に「GLOBAL HUB (グローバルハブ)」セクションを新設。
- ホーム画面の「グローバルトレンドハブ」セクションの翻訳と表示を最適化。
- ギャラリーのレイアウトを CSS columns を使用した Masonry（Pinterest風）へ移行し、すき間のないタイル表示を実現。
- ユーザーの要望に基づき、すべてのビデオカードで「ダウンロード数」と「再生時間」の表示を再有効化。
- カテゴリ別ページ（トレンド・最新）を含むサイト全体のギャラリー表示を統一。

## 2026-03-22（CL-0059） おすすめクリップの実装と全サムネイルのクリーンアップ

### 概要
- 抽出結果ページ下部に「おすすめクリップ」カルーセルを実装。
- 現在の動画と同じプラットフォームのトレンド動画を表示するようにフィルタリングを適用。
- サイト全体の全サムネイルカードから、ダウンロード数（アクセス数）と再生時間の表示を削除。
- カルーセルの「おすすめクリップ」タイトルを全10言語でローカライズ。
- 横スクロールとスナップ機能を備えたモバイルフレンドリーなカルーセルUIの導入。

## 2026-03-22（CL-0058） メニューUIの改善と配置修正

### 概要
- デスクトップ表示時のメニューボタンおよびドロワーの配置を左側に変更（LTR言語時）。
- ドロワー内のメニュー項目を下寄せ（bottom-aligned）にし、広告との重なりを回避。
- ドロワーの開閉アニメーション（スライド方向）を配置に合わせて修正。
- 非表示時のドロワーが画面外へ正しく隠れるようにCSS（Tailwind）を最適化。

## 2026-03-20（CL-0057） 10言語対応SEO、メタデータ拡張の実装

### 概要
- 全10種（EN, JA, AR, ES, PT, FR, ID, HI, DE, TR）のサポート言語に対する `hreflang` 属性の動的な実装を完了。
- サイトトップ、ダウンローダー、ブログを含む網羅的な `sitemap.xml` の拡張。
- 日本語ブログインデックスのメタデータ定義と正規化処理の修正。
- グローバルな JSON-LD における全10言語の `inLanguage` 構成の適用。
- 本番環境（clipkeep.net）への反映とインデックス準備の完了。

## 2026-03-20（CL-0056） オリジナルアイコンの実装と本番反映

### 概要
- クリップが再生ボタンを挟み込む「クランプ」デザインのオリジナルアイコンを実装。
- ユーザーの手書きスケッチを清書した「第7案（Glossy Sketch版）」を最終採用。
- `app/icon.png` として正式導入し、全デバイスでの視認性を確保。
- Cloudflareへのデプロイを完了し、本番サイト（clipkeep.net）に反映。

## [2026-03-22] - Phase 3: Global Trends Hub Implementation
- **Implemented Global Trends Hub**: Added a cross-platform trending carousel at the top of the home page.
- **Enhanced Gallery APIs**: Updated `trending` and `recent` APIs to support mixed-platform queries via `platform=all`.
- **Improved Discovery UI**: Added platform icons to `GallerySection` and `DiscoverySection` thumbnails for clarity in mixed views.
- **Multilingual Support**: Added internationalization for "Global Trends Hub" across 10 supported languages.

## [2026-03-22] - Phase 2: Recommended Clips & UI Cleanup
- **Implemented "Recommended Clips" Carousel**: Added platform-specific trending carousels to the extraction result page.
- **Global Metadata Cleanup**: Removed download counts and playback durations from all video thumbnails for a cleaner UI.
- **Performance & Type Safety**: Refactored `GallerySection` for reusability and resolved build-time linting issues.

## 2026-03-20（CL-0055） ビルドエラー修正と機能状態の総点検

### 概要
- Next.js 15のプリレンダリングエラー（404ページでのuseSearchParams使用）を修正。
- `app/not-found.tsx` を新規作成し、独自のSuspense境界を導入することでビルドプロセスを正常化。
- 404ページを10言語すべてでローカライズ。
- TikTok、Instagramの抽出ロジック（TikWM、ddinstagram、instafix）の動作および統合状態を再確認。
- D1データベースとの同期およびバックグラウンド処理（waitUntil）の安定性を確認。

### レビュー結果
- 結果: 完了
- コメント:
  - ビルドエラーが解消され、Cloudflare Pagesへのデプロイが可能になった。
  - TikTok/Instagram機能が標準構成で動作することを確認。

## 2026-03-16（CL-0054） SNSプラットフォームレイアウトの標準化と抽出ロジック強化

### 概要
- Instagram, TikTok, TelegramのダウンロードページをTwitter版と同等のデュアルセクション（リアルタイム・話題）レイアウトに統一。
- ギャラリーカードにプラットフォーム固有のロゴアイコンを追加。
- Instagram（ddinstagram経由）およびTikTok（TikWM API経由）の抽出ロジックを新規実装。
- **Twitter(X) 動画再生プロキシのドメイン制限を解除し、再生ボタンの不具合（403エラー）を修正。**
- i18n対応として全言語でのSNS別タイトル・手順・FAQ・ギャラリーメタデータを完備。
- lintエラーの解消とコード品質の向上。

### レビュー結果
- 結果: 完了
- コメント:
  - レイアウトの統一により、将来的なスケールが容易になった。
  - 抽出ロジックの冗長化により、外部仕様変更への耐性が向上。

## 2026-03-15（CL-0053） 次フェーズ改善ロードマップ統合

### 概要
- レビュー改善案とPV増加施策を統合したロードマップを追加。
- taskをPhase1着手前提へ更新。

### レビュー結果（レビュー後に追記）
- 結果: 未レビュー
- コメント:
  - Phase1実装後に優先順を再評価。

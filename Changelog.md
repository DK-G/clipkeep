# Change Log（開発概要 + diff.mdスナップショット）

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

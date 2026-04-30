# ClipKeep ユーザー獲得 成長計画

> 作成: 2026-04-30  
> 背景: ローンチ後ユーザーゼロ。問題点の洗い出しに基づいて優先順に並べた実行タスク集。  
> ルール: 上から順に着手する。完了したら `[x]` に変える。

---

## 優先度 P0 ─ 「来ても使えない」を潰す（即着手）

### P0-1: 抽出機能の安定性を実測する
- [ ] 各プラットフォーム（TikTok / Twitter / Telegram / Reddit / Bilibili）を実際のURLで手動テストし、成功率を記録する
- [ ] 失敗率が高いプラットフォームについて、外部APIプロバイダーの死活（TikWM / fxtwitter 等）を確認する
- [ ] デモ用 Pinned Response（`job_tiktok_7c1de28c9edb807c`）を撤去し、実抽出が通るか確認する
- [ ] 失敗時のエラーメッセージが「なぜ失敗したか」を明確にユーザーに伝えているか確認する（"Something went wrong" はNG）

**なぜ最優先か**: 検索で流入しても抽出が失敗するなら離脱率100%。他の施策がすべて無駄になる。

---

### P0-2: Popunder広告を削除する
- [ ] `memo.md` に記載の Popunder スクリプト（`pl28915034.effectivegatecpm.com`）を `app/layout.tsx` またはScript挿入箇所から削除する
- [ ] SocialBar（`pl28916536`）も同様に削除を検討する（侵襲度が高い）
- [ ] 削除後、Google Analytics でバウンス率の変化を1週間モニタリングする

**なぜ最優先か**: CL-0065のデータで「150PVに対して抽出完了ユーザーが極端に少ない」と既に確認済み。Popunderは初訪問ユーザーが最も嫌うフォーマットで、特にモバイルで即離脱を引き起こす。広告収益 < 機会損失。

---

## 優先度 P1 ─ SEOコンテンツの質を上げる（P0と並行可）

### P1-1: Thin Content ブログ記事にコンテンツを追加する
- [ ] `src/lib/blog/keyword-articles.ts` を確認し、`steps` / `proTips` が**未定義の記事**をリストアップする（55本中おそらく40本以上が該当）
- [ ] 優先度の高いカテゴリから順にコンテンツを補完する
  - [ ] Twitter/X カテゴリ（検索ボリューム高）: 未定義の全記事に `steps`（3ステップ）と `proTips`（2件）を追加
  - [ ] TikTok カテゴリ: 同上
  - [ ] Telegram カテゴリ: 同上
  - [ ] Comparison カテゴリ: 同上
- [ ] 各記事のページに `quickAnswer` セクション（100字以内の要点）があるか確認し、なければ追加する
- [ ] `guide-to-media-archiving` の既存blog記事を読み、同等の文字量（1000字以上）が他のキーワード記事にも存在するか確認する

**目標**: 全55記事に最低でも300文字相当のオリジナルコンテンツを持たせる。

---

### P1-2: Solution Pagesを拡充する（3 → 20ページ）
- [ ] `src/lib/solution-pages/store.ts` に以下のスラッグを追加する（英語のみでよい、後から多言語化）
  - [ ] `tiktok-video-downloader-not-working`
  - [ ] `reddit-video-downloader-not-working`
  - [ ] `facebook-video-downloader-not-working`
  - [ ] `bilibili-video-downloader-not-working`
  - [ ] `discord-video-downloader-not-working`
  - [ ] `instagram-downloader-not-working`（maintenanceページと接続）
  - [ ] `video-download-not-working-on-iphone`（横断的）
  - [ ] `video-download-not-working-on-android`（横断的）
  - [ ] `download-not-working-on-chrome`
  - [ ] `download-not-working-private-account`
  - [ ] `how-to-download-without-watermark`（TikTok/Twitter共通）
  - [ ] `video-download-slow`
  - [ ] `video-downloader-safe-guide`
  - [ ] `is-video-downloader-legal`（FAQページへのCTA付き）
  - [ ] `video-format-mp4-vs-webm`
  - [ ] `best-quality-download-settings`
  - [ ] `twitter-video-download-2026`
  - [ ] `tiktok-download-2026`
- [ ] 追加したスラッグをsitemapに反映する（後述P1-3）

---

### P1-3: Sitemapを完全に再生成する
- [ ] `public/sitemap.xml`（静的ファイル）を Next.js の `app/sitemap.ts` に移行し、ビルド時に自動生成されるようにする
- [ ] 含めるべきURLを確認する
  - [ ] ホームページ × 10言語（クエリパラメーター方式のままでOK、hreflangが設定されていれば問題ない）
  - [ ] 全ダウンローダーページ（11プラットフォーム）× 10言語
  - [ ] 全ブログ記事（55本）× 主要言語（en / ja / es / pt 最低4言語）
  - [ ] 全Solutionページ × 主要言語
  - [ ] 法務ページ / FAQ / About
- [ ] `<lastmod>` を実際のファイル更新日時に連動させる
- [ ] Google Search Console でサイトマップを再送信する

**現状**: 125 URL → 目標 600+ URL

---

## 優先度 P2 ─ SEO外の初期流入を作る

### P2-1: Product Huntにローンチ登録する
- [ ] Product Hunt のアカウントを作成 / ログインする
- [ ] プロダクト情報を準備する
  - tagline例: "Download videos from TikTok, X, Telegram and more — free, no watermark"
  - 説明文（英語）: 機能・対応プラットフォーム・無料である点を明記
  - スクリーンショット3枚以上（ホーム / 抽出結果 / 多言語対応）
- [ ] 金曜日以外（火〜木が推奨）にローンチする
- [ ] 日本語圏向けには Zenn / Qiita / note での紹介記事も検討する

---

### P2-2: Redditに適切な形で投稿する
- [ ] 対象コミュニティを選定する
  - r/learnprogramming（技術スタック紹介として）
  - r/webdev（個人開発の紹介として）
  - r/selfhosted / r/DataHoarder（メディア保存ニーズ）
  - r/社会人エンジニア系（日本語subreddit）
- [ ] 宣伝ではなく「役立つ情報」として投稿する（ツール告知は各subredditのルールを確認）
- [ ] 投稿後の反応でどのキーワードが刺さるか確認し、ブログコンテンツに反映する

---

### P2-3: X (Twitter) での定期発信を始める
- [ ] `@clipkeep` アカウントで週1〜2本のツイートを開始する
  - 例: 「TikTok動画をウォーターマークなしで保存する方法」「Telegramの動画を保存できない原因と解決策」など実用ツイート
  - ツールへのリンクを自然に含める
- [ ] 各ブログ記事の内容をツイート1本に要約してシェアするサイクルを作る

---

## 優先度 P3 ─ インデックス状況の確認と基盤整備

### P3-1: Google Search Console の設定を確認する
- [ ] GSCにログインし、`clipkeep.net` が登録されているか確認する
- [ ] インデックス済みページ数を確認する（目標: 少なくとも主要ダウンローダーページ11本が全てインデックスされていること）
- [ ] カバレッジレポートでインデックスが「除外」になっているページを確認し、原因を特定する
- [ ] URL検査ツールでホームページと主要ページをインデックス申請する
- [ ] サイトマップ更新後に再送信する

---

### P3-2: Core Web Vitalsを確認する
- [ ] Google Search Consoleの「ページエクスペリエンス」を確認する
- [ ] PageSpeed Insights（モバイル）でスコアを確認する
  - 広告スクリプト削除（P0-2）後にスコアが改善しているはず
  - LCP / CLS / FID の各指標を記録する
- [ ] モバイルスコアが60以下なら画像最適化 / スクリプト遅延を優先する

---

### P3-3: バックリンク獲得の初動を作る
- [ ] 類似ツールまとめサイト（alternativeto.net 等）に登録する
- [ ] 個人開発紹介サイト（IndieHackers / MicroLaunch）に登録する
- [ ] 日本語圏: Zennに「個人開発でCloudflare Workers + Next.jsでSNSダウンローダーを作った話」を書く（技術ブログとして）

---

## 優先度 P4 ─ 中期的な構造改善

### P4-1: 多言語URLをパスセグメント方式に移行する（中期）
- [ ] 現状の `?locale=ja` を `/ja/` パスプレフィックス方式に変更する
- [ ] Next.js の `next-intl` または `next/navigation` を使ったi18nルーティングに切り替える
- [ ] 全hreflangを新URLに更新する
- [ ] 旧URLから新URLへの301リダイレクトを設定する
- [ ] sitemapを新URL構造で再生成する

**注意**: 工数が大きく短期効果も限定的。P0〜P2が完了してからで十分。

---

### P4-2: TikTokをメイン機能として前面に出す（機能拡張）
- [ ] TikTokは検索ボリュームが最大クラスにもかかわらず、RoadMap上は「Phase 4 Backlog」のまま
- [ ] TikTok抽出の品質を Telegram / Twitterと同等レベルに引き上げる
- [ ] `/download-tiktok-video` ページのUI・FAQ・Solution連携を強化する
- [ ] TikTokキーワードのブログ記事（P1-1）と合わせてシナジーを作る

---

## 完了確認チェックリスト

| チェック項目 | 状態 |
|---|---|
| 全プラットフォームで抽出成功率 > 80% | ⬜ |
| Popunder広告が削除されている | ⬜ |
| ブログ55本に全てコンテンツが存在する | ⬜ |
| Solutionページが20本以上ある | ⬜ |
| Sitemapが自動生成で600URL以上 | ⬜ |
| GSCでインデックス済み50ページ以上 | ⬜ |
| Product Hunt ローンチ済み | ⬜ |
| X / Redditでの初期投稿済み | ⬜ |
| Core Web Vitals（モバイル）Pass | ⬜ |

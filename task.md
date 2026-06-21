# 作業タスクリスト: ClipKeep

## 戦略バックログ（日次ループはここの先頭から1件選ぶ。優先順位は週次レビューが管理）

正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日）

> 2026-06-15 週次レビュー（#002）で並べ替え。律速結論: ボトルネックは「コンテンツ不足」ではなく
> **インデックス/クロール反映の遅延**（sitemap 508 URL に対し impression 発生は実質2正規ページ、
> 06-13/06-14 充足の新規ページは impression=0）。よって先頭を「計測整備 → インデックス促進」に再配置。
> 詳細: `docs/ops/weekly_review_2026-06-15.md`。

1. [x] 計測/北極星: `scripts/growth-summary.mjs` に `ad_script_load`（zone 10760541 / 10969428 別）の**28日**集計を追加し growth:review に表示 ← **完了（2026-06-15, ver f43be6bd）**。GA4にカスタムディメンション未登録＋OAuth read-onlyのため `customEvent:ad_zone` 不可と判明。代替として ad-diagnostics で zone内包 companion イベント（`ad_script_load_z<zone>`）を併発し、eventName ブレークダウンで zone別取得する方式に切替。growth:review に NORTH STAR ブロック新設（7d=4/28d=18 集約を可視化、zone別はデプロイ後蓄積）。詳細 docs/ops/daily/2026-06-15.md
2. [~] 計測/柱1: GSC カバレッジ取得（indexed 実数化）。`growth:review` に URL Inspection 由来の indexed カウント＋除外理由を追加 ← **計測部分は完了（2026-06-16, ローカル計測ツール）**。**フェーズゲート indexed≥50 は GSC 正本 172 でクリア済み**（Phase L 継続は impressions(28d)=15«1,000 のみ）。律速は新パス URL（ja/pt/ar 約375本が 100% 近く Google 未発見＝孤立疑い）の**発見/移行**。スイープの indexed=20/500 は「新 URL 発見率」でゲート指標と混同しないこと。**sitemap 再送信＝2026-06-16 ユーザーが GSC UI で手動完了。当日再読込・ステータス成功・検出508（送信直後の旧値127→508に更新＝発見ギャップ即解消）**。ただし検出(discovered)≠index、実インデックス化は数日〜2週間→次回週次で新パスの登録済み件数増を監視。残る自律タスクは #3 内部リンク強化。詳細 docs/ops/daily/2026-06-16.md
3. [x] 柱1: 06-13/06-14 充足の新規 solution ページ（X/Reddit/Telegram/Twitter の `downloader-not-working` ja/pt）の**内部リンク強化** ← **完了（2026-06-17, ver `3a803a1a`）**。根本原因＝solution テンプレートの遷移が `router.push` の onClick ボタンのみでクローラー追跡可能な `<a href>` が皆無＋ページ間リンク不在＝孤立。対策: `getRelatedSolutions()` で全ページが高意図 not-working クラスタへ必ずリンクする内部リンクグラフを追加、テンプレに実アンカーの「関連リンク」nav を新設、CTA/戻る導線も実 `<a>` 化、ホームグリッドに Twitter/Telegram not-working を追加。本番で関連リンク5本/CTA実アンカー/canonical/ホーム被リンクを確認。impression 解消は数日〜2週間 lag、次回週次で新パスの indexed/impression 増を監視。詳細 docs/ops/daily/2026-06-17.md
4. [x] 柱1: ar Solution ページの内容充足（RTL 目視確認込み） ← **完了（2026-06-18, ver `2044b843`）**。高意図 not-working クラスタ（Telegram/Twitter/Reddit）の ar 本文を ja/pt 同等の複数文化＋s3 新設、ar セクション見出しも追加（英語 "Step N" フォールバック解消）。本番3ページで 200・新s3存在・`dir="rtl"`・path-based 自己参照 canonical・hreflang(en/ja/pt/ar/x-default) を確認。新規 URL 追加なし（既存 ar URL の充足）、D1/bindings 変更なし。詳細 docs/ops/daily/2026-06-18.md
5. [x] OPS-1残: blog / about / contact / legal / status の canonical を metadata-helper 方式に統一（?locale= 自己参照 canonical 残存の解消）← **完了（2026-06-19, ver `d3c54c81`）**。対象10ファイル（about/contact/status, legal/{terms,privacy,dmca,cookies}, blog/{index,guide,[slug]}）のインライン `alternates`（`?locale=` 自己参照 canonical ＋ クエリパラメータ10言語 hreflang）を `buildLocaleAlternates(path, locale)` に統一。本番で `?locale=es` 等の非パスビューが English へ畳み、ja/pt/ar は path-based 自己参照、hreflang は en/ja/pt/ar+x-default の5本のみを確認。詳細 docs/ops/daily/2026-06-19.md
6. [x] 柱1: Schema.org（FAQ/HowTo）の ja/pt/ar 実装 ← **完了（2026-06-20, ver `0b329ec7`）**。solution ページには既に HowTo/FAQPage/BreadcrumbList の JSON-LD があったが ja/pt/ar で2実害: ①BreadcrumbList ラベルが `ja` のみローカライズ（pt/ar 等は英語フォールバック）、②FAQPage が退化（タイトル1問＋全本文連結回答）。対策: `page.tsx` で全10ロケールの breadcrumb ラベルマップを追加、FAQPage を **section 別 Q&A（heading→質問/body→回答）** に書換（1→3問の多言語FAQ化）。付随で `store.ts` の tiktok-not-working 見出しを ja/pt/ar 化（英語 Step 1/2/3 解消＝可視ページも改善）。本番で ja/pt/ar/tiktok-ja の JSON-LD を抽出・検査し breadcrumb ローカライズ・FAQ3問・HowTo3steps を確認。新規URLなし＝sitemap 不変、D1/bindings 変更なし。効果は数日〜2週間 lag（※Google は HowTo リッチリザルト廃止・FAQ を権威ドメイン限定のため、表示でなく意味理解/i18n衛生の改善として扱う）。詳細 docs/ops/daily/2026-06-20.md
7. [x] 柱2: トレンド鮮度ページ生成パイプラインの設計（trending cron のデータから「{トレンド} video download」系ページを生成する方式を設計し、設計文書を docs/strategy/ に出す）← **完了（2026-06-21, 設計文書 `docs/strategy/trend-freshness-pages-design.md`、DRAFT・承認待ち）**。中心決定: ①ページ単位を動画1本でなく**トピックハブ `/trend/[slug]`** に集約（薄ページ量産＝ドアウェイ回避）、②量でなく**品質ゲート**で絞る、③**鮮度減衰**（STALE→noindex/410）を最初から実装、④段階導入（Phase 0=D1スキーマ変更なしMVP→Phase 1=`trend_topics`テーブル＝**要ユーザー承認**）。判明した前提: `auto-trend.ts` はトレンド**キーワードを破棄**しており、まずトピック永続化が必要。詳細 docs/ops/daily/2026-06-21.md
8. [ ] OPS-1残: workers.dev 配信の重複対策（canonical が clipkeep.net を指すことを本番確認）
9. [ ] 柱1: id/hi/tr のロングテールキーワードマップ作成（次の言語展開準備。検索需要・競合弱さ・広告収益性・実装リスクで優先度付け）

### 柱2 Phase 0 実装（2026-06-21 ユーザー承認済み。設計正本: `docs/strategy/trend-freshness-pages-design.md`。日次ループの1デプロイ単位）
- 10. [ ] **P0-1 トピック捕捉＋格納配管**: `src/lib/auto-trend.ts` で破棄しているトレンドキーワード/ハッシュタグを捕捉し、トピック→jobIds マップを **KV（新規バインディング `TREND_KV`）** に永続化（D1 非依存）。※調査で既存 KV 無し＆ビルド時 JSON はランタイム発見を書込めず不適合と判明→KV 確定。`wrangler.production.toml`/`wrangler.test.toml` 双方に宣言。この単位ではページは作らない（配管のみ）。検証は admin auto-trend エンドポイント手動トリガ→KV 反映確認。
- 11. [ ] **P0-2 `/trend/[slug]` ルート骨組み**: `app/trend/[slug]/page.tsx`（`/solution/[slug]` を手本に SSR）。ja のみ、複数クリップギャラリー（各 `/result/[jobId]` へ実 `<a>`）＋導入文＋FAQ、`buildLocaleAlternates` で canonical/hreflang、CollectionPage/ItemList/BreadcrumbList/FAQPage JSON-LD。slug は安定ID `t-<hash>`。
- 12. [ ] **P0-3 品質ゲート＋sitemap 条件付き収録＋内部リンク**: `MIN_CLIPS=3`/`MAX_LIVE_TOPICS=10〜20` を満たすトピックのみ公開・`app/sitemap.ts` に動的収録。`/trending`・`/trending/[platform]` から該当トピックへ実アンカーで内部リンク（孤立防止）。
- 13. [ ] **P0-4 鮮度減衰＋個別撤去導線**: `STALE_AFTER=30日` 超過で sitemap 除外＋noindex/410。同機構を流用し**問題トピックを手動で即時撤去**できる導線を用意（判断3の事後対応路）。

### 完了済み（旧バックログ #2-#4, 2026-06-15 にアーカイブ）
- [x] 柱1/TikTok-SEO: 「TikTok 保存できない/ロゴなし保存」solution ページ（en/ja）充足確認・extractor 実態整合（2026-06-13）
- [x] 柱1: ja Solution（X/Reddit/Telegram「保存できない」）内容充足 s3追加（2026-06-13, ver a5c183d2）
- [x] 柱1: pt Solution（Telegram/Twitter/Reddit「não funciona」3ページ）内容充足（2026-06-14, ver 3fa084d6）

## 作業中 (In Progress)
- [/] OPS-1: 獲得ゼロ問題の是正（2026-06-12 診断に基づく）
    - [x] 原因診断: 未デプロイ（/ja/ 404・旧sitemap）、hreflang全言語同一URL、?locale= canonical畳み込み、GA4認証失効、weekly review未記入
    - [x] main を本番デプロイし `/ja` 200 と path-based sitemap を本番確認（2026-06-12, ver 708c8fc4）
    - [x] canonical/hreflang の矛盾を修正（自己参照 canonical、hreflang は en/ja/pt/ar のみ、sitemap から ?locale= を全廃 5,486→508 URL）
    - [x] GA4/GSC 認証復旧（2026-06-15 確認: `.secrets/ga4-oauth-token.json` 有効、`npm run analytics:ga4` / `analytics:gsc` 両方成功・実データ取得。失効時は `npm run analytics:ga4:login` で再ログイン）
    - [x] GSC で sitemap 再送信（2026-06-16 ユーザー手動完了）とカバレッジ確認（indexed 実数化は 06-16 計測ツールで完了）
    - [ ] ホーム title から未対応の TikTok を除去し実態と一致させる
    - [ ] workers.dev 配信の重複対策（canonical は clipkeep.net を指すことを本番で確認）
    - [x] blog / about / contact / legal / status の canonical を metadata-helper 方式に統一（2026-06-19, ver `d3c54c81`、本番確認済み。`buildLocaleAlternates` に統一、?locale= 自己参照 canonical 解消）
- [/] Phase 3.5: 収益最大化向けSEO多言語展開（ja / pt / ar）
    - [ ] プラットフォーム×言語のロングテールキーワードマップ作成（検索需要・競合弱さ・広告収益性・実装リスクで優先度付け）
    - [x] ja/pt/ar 向け Solution ページの内容充足（X/Reddit/Telegram中心、TikTok除外）← ja(06-13)/pt(06-14)/ar(06-18) で not-working クラスタ充足完了
    - [x] 各ロケールの `<title>` / `<meta description>` をlocaleファイルに追加
    - [x] hreflangタグの実装（`/ja/`, `/pt/`, `/ar/` URLパス対応）
    - [x] Sitemap の hreflang alternates 追加
    - [x] Schema.org（FAQ/HowTo）の多言語実装 ← 完了（2026-06-20, ver `0b329ec7`、本番確認済み。breadcrumb 全10ロケール化＋FAQPage を section 別 Q&A 化）

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
- 2026-06-21: **設計 §9 の全判断をユーザー承認**（設計文書ステータス DRAFT→承認済み・Phase 0 着手可）。確定: ①しきい値 MIN_CLIPS=3/MAX_LIVE_TOPICS=10〜20/STALE_AFTER=30日（保守開始→週次実測で緩和）、②Phase 1 の D1 スキーマは Phase 0 効果検証後に別途承認、③ブロックリスト/人手承認は Phase 0 では設けず最大限自由に公開（現状トピック数ほぼゼロ）＋問題トピックの即時個別撤去導線のみ確保、④slug は安定ID `t-<hash>`、⑤Phase 0 格納は (b) KV/ビルド時 JSON（D1 非依存）。Phase 0 をバックログ #10〜#13（P0-1〜P0-4）として日次1デプロイ単位に分割。
- 2026-06-21: 日次ループ。**バックログ #7（柱2 トレンド鮮度ページ生成パイプラインの設計）完了**（設計文書 `docs/strategy/trend-freshness-pages-design.md`、ステータス DRAFT・ユーザー承認待ち）。設計のみ＝サイトコード/worker/D1 変更なし・新規URLなし＝sitemap 不変。中心決定: ①**ページ単位をトピックに集約**（動画1本=1ページ=`/result` は据え置き、鮮度SEOは複数クリップ＋編集文＋FAQ を束ねる**トピックハブ `/trend/[slug]`**＝薄ページ量産によるドアウェイ/自動生成スパム抵触の回避）、②**量でなく品質ゲートで絞る**（最小クリップ数/dedup/編集文生成済み/NG除外/公開上限）、③**鮮度減衰を最初から実装**（STALE_AFTER 超過で sitemap 除外＋noindex/410＝腐った薄ページの山を残さない）、④**段階導入**（Phase 0=D1スキーマ変更なしMVP→Phase 1=`trend_topics`テーブル追加＝**要ユーザー承認**→Phase 2 pt/ar→Phase 3 計測連動は Phase G 解禁後）。調査で判明: `src/lib/auto-trend.ts` はトレンド**キーワードを取得後に破棄**しており、「{トレンド} video download」ページにはまずトピックの永続化が前提（Phase 0 の核）。本番健全性はリリースゲート全PASS（29/0/1, D1 PASS。初回 D1 step は一過性 wrangler blip で FAIL→単独再現で成功→2回目PASS）で確認。**要ユーザー判断**: 設計 §9 の各上限値・Phase 1 の D1 スキーマ・トピックブロックリスト・非ASCII slug 方針。詳細 docs/ops/daily/2026-06-21.md。
- 2026-06-20: 日次ループ。**バックログ #6（Schema.org FAQ/HowTo の ja/pt/ar 実装）完了**（ver `0b329ec7`、本番確認済み）。solution ページには既に HowTo/FAQPage/BreadcrumbList の JSON-LD が出ていたが、ja/pt/ar で2つの実害を発見・是正: ①`BreadcrumbList` の Home/Solutions ラベルが `ja` だけローカライズされ pt/ar/その他は英語にフォールバック（locale 不一致）、②`FAQPage.mainEntity` がページタイトル**1問のみ**＋回答が全 section 本文の連結＝多言語 FAQ として機能せず。対策: `app/solution/[slug]/page.tsx` に全10ロケールの `breadcrumbLabels`（home/solutions）マップを追加して BreadcrumbList に適用、FAQPage を **section ごとの Q&A**（`heading`→質問・`body`→回答）へ書き換え（ローカライズ済み section データにより ja/pt/ar で完全多言語 FAQ・1→3問）。付随で `src/lib/solution-pages/store.ts` の `tiktok-video-downloader-not-working` 見出しを ja/pt/ar 化（英語「Step 1/2/3」を解消＝**可視ページも同時改善**）。typecheck/lint/build PASS、リリースゲート **PASS=29/0/1**。本番で telegram(ja)/twitter(pt)/reddit(ar)/tiktok(ja) の JSON-LD を `Invoke-WebRequest` で抽出・`@graph` をパースし、breadcrumb のローカライズ・FAQ3問・HowTo3steps を確認。新規 URL なし＝sitemap 不変、D1/bindings 変更なし。**注**: Google は 2023 以降 HowTo リッチリザルト廃止・FAQ を権威ドメイン限定のため、リッチリザルト表示は期待せず意味理解/i18n 衛生の改善として扱う。次回週次で ja/pt/ar 圏 impression 推移を監視。詳細 docs/ops/daily/2026-06-20.md。
- 2026-06-19: 日次ループ。**バックログ #5（OPS-1残: blog/about/contact/legal/status の canonical 統一）完了**（ver `d3c54c81`、本番確認済み）。対象10ファイル（about/contact/status, legal/{terms,privacy,dmca,cookies}, blog/{index,guide,[slug]}）の `generateMetadata` が各々インラインで持っていた `canonical: ${base}${path}?locale=<x>`（**自己参照**）＋ クエリパラメータ10言語 hreflang を、正本ヘルパー `buildLocaleAlternates(path, locale)`（path-based en/ja/pt/ar+x-default、非パスロケールは English へ畳む）に置換。`openGraph.url`/JSON-LD url（実ビュー URL）は canonical 信号でないため不変更、未使用化した `base`/`url` のみ除去。typecheck/lint/build PASS、リリースゲートは外部 Telegram 上流プローブの一過性 FAIL を経て再実行 **PASS=29/0/1**。本番で about(es→/about 畳み・ja→/ja/about 自己参照)・legal/terms(es 畳み)・status(fr 畳み)・contact(de 畳み)・blog(pt→/pt/blog)・guide(es 畳み)・blog/[slug](es 畳み/ja path)を検査、全ページ hreflang は en/ja/pt/ar+x-default の5本のみ・旧 `?locale=` 列挙 grep 0 件を確認。新規 URL なし＝sitemap 不変、D1/bindings 変更なし。効果（重複の English 畳み込みによるクロールバジェット改善・「代替 canonical 除外」混乱の解消）は次回週次で GSC 除外理由推移を監視。詳細 docs/ops/daily/2026-06-19.md。
- 2026-06-18: 日次ループ。**バックログ #4（ar Solution 内容充足・RTL 目視込み）完了**（ver `2044b843`、本番確認済み）。高意図 not-working クラスタ（Telegram/Twitter/Reddit）の `store.ts` 内 ar 本文が単文スタブ＋s3 欠落、かつセクション見出しが英語 "Step N" フォールバックだったのを是正。①ar s1/s2 を ja/pt 同等の複数文へ拡充＋**s3 新設**（画質/形式・対応範囲・保存不可種別）、②`pages` 生成三項に `locale === "ar"` 見出し分岐を追加（Telegram/Twitter/Reddit 各3見出し）。RTL は既存 `dir={localeDir(locale)}` で担保（新規コンポーネント変更なし）。typecheck/lint/build PASS、リリースゲート **PASS=29/0/1**。本番3ページ（`?locale=ar`）で 200・新s3本文・`dir="rtl"`・path-based 自己参照 canonical・hreflang5本(en/ja/pt/ar/x-default, 全 path-based) を確認。新規 URL 追加なし＝sitemap 不変（既存 ar URL の本文格上げ）。効果（薄ページ評価回避→discovered→indexed 昇格・ar 圏 impression）は数日〜2週間 lag、次回週次で監視。D1/bindings 変更なし。詳細 docs/ops/daily/2026-06-18.md。
- 2026-06-17: 日次ループ。**バックログ #3（新規 solution ページ ja/pt の内部リンク強化）完了**（ver `3a803a1a`、本番確認済み）。**根本原因を特定**: solution テンプレートの遷移が `router.push` の `onClick` ボタンのみで、クローラーが辿れる `<a href>` が実質ゼロ＋ページ間リンク不在＝孤立（impression=0 の主因の一つ）。対策3点: ①`store.ts` に `getRelatedSolutions()`＋プラットフォーム別内部リンクグラフを追加（全ページが高意図 not-working クラスタへ必ずリンク）、②`solution-content-client.tsx` に実 `<a>` の「関連リンク」nav を新設し CTA/戻る導線も実アンカー化、③ホームグリッドに Twitter/Telegram not-working を追加（最高権威ページからの直接被リンク）。typecheck/lint/build PASS、リリースゲートは外部 Telegram 上流プローブの一過性 FAIL を経て再実行 **PASS=29/0/1**。本番で ja/pt 各ページに関連リンク5本・CTA 実アンカー・path-based canonical・ホーム被リンクを確認。効果（discovered→indexed 昇格、impression 発生）は数日〜2週間 lag、次回週次で新パスの indexed/impression 増を監視。D1/bindings 変更なし。詳細 docs/ops/daily/2026-06-17.md。
- 2026-06-16: **sitemap 手動再送信を実施（ユーザー操作）**。GSC UI（`sc-domain:clipkeep.net`）で `sitemap.xml` 再送信。**当日再読込・ステータス成功・検出ページ数 508**（送信直後の旧値127→508に更新＝新パス発見ギャップ約381本が即解消）。**#2 の人間操作待ち残を消し込み**。ただし検出(discovered)≠インデックス、実 index 化は数日〜2週間。次は **#3 内部リンク強化**（発見済みURLのクロール→index 昇格を後押し）。次回週次は新パスの登録済み件数増を監視。詳細 docs/ops/daily/2026-06-16.md。
- 2026-06-16: 日次ループ。**バックログ #2 の計測部分（indexed 実数化＋除外理由の一次データ）を完遂**。新規 `scripts/fetch-gsc-index-coverage.mjs`（URL Inspection API, read-only スコープで可）を追加し `growth:review` に **📚 INDEX COVERAGE** ブロックを新設（`analytics:gsc:coverage` スクリプト追加、`run-growth-review` に組込、日次は既定 100 サンプル / 週次は `GSC_INSPECT_LIMIT=0` で全件）。スイープ実測（新 sitemap 500 URL の発見率）: PASS=20 / unknown=477 / crawled-not=3 / canonical 不一致=0、locale 別 en19・ja0・pt0・ar1。**【訂正】**ユーザー提供の GSC「ページのインデックス登録」正本では **登録済み=172 / 未登録=82**（404=27, 代替canonical=18, クロール済み未登録=29 等）。当初「indexed=20・ゲート未達」と書いたのは誤りで、スイープは「新パス URL の発見率」を測っていた。**フェーズゲート indexed≥50 は 172 でクリア済み**、Phase L 継続は impressions(28d)=15«1,000 の側のみ。172 の大半は sitemap から外した旧 ?locale= URL（低意図・表示ほぼ0）で、狙った高意図ページ（新パス ja/pt/ar 約375本）が**ほぼ未発見**＝**律速は新 URL の発見/移行**（孤立ページ疑い＋「検出-未登録=0」）。本タスクは worker/サイトコード不変更の計測ツールのため本番デプロイ面なし（`deploy:prod` 非該当）、リリースゲート PASS=29/0/1 で prod 健全確認。**#2 残**: sitemap 再送信は書込スコープ未付与で自律不可→GSC UI 手動（発見キュー投入に有効）。**次タスク=#3 内部リンク強化（ユーザー承認済み）**。詳細 docs/ops/daily/2026-06-16.md。
- 2026-06-15: 日次ループ。**バックログ #1（北極星 `ad_script_load` の growth:review 可視化＋zone別計測）完了**（ver `f43be6bd`、本番確認済み）。ブロッカーは認証ではなく「GA4 にカスタムディメンション `ad_zone` 未登録＋OAuth read-only で登録不可」と判明。代替として ad-diagnostics で zone内包 companion イベント（`ad_script_load_z<zone>`）を併発し eventName ブレークダウンで zone別取得する方式へ。growth-summary に NORTH STAR ブロック（7d/28d 集約＋zone別 load/error/timeout＋成功率）を新設。北極星 28d=18（集約値、本日から常時可視化）。zone別実数は本デプロイ以降に蓄積（GA4仕様上の遡及不可を明記）。次は #2（GSC sitemap 再送信＋カバレッジ取得=indexed 実数化）。詳細 docs/ops/daily/2026-06-15.md。
- 2026-06-15: **週次戦略レビュー #002 実施**（`docs/ops/weekly_review_2026-06-15.md`）。`growth:review` 成功・本番health 200。28d 実測: セッション2(±0)、GSC impressions 17→15(微減, locale-summary基準/pages基準では27)、clicks 0継続、北極星 ad_script_load は zone別28d が取得不能（events export が7日範囲のみ→バックログ#1で解消）、indexed 実数も取得不能（カバレッジAPI未取得→#2で解消、impression発生正規ページ=2）。**律速はインデックス遅延**（sitemap 508 URL に対し impression は旧?locale= 経由の2ページのみ、06-13/06-14充足の新規ページは impression=0）。撤退基準は非該当（履歴2点・3日で母数不足）。バックログを「計測整備→インデックス促進」優先に並べ替え（9件維持）。KPI履歴表に1行追記。柱4 outreach 下書きを `docs/ops/outreach/2026-06-15.md` に生成（投稿はユーザー手動）。戦略変更提案3件はレビュー文書に記載（growth-strategy.md 本文は未変更）。
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

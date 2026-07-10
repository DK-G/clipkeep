# 柱4' 権威（被リンク）計画 — ホワイトハット限定（Track B）

作成: 2026-07-10（ユーザー承認 A+B に基づく準備。2026-07-03「純オーガニック・柱4廃止」を本件で見直し）
正本参照: `docs/strategy/growth-strategy.md` §4 柱4'／§6 ガードレール

> **狙い**: 真因（ドメイン権威・被リンクの欠如）に**直接**効くレバーを解禁する。
> ただし **ホワイトハットのみ**。§6 ガードレール（PBN・有料リンク網・クローキング・ドアウェイ・
> スパム的リンク散布）は**不変＝引き続き禁止**（やればドメインごと失う）。

## 承認された制約変更（2026-07-10）

- 2026-07-03 の「純オーガニック（被リンクゼロ）・自律限定」を**部分的に見直し**、
  **正当な被リンク獲得（デジタルPR・関連ディレクトリ登録・コミュニティでの正当な言及）を解禁**。
- **危害ゲートは不変**: ①金銭（有料PR/有料ツール）＝要ユーザー承認、②法務/規約/ドメイン評価
  （§6 スパム手法）＝禁止のまま、③不可逆破壊・④セキュリティ＝不変。
- 「自律限定」も**部分見直し**: outreach は本質的に一部 人間の一度きり操作を伴う。
  → **Claude 自律分**と**ユーザー一度きり操作分**を下記で明確に分離し、後者は最小チェックリスト化。

## B-1. Claude 自律分（人手不要・まず着手）

- [ ] **link magnet 化**: Track A の status 資産に **埋め込み用バッジ/スニペット**を提供
  （他サイトが貼れるライブ稼働バッジ＝貼られると自然被リンク）。OpenGraph/Twitter カード整備で
  SNS 共有時の見栄えを上げ、共有→被リンクの初速を作る。
- [ ] **一次データのプレス化（自動生成）**: status 資産から「今週どの PF のダウンロードが落ちていたか」
  の要約を定期生成し、公開ページ化（記事が引用しやすい形＝被引用性）。
- [ ] **構造化**: `schema.org/Dataset` 等で asset を機械可読化（引用・データポータルからの発見性）。

## B-2. ユーザー一度きり操作分（＝下記をコピペで実行するだけ・貼付文面確定版）

> **すべて無料・ホワイトハット・一度きり**。関連性のある場所のみ。スパム的な大量登録はしない（§6）。
> 資産 URL は公開済み: **https://clipkeep.net/platform-status** ／ サイト: **https://clipkeep.net**
> ／ 埋め込みバッジ: **https://clipkeep.net/platform-status/badge**
> 正直性: HN/Reddit/PH のリンクは多くが nofollow。狙いは**初速の露出→ブログ/README からの editorial 被リンク
> ・バッジ埋め込み（dofollow）**を誘発すること。直リンクの SEO 値そのものではない。

**① Show HN（Hacker News）** — https://news.ycombinator.com/submit （優先・最も正当）
- Title: `Show HN: Live status page for video downloaders (X, Telegram, Reddit, Threads)`
- URL: `https://clipkeep.net/platform-status`
- 最初のコメント（貼付）:
  > I built a small live status page that probes the public upstreams behind common video downloaders (Twitter/X, Telegram, Reddit, Threads) every ~6h and shows whether each is currently reachable, plus uptime history. It's part of ClipKeep, a free no-login web downloader. The status data and an embeddable badge are open — feedback welcome, especially on the probe methodology (e.g. 403/429 from datacenter IPs is treated as "reachable, not down").

**② AlternativeTo** — https://alternativeto.net/ （要アカウント → "Add application"）
- Name: `ClipKeep` / URL: `https://clipkeep.net` / License: Free / Platform: Online (Web)
- Category: `Online Video Downloader`（なければ Video Downloader）
- Description（貼付）:
  > ClipKeep is a free, no-login web tool to download videos from TikTok, Twitter/X, Telegram, Reddit, Threads and more. It also publishes a live platform-status page showing which downloaders are currently working.

**③ Reddit — 既存質問への"正当な回答"1件**（新規宣伝投稿はしない） — r/DataHoarder / r/software 等で
「how to download [Telegram/Reddit/X] video」系の既存スレを検索し、実際に役立つ回答として1件だけ:
  > If it's a public post, a free web tool like ClipKeep (clipkeep.net) handles [Telegram/Reddit/X] links without login. If a platform seems flaky, they also run a live status page (clipkeep.net/platform-status) that shows whether the source is currently reachable — handy to tell "the tool is broken" from "the platform is down" before you retry.

**④ Product Hunt**（任意・無料） — https://www.producthunt.com/ で一度きり掲載
- Tagline: `Live status page for video downloaders` / 説明は②の Description を流用。

**⑤ GitHub "awesome" リスト PR**（任意・関連リストが実在する場合のみ）
- エントリ行: `- [ClipKeep](https://clipkeep.net) - Free no-login video downloader (TikTok, X, Telegram, Reddit, Threads) with a live platform-status page.`

> **禁止**: 複数 subreddit への同文コピペ、やらせレビュー、無関係リストへの押し込み、有料リンク購入
> （必要が生じたら危害ゲート①として個別にユーザー承認）。

## B-3. 禁止（§6 不変・念押し）

- PBN、有料リンク網、リンク交換スキーム、コメントスパム、無関係サイトへの大量登録。
- クローキング/ドアウェイ。Instagram noindex 解除。レート制限/広告ゾーン変更。

## 成功指標

- 参照ドメイン数（GSC「リンク」レポート）が 0→数件に。
- asset ページの被リンク発生 → indexed 化・impressions 立ち上がりを Track A と合わせて柱単位で判定。
- 撤退基準（§7, 8週連続 impressions 非成長）は据え置き。A+B 投入後の推移で最終判断。

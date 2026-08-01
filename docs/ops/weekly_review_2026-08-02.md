# Weekly Review Record #008 — ClipKeep Growth

日付: 2026-08-02（日／週次スロット）
対象期間: 直近28日（GA4/GSC as of 2026-08-02, snapshot `growth-2026-08-01T20-43-11-113Z.json`）
比較対象: 前回 週次レビュー #007（2026-07-26・**7日前**＝正常間隔に復帰）
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中。先行指標は **GSC impressions / URL Inspection「Google 未発見」比率 / インデックス数 / Google オーガニックセッション**。CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。実数のみ記載・**TBD 禁止**（取得できない値は「取得不能: 理由」を明記）。
>
> **#007 で確定した読み方を本レビューも踏襲する**: `ad_script_load` とセッションは Phase L の判定指標から外す（§1.1 で本週も追認）。

---

## ✅ 0. 計測健全性（実装前ゲート）

**`npm run growth:review`: 成功（GA4・GSC・URL Inspection の3系統とも SA で fresh 取得）。**

- 認証: `docs/analytics/auth-status.json` = ga4 ok / gsc ok / gsc-coverage ok（`2026-08-01T20:43:11Z`・`blocked:false`）。SA 化（06-28）以降 5 週連続で無人失効なし。
- スナップショット: `docs/analytics/history/growth-2026-08-01T20-43-11-113Z.json`（28日窓 as of 2026-08-02 JST）。

### 本番健全性（`npm run check:loop` ＋ PowerShell `Invoke-WebRequest` 実測, 2026-08-02）

| 対象 | 実測 | 判定 |
|---|---|---|
| `npx wrangler whoami`（デプロイ経路） | **未ログイン＝デプロイ不能** | **BLOCKER（19日目）** |
| `GET /api/v1/health` | **200**（db ok / extractor ok / degraded=false / errorRatio 0 / queueWaitP95 0 / activeJobs 0） | 健全 |
| `GET /sitemap.xml` | **200**（358,027 bytes / `<loc>` **509** / `?locale=` **0** / `/trend/` **0** / `platform-status` **1**） | 応答健全（`/trend/`=0＝柱2 産出ゼロ継続） |
| `GET /platform-status` | **200**（49,565 bytes） | 稼働（**6 PF のまま**＝`3bd3cb6` 未デプロイ） |
| `GET /api/v1/platform-status` | **200**（2,769 bytes・overall=`limited`・`platforms` **6** / `alsoSupported` **5**） | 稼働・**旧構成**（9 PF 化は未反映） |
| `GET /platform-status/badge` | **200**（873 bytes / SVG） | 健全 |
| `GET /trending` | **200**（44,916 bytes・`/trend/` リンク **0**） | 応答健全・中身は空 |

`npm run check:loop` の総合判定: **BLOCKED — blocker 1 件（wrangler 未ログイン）／warning 1 件（twitter degraded）**。

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-08-02（実測） | 2026-07-26（#007） | WoW | 判定 |
|---|---:|---:|---:|---|
| ad_script_load（北極星, 28d 合計） | **237** | 119 | **+118** | 倍増だが**獲得の指標として無効**（§1.1・#007 で確定済） |
| ad_script_load（7d） | **121** | 71 | +50 | 同上 |
| zone 10760541（In-Page Push, 28d） | **119** loads / err 3 / timeout 8・**load 率 92%** | 61 / 2 / 4・91% | 量+58 | 成功率は横ばい（91→92%） |
| zone 10969428（Push Notification, 28d） | **118** loads / err 2 / timeout 4・**load 率 95%** | 58 / 1 / 3・94% | 量+60 | 成功率は横ばい（94→95%） |
| セッション/28d（GA4 summary） | **65** | 36 | +29 | 増だが **91% が Direct**（§1.1） |
| アクティブユーザー/28d | **65** | 36 | +29 | 同上 |
| エンゲージメント率/28d | **55.4%** | 72.2% | **−16.8pp** | **セッションが倍増しながら質は低下**＝非人間トラフィック説を補強（§1.1） |
| **Google オーガニック セッション/28d** | **0** | 0 | ±0 | **2週連続で完全にゼロ** |
| GSC impressions/28d（**query 次元**＝従来系列） | **7** | 5 | **+2** | 微増（撤退カウンタはリセット維持・§6） |
| GSC impressions/28d（**page 次元**＝今週新規計測） | **33** | 計測せず | — | **新規発見。従来値の 4.7 倍**（§2.1） |
| GSC clicks/28d | **0** | 0 | ±0 | 母数ゼロ域 |
| GSC 平均順位（en・query 次元） | **30.1** | 37.0 | 改善 | **母数 7 では統計的に無意味**（成果と読まない） |
| GSC indexed（URL Inspection サンプル100） | **36 / 100** | 36 / 100 | **±0** | **初めて改善が止まった**（§2） |
| 「Google 未発見」URL（サンプル100） | **63 / 100** | 63 / 100 | **±0** | **単調改善が完全に停止**（72→68→66→65→63→**63**）（§2） |
| Crawled - not indexed（サンプル100） | 1 | 1 | ±0 | — |
| canonical mismatch / blocked | 0 / 0 | 0 / 0 | ±0 | 健全 |
| sitemap URL 数 | **501**（`<loc>`509） | 501（509） | ±0 | **3週間 新規 URL ゼロ**（stub 量産停止方針の帰結＝想定内） |

### 1.1 北極星の増加が獲得と無関係であることを、本週も追認した

#007 で確定した「`ad_script_load` の増加は検索流入起因でない」は、本週の実測でも**そのまま再現**した。

GA4 acquisition（28d, `sessionDefaultChannelGroup` × `sessionSourceMedium`）:

| channelGroup | sourceMedium | sessions | engagedSessions |
|---|---|---:|---:|
| **Direct** | (direct) / (none) | **121** | 66 |
| Unassigned | (not set) | 6 | 0 |
| Organic Search | yandex / organic | 3 | 0 |
| Organic Search | terra.com / referral | 1 | 0 |
| Organic Search | yandex.com.tr / referral | 1 | 0 |
| Referral | compfight.com / referral | 1 | 0 |

- **Google からのオーガニック セッションは 0 件**（#007 と同じ）。検索経由は yandex 系 4 件＋terra 1 件のみで、構成もほぼ同一。
- **Direct が 121/133 = 91%**（#007 は 60/66 = 91%）。**比率が完全に一致したまま量だけ倍増**している＝同一の非検索ソースがスケールしただけ。
- ファネルは全段 **0**（Form Interest 0 / Extract Submit 0 / processing_complete 0 / download_actual_start 0 / share 0 / discovery 0 / related 0）。
- **エンゲージメント率が 72.2%→55.4% に低下**した。人間の流入が増えたならこの指標は下がりにくい。**セッション倍増＋エンゲージメント低下**は、ボット/クローラ由来という読みと整合する。
- 計測上の注意（#007 と同じ・正直な記載）: acquisition 行の合計は **133** で、無ディメンションの summary セッション **65** と一致しない。GA4 はディメンションを付けるとセッションが重複計上されうるため、**チャネル構成比（約9割 Direct）は方向性として読み、絶対値は summary の 65 を正とする**。どちらも実測であり推定値は用いていない。なお GA4 の `views`（screenPageViews）は本週も **0** が返る（イベント総数 520 は取得できている）＝**views 指標は当プロパティで実質未計測**。KPI 判断には用いていない。
- **結論（不変）**: 北極星 `ad_script_load` は現在「獲得の進捗」を測っていない。Phase L における実質の先行指標は **GSC impressions・「未発見」比率・Google オーガニックセッション** の3点のみ。

---

## 2. SEO シグナル（GSC, 28日）— 今週の最重要セクション

### 2.0 発見（インデックス）の改善が完全に止まった

- Submitted and indexed: **36**（#007 と同数）
- URL is unknown to Google: **63**（#007 と同数）
- Crawled - currently not indexed: **1** / canonical mismatch: 0 / errors: 0

「未発見」比率の推移は **72 → 68 → 66 → 65 → 63 → 63** となり、**5 期連続で続いていた単調改善が今週ゼロになった**。改善幅は **−6 → −2 → −1 → −2 → 0**。

これは驚くべき結果ではなく、**入力が枯れた必然的な帰結**である: sitemap は 501 URL で 3 週間不変（templated stub 量産を 07-10 に停止したため）、新規コンテンツ 0、被リンク 0。Google に「まだ見ていない URL」を渡していない以上、発見率は在庫の上限へ収束する。**「発見はもう伸ばせるレバーではない」ことが今週確定した。**

### 2.1 【新規発見・計測の穴】撤退基準に使ってきた impressions は、実測の 1/4.7 しか見えていなかった

`npm run growth:review` の `localeSummary`（＝週次レビューが毎回「GSC impressions」として記録してきた値）は、**`dimensions: ["query","page","country","device"]` の結果から導出**されている（`scripts/fetch-gsc-report.mjs:348,360`）。GSC は次元を増やすほど**匿名化クエリの行を落とす**ため、この値は構造的に過小になる。

同じ 28 日窓・同じ API 呼び出しで取得している **`dimensions: ["page"]`（`latest-gsc-pages.csv`）を集計すると、impressions は 33** だった。

| 集計次元 | impressions/28d | 内訳 |
|---|---:|---|
| query × page × country × device（**従来の記録値**） | **7** | en のみ（クエリ 5 件・ページ 2 件） |
| country × page | **7** | gbr/idn/jpn/phl/usa |
| **page**（今週新規） | **33** | **en 19 / pt 7 / ja 4 / es 2 / hi 1** |

**＝従来の系列は実測の約 21%（1/4.7）しか捉えていなかった。** これは計測バグではなく GSC の仕様だが、**撤退基準（§7）と KPI 履歴が最も過小・最もノイズの大きい次元の上に乗っていた**ことを意味する。§7 提案1 で是正を提案する。

### 2.2 【新規発見】page 次元で見ると、**pt ロケールだけが順位化している**

従来の query 次元では「en のみ・平均順位 30.1」としか見えなかったが、page 次元では 5 ロケールが impression を取得しており、**順位の分布がロケール間で大きく違う**:

| locale | impressions/28d | ページ例（position） |
|---|---:|---|
| en | **19** | `/` 10 impr(**12.6**) / `blog/tiktok-video-save-method-ja` 2(**92**) / `contact` 1(3) / `trending/bilibili` 1(5) / `trending/threads` 1(6) / `legal/cookies` 1(7) / `solution/bilibili-...-not-working` 1(9) / `blog/twitter-video-download-private-account` 1(11) / `solution/...-on-android` 1(42) |
| **pt** | **7** | **`/pt` 1(2)** / **`/pt/blog/safest-video-downloader-sites` 1(2)** / `blog/how-to-download-twitter-videos?locale=pt` 1(4) / `/pt/latest` 1(4) / `blog/tiktok-video-download-no-watermark?locale=pt` 1(6) / `/pt/blog/twitter-video-download-mp4` 1(7) / `blog/tiktok-save-visible-ja?locale=pt` 1(11) |
| ja | **4** | `blog/tiktok-video-download-private?locale=ja` 2(9) / `?locale=ja` 1(10) / `/ja/solution/video-download-slow` 1(11) |
| es | **2** | `?locale=es` 1(8) / `blog/telegram-video-download-bot-safe?locale=es` 1(19) |
| hi | **1** | `?locale=hi` 1(9) |

- **pt は 7 impression 中 6 件が position 2〜7** に入っている（平均 ≈5.1）。en の主力である `/` は position 12.6。**多言語ロングテール（柱1）の仮説は死んでおらず、pt で最も順位化している。**
- **ar は page 次元でも impression 0**。ja/pt/ar を同列に扱ってきた前提は実測と合わない。
- **正直な但し書き（重要）**: 各行は 1〜2 impression であり、「position 2」は**1 回そこに表示された**という意味しかない。これを「pt は上位表示できている」と一般化してはならない。今週言えるのは **(a) 従来の計器では見えていなかった 5 ロケール分の露出が実在する**、**(b) その中で pt だけが低順位帯（2〜7）に偏っている** の 2 点であり、**次週以降の同一次元での継続観測が要る**（§8 優先1 に計測タスクとして積んだ）。
- 副次: `http://clipkeep.net/?locale=es|hi|ja` という **http・`?locale=` 形式の旧 URL が依然 impression を取っている**（計 3）。sitemap からは全廃済み（`?locale=`=0）で canonical mismatch も 0 のため、**Google 側に残る旧インデックスの残滓**と読める。害はないが、canonical 統合の完了までタイムラグがあることの証拠。

### 2.3 結論

**律速の診断は #006・#007 から不変**＝「index されたページの順位化＝ドメイン権威・被リンク」。今週それに **2 つの事実**が加わった:

1. **発見側のレバーは尽きた**（未発見 63 で頭打ち・sitemap 3 週間不変）。
2. **順位化は完全にゼロではない**（page 次元で pt が pos 2〜7）。ただし clicks は 0 で、impressions 33 は依然として桁が足りない（Phase G 閾値 1,000 の 3.3%）。

---

## 3. ファネル / グロースループ（28日, 凍結中）

Phase L につき凍結（CVR/ファネル微調整は選択不可）。参考実測のみ: Form Interest 0 / Intent-to-Clip 0 / Success 0、share 0 / discovery 0 / related 0、viral factor 0.00。**セッションは 65 に倍増したがファネル進入は全段ゼロ**＝§1.1 の「Direct 流入は実ユーザーでない可能性が高い」を今週も補強する。Phase G（indexed≥50 かつ impressions≥1,000）到達まで着手しない。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0、本番 6 エンドポイント全て 200 実測）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0（**アプリ配信本体は健全**）
- **柱1' status 資産が示す上流の異常（本番実測 2026-08-02, `checkedAt=2026-08-01T20:40:50Z`）**:

  | platform | status | http | latency | uptime | samples |
  |---|---|---:|---:|---:|---:|
  | **twitter** | **limited** | **401** | 10ms | **0%** | 56 |
  | telegram | operational | 200 | 992ms | 100% | 56 |
  | reddit | operational | 403 | 24ms | 100% | 56 |
  | threads | operational | 302 | 241ms | 100% | 56 |
  | bluesky | operational | 200 | 336ms | **93%** | 56 |
  | tiktok | operational | 403 | 155ms | 100% | 56 |

  - **【今週の精密化】uptime のローリング窓は `HISTORY_MAX = 56`（`src/lib/platform-status/probes.ts:267`）＝6時間間隔 × 56 サンプル = ちょうど 14 日**。したがって twitter の **uptime 0% / n=56 は「直近 14 日間の 56 回すべてのプローブが失敗した」**という意味であり、**2026-07-19〜08-01 の全窓で 1 度も上流に到達できていない**ことが確定する（＝観測開始 07-10 からの連続失敗が窓を埋め切った状態）。n が 56 で止まっているのは計測停止ではなく**窓の上限**であり、`checkedAt` が 2026-08-01T20:40Z＝**プローブ自体は正常稼働している**。
  - **twitter 401 は本日で発見から 9 日目・観測上は約 23 日継続**。主力プラットフォームである X の上流（`api.fxtwitter.com`）が Cloudflare Workers の egress を弾いている疑いは不変。
  - **07-30 の日次ループが根因側の起点を特定済**: `src/lib/extract/twitter.ts:186-215` の fx-api 分岐は **HTTP 401 をどの枝でも分類していない**（403/429→cooldown、404→`POST_NOT_FOUND`、`ok`→解析、**401 はどれにも入らず**黙って次のフォールバックへ）。**本番が出し続けている 401 は extractor 自身のログに一切現れない**（`provider_failed` すら出ない）。
  - X 抽出の実地確認は依然として無人不可（`POST /api/v1/extract/prepare` は `403 TURNSTILE_MISSING`＝Turnstile は設計通り機能。CAPTCHA 回避は行わない）。
- **【3週連続・最大の運用障害】デプロイ経路が 19 日間 断絶している**: `wrangler whoami` → **未ログイン**（`npm run check:loop` が BLOCKER 判定・exit 1）。07-14（ver `1d946b55`）を最後に OAuth が失効し、以降 `npm run deploy:prod` が実行不能。結果として:
  - 07-24 push 済みの `3bd3cb6`（Track A プローブ 6→9 PF）が**本番未反映 9 日目**（本日の `/api/v1/platform-status` が `platforms:6` / `alsoSupported:5`＝旧構成であることで確認）。
  - 最優先課題（fxTwitter 401）の**診断も是正も出荷できない**。
  - 日次ループの Definition of Done（AGENTS.md 手順3〜5）が**構造的に達成不能**。
  - **復旧はユーザーの 1 回操作のみ**（§8 優先0）。

### 4.1 本週の日次ループ稼働状況（正直な記載）

日次スロット（月〜土 07:05）のうち、**daily log が存在するのは 07-28・07-30 の 2 日のみ**。07-27（月）・07-29（水）・07-31（金）は log が無く**未発火または未記録**（07-28 の log には「同日2回目の発火」の記載があり、07-27 分が翌日にずれた可能性がある）。08-01（土）は週次 health-check として実施済み。

- **07-28**: `npm run check:loop`（`scripts/loop-health-check.mjs`）を新設（`abe6fbe`）。初回実行で過去2件の見落とし事故を即検出。deploy は n/a（本番面なし）。
- **07-30**: HC-8＝`src/lib/extract/` の純関数にユニットテスト導入（`678695b`）。**vitest 44→73（+29）**。副次発見として上記 401 分類漏れを特定。deploy は n/a。
- **08-01**: 週次 health-check（`48adade`）。status **green**（層B/層B+ 変更 0）。**HC-6 の緊急度を 中→高 に上方修正**（`next` advisory 全文確認で middleware redirect SSRF / rewrites HTTP request smuggling / App Router Middleware・Proxy bypass / cache poisoning / CSP nonce XSS 等が該当と判明し、前回の「`/_next/image` が 404 だから低露出」という評価根拠が**不成立**と確定）。新規 HC-9（認証/レート制限レイヤーが無テスト）・HC-10（レート制限 env parse に NaN ガード無し＝潜在 fail-open）を起票。

**＝本週の出荷は 0 件**（コミット 3 件はすべて本番面を持たないテスト/スクリプト/文書）。これはサボりではなく**デプロイ経路が塞がっている中で唯一実行可能な種類のタスクを選んだ結果**だが、**3 週連続で本番が 1 mm も動いていない**という事実は明記しておく。

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

| 柱 | 直近の打ち手（07-26〜08-02 出荷物） | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | **新規出荷なし**（templated stub 量産は 07-10 以降 停止のまま・sitemap 501 で 3 週間不変） | 未発見 **63→63**・indexed **36→36**＝**改善停止**。一方 **page 次元で 5 ロケール・33 impressions が実在**し、**pt は 7 impr 中 6 件が pos 2〜7**（§2.2）。ar は page 次元でも 0 | **「発見」レバーは尽きた（頭打ち）が、「順位化」は pt で兆しがある**＝柱1 の仮説自体は棄却されない。ただし clicks 0・母数は依然ノイズ域 | ①**page 次元の locale 別 impressions/position を週次計器に昇格**（§8 優先1・自律可・デプロイ不要）②**「量産」でなく「pt の既存ページを深く」へ賭け先を寄せる**（§8 優先6・要デプロイ）③ar の扱いは 2 週分の page 次元データを見てから判断 |
| 柱1' linkable asset（主軸） | **新規出荷なし**。`3bd3cb6`（6→9 PF）は 07-24 push 済・**9 日間 未デプロイ** | 資産は稼働（page/JSON/badge 全 200・`checkedAt` fresh）。**19 日間 更新が本番へ届いていない**。資産自身が twitter 0%（14日窓 全滅）を出し続けている | **"稼働"は維持、"成長"は 3 週連続 停止**。律速は資産の設計でなく**デプロイ経路の断絶**（不変） | ①**デプロイ復旧後ただちに `3bd3cb6` を出荷**（コードは main 済・再実装不要）②その後 A-v2（`extractor_jobs` per-PF 実成功率の併記） |
| 柱2 トレンド鮮度 | **新規出荷なし**（最後の変更は 07-13 の 60s 緩和） | **20 日・約80 cron 窓 稼働して産出ゼロ**（`/trend/` が sitemap 0 件・`/trending` 内リンク 0 件）。KV heartbeat は wrangler 未ログインのため**取得不能** | **#007 の「60s 緩和は失敗」判定を、さらに 7 日分のデータで追認**。無償の打ち手は尽きたまま | **#007 提案2 の二択（(a) 有料 Browser Rendering＝危害ゲート①要承認／(b) 凍結）に対するユーザーの一言が 1 週間得られていない**。推奨は引き続き **(b) 凍結**（§7 提案3・§8 優先5） |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4' 外部流入・権威 | **新規出荷なし**（07-26 の outreach 下書きの実施有無は未確認） | 参照ドメイン: **自動取得不能と確定済**（GSC API に links エンドポイント非提供）。代理指標（badge 外部 Referer 集計）は**未実装＝KV binding が要り自律不可と 07-28 に判定済**。GA4 referral は `compfight.com` 1 件のみ（#007 と同一）＝**被リンク獲得は 3 週間 観測されず** | **効果は未観測。かつ効果を測る計器が無い状態が 3 週間 継続** | ①KV namespace 作成＝**ユーザー承認クラス**として §8 優先4 に維持 ②AlternativeTo 登録が未実施なら本週の下書き（`docs/ops/outreach/2026-08-02.md`）で再提示 |

**律速の結論**: 戦略的な律速は #006 から不変で「**順位化＝ドメイン権威/被リンク**」。今週それに **「発見側のレバーが頭打ちに達した」**（§2.0）という新事実が加わり、**「発見を待てば良い」という逃げ道が消えた**。一方で **実務上の律速は 3 週連続で「デプロイ経路の断絶（19日）」**であり、柱1'・柱1・柱4' のいずれも本番に届かない。**まずここを開けることが、どの柱の議論よりも優先する。**

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 今週の GSC impressions(28d)（従来系列＝query 次元） = **7**（前回 #007 = 5）。**+2＝微増＝成長**に該当。
- 実測ベースのカウント履歴: #002（06-15, 17→15 減＝非成長, 連続1）→ #003（06-24, 測定不能＝非加算）→ #004（06-29, 15→3 減＝非成長, 連続2）→ #005（07-05, 3→4 増＝成長, リセット=0）→ #006（07-12, 4→4 横ばい＝非成長, 連続=1）→ #007（07-26, 4→5 増＝成長, リセット=0）→ **#008（08-02, 5→7 増＝成長, リセット=0）**。
- **判定: 撤退基準 非該当（連続非成長=0）。**
- **重要な留保（自己批判・#007 から強化）**:
  1. impressions 7 は移行前の 15 に遠く、+2 は**母数 7 の統計的ノイズ域**であって「成長」と呼べる実体はない。撤退カウンタが機械的にリセットされることを**改善の証拠と読んではならない**。
  2. **今週さらに悪い問題が判明した**: この判定に使っている系列は §2.1 のとおり **GSC の匿名化フィルタで実測の約 1/4.7 しか捉えていない次元**である。母数 7 の系列は 1 行の匿名化で ±数件動くため、**撤退基準そのものがノイズで駆動されている**。**カウンタが 0 にリセットされ続けていること自体が「撤退基準が機能していない」ことの証拠**であり、これを安心材料にしてはならない。§7 提案1 で計器の是正を提案する。
  3. 判定の根拠は **impressions・未発見%・Google オーガニックセッション の 3 点のみ**（#007 提案1 に従い `ad_script_load` 237・セッション 65 は根拠に用いない）。この 3 点は今週それぞれ **7（ノイズ域の微増）・63%（改善停止）・0（2週連続ゼロ）** であり、**実体としては「前進ゼロ」が正しい要約**である。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **【最優先・計測の是正】KPI 履歴と撤退基準の impressions を「page 次元」に切り替える（従来系列は併記して継続）**: §2.1 のとおり、これまで記録してきた impressions（query×page×country×device 次元）は GSC の匿名化により**実測の約 21% しか捉えていない**（7 vs 33）。母数が小さいほど匿名化の影響は相対的に大きく、**撤退基準（§7）が最もノイズの大きい系列の上に乗っている**。是正案: (a) 週次レビューは今週から **page 次元 impressions を主系列**として記録する、(b) **query 次元も併記**して過去 8 期分の連続性を壊さない、(c) 撤退カウントは**series 移行の断絶を避けるため、当面は両系列を並記して「両方が非成長のときだけ非成長とカウント」**する。データ取得コードの変更は不要（`latest-gsc-pages.csv` として既に毎回取得済み）＝**`scripts/growth-summary.mjs` の集計追加のみ・デプロイ不要・自律実行可**（§8 優先1）。growth-strategy.md §7 の文言変更はユーザー承認が要るため、本提案は**運用上の併記から始める**。
2. **【新規・柱1 の賭け先変更】「多言語を広く」から「pt を深く」へ寄せる**: §2.2 の page 次元実測で、**impression を取っているのは en 19 / pt 7 / ja 4 / es 2 / hi 1 で、pos 2〜7 の低順位帯に入っているのは pt のみ**（ar は 0）。柱1 は「ja/pt/ar 優先」と定義されているが、**実測は ja と ar を支持していない**。stub 量産の停止方針は維持したまま、**限られた出荷枠を pt の既存ページの内容深化に寄せる**ことを提案する（新規 URL を増やさないので thin/doorway リスクも増えない）。ただし各行 1〜2 impression のノイズ域であるため、**#009 で 2 週分の page 次元データを確認してから確定**する（今週は §8 優先6 に「候補」として積む）。
3. **【再提示・柱2】60s 緩和は失敗。二択（有料化 or 凍結）への回答が 1 週間 得られていない**: #007 提案2 は 07-13 出荷の 60s 緩和が**本番 20 日・約80 cron 窓で `/trend/` 産出ゼロ**であることを根拠に、(a) 有料 Browser Rendering 切替（危害ゲート①金銭＝要承認）か (b) 凍結の二択に到達したと判定した。本週さらに 7 日分のデータが加わったが**結論は変わらず**、かつ**ユーザーからの回答が未取得**のため日次ループは 1 週間これに触れられていない。**推奨は引き続き (b) 凍結**（検索流入が実質ゼロの現状ではトレンドページを産出できても順位化しない）。凍結は「戦略文書の書き換え」に当たるため**ユーザーの一言（「凍結でよい」）が要る**。回答が無い間、柱2 は**事実上すでに凍結されている**（打ち手が無く日次枠も消費していない）ので、実害は「バックログ上に判定不能の項目が居座り続けること」のみ。
4. **【継続・柱4'】代理指標が無いまま 3 週間が経過した**: badge 外部 Referer の KV 集計は 07-28 に「**KV namespace の作成＝Cloudflare bindings の追加が必要で日次ループの自律範囲外**」と判定済み。よってこれは**優先0（wrangler login）と同じ「一度きりの人間操作」クラス**であり、ユーザーの承認が無い限り永久に着手されない。**主軸 A+B の効果を測る唯一の計器がこれ**である以上、**優先0 と同時に依頼するのが合理的**（どちらもユーザーが Cloudflare ダッシュボード/CLI に触る作業）。§8 で優先4 に据え置き、依頼文を優先0 とまとめた。
5. **【プロセス】日次ループの発火率が 5 割を切っている**: 本週の日次スロット（月〜金の 5 枠）で daily log が残ったのは 2 枠のみ（§4.1）。`check:loop` による BLOCKER 検知は機能しているが、**そもそも発火していない日は検知対象にすらならない**。#007 で導入した健全性チェックは「発火した日の異常」を捉える計器であって「発火しなかった日」は捉えられない。**週次レビューが毎回 daily log の存在有無を数えて記録する**ことで穴を可視化する（本レビューから実施＝§4.1）。スケジューラ側の調査はリポジトリ外の作業であり、ここでは記録に留める。

> いずれも growth-strategy.md 本文は未変更（KPI 履歴行の追記のみ）。決定事項7・8（危害以外は自律確定可）に基づき提案1・5 は自律実行しうる。**提案3 の (a) 有料切替は危害ゲート①、提案4 の KV namespace 作成は「一度きりの人間操作」＝いずれもユーザー承認が必要**。提案2 は #009 の追加データ待ち。

---

## 8. 翌週アクション（task.md 戦略バックログへ反映済み）

`task.md` の戦略バックログを並べ替え・補充し、**計 12 件**（優先0〜11。うち 優先0・5・11 はユーザー操作/判断、**残り 9 件が日次ループの消費対象**）を維持した（≥7 要件クリア）。**うち 3 件（優先1・3・7）はデプロイ経路が塞がったままでも完遂できる**ように選んである（3 週連続で「全部ブロック」になり日次枠が溶けるのを避けるため）。

| 優先 | タスク | 柱/種別 | デプロイ要否 | 成功指標 |
|---|---|---|---|---|
| **0** | **【ユーザー操作・全タスクの前提】`npx wrangler login`（または `CLOUDFLARE_API_TOKEN` 設定）でデプロイ経路を復旧** → 直後に `npm run deploy:prod && npm run check:release:prod` で **`3bd3cb6`（6→9 PF）を出荷して閉じる**。**あわせて優先4 用の KV namespace 作成も同時に依頼**（同じ Cloudflare 作業のため） | 運用/blocker | — | `wrangler whoami` 認証済／`/api/v1/platform-status` の platforms が 6→**9**・`alsoSupported` 2件 |
| **1** | **【新規・自律可】計測: `growth:review` に page 次元 impressions（locale 別・position 別）を集計として追加**（§7 提案1。`latest-gsc-pages.csv` は既に毎回取得済み＝**新規 API 呼び出しゼロ**。`scripts/growth-summary.mjs` の集計とサマリー出力の追加のみ） | 計測 | **不要** | `npm run growth:review` の出力とスナップショット JSON に page 次元 impressions とロケール別内訳が出る |
| **2** | **柱1/修復: fxTwitter 401 の明示分類とログ化**（`src/lib/extract/twitter.ts:186-215` が 401 をどの枝でも分類せず黙って落ちる＝本番の 23 日間の異常が extractor ログに現れない根因。**まず 401 を明示分類してログに出すのが最小の一手**。本番検証は優先0 の復旧が前提だが、**実装・テスト・push はデプロイ非依存で先行できる**） | 柱1/修復 | 検証のみ要 | 401 が失敗分類に現れる・vitest green／（復旧後）status の twitter が operational へ |
| **3** | **【新規・自律可】健全性 HC-9: 認証/レート制限レイヤーのユニットテスト**（`src/lib/rate-limit/extract.ts` の `getClientKey`／窓・上限判定＝純粋に近い部分から。`verifyTurnstileToken` は fetch/`getCloudflareContext` のモックが要るため分割可。**"fail-closed であること"を契約として固定する**） | 健全性/品質 | **不要** | rate-limit の純関数にテストが入り green（production 非改変） |
| **4** | **柱4' 測定: badge 外部 Referer の KV 集計＝被リンク代理指標**（**要ユーザー承認: KV namespace 作成**。主軸 A+B の唯一の計器。§7 提案4。優先0 と同時依頼） | 柱4'/測定 | 要 | 外部 Referer ホスト数を週次で取得できる・本番200 |
| **5** | **柱2: 凍結の可否をユーザーに確認する（§7 提案3）**（(a) 有料 Browser Rendering＝危害ゲート① / (b) 凍結。**推奨は (b)**。回答が無い限り日次ループは着手しない） | 柱2/判断 | — | ユーザーの一言を得て task.md に明記 |
| **6** | **【新規・候補】柱1: pt ロケール既存ページの内容深化**（§2.2＝page 次元で pt のみ pos 2〜7。**新規 URL は増やさない**＝thin/doorway リスク非増。★**#009 で 2 週分の page 次元データを確認してから着手**＝今週は着手しない） | 柱1/内容 | 要 | pt ページの impressions/position が 2 週連続で改善 |
| **7** | **【自律可】健全性 HC-8 残: `extractTwitter`／`extractTikTok` の I/O モック付きテスト**（失敗分類の網羅。優先2 と同じレイヤーなので連続実施が自然） | 健全性/品質 | **不要** | extract 層の失敗分類にテストが入り green |
| **8** | **健全性 HC-6: `next` 15.2.9 → 15.5.22（security・緊急度 高）**（08-01 health-check で緊急度を 中→高 に上方修正＝middleware redirect SSRF / rewrites の HTTP request smuggling / App Router Middleware・Proxy bypass / cache poisoning / CSP nonce XSS が ClipKeep の構成に該当。`package.json` の版指定変更を伴うため**要ユーザー承認**・要本番フル検証） | 健全性/security | 要 | `next@15.5.22` で typecheck/lint/build/vitest PASS・本番フル検証 PASS |
| **9** | **柱1' Track A: A-v2 = `extractor_jobs` の per-PF 実成功率を status 資産へ併記**（合成プローブ＝上流到達性 と 実ジョブ成功率 は別物。二軸併記は被引用性を上げる。優先2 の結果とも接続） | 柱1'/資産 | 要 | status page/JSON に per-PF 実成功率が出る・本番200 |
| **10** | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し） | 柱1/発見 | 要 | 残る solution help リンクの path 形式化・本番200 |
| **11** | **柱4' B-2（ユーザー一度きり・任意）: AlternativeTo 登録**（7/17 予定分が未実施なら。文面は `docs/ops/outreach/2026-08-02.md`／authority-plan.md B-2） | 柱4'/権威 | — | 登録1回・被リンク発生（ユーザー実行分） |

> **落としたもの・変えたもの（明示）**:
> - #007 優先7「ja/pt/ar の indexed/impression 推移を週次記録」は、**優先1（page 次元計測の実装）と週次レビューの定常業務に分割吸収**した（単独タスクとしては消滅）。
> - #007 優先3（badge Referer）は**優先度を 3→4 に下げた**。降格ではなく、**自律不可（KV binding 必須）と確定した以上バックログ上位に置いても日次ループが消費できない**ため、実際に消費できるタスクを上に繰り上げた。重要度の評価は不変（主軸の唯一の計器）。
> - **HC-10（レート制限 env parse の NaN ガード欠落＝潜在 fail-open）はバックログに積んでいない**。理由: セキュリティ性質を変える修正であり、**本番検証なしに出荷すべきでない**＝優先0 の復旧後に HC-9（優先3）とセットで扱うのが正しい。08-01 health-check の記録に残っており、実害は現時点でなし（3 つの wrangler toml すべて正常値）。
> - HC-5（yaml moderate）は**ユーザーの承認マーカーが 4 週連続で未付与**のため据え置き。

---

## 9. 柱4' outreach（ホワイトハット限定）

- 本週分の下書き: **`docs/ops/outreach/2026-08-02.md`**（AlternativeTo 登録文面／Reddit・Quora 既存質問への正当回答／バッジ埋め込みピッチ）。**投稿はユーザー手動・自動投稿は禁止**。
- 正本: `docs/strategy/authority-plan.md`。§6 ガードレール（スパム的大量登録・PBN・有料リンク）不変。有料PRは危害ゲート①＝要承認。
- **正直な但し書き（#007 から継続・より強く）**: 本週の下書きも 07-12／07-26 版から**実質的に変わっていない**（AlternativeTo 登録が 3 週連続で未実施のため再掲）。**下書きを毎週作り直すこと自体には価値がない**。柱4' を実際に動かすのは (a) ユーザーの一度きり登録、(b) 資産主導の自然リンク、(c) 効果を測る代理指標（優先4）の 3 点であり、**(c) が無い限り (a)(b) の成否も判定できない**。**#009 でも未実施かつ KV 承認も無い場合、outreach 下書きの毎週生成を停止し、変更があった週のみ更新する運用へ切り替えることを提案する**（無意味な差分を積み上げないため）。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分=実測行を追記）
- `docs/strategy/linkable-asset-plan.md`（柱1' Track A 設計）／`docs/strategy/authority-plan.md`（柱4' Track B・outreach 正本）
- 前回: `docs/ops/weekly_review_2026-07-26.md`（#007・7日前）
- 中間実測: `docs/ops/daily/2026-07-28.md`（`check:loop` 新設）／`docs/ops/daily/2026-07-30.md`（HC-8・401 分類漏れ発見）／`docs/ops/health/2026-08-01.md`（週次健全性・HC-6 上方修正・HC-9/10 新規）
- スナップショット: `docs/analytics/history/growth-2026-08-01T20-43-11-113Z.json`（2026-08-02 as-of・実測）
- 生 CSV（page 次元の根拠）: `docs/analytics/latest-gsc-pages.csv`（28d・`dimensions:["page"]`）／`latest-gsc-query-pages.csv`（28d・4次元）／`latest-gsc-locale-summary.csv`
- 認証: `docs/analytics/auth-status.json`（SA・fresh・`blocked:false`）／`docs/ops/analytics-auth-recovery.md`（SA 化ランブック）
- 柱2: `/trending` 本番 200・`/trend/` リンク 0 件／sitemap `/trend/` 0 件（**KV heartbeat は wrangler 未ログインのため取得不能**）
- 柱1' uptime: 本番 `/api/v1/platform-status`（twitter 0%/401・telegram 100%・reddit 100%・threads 100%・bluesky 93%・tiktok 100%／窓 = `HISTORY_MAX 56` × 6h = 14日、`src/lib/platform-status/probes.ts:267`）

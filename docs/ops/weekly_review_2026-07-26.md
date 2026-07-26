# Weekly Review Record #007 — ClipKeep Growth

日付: 2026-07-26（日／週次スロット）
対象期間: 直近28日（GA4/GSC as of 2026-07-26, snapshot `growth-2026-07-26T08-00-27-283Z.json`）
比較対象: 前回 週次レビュー #006（2026-07-12・**14日前**）／中間実測 日次ループ 2026-07-24
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中。先行指標は **GSC impressions / URL Inspection「Google 未発見」比率 / インデックス数 / セッション / ad_script_load**。CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。実数のみ記載・**TBD 禁止**（取得できない値は「取得不能: 理由」を明記）。
>
> **本レビューは前回 #006 から 14 日空いている**。2026-07-15〜07-23 の 9 日間はスケジュールタスク登録の消失により日次ループ・週次レビューとも未発火（本リポジトリ起因ではない・07-23 再登録済）。よって **#006→#007 の差分は 2 週間分**であり、この間の出荷は 07-13（柱2 タイムアウト緩和）・07-14（Track A JSON 公開）・07-24（プローブ拡大＝**未デプロイ**）の 3 件のみ。

---

## ✅ 0. 計測健全性（実装前ゲート）

**`npm run growth:review`: 成功（GA4・GSC・URL Inspection の3系統とも SA で fresh 取得）。**

- 認証: `docs/analytics/auth-status.json` = ga4 ok / gsc ok / gsc-coverage ok（`2026-07-26T08:00:27Z`・`blocked:false`）。SA 化（06-28）以降、無人ルーティンで失効なし。
- スナップショット: `docs/analytics/history/growth-2026-07-26T08-00-27-283Z.json`（28日窓 as of 2026-07-26）。

### 本番健全性（OAuth 非依存・実測 OK, 2026-07-26, PowerShell `Invoke-WebRequest`）

| 項目 | 実測 | 判定 |
|---|---|---|
| `GET /api/v1/health` | **200**（db ok / extractor ok / degraded=false / errorRatio 0 / queueWaitP95 0 / activeJobs 0） | 健全 |
| `GET /sitemap.xml` | **200**（358,027 bytes / `<loc>` **509** / `?locale=` **0** / `/trend/` **0** / `platform-status` **1**） | 健全（`/trend/`=0＝柱2 が産出ゼロのまま・§5 柱2） |
| `GET /platform-status` | **200**（49,561 bytes） | 稼働（ただし **6 PF のまま**＝07-24 の 9 PF 拡張が未デプロイ） |
| `GET /api/v1/platform-status` | **200**（2,768 bytes・JSON・overall=`limited`） | 稼働（`platforms` 6 / `alsoSupported` 5＝**旧構成**） |
| `GET /platform-status/badge` | **200**（873 bytes / SVG） | 健全 |
| `GET /trending` | **200**（44,916 bytes・`/trend/` リンク **0**） | 応答は健全・中身は空（柱2 産出ゼロ） |
| `POST /api/v1/extract/prepare`（X 経路の実地確認） | **403 `TURNSTILE_MISSING`** | 防御は設計通り。**＝無人からは X 抽出の実地確認が不可**（§5 柱1 参照） |

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-07-26（実測） | 2026-07-12（#006） | 2週間の差 | 参考 2026-07-24（日次） | 判定 |
|---|---:|---:|---:|---:|---|
| ad_script_load（北極星, 28d 合計） | **119** | 24 | **+95** | 85 | 増だが**獲得の指標として無効**（§1.1） |
| ad_script_load（7d） | **71** | 15 | +56 | — | 同上 |
| ad_script_load zone別/28d（10760541 / 10969428） | **61 / 58**（err 2/1・timeout 4/3・load 率 **91% / 94%**） | 12 / 12（err 0・timeout 0・100%） | +49 / +46 | — | 量は増・**成功率は 100%→91/94% へ低下**（要監視） |
| セッション/28d（GA4 summary） | **36** | 9 | +27 | 32 | 増だが **91% が Direct**（§1.1） |
| アクティブユーザー/28d | **36** | 9 | +27 | 32 | 同上 |
| エンゲージメント率/28d | **72.2%** | 記録なし | — | — | 参考値 |
| **Google オーガニック セッション/28d** | **0** | 実測せず | — | — | **新規計測。検索流入は実質ゼロ** |
| GSC impressions/28d | **5** | 4 | **+1** | 5 | **微増（＝撤退カウンタはリセット維持）** |
| GSC clicks/28d | **0** | 1 | −1 | 0 | 母数ゼロ域 |
| GSC 平均順位（en） | **37.0** | 54.3 | 改善 | 37.0 | **母数 5 では統計的に無意味**（成果と読まない） |
| GSC indexed（URL Inspection サンプル100） | **36 / 100** | 33 / 100 | **+3** | 34 / 100 | 改善継続（下限値） |
| 「Google 未発見」URL（サンプル100） | **63 / 100** | 66 / 100 | **−3** | 65 / 100 | 改善継続（72→68→66→65→**63**）だが**鈍化傾向は継続** |
| Crawled - not indexed（サンプル100） | 1 | 1 | ±0 | 1 | — |
| canonical mismatch / blocked | 0 / 0 | 0 / 0 | ±0 | — | 健全 |
| sitemap URL 数 | **501**（`<loc>`509） | 501（509） | ±0 | 501 | **2週間 新規 URL ゼロ**（stub 量産停止方針の帰結＝想定内） |

### 1.1 【最重要・新規発見】北極星の急増は「検索流入の改善」ではない

07-24 の日次ログが「`ad_script_load` 85 / セッション 32 は impressions 5 と整合しない＝検索流入起因ではない。次回 review で流入元内訳を確認する」と積み残した宿題を、本レビューで**実測して確定させた**。

GA4 acquisition（28d, `sessionDefaultChannelGroup` × `sessionSourceMedium`）:

| channelGroup | sourceMedium | sessions | engagedSessions |
|---|---|---:|---:|
| **Direct** | (direct) / (none) | **60** | 30 |
| Organic Search | yandex / organic | 2 | 0 |
| Organic Search | terra.com / referral | 1 | 0 |
| Organic Search | yandex.com.tr / referral | 1 | 0 |
| Referral | compfight.com / referral | 1 | 0 |
| Unassigned | (not set) | 1 | 0 |

- **Google からのオーガニック セッションは 0 件**。検索経由は yandex 系の 4 件のみ。
- **91%（60/66）が Direct**＝リンク元も検索も持たない流入。ファネルは全段 **0**（Form Interest 0 / Extract Submit 0 / Download 0 / share 0）。
- 計測上の注意（正直な記載）: この acquisition 行の合計は **66** で、無ディメンションの summary セッション **36** と一致しない（`topPages` でも `/` 単独で 43 セッション）。GA4 はディメンションを付けるとセッションが重複計上されうるため、**チャネル構成比（約9割 Direct）は方向性として読み、絶対値は summary の 36 を正とする**。どちらの数字も実測であり、推定値は用いていない。
- **結論**: **北極星 `ad_script_load` は現在「獲得の進捗」を測っていない**。119 件のタグロードは、検索から来ていない Direct トラフィック（ボット/クローラ/広告ネットワーク由来の可能性が高い）にほぼ全面的に依存している。**「北極星が 24→119 に伸びた＝戦略が効いた」と読むのは誤り**であり、Phase L における実質の先行指標は依然として **GSC impressions（5）と「未発見」比率（63/100）**である。§7 提案1 に計測上の是正を記載する。

---

## 2. SEO シグナル（GSC, 28日）

- locale 別サマリ: **en のみ**（clicks **0** / impressions **5** / CTR 0.0% / pos **37.0** / query 5件 / page 2件）。ja/pt/ar/id/hi/tr は **impression 0**（クエリ行なし）＝#006 と同じ構図が 2 週間継続。
- **インデックスカバレッジ（URL Inspection API, sitemap 501 URL から 100 サンプル）**:
  - Submitted and indexed: **36**（#006 の 33 から +3）
  - URL is unknown to Google: **63**（#006 の 66 から −3）
  - Crawled - currently not indexed: **1**
  - canonical mismatch: 0 / errors: 0
- **結論**: 発見（未発見比率）は **72→68→66→65→63** と単調改善を続けているが、**週あたりの改善幅は −6 → −2 → −1 → −2 と明確に減衰**している。一方 impressions は 4→5、clicks は 1→0 で**獲得は 2 週間ほぼ不変**。#006 で立てた「律速は発見から順位化＝権威へ移った」という読みは、**2 週間の追加データでも覆らず追認された**。かつ本レビューでは新たに「**Google オーガニック流入 0**」が確定したため、**権威不足という診断はより強く裏付けられた**。

---

## 3. ファネル / グロースループ（28日, 凍結中）

Phase L につき凍結（CVR/ファネル微調整は選択不可）。参考実測のみ: Form Interest 0 / Intent-to-Clip 0 / Success 0、share 0 / discovery 0 / related 0、viral factor 0.00。セッションは 36 に増えたが**ファネル進入は全段ゼロ**＝§1.1 の「Direct 流入は実ユーザーでない可能性が高い」を補強する。Phase G（indexed≥50 かつ impressions≥1,000）到達まで着手しない。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0、本番 6 エンドポイント全て 200 実測）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0（**アプリ配信本体は健全**）
- **柱1' status 資産が示す上流の異常（本番実測 2026-07-26）**:

  | platform | status | http | uptime |
  |---|---|---:|---:|
  | **twitter** | **limited** | **401** | **0%** |
  | telegram | operational | 200 | 95% |
  | reddit | operational | 403 | 100% |
  | threads | operational | 302 | 100% |
  | bluesky | operational | 200 | **93%**（前回 100%） |
  | tiktok | operational | 403 | 100% |

  - **twitter 401 / uptime 0% は 07-10 の計測開始から約 16 日間 継続**（#006 時点で既に 0%・07-24 に発見・**本日も未解消**）。主力プラットフォームである X の上流（`api.fxtwitter.com`）が Cloudflare Workers の egress を弾いている疑いは変わらない。
  - **本日、本番の抽出経路を無人で実地確認しようとしたが `POST /api/v1/extract/prepare` は `403 TURNSTILE_MISSING` を返す**（＝Turnstile 保護は設計通り機能）。CAPTCHA 系チャレンジの回避は行わないため、**「実ユーザーの X ダウンロードが実際に壊れているか」は本レビューでは判定不能**。判定には (a) 診断コードをデプロイして Worker から `d.fxtwitter.com` / `vxtwitter.com` フォールバックの生死を測る、(b) ユーザーがブラウザで 1 回試す、のいずれかが要る。**(a) はデプロイ経路が塞がっているため実行できない**（下記）。
- **【最大の運用障害】デプロイ経路が 12 日間 断絶している**: `npx wrangler whoami` → **`Not logged in.`**（本日 08:02 実測）。07-14 を最後に OAuth が失効し、以降 `npm run deploy:prod` が実行不能。結果として:
  - 07-24 に実装・push 済みの `3bd3cb6`（Track A プローブ 6→9 PF）が**本番未反映**（本日の `/api/v1/platform-status` が 6 PF であることで確認）。
  - 最優先課題（fxTwitter 401）の**診断も是正も出荷できない**。
  - 日次ループの Definition of Done（AGENTS.md 手順3〜5）が**構造的に達成不能**な状態。
  - **これは本レビュー期間における唯一かつ最大のボトルネックである**（コード品質・戦略の問題ではない）。復旧はユーザーの 1 回操作のみ（§8 優先0）。

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

| 柱 | 直近の打ち手（07-13〜07-26 出荷物） | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | **新規出荷なし**（templated stub 量産は 07-10 以降 停止のまま。sitemap 501 で 2 週間不変） | 未発見 **66→63/100**・indexed **33→36/100**（既存在庫の発見が進行）。impressions 4→5・**Google オーガニック 0** | **発見は改善継続だが鈍化（−6→−2→−1→−2）。順位化・流入化はしていない**＝#006 の読みを 2 週間分のデータで追認 | ①発見%の週次記録を継続 ②**新規 templated 量産はしない**（方針不変）③**最優先は主力 X の抽出健全性**（柱1/修復＝下記 §8 優先1）。獲得ページを増やす前に「来た人が使える」を保つ |
| 柱1' linkable asset（主軸） | 07-14 公開 JSON `/api/v1/platform-status`＋`Dataset` 機械可読性強化（`1288df0`, ver `1d946b55`）／07-24 プローブ 6→9 PF 実装・push（`3bd3cb6`）**＝未デプロイ** | 資産は稼働（page/JSON/badge 全 200）。**ただし 12 日間 更新が本番へ届いていない**。資産自身が twitter 0%（16日）を出し続けている | **資産の"稼働"は維持、"成長"は停止**。律速は資産の設計でなく**デプロイ経路の断絶** | ①**デプロイ復旧後ただちに `3bd3cb6` を出荷して 9 PF 化**（コードは main 済・再実装不要）②その後 A-v2（`extractor_jobs` per-PF 成功率の併記）・OG 画像 |
| 柱2 トレンド鮮度 | 07-13 起動タイムアウト 30s→60s 緩和（`3ecf807`, ver `34b713c7`）＝**デプロイ済み**（OAuth 失効前に出荷できた最後の変更） | **緩和が本番で 13 日間 稼働した結果、産出は依然ゼロ**＝`/trend/` が sitemap **0 件**・`/trending` ページ内の `/trend/` リンク **0 件**。※KV heartbeat（`meta:last_run`）の直読みは **wrangler 未ログインのため取得不能** | **60s 緩和は失敗と判定してよい**（13日・約52回の cron 窓で 1 件も産出せず）。07-13 に観測された **429 Rate limit** 側が支配的という読みが最も整合的 | **柱2 は「有料 Browser Rendering への切替（＝危害ゲート①金銭・要ユーザー承認）」か「凍結」の二択に到達**。**本レビューの推奨は"凍結"**（§7 提案2）。無償の追加デバッグ余地は尽きた |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4' 外部流入・権威 | **新規出荷なし**（07-12 の outreach 下書き／AlternativeTo 7/17 登録はユーザー手動分・実施有無は未確認） | 参照ドメイン: **自動取得不能と確定**（GSC API に links エンドポイント非提供）。代理指標（badge の外部 Referer 集計）は**未実装**。GA4 referral は `compfight.com` 1 件のみ＝**実質的な被リンク獲得は観測されず** | **効果は未観測。かつ効果を測る計器が無い**状態が 2 週間続いた | ①**代理指標の実装を優先度を上げて実行**（badge Referer の KV 集計＝§8 優先3）②AlternativeTo 登録が未実施なら本週の下書き（`docs/ops/outreach/2026-07-26.md`）で再提示 |

**律速の結論**: 戦略的な律速は #006 から不変で「**index されたページの順位化＝ドメイン権威/被リンク**」。今週それに**「Google オーガニック流入 0」という直接証拠**が加わり、診断は強化された。しかし**実務上の律速は戦略ではなく「デプロイ経路の断絶（12日）」に移っている**。この状態では柱1'（資産の成長）・柱1（X 抽出の修復）・柱4'（代理指標の実装）のいずれも本番に届かない。**まずここを開けることが、どの柱の議論よりも優先する。**

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 今週の GSC impressions(28d) = **5**（前回 週次実測 #006 = 4）。**+1＝微増＝成長**に該当。
- 実測ベースのカウント履歴: #002（06-15, 17→15 減＝非成長, 連続1）→ #003（06-24, 測定不能＝非加算）→ #004（06-29, 15→3 減＝非成長, 連続2）→ #005（07-05, 3→4 増＝成長, リセット=0）→ #006（07-12, 4→4 横ばい＝非成長, 連続=1）→ **#007（07-26, 4→5 増＝成長, リセット=0）**。
- **判定: 撤退基準 非該当（連続非成長=0）。**
- **重要な留保（自己批判）**: impressions 5 は移行前の 15 に遠く、+1 は**母数 5 の統計的ノイズ域**であって「成長」と呼べる実体はない。撤退カウンタが機械的にリセットされることを**改善の証拠と読んではならない**。加えて本週は §1.1 で「北極星の急増が検索と無関係」と確定したため、**表面的な KPI（ad_script_load 119・セッション 36）はむしろ判断を誤らせる方向に働く**。次回 #008 の判定では **impressions・未発見%・Google オーガニックセッション数の 3 点のみ**を根拠にすること。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **【新規・計測の是正】北極星を「資格化」し、獲得判定から `ad_script_load` の生値を外す**: §1.1 の実測で、`ad_script_load`（119）とセッション（36）の増加は **Google オーガニック 0 / Direct 91%** の流入に由来し、**獲得の進捗を一切表していない**ことが確定した。北極星（Monetag タグロード数/日）は収益の定義としては維持しつつ、**Phase L の判定指標からは除外**し、代わりに **「Google オーガニック セッション/28d」を KPI 履歴に追加**して毎週記録する（本レビューから開始・今週は **0**）。charter 本文の北極星定義は変更しない＝**運用上の解釈の明確化**にとどめる（KPI 履歴表への列追加は次回以降の提案）。
2. **【判断を要求・柱2】60s 緩和は失敗。柱2 は「有料化」か「凍結」の二択で、推奨は凍結**: 07-13 に出荷した起動タイムアウト 60s 緩和は**本番で 13 日間・約52 cron 窓 稼働して産出ゼロ**（`/trend/` が sitemap 0 件）。#006 で予告した分岐条件（「それでも起動できないなら無料枠 Browser Rendering は cron から安定稼働しない」）に**到達した**。選択肢は (a) **Cloudflare Browser Rendering の有料切替＝危害ゲート①（金銭）＝要ユーザー承認**、(b) **柱2 を明示的に凍結し、その分の日次枠を柱1'（資産）・柱1（X 修復）へ回す**。**推奨は (b) 凍結**: 理由＝現在は検索流入が実質ゼロで、トレンドページを産出できたとしても受け皿の権威が無く順位化しない（#006・#007 で追認済の律速）。**課金は「権威が付き、かつ柱2 の産出が順位化しうる段階」まで待つのが合理的**。ユーザーが (a) を選ぶ場合のみ承認を要する。
3. **【継続・強化】柱4' の効果測定を自前化しないと、主軸の成否が永久に判定できない**: 参照ドメイン数は GSC API に links エンドポイントが無く**自動取得不能と確定済**（07-24）。この穴を埋めない限り、07-10 に転換した主軸（A+B＝linkable asset＋ホワイトハット権威）の効果を**測る計器が無いまま走り続ける**ことになる。よって **badge（`/platform-status/badge`）の外部 Referer ホストを Worker 側で KV 集計する代理指標**の実装を、バックログ上位（§8 優先3）へ据える。D1 スキーマ非依存・無課金・可逆＝自律実装可。
4. **【プロセス】デプロイ経路の単一障害点を可視化する**: 今回の 12 日間の停止は「wrangler OAuth がループ実行によってのみリフレッシュされ、ループが止まると失効する」という循環依存が原因。**日次ループの健全性チェックに `npx wrangler whoami` を追加**し、失効を発見した日に即座にユーザーへ提示する（＝12日気付かない事態を防ぐ）。実装は日次ループ手順の更新のみ＝自律範囲。

> いずれも growth-strategy.md 本文は未変更（KPI 履歴行の追記のみ）。決定事項7・8（危害以外は自律確定可）に基づき提案1・3・4 は自律実行しうる。**提案2 の (a) 有料切替のみ 危害ゲート①＝ユーザー承認が必要**であり、承認が無い場合は (b) 凍結を既定として進める。

---

## 8. 翌週アクション（task.md 戦略バックログへ反映済み）

`task.md` の戦略バックログを並べ替え・補充し、翌週の日次ループが消費できる具体的タスクを **9件** 維持（≥7 要件クリア）。先頭は本レビューの結論「**デプロイ経路の復旧が全てに優先**」「**主力 X の抽出健全性**」「**柱4' の計器を自前で持つ**」を反映。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| **0** | **【ユーザー1回操作・全タスクの前提】`npx wrangler login`（または `CLOUDFLARE_API_TOKEN` 設定）でデプロイ経路を復旧** → 直後に `npm run deploy:prod && npm run check:release:prod` で **`3bd3cb6`（Track A 6→9 PF）を出荷して閉じる** | 運用/blocker | `wrangler whoami` が認証済／`/api/v1/platform-status` の platforms が 6→**9**・`alsoSupported` 2件 |
| 1 | **柱1/修復: fxTwitter 401 の切り分けと X 抽出経路の是正**（本番 twitter **uptime 0%・401 が約16日継続**。ローカル residential IP は 200＝Workers egress が弾かれている疑い。`src/lib/extract/twitter.ts:187`。`d.fxtwitter.com` / `vxtwitter.com` フォールバックの生死は**未確認**＝無人では Turnstile で実地確認不可のため、**Worker 側の診断ログ or 一時診断エンドポイントで測る**。優先0 の復旧が前提） | 柱1/修復 | 本番 Worker から X 抽出が成功する経路を1つ確定・status の twitter が operational へ |
| 2 | **柱1' Track A: A-v2 = `extractor_jobs` の per-PF 成功率を status 資産へ併記**（合成プローブ（上流の到達性）と**実ジョブの成功率**は別物＝実データの併記は被引用性を明確に上げる。優先1 の結果とも接続する） | 柱1'/資産 | status page/JSON に per-PF 実成功率が出る・本番200 |
| 3 | **柱4' 測定: badge の外部 Referer 集計＝被リンク代理指標の自前化**（`/platform-status/badge` の Referer ホストを Worker 側で KV 集計。GSC links API 不在の穴を埋める＝**主軸 A+B の唯一の計器**。D1 スキーマ非依存） | 柱4'/測定 | 外部 Referer ホスト数を週次で取得できる状態・本番200 |
| 4 | **計測: 日次ループの健全性チェックに `npx wrangler whoami` と `/api/v1/platform-status` の per-PF uptime を追加**（今回の 12日 停止・16日 twitter 異常放置の再発防止＝§7 提案4。手順文書の更新のみ） | 運用/計測 | 日次ログのテンプレに 2 項目が入り、失効・異常をその日に検知できる |
| 5 | **柱2: 明示的に凍結する（§7 提案2 (b)）**（60s 緩和が 13日・約52窓で産出ゼロ＝無償の打ち手は尽きた。**ユーザーが有料 Browser Rendering を承認する場合のみ (a) へ分岐**＝危害ゲート①。凍結時は cron を止めず（無害・無課金）、日次枠だけ他柱へ回す） | 柱2/判断 | 凍結を task.md に明記し、柱2 起因のタスクをバックログから外す（または承認を得て有料化） |
| 6 | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・発見の残掃除） | 柱1/発見 | 残る solution help リンクの path 形式化・本番200 |
| 7 | 柱1: 新パス ja/pt/ar の indexed/impression 推移を週次記録し、Schema/canonical/内部リンクの効果を帰属・横展開判断 | 柱1/測定 | indexed/impression 推移を週次記録・効いた施策を特定 |
| 8 | **柱4' B-2（ユーザー一度きり・任意）: AlternativeTo 登録**（7/17 の予定分が未実施なら実施。文面は `docs/ops/outreach/2026-07-26.md`／authority-plan.md B-2。※Show HN/awesome は不適合で見送り＝07-10 実地） | 柱4'/権威 | 登録1回・被リンク発生（ユーザー実行分） |
| 9 | 健全性: HC-8「`src/lib/extract/` にユニットテスト導入」（純関数から Vitest。**現在の最優先障害＝X 抽出のレイヤーが テスト0本**。production 非改変・規模小） | 健全性/品質 | extract 層の純関数にテストが入り green |

> **落としたもの（明示）**: #006 バックログ #5「発見%＋参照ドメイン数の週次判定」は、参照ドメインの自動取得が不能と確定したため**優先3（代理指標の実装）へ統合**し、発見%の記録は週次レビュー定常業務へ吸収した。HC-5（yaml moderate）は**ユーザーの承認マーカーが未付与のため今週も据え置き**、HC-6（`next` 15.2→15.5 security minor）は規模中＝層B+ 対象外で、優先0 の復旧後に専用日次タスクとして扱う（本番 `_next/image` が 404＝実露出は低い見込み）。

---

## 9. 柱4' outreach（ホワイトハット限定）

- 本週分の下書き: **`docs/ops/outreach/2026-07-26.md`**（AlternativeTo 登録文面／Reddit・Quora 既存質問への正当回答／バッジ埋め込みピッチ）。**投稿はユーザー手動・自動投稿は禁止**。
- 正本: `docs/strategy/authority-plan.md`。§6 ガードレール（スパム的大量登録・PBN・有料リンク）不変。有料PRは危害ゲート①＝要承認。
- **正直な但し書き**: 本週の下書きは 07-12 版から**実質的に変わっていない**（AlternativeTo 登録が未実施のため再掲）。柱4' は 2 週間 前進しておらず、**下書きを毎週作り直すこと自体には価値がない**。柱4' を実際に動かすのは (a) ユーザーの一度きり登録、(b) 資産主導の自然リンク、(c) **効果を測る代理指標（優先3）** の 3 点であり、(c) が無い限り (a)(b) の成否も判定できない。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分=実測行を追記）
- `docs/strategy/linkable-asset-plan.md`（柱1' Track A 設計）／`docs/strategy/authority-plan.md`（柱4' Track B・outreach 正本）
- 前回: `docs/ops/weekly_review_2026-07-12.md`（#006・14日前）
- 中間実測: `docs/ops/daily/2026-07-24.md`（復帰初回・fxTwitter 401 発見・デプロイ blocked）／`docs/ops/health/2026-07-25.md`（週次健全性・HC-6/7/8 新規）
- スナップショット: `docs/analytics/history/growth-2026-07-26T08-00-27-283Z.json`（2026-07-26 as-of・実測）
- 認証: `docs/analytics/auth-status.json`（SA・fresh・`blocked:false`）／`docs/ops/analytics-auth-recovery.md`（SA 化ランブック）
- 柱2: `/trending` 本番 200・`/trend/` リンク 0 件／sitemap `/trend/` 0 件（**KV heartbeat は wrangler 未ログインのため取得不能**）
- 柱1' uptime: 本番 `/api/v1/platform-status`（twitter 0%/401・telegram 95%・reddit 100%・threads 100%・bluesky 93%・tiktok 100%）
</content>
</invoke>

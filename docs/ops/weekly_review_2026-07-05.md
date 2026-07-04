# Weekly Review Record #005 — ClipKeep Growth

日付: 2026-07-05（日／週次スロット）
対象期間: 直近28日（GA4/GSC as of 2026-07-05, snapshot 2026-07-04T20:40Z）
比較対象: 前回 週次レビュー #004（2026-06-29, 6日前・実測）
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中。先行指標は **GSC impressions / URL Inspection「Google 未発見」比率 / インデックス数 / セッション / ad_script_load**。CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。実数のみ記載・**TBD 禁止**（取得できない値は「取得不能: 理由」を明記）。
>
> **柱4（外部流入・outreach）は 2026-07-03 ユーザー判断で廃止**。よって本レビューでは playbook の「柱4 outreach 下書き生成」ステップ（旧・週次手順7）を**実施しない**（`docs/strategy/growth-strategy.md` 決定事項5＝純自然流入・柱4 アーカイブに従う）。獲得は柱1＋柱2に集約。

---

## ✅ 0. 計測健全性（実装前ゲート）

**`npm run growth:review`: 成功（GA4・GSC・URL Inspection の3系統とも SA で fresh 取得）。**

- `docs/analytics/auth-status.json` = **`blocked:false`**（ga4 / gsc / gsc-coverage すべて ok、generatedAt 2026-07-04T20:40Z）。SA 化（06-28）以降、無人ルーティンで失効なし。
- スナップショット: `docs/analytics/history/growth-2026-07-04T20-40-41-537Z.json`（28日窓 as of 2026-07-05）。

### 本番健全性（OAuth 非依存・実測 OK, 2026-07-05）

| 項目 | 実測 | 判定 |
|---|---|---|
| `GET /api/v1/health` | **200**（db ok / extractor ok / degraded=false / errorRatio 0 / queueWaitP95 0 / activeJobs 0） | 健全 |
| `GET /sitemap.xml` | **200**（357,865 bytes / `<loc>` **508** / `?locale=` **0** / `/trend/` **0**） | 健全（`/trend/`=0 は品質ゲートが gate-passing トピック不在を正しく withhold＝正常） |
| `GET /trending` | **200**（45,082 bytes） | 健全 |
| `GET /trend/t-nonexistent-xyz`（未存在 slug） | **404** | 正常（KV read 経路ライブ） |

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-07-05（実測） | 2026-06-29（前回 #004） | WoW | 判定 |
|---|---:|---:|---:|---|
| ad_script_load（北極星, 合計/28d） | **13** | 12 | **+1** | 微増（母数小＝ノイズ域） |
| ad_script_load（北極星, 7d） | 3 | 2 | +1 | — |
| ad_script_load zone別/28d（10760541 / 10969428） | **5 / 4**（load 率 100% / err 0 / timeout 0） | 3 / 3 | +2 / +1 | zone別計測が蓄積継続・広告ロードは健全（失敗 0） |
| セッション/28d（GA4 summary） | **3** | 1 | **+2** | 微増（ノイズ域） |
| アクティブユーザー/28d | **3** | 1 | **+2** | 微増（ノイズ域） |
| GSC impressions/28d | **4** | 3 | **+1** | **微増（＝撤退カウンタの連続を切る／ただしノイズ域, §6）** |
| GSC clicks/28d | **1** | 1 | ±0 | en, pos 33.5, CTR 25.0%（前回 pos 23.3→33.5 で順位はやや後退・母数1） |
| GSC indexed（URL Inspection サンプル100） | **27 / 100**（lower bound） | 27 / 100 | ±0 | サンプル下限。GSC UI 正本は別途（06-16 時点 172） |
| 「Google 未発見」URL（サンプル100） | **72 / 100** | 72 / 100 | **±0** | **発見が依然律速。06-28/29 の内部リンク path 形式統一の効果がサンプル上まだ出ていない（§2/§5）** |
| Crawled - not indexed（サンプル100） | 1 | 1 | ±0 | — |

> **重要な解釈**: セッション/北極星/クリックは母数 1〜3 で**統計的ノイズ域**（実ユーザーほぼ不在）。意味のある先行指標は **GSC impressions と URL Inspection「Google 未発見」比率**。今週は impressions が 3→4 と**微増**（撤退カウンタの連続非成長を機械的に切る＝§6）だが、移行前の 15 には遠く、依然ノイズ域。**最も注視すべきは「未発見」比率が 72/100 のまま横ばい**である点＝06-28/29 に出荷した発見の根本対策（内部リンク path 形式統一, ver `bd876607`/`eb7e1c02`/`054cf49e`/`7c6cc36b`）が **~1週間経過してもサンプル上まだ効いていない**（効果 lag は数日〜2週間＝まだ窓の内側だが、来週も 72% 横ばいなら「内部リンクだけでは新パスが発見されない」と結論づける必要がある＝§7 提案）。

---

## 2. SEO シグナル（GSC, 28日）

- locale 別サマリ: **en のみ**（clicks 1 / impressions 4 / CTR 25.0% / pos 33.5 / query行あり）。ja/pt/ar は **impression 0**（クエリ行なし）＝#004 と同じ構図。
- **インデックスカバレッジ（URL Inspection API, sitemap 500 URL から 100 サンプル）**:
  - Submitted and indexed: **27**（#004 と同数）
  - URL is unknown to Google: **72**（#004 と同数＝**発見の律速が1週間で改善していない**）
  - Crawled - currently not indexed: **1**
  - canonical mismatch: 0 / blocked: 0
- **結論**: 律速は依然「新パス URL（ja/pt/ar 含む）の発見→インデックス昇格」。06-28〜06-29 に内部リンクの `?locale=`→path 形式統一（ホーム grid／side-menu／solution 本文／footer／guides grid）を出し切ったが、**URL Inspection サンプルの「未発見」72/100 は横ばい**。効果 lag（数日〜2週間）の窓内ではあるが、**発見改善の兆候はまだ観測できない**。来週 #006 が発見対策の効果を判定する決定的な週になる。

---

## 3. ファネル / グロースループ（28日, 凍結中）

Phase L につき凍結（CVR/ファネル微調整は選択不可）。参考実測のみ: form interest 1 / intent-to-clip 2 / success 1（50%）、share 0 / discovery 0 / related 0、viral factor 0.00。いずれも母数 1〜3 でノイズ域。Phase G（indexed≥50 かつ impressions≥1,000）到達まで着手しない。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0、本番 200 実測）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0（**アプリ本体は健全**）
- extractor: ok（fixer 経由 TikTok extractor 含め稼働。degraded 観測なし）
- 影響ページ: なし
- **柱2 cron（trending 収集）だけは別系統で不全継続**（§5 柱2 参照）。アプリ配信・広告・抽出には影響しない。

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

| 柱 | 直近の打ち手（06-29〜07-04 出荷物） | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | 06-29 残る内部リンク欠落の解消（side-menu telegram 追加・solution 本文/footer/guides の path 形式化, ver `054cf49e`/`7c6cc36b`）／07-02 id/hi/tr キーワードマップ（`docs/strategy/keyword-map-id-hi-tr.md`, docs-only） | URL Inspection「未発見」**72/100 横ばい**（#004 と同数）＝発見の根本対策がサンプル上まだ未反映。impressions 3→4 微増・indexed 27/100 横ばい | **出荷完了・効果は依然 lag 窓内（未確認）**。この1週間は「新規施策」より「発見デバッグ＋文書」に時間を使い、**発見の実効改善は測れていない** | ①来週 #006 で「未発見%」を判定（横ばいなら §7 提案＝crawl budget 集中/sitemap 剪定を検討）②keyword-map 制作順 1–7 の本文充足に着手し**indexable な高品質サーフェスを増やす**（発見された時に順位化できる在庫を作る） |
| 柱2 トレンド鮮度 | 07-01 実 puppeteer エラー計装（ver `d50ebcfc`）／**07-03 429 是正=cron 毎時→6h・`puppeteer.limits()` 計装・取得予算0で graceful skip**（ver `a51db595`, `wrangler.production.toml` `0 */6 * * *`） | 本番 KV heartbeat（`meta:last_run`, 直近 cron `2026-07-04T18:03Z`）: `browserLaunched:false` / `topicsWritten:0` は継続。**ただしエラーが 429 から変化**: `allowedBrowserAcquisitions:1`・`timeUntilNextAcquisitionMs:0`（＝**取得予算は空いており graceful-skip 未発火**）にもかかわらず launch 失敗、`browserLaunchError` = **`Unable to connect to existing session … Browser.getVersion timed out`**（**セッション再利用の protocolTimeout。もはや 429 ではない**） | **配管完了・産出ゼロ継続だが律速が「429 クォータ」から「セッション再利用の protocolTimeout」へ移行**。6h 化で少なくとも直近窓は非429＝**「全窓429」は反証**（バックログ優先1 の分岐判定に回答） | 次の柱2 自律枠: **セッション再利用ロジックの是正**（`puppeteer.sessions()`+`connect` が stale/未 ready なセッション id へ connect して `Browser.getVersion` が timeout。①`protocolTimeout` 引き上げ ②connect 失敗時に既存セッションを捨てて `puppeteer.launch` フォールバック ③接続前の session 生存確認）。無料枠・非課金の範囲で自律実装可 |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4 外部流入 | **廃止（2026-07-03）** | — | 廃止（アーカイブ・新規 outreach 生成なし） | 対象外 |

**律速の結論**: 依然 **「新パス URL の発見/インデックス遅延」**（URL Inspection「未発見」72/100 が1週間横ばい）。06-28/29 の内部リンク path 形式統一は出し切ったが、効果はサンプル上まだ観測できない（lag 窓内）。**来週 #006 が発見対策の成否を判定する決定的な週**。並行する柱2 は、6h cron 化で 429 は解消方向（直近窓は非429）だが、**セッション再利用の protocolTimeout** という別の失敗へ移行し産出ゼロが継続＝次の柱2 デバッグ対象が明確化した。

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 今週の GSC impressions(28d) = **4**（前回実測 3 から**微増**）。**機械的判定＝「成長した週」**（4 > 3）。よって**実測ベースの連続非成長カウントはリセット（=0）**。
- 実測ベースのカウント履歴: #002（06-15, 17→15 減＝非成長, 連続1）→ #003（06-24, 測定不能＝非加算）→ #004（06-29, 15→3 減＝非成長, 連続2）→ **#005（07-05, 3→4 増＝成長, 連続リセット=0）**。
- **判定: 撤退基準 非該当（連続非成長=0・8週母数にも未到達）。**
- **ただし重要な留保（自己批判）**: 3→4 の +1 は**ノイズ域の微増**であり、移行前の 15 には遠く、かつ **URL Inspection「未発見」比率は 72/100 で横ばい＝発見は実質改善していない**。撤退カウンタは機械的にリセットされるが、**「発見が改善していない」という本質は #004 から変わっていない**。次回 #006 で impressions が再び減少し「未発見」も 72% 横ばいのままなら、撤退カウンタの再加算と併せて **§7 の戦略変更（crawl budget 集中）を本格検討**する。撤退カウンタのリセットを「回復」と誤読しないこと。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **【最重要・条件付き提案】発見律速に対する「crawl budget 集中／sitemap 剪定」**: sitemap 508 URL のうち URL Inspection サンプルの **72% が「Google 未発見」**の状態が **#004→#005 の1週間、内部リンク path 形式統一を出し切った後も横ばい**。ゼロ権威ドメイン（セッション 3/28d・被リンク方針は柱4 廃止で純内部シグナルのみ）では、**500 URL 全部を内部リンクだけで発見させるのは Google のクロールバジェット上そもそも困難**な可能性が高まっている。提案（**来週 #006 で「未発見」がなお 72% 横ばいなら実行を検討**）: sitemap を「最も順位化見込みの高い高意図コア（高意図 not-working クラスタ ja/pt/ar の充足済みページ群）」に**意図的に絞り込み**、低意図・低品質 URL（旧 `?locale=` 由来の残骸・薄い派生ページ）を sitemap から外してクロールバジェットを集中させる。※これは §6 ガードレールの「薄ページ量産の逆」＝**削る**方向であり抵触しない。charter 改訂は不要（sitemap 生成ロジックの調整＝柱1 実装）。**判断材料が1週分不足**のため今回は提案に留め、#006 の「未発見%」で発火可否を決める。
2. **【新規・柱2】429 の次の律速＝セッション再利用の protocolTimeout**: 6h cron 化（07-03）で 429 は直近窓で解消（`allowedBrowserAcquisitions:1`）したが、`Unable to connect to existing session … Browser.getVersion timed out` へ失敗が移行。**バックログ優先1 の「全窓429か」への回答＝NO（少なくとも 07-04 18:00Z 窓は非429）**。次の柱2 自律デバッグは**セッション再利用ロジックの是正**（protocolTimeout 引き上げ／connect 失敗時の launch フォールバック／session 生存確認）。無課金・自律範囲で実装可（危害①金銭に非該当）。charter 改訂不要。
3. **【継続】発見の先行指標化**: #004 提案3 を継続運用。北極星（ad_script_load）とセッションは母数 1〜3 でノイズ域＝Phase L では実質無情報。**「URL Inspection の『Google 未発見』比率」と「GSC impressions(28d)」を発見の主先行指標として毎週トラッキング**（今回も両者で判定）。KPI 履歴表への「未発見%」列追加は将来提案（今回は charter 本文を変えず週次文書で運用）。

> いずれも growth-strategy.md 本文は未変更（KPI 履歴行の追記のみ）。決定事項7（危害以外は自律確定可）に基づき提案1・2 は自律実装しうるが、**提案1 は判断材料が1週分不足**のため #006 の実測を待って発火判定する（拙速な sitemap 剪定は発見資産の毀損リスク＝慎重に）。

---

## 8. 翌週アクション（task.md 戦略バックログへ反映済み）

`task.md` の戦略バックログを並べ替え・補充し、翌週の日次ループが消費できる具体的タスクを **8件** 維持（≥7 要件クリア）。先頭は本レビューの結論「**柱2 セッション再利用 protocolTimeout の是正**」「**柱1 keyword-map 制作順の本文充足（indexable 在庫増）**」「**発見%の週次判定**」を反映。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| 1 | **柱2 セッション再利用 protocolTimeout の是正**（`puppeteer.sessions()`+`connect` が stale/未 ready session へ connect し `Browser.getVersion` timeout。①`protocolTimeout` 引き上げ ②connect 失敗時に既存セッション破棄→`puppeteer.launch` フォールバック ③接続前 session 生存確認。無課金・自律範囲） | 柱2/修復 | 次 cron 窓の heartbeat で `browserLaunched:true` or 別エラーへ前進（protocolTimeout 消失） |
| 2 | **柱1: id/hi/tr not-working 本文充足**（keyword-map 制作順 1–7, 1言語×1PF/日）← 次順 ①tr-twitter ②hi-telegram ③id-tiktok（既存 stub を ja/pt/ar 同等 s1/s2/s3 へ充足＝**発見された時に順位化できる indexable 在庫を増やす**） | 柱1/発見 | 対象 locale/PF ページ充足・本番200 |
| 3 | **柱1: 発見%の週次判定と横ばい時の分岐**（URL Inspection「未発見」比率を記録。#006 で 72% 横ばいなら §7 提案1＝crawl budget 集中/sitemap 剪定の設計に着手） | 柱1/測定・判断 | 未発見%を記録し横ばい/低下を判定・低下せずなら剪定設計を起票 |
| 4 | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・低クロール価値） | 柱1/発見 | 残る solution help リンクの path 形式化・本番200 |
| 5 | 柱1: 高意図 not-working クラスタの es/fr/de 等への横展開（ja/pt/ar 同等の s1-s3 充足） | 柱1 | 対象 locale ページ充足・本番200 |
| 6 | 柱1: 新パス ja/pt/ar の indexed/impression 推移を週次記録し、Schema/canonical/内部リンクの効果を帰属・横展開判断 | 柱1/測定 | indexed/impression 推移を週次記録・効いた施策を特定 |
| 7 | 柱2: cron が実トピック捕捉時の `/trend/[slug]` populated-render 本番検証（P0-1〜P0-4 積み残し検証。優先1 の browser 修復が前提） | 柱2/検証 | 実トピックで index/sitemap 収録・本番200 確認 |
| 8 | 健全性: HC-5 の yaml 2.0–2.8.2 moderate を非 `--force` の `npm audit fix` で semver 内修正（**要ユーザーの承認マーカー `（承認済み・消化可）`。未付与なら据え置き**） | 健全性 | 承認済みなら層B+ で1件消化・テスト green |

> #4〜#7 は Phase L で着手可（発見・配管検証であり CVR 凍結に抵触しない）。HC-4/HC-5 の major 更新（`--force` 相当）は要承認の大物のため日次ループ対象外に据え置き。

---

## 9. 柱4 outreach

**廃止（2026-07-03 ユーザー判断・growth-strategy.md 決定事項5）**。純自然流入方針に伴い、outreach 下書きの新規生成は行わない（`docs/ops/outreach/` はアーカイブ）。獲得は柱1＋柱2に集約。旧・週次手順7は本レビューから恒久的に外す。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分=実測行を追記）
- 前回: `docs/ops/weekly_review_2026-06-29.md`（#004・計測復旧後初の実測）
- スナップショット: `docs/analytics/history/growth-2026-07-04T20-40-41-537Z.json`（2026-07-05 as-of・実測）
- 認証: `docs/analytics/auth-status.json`（`blocked:false`, 2026-07-04T20:40Z）／`docs/ops/analytics-auth-recovery.md`（SA 化ランブック）
- 柱2 heartbeat: 本番 KV `TREND_KV`（ns `ab21329d…`）`meta:last_run`（直近 cron `2026-07-04T18:03Z`, `browserLaunched:false`／protocolTimeout）
- `docs/ops/daily/2026-06-29.md` 〜 `2026-07-04.md`（内部リンク path 統一／柱2 捕捉ゼロ調査／429 是正／keyword-map／週次 health-check）

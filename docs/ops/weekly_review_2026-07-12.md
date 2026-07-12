# Weekly Review Record #006 — ClipKeep Growth

日付: 2026-07-12（日／週次スロット）
対象期間: 直近28日（GA4/GSC as of 2026-07-12, snapshot `growth-2026-07-12T00-45-08-567Z.json`）
比較対象: 前回 週次レビュー #005（2026-07-05, 7日前・実測）
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中。先行指標は **GSC impressions / URL Inspection「Google 未発見」比率 / インデックス数 / セッション / ad_script_load**。CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。実数のみ記載・**TBD 禁止**（取得できない値は「取得不能: 理由」を明記）。
>
> **本レビューは 2026-07-10 の戦略転換（決定事項8＝ユーザー承認 A+B）後の初回週次**。柱1'（linkable asset）＋柱4'（ホワイトハット権威）を新設・再開済み。純オーガニック（2026-07-03）は部分見直し済み。柱4' outreach 下書きは authority-plan.md を正本に**ホワイトハット限定で再生成する**（手順7・投稿はユーザー手動）。

---

## ✅ 0. 計測健全性（実装前ゲート）

**`npm run growth:review`: 成功（GA4・GSC・URL Inspection の3系統とも SA で fresh 取得）。**

- 認証: `OK (analytics credentials valid as of last export)`。SA 化（06-28）以降、無人ルーティンで失効なし。
- スナップショット: `docs/analytics/history/growth-2026-07-12T00-45-08-567Z.json`（28日窓 as of 2026-07-12）。

### 本番健全性（OAuth 非依存・実測 OK, 2026-07-12, PowerShell `Invoke-WebRequest`）

| 項目 | 実測 | 判定 |
|---|---|---|
| `GET /api/v1/health` | **200**（db ok / extractor ok / degraded=false / errorRatio 0 / queueWaitP95 0 / activeJobs 0） | 健全 |
| `GET /sitemap.xml` | **200**（358,027 bytes / `<loc>` **509** / `?locale=` **0** / `/trend/` **0** / `/platform-status` **1**） | 健全（`/trend/`=0 は品質ゲートが gate-passing トピック不在を正しく withhold＝正常。`/platform-status` 収録＝Track A 資産がライブ） |
| `GET /platform-status` | **200**（46,502 bytes） | 健全（Track A 資産・6PF ライブ描画） |
| `GET /platform-status/badge` | **200**（873 bytes / SVG） | 健全（Track B-1 埋め込みバッジ稼働） |
| `GET /trending` | **200**（45,042 bytes） | 健全 |

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-07-12（実測） | 2026-07-05（前回 #005） | WoW | 判定 |
|---|---:|---:|---:|---|
| ad_script_load（北極星, 合計/28d） | **24** | 13 | **+11** | 増（ただし母数=セッション9でノイズ域） |
| ad_script_load（北極星, 7d） | **15** | 3 | +12 | — |
| ad_script_load zone別/28d（10760541 / 10969428） | **12 / 12**（load 率 100% / err 0 / timeout 0） | 5 / 4 | +7 / +8 | 広告ロードは健全（失敗 0）・zone別計測が蓄積継続 |
| セッション/28d（GA4 summary） | **9** | 3 | **+6** | 増（ノイズ域・実ユーザーはなお極小） |
| アクティブユーザー/28d | **9** | 3 | **+6** | 増（ノイズ域） |
| GSC impressions/28d | **4** | 4 | **±0** | **横ばい（＝撤退カウンタ再加算・§6）。移行前 15 には遠い** |
| GSC clicks/28d | **1** | 1 | ±0 | en, CTR 25.0%, **pos 54.3**（前回 33.5→54.3 で**順位悪化**・母数1） |
| GSC indexed（URL Inspection サンプル100） | **33 / 100**（lower bound） | 27 / 100 | **+6** | **改善（サンプル下限）。GSC UI 正本は別途（06-16 時点 172）** |
| 「Google 未発見」URL（サンプル100） | **66 / 100** | 72 / 100 | **−6** | **改善（72→68→66 と2週連続低下＝発見が動き始めた）** |
| Crawled - not indexed（サンプル100） | 1 | 1 | ±0 | — |
| sitemap URL 数 | **501**（`<loc>`509） | 500（508） | +1 | `/platform-status` 追加（Track A 資産） |

> **重要な解釈**: セッション/北極星/クリックは母数 1〜9 で**統計的ノイズ域**（実ユーザーほぼ不在）。意味のある先行指標は **GSC impressions と URL Inspection「Google 未発見」比率**。
> - **良い兆候（発見）**: 「未発見」が **72→68→66/100** と2週連続で低下し、indexed も **27→29→33/100** と上昇。#005 で「72/100 横ばい＝発見が実質改善していない」と指摘した状態が**反転**し、**発見/インデックス昇格が動き始めた**。これは 06-28/29 の内部リンク path 形式統一＋7/7〜7/10 の id/hi/tr 本文充足（tr-twitter/hi-telegram/id-tiktok）の効果 lag が出始めたものと解釈できる。
> - **悪い/未動（獲得・順位）**: 一方で **GSC impressions は 4 で横ばい**、平均順位は **33.5→54.3 と悪化**。つまり「**より多くのページが index されつつあるが、まだ順位化・impression 化していない**」。これは決定事項8 の権威ギャップ仮説と整合＝**index は内部シグナルで進むが、順位/impression には権威（被リンク）が要る**。A+B 資産（07-10 デプロイ）は被リンク発生には新しすぎ、効果は未観測。

---

## 2. SEO シグナル（GSC, 28日）

- locale 別サマリ: **en のみ**（clicks 1 / impressions 4 / CTR 25.0% / **pos 54.3**）。ja/pt/ar は **impression 0**（クエリ行なし）＝#005 と同じ構図。順位は #005 の 33.5 から 54.3 へ後退（母数1・単一クエリのため確率的変動域だが、順位化はできていない）。
- **インデックスカバレッジ（URL Inspection API, sitemap 501 URL から 100 サンプル）**:
  - Submitted and indexed: **33**（#005 の 27 から +6）
  - URL is unknown to Google: **66**（#005 の 72 から −6）
  - Crawled - currently not indexed: **1**
  - canonical mismatch: 0 / errors: 0
- **結論**: **発見の律速が緩み始めた**（未発見 72→66・indexed 27→33）。#005 で「来週 #006 が発見対策の成否を判定する決定的な週」と予告したとおり、**内部リンク path 統一＋多言語本文充足は発見側に効いた**と判定できる。ただし**発見≠順位化**であり、impression 横ばい・順位悪化が示すとおり、**次の律速は「index されたページの順位化＝権威」**へ明確に移った。これは 07-10 の A+B 転換の前提を実測で追認する形。

---

## 3. ファネル / グロースループ（28日, 凍結中）

Phase L につき凍結（CVR/ファネル微調整は選択不可）。参考実測のみ: Form Interest 0 / Intent-to-Clip 0 / Success 0、share 0 / discovery 0 / related 0、viral factor 0.00。いずれも母数 0〜9 でノイズ域（実ユーザー不在）。Phase G（indexed≥50 かつ impressions≥1,000）到達まで着手しない。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0、本番 200 実測）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0（**アプリ本体は健全**）
- extractor: ok（fixer 経由 TikTok extractor 含め稼働。degraded 観測なし）
- 影響ページ: なし
- **柱2 cron（trending 収集）だけは別系統で不全継続**（§5 柱2 参照）。アプリ配信・広告・抽出・**Track A status プローブには影響しない**（status-probe は HTTP-only の別経路で稼働＝§5 柱1' 参照）。

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

| 柱 | 直近の打ち手（07-06〜07-11 出荷物） | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | 07-07 tr-twitter（ver `f888a8b9`）／07-09 hi-telegram（`0a3d8066`, デーヴァナーガリー化）／07-10 id-tiktok（`805d757f`）を s1/s2/s3 リッチ本文へ充足。**07-10 で templated stub 量産は停止**（thin/doorway リスク・真因は権威）＝残 #4–#7 は着手しない | 未発見 **72→66/100**・indexed **27→33/100** と2週連続改善。impressions 4 横ばい・pos 33.5→54.3 悪化 | **発見に効いた（改善を確認）**。ただし順位化はしていない＝律速は権威へ移行 | ①発見%の週次記録を継続（改善トレンドの持続を確認）②新規の templated 量産はしない。既存 indexable 在庫は維持し、**順位化＝柱1'/柱4'（権威）に主軸を移す** |
| 柱1' linkable asset（**新設・主軸**） | 07-10 Track A-v0 公開 `/platform-status`（合成プローブ表, `bdc6b054`）／A-v1 定期プローブ＋uptime 履歴（`8850a6d8`）／カバレッジ拡大 Bluesky+TikTok 計6PF（`b574132e`） | 本番 200・6行ライブ・sitemap 収録・`Dataset` JSON-LD。**KV `platform-status:history` に実データ蓄積開始**＝07-10 12:00〜07-12 00:00 で **9サンプル**（twitter 0%=limited固定／telegram・reddit・threads・bluesky・tiktok 各 **100%** uptime） | **資産が実データで稼働開始＝被引用性の土台が完成**。uptime 履歴が貯まり「引用したくなるデータ」になりつつある。被リンク発生は未観測（資産が新しすぎ） | **被引用性の強化（本命・自律）**: uptime 履歴の充実（14日窓が埋まる）／「今週落ちていた PF」要約の公開ページ化／OG 画像・Dataset の機械可読性向上。柱4' と一体で追跡 |
| 柱2 トレンド鮮度 | 07-06 セッション再利用 protocolTimeout の是正（`launchBrowserWithRetry`＝各試行30sバウンド×3試行＋生存確認, ver `83afb184`） | 本番 KV heartbeat（`2026-07-12T00:02Z`）: **修正は設計通り機能**＝`launchAttempts:3`・`stageErrors:["browser_launch","browser_launch_retry_2","browser_launch_retry_3"]`・**180s ハング/`Browser.getVersion timed out` は消失**。ただし `browserLaunched:false` 継続で、失敗が **`browser_launch exceeded 30000ms`（3試行とも 30s 超過）** へ移行。`allowedBrowserAcquisitions:1`/`timeUntilNextAcquisitionMs:0`＝**取得予算は空き（非429）** | **protocolTimeout ハングは解消（前律速を除去）だが産出ゼロは継続。律速が再び移行**＝「起動が 30s 以内に完了しない」（非429・予算あり＝クォータ枯渇でもハングでもなく、**コールドローンチのレイテンシが 30s バウンドを超えている**可能性が高い） | 次の柱2 自律枠: **各試行の起動タイムアウトを 30s→60s へ引き上げる**（180s ハングは修正済み＝もはや fail-fast のための 30s は過剰に厳しい。予算は空いており 429 でもないため、コールドローンチに十分な時間を与える）。無課金・可逆・自律範囲（危害①非該当）。それでも `launch exceeded` が続くなら「無料枠 Browser Rendering が cron から安定起動しない」と結論づけ、**有料 Browser Rendering=危害①金銭=要ユーザー承認**の分岐（§7 提案2） |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4' 外部流入・権威（**再開・ホワイトハット限定**） | 07-10 Track B-1 埋め込みバッジ＋OG/Twitter カード＋`Dataset`（`bdc6b054`）／B-2 実地（冷たい登録は各サイトのアンチスパムで構造的に不可と判明） | バッジ本番 200（image/svg+xml）。被リンク/参照ドメインは **0 のまま**（GSC リンクレポート・資産が新しすぎ） | **link magnet は稼働開始・被リンク発生は未観測**。冷たい登録は不可＝**アセット主導の自然リンク獲得が本命**と実地確認済 | ①**アセット被引用性の強化（自律・本命）**＝柱1' と一体 ②B-2 ユーザー一度きり: **7/17 に AlternativeTo 登録1回**（本レビューの outreach 下書きに貼付文面。任意）③Reddit/Quora の既存質問への正当な回答1件（下書き提示・投稿はユーザー手動） |

**律速の結論**: **発見の律速は今週明確に緩んだ**（未発見 72→66・indexed 27→33＝2週連続改善）。これは 06-28/29 内部リンク統一＋多言語本文充足の効果 lag が出たもの。**次の律速は「index されたページの順位化＝ドメイン権威/被リンク」へ移行**した（impressions 横ばい・順位悪化・参照ドメイン0 が裏付け）。これは 07-10 の A+B 転換の前提（真因＝権威）を**実測で追認**する結果＝A+B（linkable asset の被引用性強化＋ホワイトハット被リンク）が正しい主軸。並行する柱2 は protocolTimeout ハングを除去したが `browser_launch exceeded 30000ms` へ律速移行＝次は起動タイムアウト緩和で分岐判定。

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 今週の GSC impressions(28d) = **4**（前回実測 4 と**同値＝横ばい**）。横ばい（±0）は「成長しない」に該当＝**非成長の週**。よって**実測ベースの連続非成長カウントを +1（=1）**。
- 実測ベースのカウント履歴: #002（06-15, 17→15 減＝非成長, 連続1）→ #003（06-24, 測定不能＝非加算）→ #004（06-29, 15→3 減＝非成長, 連続2）→ #005（07-05, 3→4 増＝成長, 連続リセット=0）→ **#006（07-12, 4→4 横ばい＝非成長, 連続=1）**。
- **判定: 撤退基準 非該当（連続非成長=1／8週母数に未到達）。**
- **重要な留保（自己批判）**: impressions は移行前 15 に遠く横ばい・順位も悪化しており、**獲得（impression/順位）の本質は依然停滞**。ただし今週は**発見（未発見%・indexed）が明確に改善**しており、律速が「発見」から「順位化＝権威」へ移ったことが実測で確認できた。つまり**停滞の原因診断が正しく更新され（07-10 A+B 転換の追認）、投入したレバー（linkable asset＋ホワイトハット権威）が真因に直接効く位置にある**。撤退カウンタは機械的に +1 だが、これは「打ち手が的外れで停滞」ではなく「**正しいレバーを投入した直後で被リンク効果 lag の窓内**」である点を次回 #007 判定時に区別すること（発見改善が続き、かつ A+B 由来の参照ドメインが 0→数件に動くかが #007〜#008 の焦点）。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **【追認・継続】真因＝権威。主軸は A+B（linkable asset の被引用性＋ホワイトハット被リンク）で確定**: 今週の実測（発見は改善＝未発見72→66/indexed27→33、しかし impressions 横ばい・順位悪化・参照ドメイン0）は、**律速が「発見」から「順位化＝権威」へ移った**ことを示し、07-10 の A+B 転換の前提を実測で追認した。よって**戦略変更は不要**＝A+B を継続し、**アセットの被引用性強化（自律・本命）**に注力する。growth-strategy.md 本文は未変更（KPI 履歴の追記のみ）。
2. **【新規・柱2】律速が protocolTimeout ハング→`browser_launch exceeded 30000ms` へ移行**: 07-06 の `launchBrowserWithRetry`（30sバウンド×3）は 180s ハングを除去し fail-fast は成立（`launchAttempts:3`）したが、**取得予算が空き（非429）にもかかわらず 3試行とも 30s 以内に起動完了しない**。原因は「コールドローンチのレイテンシ > 30s バウンド」の可能性が高い（ハングは修正済みのため 30s の厳格化はもはや不要）。**次の柱2 自律デバッグ＝各試行の起動タイムアウトを 30s→60s へ引き上げ**（無課金・可逆・自律範囲）。それでも `launch exceeded` が続くなら「無料枠 Browser Rendering が cron から安定起動しない」＝**有料 Browser Rendering への切替＝危害①金銭＝要ユーザー承認**の分岐を #007 で提示。charter 改訂不要。
3. **【継続】発見の先行指標化＋新指標の追加検討**: 北極星（ad_script_load）とセッションは母数 1〜9 でノイズ域＝Phase L では実質無情報。**「URL Inspection の『Google 未発見』比率」「GSC impressions(28d)」に加え、A+B 効果測定のため「GSC 参照ドメイン数（リンクレポート）」を主先行指標に追加**して毎週トラッキングする（今回は 0 を確認）。KPI 履歴表への「未発見%」「参照ドメイン数」列追加は将来提案（今回は charter 本文を変えず週次文書で運用）。

> いずれも growth-strategy.md 本文は未変更（KPI 履歴行の追記のみ）。決定事項7・8（危害以外は自律確定可）に基づき提案2 は自律実装しうる（起動タイムアウト緩和は無課金・可逆）。提案1 は「戦略維持」の追認であり変更なし。

---

## 8. 翌週アクション（task.md 戦略バックログへ反映済み）

`task.md` の戦略バックログを並べ替え・補充し、翌週の日次ループが消費できる具体的タスクを **9件** 維持（≥7 要件クリア）。先頭は本レビューの結論「**柱2 起動タイムアウト 30s→60s の緩和**」「**柱1'/柱4' アセット被引用性の強化（本命・自律）**」「**発見%＋参照ドメイン数の週次判定**」を反映。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| 1 | **柱2 起動タイムアウトの緩和（30s→60s）**（07-06 の fail-fast で 180s ハングは除去済み＝`browser_launch exceeded 30000ms`／非429・予算空き＝コールドローンチ超過。各試行バウンドを 60s へ。無課金・可逆・自律） | 柱2/修復 | 次 cron 窓 heartbeat で `browserLaunched:true` or 別エラーへ前進（`exceeded` 消失） |
| 2 | **柱1'/柱4' アセット被引用性の強化（本命・自律）**（uptime 履歴14日窓の充実／「今週落ちていた PF」要約の公開ページ化＝記事が引用しやすい一次データ／OG 画像・`Dataset` の機械可読性向上）。冷たい登録は構造的に不可と実地確認済＝**資産の質で自然リンクを稼ぐ** | 柱1'・柱4'/資産・権威 | 被引用性を高める公開面を1つ追加・本番200／週次で参照ドメイン数を追跡 |
| 3 | **発見%＋参照ドメイン数の週次判定**（URL Inspection「未発見」比率＝今週66/100・2週連続改善の持続を追う＋GSC リンクレポートの参照ドメイン数＝今週0 の 0→数件を追う。A+B 効果の主先行指標） | 柱1/柱4'/測定 | 未発見%と参照ドメイン数を毎週記録・A+B 投入後の推移を判定 |
| 4 | **柱1' Track A: プローブ・カバレッジ拡大**（Pinterest/Facebook/Bilibili 等を上流の正確性が担保できる範囲で追加＝資産の網羅性＝被引用性向上） | 柱1'/資産 | 対象PF追加・本番200・方法論注記整合 |
| 5 | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・低クロール価値・発見の残掃除） | 柱1/発見 | 残る solution help リンクの path 形式化・本番200 |
| 6 | 柱1: 新パス ja/pt/ar の indexed/impression 推移を週次記録し、Schema/canonical/内部リンクの効果を帰属・横展開判断（発見改善が始まったので順位化までを追う） | 柱1/測定 | indexed/impression 推移を週次記録・効いた施策を特定 |
| 7 | **柱4' B-2（ユーザー一度きり・任意）: 7/17 に AlternativeTo 登録1回**（ClipKeep は掲載適合。文面は `docs/ops/outreach/2026-07-12.md` / authority-plan.md B-2）。※Show HN/awesome リストは不適合で見送り（07-10 実地確認） | 柱4'/権威 | 登録1回・被リンク発生（ユーザー実行分） |
| 8 | 柱2: cron が実トピック捕捉時の `/trend/[slug]` populated-render 本番検証（P0-1〜P0-4 積み残し検証。優先1 の browser 起動修復が前提） | 柱2/検証 | 実トピックで index/sitemap 収録・本番200 確認 |
| 9 | 健全性: HC-5 の yaml 2.0–2.8.2 moderate を非 `--force` の `npm audit fix` で semver 内修正（**要ユーザーの承認マーカー `（承認済み・消化可）`。未付与なら据え置き**） | 健全性 | 承認済みなら層B+ で1件消化・テスト green |

> #5〜#8 は Phase L で着手可（発見・資産・配管検証であり CVR 凍結に抵触しない）。HC-4/HC-5 の major 更新（`--force` 相当）は要承認の大物のため日次ループ対象外に据え置き。

---

## 9. 柱4' outreach（ホワイトハット限定・再開）

**2026-07-10 の A+B 転換で柱4' を再開**（純オーガニック・柱4廃止は撤回）。ただし 07-10 実地で**冷たい新規登録は各サイトのアンチスパムで構造的に弾かれる**と判明したため、下書きは「(a) 適合する所へ一度きり (b) 既存質問への正当な回答 (c) アセット主導の自然リンク」に限定。投稿はユーザー手動。正本: `docs/strategy/authority-plan.md`。

- 本週分の下書き: **`docs/ops/outreach/2026-07-12.md`**（AlternativeTo 7/17 登録文面／Reddit・Quora 既存質問への正当回答下書き／バッジ埋め込みピッチ）。
- **自動投稿は禁止**。§6 ガードレール（スパム的大量登録・PBN・有料リンク）不変。有料PRは危害ゲート①＝要承認。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分=実測行を追記）
- `docs/strategy/linkable-asset-plan.md`（柱1' Track A 設計）／`docs/strategy/authority-plan.md`（柱4' Track B・outreach 正本）
- 前回: `docs/ops/weekly_review_2026-07-05.md`（#005・A+B 転換前）
- スナップショット: `docs/analytics/history/growth-2026-07-12T00-45-08-567Z.json`（2026-07-12 as-of・実測）
- 認証: `docs/analytics/auth-status.json`（SA・fresh）／`docs/ops/analytics-auth-recovery.md`（SA 化ランブック）
- 柱2 heartbeat: 本番 KV `TREND_KV`（ns `ab21329d…`）`meta:last_run`（直近 cron `2026-07-12T00:02Z`, `browserLaunched:false`／`browser_launch exceeded 30000ms`／`launchAttempts:3`／非429）
- 柱1' uptime: 本番 KV `platform-status:history`（9サンプル, 07-10 12:00〜07-12 00:00／twitter 0%・他5PF 100%）
- `docs/ops/daily/2026-07-06.md`（柱2 protocolTimeout 是正）〜`2026-07-10.md`（id-tiktok＋A+B 転換＋Track A-v0/v1/B-1/カバレッジ拡大）

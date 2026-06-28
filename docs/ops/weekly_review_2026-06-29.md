# Weekly Review Record #004 — ClipKeep Growth

日付: 2026-06-29（月）
対象期間: 直近28日（GA4/GSC as of 2026-06-29）
比較対象: 前回 週次レビュー #003（2026-06-24, 5日前／**計測ブロックで数値取得不能**）、最後の実測は #002（2026-06-15, 14日前）
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中。北極星指標は **インデックス数 / GSC impressions / セッション数 / ad_script_load**。CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。実数のみ記載・**TBD 禁止**（取得できない値は「取得不能: 理由」を明記）。

---

## ✅ 0. 計測健全性（実装前ゲート）— 今週は**計測復旧**（#003 のブロック解消）

**`npm run growth:review`: 成功（GA4・GSC・URL Inspection の3系統とも SA で fresh 取得）。**

- 2026-06-28 に **サービスアカウント（SA `clipkeep-ga4-reader@clipkeep-495214`）化**で OAuth `invalid_grant` 失効ブロックを恒久解消（鍵 `.secrets/ga4-service-account.json`、コードは OAuth 失敗時に自動フォールバック）。
- `docs/analytics/auth-status.json` = **`blocked:false`**（ga4 / gsc / gsc-coverage すべて ok、checkedAt 2026-06-28T20:36Z）。
- **これにより律速は #003 の「計測ブロック」から、本来の「発見/インデックス遅延」へ戻った**（§5 参照）。無人の日次/週次ルーティンでも今後失効しない。
- スナップショット: `docs/analytics/history/growth-2026-06-28T20-36-36-525Z.json`（28日窓 as of 2026-06-29）。

### 本番健全性（OAuth 非依存・実測 OK, 2026-06-29）

| 項目 | 実測 | 判定 |
|---|---|---|
| `GET /api/v1/health` | **200**（db ok / extractor ok / degraded=false / errorRatio 0 / queueWaitP95 0 / activeJobs 0） | 健全 |
| `GET /sitemap.xml` | **200**（357,865 bytes / `<loc>` **508** / `?locale=` **0** / `/trend/` **0**） | 健全（後述） |
| `GET /trending` | **200**（44,961 bytes） | 健全 |
| `GET /trend/t-nonexistent-xyz`（未存在 slug） | **404** | 正常（KV read 経路ライブ） |

- sitemap の `/trend/` エントリ=0 は **P0-3 品質ゲートが gate-passing トピック不在を正しく withhold している証跡**（薄ページ未注入＝ガードレール遵守）。異常ではない（§5 柱2 参照）。

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-06-29（実測） | 2026-06-15（前回実測 #002） | WoW | 判定 |
|---|---:|---:|---:|---|
| ad_script_load（北極星, 合計/28d） | **12** | 18 | **-6** | 微減（低トラフィック由来＝ノイズ域） |
| ad_script_load（北極星, 7d） | 2 | — | — | — |
| ad_script_load zone別/28d（10760541 / 10969428） | 3 / 3（残り6は未分類イベント） | zone別未蓄積 | — | zone別計測が稼働（蓄積中） |
| セッション/28d（GA4 summary） | **1** | 2 | **-1** | 微減（ノイズ域） |
| アクティブユーザー/28d | **1** | 2 | **-1** | 微減（ノイズ域） |
| GSC impressions/28d | **3** | 15 | **-12** | **減（URL移行のディップ・要監視, §5/§6）** |
| GSC clicks/28d | **1** | 0 | **+1** | **初の実クリック（en, pos 23.3, CTR 33.3%）** |
| GSC indexed（URL Inspection サンプル） | **27 / 100**（lower bound, sitemap 500 中） | 取得不能 | — | サンプル下限。GSC UI 正本は 06-16 時点 172 |
| 「Google 未発見」URL（サンプル） | **72 / 100** | — | — | **発見が律速（§5）** |

> **重要な解釈**: セッション/北極星はいずれも 1〜2 の極小値で、増減は**統計的ノイズ域**（実ユーザーほぼ不在）。意味のある先行指標は **GSC impressions と「Google 未発見」URL 比率**。今週は impressions が 15→3 に減少したが、これは **#002 時点で impression の大半を担っていた旧 `?locale=` URL を sitemap から全廃＋301 で畳んだ移行の結果**（旧 URL のインデックス資産が消え、新パス URL がまだ未インデックス＝サンプルの 72% が「Google 未発見」）。同時に **指名外で初の実クリック 1（en, pos 23.3）** が出ており、新パスの一部が検索面に乗り始めた兆候。

---

## 2. SEO シグナル（GSC, 28日）

- locale 別サマリ: **en のみ**（clicks 1 / impressions 3 / CTR 33.3% / pos 23.3 / query 3 / page 1）。ja/pt/ar は **impression 0**（クエリ行なし）。
- 前回（06-15）の所見「impression の大半が旧 `?locale=` 経由・新パス ja/pt/ar は未インデックス」と整合。旧 `?locale=` URL を sitemap から全廃（508 のみ・`?locale=`=0）し 301 で畳んだため、**旧 URL 由来の impression が消え、新パスの indexed 化が追いつくまでの谷**にある。
- **インデックスカバレッジ（URL Inspection API, sitemap 500 URL から 100 サンプル）**:
  - Submitted and indexed: **27**
  - URL is unknown to Google: **72**（＝発見の律速）
  - Crawled - currently not indexed: **1**
  - canonical mismatch: 0 / blocked: 0
- フェーズゲート（indexed ≥ 50）: サンプル下限 27 では below 表示だが、**06-16 の GSC UI 正本では登録済み 172**（ゲートはクリア済み）。サンプルの 27/100 は「新 sitemap URL の発見率」を測っており、ゲート指標（GSC UI 正本）と混同しないこと（#002/#003 の注記を継承）。
- **結論**: 律速は依然「新パス URL（ja/pt/ar 含む）の発見→インデックス昇格」。06-28 に**内部リンクの URL 形式不一致（`?locale=` クエリ形式 vs sitemap/canonical の path 形式）を path 形式へ統一**する根本対策（ver `bd876607`/`eb7e1c02`）を出荷済み。効果（「Google 未発見」比率の低下）は数日〜2週間 lag → 次回週次の最重要監視項目。

---

## 3. ファネル / グロースループ（28日, 凍結中）

Phase L につき凍結（CVR/ファネル微調整は選択不可）。参考実測のみ: form interest 1 / intent-to-clip 2 / success 1（50%）、share 0 / discovery 0 / related 0、viral factor 0.00。いずれも母数 1〜2 でノイズ域。Phase G（indexed≥50 かつ impressions≥1,000）到達まで着手しない。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0、本番 200 実測）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0
- extractor: ok（fixer 経由 TikTok extractor 含め稼働。degraded 観測なし）
- 影響ページ: なし
- **計測系**: #003 の OAuth 失効ブロックは SA 化で**解消**（§0）。今週は障害なし。

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

| 柱 | 直近の打ち手（06-25〜06-28 出荷物） | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | 06-25 失効検知WARN＋SA調査 / 06-27 workers.dev 複製 301（ver `1c84eac0`）/ **06-28 内部リンクの path 形式統一**（ホーム platform グリッド＋全ページ side-menu, ver `bd876607`/`eb7e1c02`）＝発見の根本対策。06-28 health-check で HC-3 クリティカルパステスト（Vitest 33 green）・HC-1 未配線 ShareButton 削除 | URL Inspection で「Google 未発見」**72/100**＝発見が依然律速だが、06-28 の path 形式統一は**最も効くはずの対策**で投入が直近すぎて未反映。**初の実クリック1（en, pos 23.3）** は faint positive | **出荷完了・効果は次回測定**（path 形式統一の効果＝「未発見」比率の低下を最優先で測る） | 残る内部リンク欠落（side-menu の telegram/instagram 欠・本文関連リンクの `?locale=` 残）を潰し発見を底上げ＋ id/hi/tr キーワードマップ（#5） |
| 柱2 トレンド鮮度 | **Phase 0（P0-1〜P0-4）全完了**（06-26 P0-4 鮮度減衰＋撤去導線, ver `ccb250ef`、単体18/18） | パイプライン本番稼働。ただし**本番 KV に qualifying トピック未生成**（sitemap `/trend/`=0）＝cron がトレンド未取得で**公開トピック0**。Phase 0 は完成したが**まだ1ページも産出していない** | **配管完了・効果未発生（実トピック待ち＝潜在ブロッカー化）** | **cron がトレンドを捕捉できていない理由の調査**（cron 稼働か／トレンド source が空か）。捕捉ゼロが続けば Phase 0 全体が出力ゼロのまま（§7 提案2） |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4 外部流入 | 06-24 に outreach 第2版生成（投稿はユーザー） | acquisition は Direct 5 / manual_seed(seed) 1 / not-set 1 ＝**Referral 流入なし**（未投稿 or 未反映） | **効果未発生（投稿実績不明）** | outreach 第3版を本日生成（`docs/ops/outreach/2026-06-29.md`）。投稿後の Referral を次回測定 |

**律速の結論**: #003 で「計測ブロック」へ一時退避していた律速が、SA 化で**本来の「新パス URL の発見/インデックス遅延」へ復帰**。06-28 にその根本対策（内部リンク path 形式統一）を出荷済み。次の最優先は**施策追加でなく、その効果（「Google 未発見」比率の低下＋新パス impression 回復）の測定**。並行する潜在ブロッカーは**柱2 cron がトレンドを1件も捕捉していない**こと（Phase 0 完成済みなのに産出ゼロ）。

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 今週の GSC impressions(28d) = **3**（前回実測 15 から**減**）。**今週は「成長しなかった週」としてカウント加算**（実測できたため #003 のような非加算扱いではない）。
- 実測ベースのカウント: #002（06-15, 17→15 微減＝非成長）→ #003（06-24, 測定不能＝非加算）→ #004（06-29, 15→3 減＝非成長）。**連続非成長の実測週 = 2**。
- 履歴母数は依然 3〜4 データ点規模・プログラム開始（06-12）から約2.5週で、**8週母数に未到達**。
- **判定: 撤退基準 非該当（連続2・8週母数に遠い）。** ただし**今回の減は移行のディップとして説明可能**だが、**新パスが indexed 化しなければ impressions は回復しない**＝発見対策（06-28 出荷）が効くかどうかが時計を握る。**次回・次々回の週次で「Google 未発見」比率の低下と impression 回復が見えなければ、撤退基準の連続カウントが進むため警戒**（§7・§8 で発見を最優先化）。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **【解決済み】計測認証の失効耐性**: #003 提案1（SA 化／失効 WARN）は **2026-06-28 に SA 化で恒久解決済み**（`blocked:false`）。クローズ。
2. **【新規・要注目】柱2 Phase 0 が「完成済みなのに産出ゼロ」**: P0-1〜P0-4 を出し切ったが、本番 KV に qualifying トピックが1件も生成されず（sitemap `/trend/`=0）、cron がトレンドを捕捉していない。**パイプラインを作り切った労力が出力に変換されていない**。提案: 次週バックログに「**cron トレンド捕捉の実態調査**（cron 実行ログ確認／トレンド source の戻り値が空か／`MIN_CLIPS=3` ゲートで全件落ちていないか）」を高位で積む。これは charter 改訂不要（柱2 の実装デバッグ）。改善しなければ Phase 1（D1 スキーマ）昇格は引き続き時期尚早。
3. **【新規・運用提案】「発見健全性」を週次の先行指標に格上げ**: 北極星（ad_script_load）とセッションは母数 1〜2 でノイズ域のため、Phase L では実質無情報。**「URL Inspection の『Google 未発見』比率」と「GSC impressions(28d)」を発見の先行指標として毎週トラッキング**し、KPI 履歴に「未発見%」列の追加を将来提案（今回は charter 本文を変えず週次文書で運用）。これにより撤退判定（impressions 非成長）の前に発見の改善/悪化を早期に捉える。
4. **【継続】柱の重み付け（charter 改訂不要）**: 06-16〜06-28 でインデックス促進策は出し切った。次フェーズは「施策追加」より「**06-28 path 形式統一の効果測定 → 効いた施策の横展開**」。4本柱の枠内の優先順位調整であり charter 改訂不要。

> いずれも growth-strategy.md 本文は未変更（KPI 履歴行の追記のみ）。ユーザー承認後に charter へ反映するかを判断。

---

## 8. 翌週アクション（task.md 戦略バックログへ反映済み）

`task.md` の戦略バックログを並べ替え・補充し、翌週の日次ループが消費できる具体的タスクを **8件** 維持（≥7 要件クリア）。先頭は本レビューの結論「**発見対策の効果測定 → 残る内部リンク欠落の解消**」と「**柱2 cron 捕捉の調査**」を反映。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| 1 | 06-28 path 形式統一の効果測定＋残る内部リンク欠落の解消（side-menu の telegram/instagram 欠落追加・solution 本文関連リンクの `?locale=` → path 形式化）。GSC URL Inspection で「Google 未発見」比率の低下を測る | 柱1/発見・測定 | 「未発見」サンプル比率が 72% から低下、欠落リンク補填・本番200 |
| 2 | **柱2 cron トレンド捕捉の実態調査**（cron 実行有無／トレンド source 戻り値／`MIN_CLIPS` ゲート脱落の切り分け。設計どおり1トピックでも公開に乗るか） | 柱2/調査 | 捕捉0の真因を特定し是正方針 or 1トピックの公開を確認 |
| 3 | #5 id/hi/tr ロングテールキーワードマップ作成（需要・競合弱さ・広告収益性・実装リスクで優先度付け） | 柱1 | キーワードマップ文書を docs/strategy/ に出力 |
| 4 | 柱1: 高意図 not-working クラスタの es/fr/de 等への横展開（ja/pt/ar 同等の s1-s3 充足） | 柱1 | 対象 locale ページ充足・本番200 |
| 5 | 柱1: 06-28 で path 形式統一した内部リンク経由で、新パス ja/pt/ar の indexed/impression 推移を週次記録し横展開判断（Schema/canonical/内部リンクの効果帰属） | 柱1/測定 | indexed/impression 推移を週次で記録・効いた施策を特定 |
| 6 | HC-2 未使用 export 5件の棚卸し（SA移行・i18n・trend 削除の未配線 API を配線 or 除去。knip 偽陽性 `growth-summary.mjs` は除外） | 健全性 | 各 export を配線 or 除去、テスト green |
| 7 | 柱2: cron が実トピック捕捉時の `/trend/[slug]` populated-render 本番検証（P0-1〜P0-4 の積み残し検証） | 柱2/検証 | 実トピックで index/sitemap 収録・本番200 確認 |
| 8 | 柱4: outreach 第3版の投稿先（AlternativeTo/SaaSHub 等）登録をユーザーが実施 → 投稿後 Referral を GA4 acquisition で測定 | 柱4/測定 | Referral チャネルの初計上を確認 |

> #6/#7 は Phase L で着手可（発見・配管検証であり CVR 凍結に抵触しない）。HC-4/HC-5（依存更新・audit）は要承認の大物のため日次ループ対象外に据え置き。

---

## 9. 柱4 outreach（下書き生成・投稿はユーザー）

`docs/ops/outreach/2026-06-29.md` にツールディレクトリ登録先リスト（前回の進捗チェック付き）と Reddit/Quora 回答下書き（第3版）を生成。**自動投稿は行っていない**（ガードレール遵守）。**計測が復旧したため、今回からは投稿実績→Referral 流入の突き合わせが可能**（次回週次で測定）。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分=実測行を追記）
- 前回: `docs/ops/weekly_review_2026-06-24.md`（#003・計測ブロック）／最後の実測 `docs/ops/weekly_review_2026-06-15.md`（#002）
- スナップショット: `docs/analytics/history/growth-2026-06-28T20-36-36-525Z.json`（2026-06-29 as-of・実測）
- 認証: `docs/analytics/auth-status.json`（`blocked:false`）／`docs/ops/analytics-auth-recovery.md`（SA 化ランブック）
- `docs/ops/daily/2026-06-25.md` 〜 `2026-06-28.md`（失効WARN／workers.dev 301／SA 復旧／path 形式内部リンク統一の履歴）
</content>
</invoke>

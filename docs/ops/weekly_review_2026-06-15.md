# Weekly Review Record #002 — ClipKeep Growth

日付: 2026-06-15（月）
対象期間: 直近28日（GA4/GSC as of 2026-06-15）
比較対象: 前回 growth run 2026-06-12（実質的な週次 #1 ベースライン。3日前）
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中につき、北極星指標は **インデックス数 / GSC impressions / セッション数 / ad_script_load** であり、CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。本レビューは playbook 形式を Phase L 用に読み替えて実数のみ記載する。**TBD 禁止**。

---

## 0. 計測健全性（実装前ゲート）

- `npm run growth:review`: **成功**（GA4 + Search Console 両方の実データ取得）。`.secrets` OAuth トークン有効。
  - GA4 property `528376605` / GSC property `sc-domain:clipkeep.net`。
- 本番 `GET https://clipkeep.net/api/v1/health` => **200**（db ok / extractor ok / degraded=false / errorRatio 0）。
- 本番 `GET https://clipkeep.net/sitemap.xml` => **200**（357,865 bytes / `<loc>` 508 件 / `?locale=` 0 件）。
- → 計測・本番ともに健全。データありで改善判断が可能。

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-06-15 | 2026-06-12 | 変化 | 判定 |
|---|---:|---:|---:|---|
| ad_script_load（北極星, zone別/28d） | 取得不能 | 取得不能 | — | 計測未整備 |
| ad_script_load（参考: events report 合計） | 18 | 18 | ±0 | 横ばい |
| セッション/28d | 2 | 2 | ±0 | 横ばい |
| アクティブユーザー/28d | 2 | 2 | ±0 | 横ばい |
| GSC impressions/28d（locale-summary 基準） | 15 | 17 | -2（-11.8%） | 微減 |
| GSC impressions/28d（pages 報告・網羅基準） | 27 | （未記録） | — | 参考 |
| GSC clicks/28d | 0 | 0 | ±0 | ゼロ継続 |
| GSC indexed（カバレッジ実数） | 取得不能 | ~2 | — | 計測未整備 |
| impression 発生の正規ページ数 | 2 | 2 | ±0 | 横ばい |
| 7日 セッション（参考） | 8 | — | — | 参考 |

### 取得不能項目の理由（TBD ではなく明示）

- **ad_script_load zone別/28d**: `growth:review` の events エクスポートは **直近7日範囲**（eventCount 合計 64 = GA4 last7Days と一致）であり、28日・zone（10760541 / 10969428）別の集計が未実装。バックログ #1（`scripts/growth-summary.mjs` への zone別28日集計追加）で解消予定。GA4 認証は復旧済みでブロック解除済み。
- **GSC indexed（実数）**: 現行 `growth:review` は Search Analytics API（クエリ/ページ/ロケール）のみ取得し、URL Inspection / Index Coverage API を叩いていないためインデックス総数の実数が取れない。impression が発生している正規ページ数（= 2: `/`（home）と `/solution/how-to-save-on-iphone-android`）を下限として記録。

---

## 2. SEO シグナル（GSC, 28日）

### ロケール別

| Locale | clicks | impressions | CTR | 平均掲載順位 |
|---|---:|---:|---:|---:|
| en | 0 | 8 | 0% | 9.5 |
| ja | 0 | 3 | 0% | 71.7 |
| es | 0 | 1 | 0% | 55.0 |
| pt | 0 | 1 | 0% | 18.0 |
| fr | 0 | 1 | 0% | 72.0 |
| de | 0 | 1 | 0% | 86.0 |
| **計** | **0** | **15** | **0%** | — |

### ページ別（pages 報告・網羅基準, 27 impressions）

| ページ | locale | impressions | 平均順位 |
|---|---|---:|---:|
| `/`（home） | en | 9 | 12.1 |
| `/solution/how-to-save-on-iphone-android?locale=ja` | ja | 11 | 68.4 |
| 同上 `?locale=de` | de | 2 | 87.0 |
| 同上 `?locale=es` | es | 1 | 55.0 |
| 同上 `?locale=fr` | fr | 1 | 72.0 |
| 同上 `?locale=id` | id | 1 | 87.0 |
| 同上 `?locale=pt` | pt | 1 | 18.0 |
| 同上 `?locale=tr` | tr | 1 | 76.0 |

### 主要クエリ（実測, 全て clicks=0）

| Query | Locale | impressions | 順位 |
|---|---|---:|---:|
| clipkeep（指名） | en | 8 | 7〜15 |
| iphone 動画 保存 方法 / アイフォン 動画 保存 / 動画 iphone 保存 | ja | 各1 | 68〜74 |
| como guardar videos en el celular | es | 1 | 55 |
| como salvar video em arquivo no iphone | pt | 1 | 18 |
| enregistrer des videos sur iphone | fr | 1 | 72 |
| videos speichern iphone | de | 1 | 86 |

**重大な所見（インデックス導線の断絶）:**
1. impression の **大半は旧 `?locale=` URL**（`how-to-save-on-iphone-android?locale=*`）から発生。2026-06-12 に sitemap を path-based（`/ja/...`）508 URL へ移行したが、Google はまだ旧 `?locale=` URL を提示しており、新パスはインデックス/impression 化していない（移行3日でクロール反映待ち = lag 想定内）。
2. **柱1 で 06-13/06-14 に内容充足した新規ページ**（X/Reddit/Telegram/Twitter の `downloader-not-working` ja/pt）は **impression ゼロ**。まだクロール・インデックスされていない。
3. 指名クエリ「clipkeep」が en で 8 impression・平均順位 ~9.5（1ページ目前後）。非指名の獲得クエリはロングテール iPhone 保存系のみで各1 impression・順位 50〜86 と低い。

---

## 3. ファネル / グロースループ（28日, 凍結中・記録のみ）

> Phase L につき CVR/ループ最適化は凍結。実数記録のみ行う。

- Form Interest: 3（150% of sessions） / Intent to Clip: 2 / 帰属完了: 1（attempts の50%）
- Viral / Discovery / Related clicks: いずれも 0
- 母数（セッション2）が小さすぎ統計的判断は不可。獲得（impression/index）が先決。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0
- extractor: ok（fixer 経由 TikTok extractor 含め稼働。今週は degraded 観測なし）
- 影響ページ: なし

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

| 柱 | 直近の打ち手 | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | 06-13 ja / 06-14 pt の solution「not-working」内容充足 | 新規ページ impression=0（未インデックス）。impression は旧 `?locale=` 経由のみ | **効果未確認（時期尚早 / インデックス導線が律速）** | クロール発見性（内部リンク・sitemap 再送信・カバレッジ triage）を最優先化。内容充足は ar で継続 |
| 柱2 トレンド鮮度 | 未着手（設計のみバックログ） | — | **N/A（未実装）** | 設計タスクをバックログ維持（優先度は柱1インデックス後） |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4 外部流入 | 未実施（outreach 出力なし） | 被リンク獲得なし | **N/A（未着手）** | 本レビューで outreach 下書き初版を生成（`docs/ops/outreach/2026-06-15.md`）。投稿はユーザー |

**律速の結論**: 現状のボトルネックは「コンテンツ不足」ではなく **インデックス/クロール反映の遅延**。508 URL の sitemap に対し impression 発生は実質2正規ページのみ。次週は柱1の中でも「インデックス化を進める施策（sitemap 再送信＋カバレッジ取得、内部リンク強化、canonical 統一）」を内容追加より優先する。

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 現状: 週次レビューは実質 #1（ベースライン 06-12）→ #2（本日 06-15）の **2データ点・履歴3日のみ**。8週連続判定の母数に未到達。
- impressions(28d) は locale-summary 基準で 17 → 15（微減）だが、(a) 比較間隔が3日と短い、(b) sitemap 移行直後のクロール過渡期、により低下を構造的悪化と断定できない。
- **判定: 撤退基準 非該当（母数不足）。** 次週以降、正規（path-based）URL でのインデックス進捗を監視。impressions が path-based URL に乗り換わらず 28d 総量が 4週以上横ばい/減少が続く場合は早期警告として再評価する。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **計測の北極星可視化を最優先タスクに昇格**（提案）: 北極星 `ad_script_load` が zone別28日で取れず横ばい判定しかできない。バックログ #1 を翌週日次ループの先頭に置き、growth:review に北極星28日値（zone別）を常時表示できるようにする。→ バックログ並べ替えに反映済み。
2. **「indexed 実数」の計測追加を提案**: Phase L のフェーズゲート（indexed ≥ 50）を判定するには URL Inspection / Coverage の実数が必要。現状ゲート判定が impression 発生ページ数（=2）の代理値に依存。`growth:review` にカバレッジ取得を追加する小タスクをバックログ化（#2）。
3. **柱の重み付け微修正の提案（戦略本文の改訂は不要）**: Phase L の当面は「柱1の内容追加」より「柱1内のインデックス促進（内部リンク/sitemap/canonical）」に比重を置く運用とする。これは戦略4本柱の枠内の優先順位調整であり、charter 改訂は不要。

> いずれも growth-strategy.md 本文は未変更。ユーザー承認後に charter へ反映するかを判断。

---

## 8. 翌週アクション（バックログへ反映済み）

`task.md` 戦略バックログを並べ替え・補充し、翌週の日次ループが消費できる具体的タスクを **9件**維持（≥7 要件クリア）。先頭3件は本レビューの律速結論（計測整備 → インデックス促進）を反映。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| 1 | ad_script_load zone別28日集計を growth:review に表示 | 計測/北極星 | 北極星28日値が zone別で出力される |
| 2 | GSC sitemap 再送信＋カバレッジ取得（indexed 実数化） | 計測/柱1 | indexed 実数が取得・記録できる |
| 3 | 新規 solution ページの内部リンク強化（クロール発見性） | 柱1 | home/関連から被リンク、本番200 |
| 4 | ar Solution 内容充足（RTL 目視込み） | 柱1 | ar 3ページ s3 追加・本番200 |
| 5 | blog/about/contact/legal/status の canonical を helper 統一 | OPS/柱1 | 自己参照 canonical が path-based に |
| 6 | Schema.org（FAQ/HowTo）ja/pt/ar 実装 | 柱1 | 構造化データ本番反映 |
| 7 | 柱2 トレンド鮮度パイプライン設計（bythink） | 柱2 | 設計文書 docs/strategy/ 出力 |

（#8 workers.dev 重複対策・#9 id/hi/tr キーワードマップ もバックログ末尾に保持）

---

## 9. 柱4 outreach（下書き生成・投稿はユーザー）

`docs/ops/outreach/2026-06-15.md` にツールディレクトリ登録先リストと Reddit/Quora 回答下書きを生成済み。**自動投稿は行っていない**（ガードレール遵守）。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分追記済み）
- `docs/analytics/latest-gsc-*.csv`, `docs/analytics/latest-ga4-*.csv`, `docs/analytics/history/growth-2026-06-14T20-43-14-209Z.json`
- `docs/ops/daily/2026-06-13.md` 〜 `2026-06-14.md`
- 前回: `docs/ops/weekly_review_2026-03-20.md`（#001, 旧 CVR フォーマット）
</content>
</invoke>

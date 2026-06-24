# Weekly Review Record #003 — ClipKeep Growth

日付: 2026-06-24（水）※本来は月曜運用だが、スケジュール実行日が水曜のため当日付で記録
対象期間: 直近28日（GA4/GSC as of 2026-06-24）
比較対象: 前回 週次レビュー #002（2026-06-15, 9日前）
担当: 自動週次レビュー（無人実行）
正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日 = GA4 `ad_script_load`）

> 注: Launch-Phase（Phase L）運用中。北極星指標は **インデックス数 / GSC impressions / セッション数 / ad_script_load**。CVR・ファネル微調整は凍結（AGENTS.md / growth-strategy.md §2）。実数のみ記載・**TBD 禁止**（取得できない値は「取得不能: 理由」を明記）。

---

## ⚠️ 0. 計測健全性（実装前ゲート）— 今週は計測ブロック発生

**`npm run growth:review`: 失敗（GA4・GSC ともに OAuth トークン失効）。**

```
[analytics] OAuth refresh failed: 400 invalid_grant
  "error_description": "Token has been expired or revoked."
ENOENT: .secrets/ga4-service-account.json （サービスアカウント fallback も未設定）
scripts/fetch-ga4-report.mjs exited with code 1
```

- GA4（`npm run analytics:ga4`）／GSC（`npm run analytics:gsc`）を個別実行しても **両方同じ `invalid_grant`（トークン revoke）** で失敗。
- 原因: `.secrets/ga4-oauth-token.json` の refresh token が失効/取り消し済み。サービスアカウント fallback（`ga4-service-account.json`）は未配置。
- 復旧手段: **このPCで `npm run analytics:ga4:login` を実行し、GA4 プロパティ `528376605` と GSC `sc-domain:clipkeep.net` の両権限を持つ Google アカウントで再ログインする必要がある**（scope=analytics.readonly + webmasters.readonly）。これは**ブラウザ対話を伴うため無人実行（本スケジュール）では実施不可** → **ユーザー手動操作が必須**。
- 措置: 戦略 §8・タスク指示の「失敗したらエラーを記録し以降の数値作業はスキップ」に従い、**本週の GA4/GSC 由来の数値は全て「取得不能（OAuth失効）」として扱う**。前回（06-15）のキャッシュ値は**現値ではなく last-known 参照**としてのみ併記する（現値に流用しない）。

### 本番健全性（OAuth 非依存・実測 OK）

| 項目 | 実測（2026-06-24） | 判定 |
|---|---|---|
| `GET /api/v1/health` | **200**（db ok / extractor ok / degraded=false / errorRatio 0 / queueWaitP95 0 / activeJobs 0） | 健全 |
| `GET /sitemap.xml` | **200**（357,865 bytes / `<loc>` **508** / `?locale=` **0** / `/trend/` **0**） | 健全（後述） |
| `GET /trending` | **200**（45,020 bytes） | 健全 |
| `GET /trend/t-nonexistent-xyz`（未存在 slug） | **404** | 正常（KV read 経路ライブ） |

- sitemap の `/trend/` エントリ=0 は **P0-3 品質ゲートが gate-passing トピック不在を正しく withhold している証跡**（薄ページ未注入＝ガードレール遵守）。異常ではない。
- → **本番は健全。律速は「計測ブロック（OAuth失効）」**。データ無しでの数値改善判断は不可（戦略 §5-1 のデータ無し改善禁止に該当）。

---

## 1. 北極星 & KPI サマリー（28日）

| Metric | 2026-06-24（現値） | 2026-06-15（参考: last-known） | 判定 |
|---|---|---|---|
| ad_script_load（北極星, zone別/28d） | **取得不能（OAuth失効）** | 取得不能（zone別未蓄積） | 計測ブロック |
| ad_script_load（参考: events合計/28d） | **取得不能（OAuth失効）** | 18 | 計測ブロック |
| セッション/28d | **取得不能（OAuth失効）** | 2 | 計測ブロック |
| アクティブユーザー/28d | **取得不能（OAuth失効）** | 2 | 計測ブロック |
| GSC impressions/28d | **取得不能（OAuth失効）** | 15（locale-summary 基準） | 計測ブロック |
| GSC clicks/28d | **取得不能（OAuth失効）** | 0 | 計測ブロック |
| GSC indexed（カバレッジ正本） | **取得不能（OAuth失効）** | 172（06-16 GSC UI 正本） | 計測ブロック |
| impression 発生の正規ページ数 | **取得不能（OAuth失効）** | 2 | 計測ブロック |

> last-known 列は 2026-06-15/16 取得のキャッシュ（`docs/analytics/history/latest-growth-snapshot.json` 等）であり、**今週の実測ではない**。今週は OAuth 失効により一切の新規取得ができていない。

---

## 2. SEO シグナル（GSC, 28日）

**取得不能（OAuth失効）。** ロケール別・ページ別・クエリ別の今週実測は取得できていない。前回（06-15）の所見（impression の大半が旧 `?locale=` 経由、新パス ja/pt/ar は未インデックス、指名「clipkeep」en 8impr/順位~9.5）からの差分は、次回 OAuth 復旧後の取得まで判定不能。

---

## 3. ファネル / グロースループ（28日, 凍結中）

Phase L につき凍結。今週は実数も取得不能（OAuth失効）のため記録なし。

---

## 4. 障害 / 健全性

- 5xx率: 0（health errorRatio 0、本番 200 実測）
- 429率 / degraded 発動: degraded=false、queueWaitP95=0、activeJobs=0
- extractor: ok（fixer 経由 TikTok extractor 含め稼働。degraded 観測なし）
- 影響ページ: なし
- **計測系の障害**: GA4/GSC OAuth トークン失効（§0）。本番サービスへの影響はないが、グロース判断データが途絶。

---

## 5. 柱別 効果判定（変更単位ではなく柱単位）

> 数値帰属は OAuth 失効で今週は不可。**実装進捗（出荷物）**ベースで記録し、効果判定は「効果未測定（計測ブロック）」とする。

| 柱 | 直近の打ち手（06-16〜06-24 出荷物） | 観測 | 判定 | 次アクション |
|---|---|---|---|---|
| 柱1 多言語ロングテール | #3 内部リンク強化（孤立解消, 06-17）/ #4 ar 内容充足（06-18）/ #5 canonical helper 統一（06-19）/ #6 Schema.org FAQ/HowTo 多言語化（06-20）。**インデックス促進＝律速対策**を集中投下 | 本番反映は確認済み（各日次 log）。impression/index への効果は GSC 取得不能で**今週は測定不能** | **効果未測定（計測ブロック）。出荷は完了** | OAuth 復旧後に「新パス ja/pt/ar の indexed/impression 増」を最優先で測定 |
| 柱2 トレンド鮮度 | 設計承認（06-21）→ **Phase 0 を P0-1〜P0-3 出荷**（06-22 捕捉配管 / 06-23 `/trend/[slug]` 骨組み / 06-24 品質ゲート＋sitemap 条件付き収録＋内部リンク） | パイプライン本番稼働。ただし**本番 KV に qualifying トピック未生成**（cron がトレンド未取得）＝公開トピック0、sitemap `/trend/`=0 | **配管完了・効果未発生（実トピック待ち）** | #13 P0-4（鮮度減衰＋個別撤去導線）。cron が実トピック捕捉した最初の週で populated-render を被検証 |
| 柱3 回遊 | 凍結（Phase L） | — | 凍結継続 | Phase G まで着手しない |
| 柱4 外部流入 | 06-15 に outreach 下書き初版生成（投稿はユーザー） | 被リンク/Referral 流入は GSC/GA4 取得不能で**今週は測定不能** | **効果未測定（計測ブロック）** | 本レビューで outreach 第2版を生成（`docs/ops/outreach/2026-06-24.md`） |

**律速の結論**: 前回（06-15）の律速は「インデックス/クロール反映の遅延」だった。06-16〜06-24 にその対策（内部リンク・canonical・Schema・sitemap 再送信）を集中投下済み。**しかし今週は OAuth 失効により効果測定が一切できず、律速が「インデックス遅延」から「計測ブロック」へ一時的に移った**。次の最優先は施策追加ではなく **計測復旧（ユーザー再ログイン）** → その上で柱1施策の indexed/impression 効果を測ること。

---

## 6. 撤退基準の判定（毎回必須）

- 基準: **8週連続**で GSC impressions(28d) が成長しない → 改修停止・戦略変更提案。
- 今週: GSC impressions(28d) が **取得不能（OAuth失効）**。成長/非成長の判定そのものができない。
- カウンタ運用: 「成長しなかった週」としても「成長した週」としてもカウントしない（**測定不能週はカウンタ非加算**とする）。これにより計測障害が撤退判定を歪めない。
- 履歴も依然 2〜3 データ点規模（#001 03-20 旧フォーマット / #002 06-15 / #003 本日=計測不能）で 8週母数に未到達。
- **判定: 撤退基準 非該当（今週は測定不能＝判定保留、かつ履歴母数不足）。** ただし**計測ブロックが2週以上続けば撤退判定が不能のまま放置されるリスク**があるため、計測復旧を最優先化する（§7・§8）。

---

## 7. 戦略変更提案（growth-strategy.md は変更せず、ここに記載）

1. **【新規・最優先】計測認証の失効耐性を上げる提案**: 今週のブロックは OAuth refresh token の revoke が原因。週次レビュー＝グロース判断の生命線がユーザーの対話的再ログインに依存している。提案: (a) **サービスアカウント（`.secrets/ga4-service-account.json`）への移行**を検討（GA4 はサービスアカウントをプロパティに閲覧者追加、GSC は Search Console API のサービスアカウント委任 or 所有権付与で対話レス化できる）、(b) 移行が難しければ最低限「トークン失効を検知したら daily log と週次に **WARN を自動出力**し、ユーザーに `analytics:ga4:login` 再実行を促す」仕組みを入れる。→ バックログ #1 に反映。
2. **【継続】柱の重み付け（charter 改訂は不要）**: 06-16〜06-24 でインデックス促進策（内部リンク・canonical・Schema・sitemap 再送信）は出し切った。次フェーズは「施策追加」より「効果測定 → 効いた施策の横展開」。これは4本柱の枠内の優先順位調整であり charter 改訂不要。
3. **【継続】柱2 Phase 1（D1 スキーマ `trend_topics`）は要ユーザー承認のまま据え置き**: Phase 0（KV ベース MVP）の効果がまだ「実トピック未生成」で観測できていないため、Phase 1 昇格判断は時期尚早。P0-4 完了＋実トピックでの公開実績を見てから。

> いずれも growth-strategy.md 本文は未変更。ユーザー承認後に charter へ反映するかを判断。

---

## 8. 翌週アクション（task.md 戦略バックログへ反映済み）

`task.md` の戦略バックログを並べ替え・補充し、翌週の日次ループが消費できる具体的タスクを **8件** 維持（≥7 要件クリア）。先頭は本レビューの結論「計測復旧 → 効果測定」を反映。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| 1 | **計測復旧＋失効耐性**: ユーザーが `analytics:ga4:login` 再ログイン（手動）。自律側は「トークン失効検知→WARN 出力」＋サービスアカウント化の調査・準備 | 計測/最優先 | `growth:review` が再び実データ取得・失効時に WARN が出る |
| 2 | #13 P0-4 鮮度減衰＋個別撤去導線（`listLiveTopics` に STALE_AFTER=30日 フィルタ接続＋手動即時撤去） | 柱2 | STALE 超過で sitemap 除外＋noindex/410、手動撤去導線が機能 |
| 3 | ホーム `<title>` から未対応 TikTok 表記を除去し実態と一致（OPS-1 残） | OPS/柱1 | ホーム title が実稼働プラットフォームと一致・本番200 |
| 4 | #8 workers.dev 配信の重複対策（canonical が clipkeep.net を指すことを本番確認） | OPS/柱1 | workers.dev 経由でも canonical=clipkeep.net |
| 5 | #9 id/hi/tr ロングテールキーワードマップ作成（需要・競合弱さ・広告収益性・実装リスクで優先度付け） | 柱1 | キーワードマップ文書を docs/strategy/ に出力 |
| 6 | 柱1: 既存高意図 not-working クラスタの es/fr/de 等への横展開（ja/pt/ar 同等の内容充足） | 柱1 | 対象 locale ページ s1-s3 充足・本番200 |
| 7 | 柱2: cron が実トピック捕捉した際の `/trend/[slug]` populated-render 本番検証（P0-1〜P0-3 の積み残し検証） | 柱2/検証 | 実トピックで index/sitemap 収録・本番200 を確認 |
| 8 | 柱1: 構造化データ（Schema）と内部リンクの効果を OAuth 復旧後に GSC で測定し横展開判断 | 柱1/測定 | indexed/impression 推移を週次で記録 |

---

## 9. 柱4 outreach（下書き生成・投稿はユーザー）

`docs/ops/outreach/2026-06-24.md` にツールディレクトリ登録先リスト（前回の進捗チェック付き）と Reddit/Quora 回答下書き（第2版）を生成。**自動投稿は行っていない**（ガードレール遵守）。

---

## 10. 参照

- `docs/strategy/growth-strategy.md`（正本・KPI 履歴に本日分=取得不能行を追記）
- 前回: `docs/ops/weekly_review_2026-06-15.md`（#002）
- last-known キャッシュ: `docs/analytics/history/latest-growth-snapshot.json`（2026-06-15 取得・現値ではない）
- `docs/ops/daily/2026-06-16.md` 〜 `2026-06-24.md`（柱1インデックス促進＋柱2 Phase 0 出荷の履歴）
</content>

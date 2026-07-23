# 作業タスクリスト: ClipKeep

## 戦略バックログ（日次ループはここの先頭から1件選ぶ。優先順位は週次レビューが管理）

正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日）

> **2026-07-12 週次レビュー（#006）で並べ替え。A+B 転換（07-10）後の初回週次。計測は健全（SA化, fresh）**:
> `growth:review` 成功（GA4/GSC/URL Inspection 3系統 fresh, as of 2026-07-12）。本番健全
> （health 200 / sitemap 509 / `?locale=`=0 / `/trend/`=0＝ゲート正常 / **platform-status 200・sitemap 収録** / badge 200 / trending 200）。
> 実測 28d: ad_script_load=**24**（前回13）、セッション=**9**（前回3）、GSC impressions=**4（前回4・横ばい）**、pos **33.5→54.3 悪化**＝**獲得はノイズ域で停滞**。
> **最重要（良い兆候）: URL Inspection「Google 未発見」= 66/100（72→68→66 と2週連続改善）・indexed 27→33/100**＝06-28/29 内部リンク統一＋7/7〜7/10 多言語本文充足（tr-twitter/hi-telegram/id-tiktok）の効果 lag が**発見側に出始めた**。#005 の「72 横ばい」懸念は反転。
> **律速が「発見」→「順位化＝権威」へ移行**（発見改善・impression 横ばい・順位悪化・参照ドメイン0）＝07-10 A+B 転換の前提を実測で追認。
> 撤退基準: impressions 4→4 横ばい＝**非成長・連続=1**（8週母数未到達・非該当）。ただし「正しいレバー投入直後の被リンク lag 窓内」と区別すること。
> **柱2**: 07-06 protocolTimeout 是正は機能（fail-fast・180sハング消失・`launchAttempts:3`）も、律速が **`browser_launch exceeded 30000ms`**（非429・予算空き＝コールドローンチ超過）へ移行し産出ゼロ継続。
> よって先頭を「**柱2 起動タイムアウト 30s→60s 緩和**」「**柱1'/柱4' アセット被引用性の強化（本命・自律）**」「**発見%＋参照ドメイン数の週次判定**」に再配置。
> 詳細: `docs/ops/weekly_review_2026-07-12.md`。前回: `#005 2026-07-05`。

### 翌週 戦略バックログ（#006, 2026-07-12 並べ替え。日次ループはここの先頭から1件）

> **主軸は A+B（07-10 転換・実測で追認）**: 発見は改善したが順位化には**ドメイン権威・被リンク**が要る、と #006 実測が示した。
> よって **templated stub 量産は停止のまま**、**Track A（linkable asset の被引用性強化）＋ Track B（ホワイトハット被リンク）** を主軸とする。
> 正本: `docs/strategy/linkable-asset-plan.md` / `docs/strategy/authority-plan.md` / growth-strategy §4 柱1'・柱4'。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| ~~1~~ | ~~**柱2 起動タイムアウトの緩和（30s→60s）**~~ ← **完了（2026-07-13, ver `34b713c7`, commit `3ecf807`）**。`LAUNCH_TIMEOUT_MS 30_000→60_000`。typecheck/lint/build PASS・vitest 33/33・release gate PASS=29/0/SKIP1・D1 remote PASS・本番 health 200/sitemap 200 loc509・`/trend/`=0。**効果は次 cron 窓（`0 */6 * * *`→2026-07-13T00:00Z〜）で被検証**。baseline heartbeat `2026-07-12T18:00:14Z`＝`browserLaunched:false`/`launchAttempts:3`。**但し書き（重要）**: 失敗モードは窓ごとに揺れる＝#006 が見た 00:02Z は `exceeded 30000ms`（タイムアウト）だが、本ループ観測の 18:00Z は **429 Rate limit exceeded**（アカウ水準クォータ）。60s 緩和はタイムアウト側のみ解消し 429 側には効かない。次数窓で 429 が支配的なら「無料枠 Browser Rendering が cron から安定起動しない」＝有料切替＝要ユーザー承認の分岐へ。詳細 docs/ops/daily/2026-07-13.md | 柱2/修復 | 次 cron 窓 heartbeat で `browserLaunched:true` or 別エラーへ前進（`exceeded` 消失） |
| ~~2~~ | ~~**柱1'/柱4' アセット被引用性の強化（本命・自律）**~~ ← **一部完了（2026-07-14, ver `1d946b55`, commit `1288df0`）**。`Dataset` 機械可読性向上＋引用しやすい一次データを実装＝公開 JSON 配信 `/api/v1/platform-status`（CORS開放・CC BY 4.0・cache）＋Dataset JSON-LD を harvest 適格へ強化（`distribution`(DataDownload/JSON)・`variableMeasured`→`PropertyValue`・`temporalCoverage`・`measurementTechnique`・`keywords`）＋ページに JSON 引用リンク。単一ビルダー `buildStatusExport`/`buildDatasetJsonLd` で page/JSON/JSON-LD の乖離排除。export.test.ts 6件。typecheck/lint/build PASS・vitest 39/39・release gate **PASS=27/FAIL=2/SKIP=1**（FAIL 2 は外部 telegram t.me の実一時障害＝本番も http=530/ローカルは DNS 解決不可・uptime 履歴は100%＝変更非起因）。本番 `/api/v1/platform-status` 200・JSON-LD 全項目反映を確認。**残（別日候補）: OG 画像（OpenNext edge 制約回避の安全策要設計）・A-v2 `extractor_jobs` per-PF success_rate 併記・プローブ拡大**。詳細 docs/ops/daily/2026-07-14.md | 柱1'・柱4'/資産・権威 | 被引用性を高める公開面を1つ追加・本番200（達成）／参照ドメイン数を週次追跡 |
| **0** | **柱1/修復: fxTwitter 401 の切り分けと X 抽出経路の是正** ← **新規・最優先（2026-07-24 発見）**。本番 `/api/v1/platform-status` で twitter が **56/56 サンプル `http=401`・uptime 0%**（約14日間）。ローカル residential IP からは同 URL が 200＝**fxTwitter が Cloudflare Workers の egress を弾いている**疑い。`src/lib/extract/twitter.ts:187` が同一条件で叩いており**主力 X の抽出が本番で恒常劣化している可能性**（`d.fxtwitter.com`/HTML フォールバックの生死は未確認）。まず本番 Worker から UA 有無・`d.` サブドメイン・vxtwitter 代替を切り分ける | 柱1/修復 | 本番 Worker からの X 抽出が成功する経路を1つ確定・status ページの twitter が operational へ |
| ~~3~~ | ~~**発見%＋参照ドメイン数の週次判定**~~ ← **一部完了（2026-07-24 計測記録）**。28d: ad_script_load **85**（前回24）/ セッション **32**（9）/ impressions **5**（4）/ clicks 0 / pos **37.0**（54.3）/ indexed **34**（33）/ **未発見 65/100**（66＝72→68→66→65 で改善継続だが**鈍化** -6→-2→-1）。判定＝**発見改善は続くが律速は順位化＝権威**（#006 の読みを追認）。**ad_script_load/セッション急増は impressions 5 と整合せず＝検索流入起因ではない**（流入元内訳を次回確認）。撤退基準は微増につき**連続カウント=0 にリセット**。★**参照ドメイン数は Search Console API に links エンドポイントが無く自動取得不能と確定**→下の新規項目へ分割。詳細 docs/ops/daily/2026-07-24.md | 柱1/柱4'/測定 | 未発見%を毎週記録（達成）／参照ドメインは代理指標へ切替 |
| 3' | **柱4' 測定: badge の外部 Referer 集計＝被リンク代理指標の自前化**（`/platform-status/badge` へのリクエストの Referer ホストを Worker 側で集計＝**バッジ被埋め込み＝被リンクの実測**。GSC links API 不在の穴を自律運用で埋める。D1 スキーマ非依存＝KV 集計で設計すること） | 柱4'/測定 | 外部 Referer ホスト数を週次で取得できる状態・本番200 |
| ~~4~~ | ~~**柱1' Track A: プローブ・カバレッジ拡大**~~ ← **実装・push 完了／デプロイのみ blocked（2026-07-24, commit `3bd3cb6`）**。Pinterest/Facebook/Bilibili を実測プローブへ昇格（資産 6→**9 PF**）・`ALSO_SUPPORTED` は Discord/Lemon8 のみに縮小。accepted-status は**各 extractor の失敗モードに合わせ個別化**（Reddit/Threads と違い 401/403/412/429 は operational にせず `limited`）＝methodology に非対称を明記。typecheck/lint/build PASS・vitest **44/44**。**未達＝`npm run deploy:prod` が wrangler 未ログイン（OAuth が 7/14 以降の未発火9日間で失効）で実行不可**。ユーザーが `npx wrangler login` を1回実行後、`npm run deploy:prod && npm run check:release:prod` で閉じる（コードは main 済み・再実装不要） | 柱1'/資産 | 本番 `/api/v1/platform-status` の platforms が 6→9・`alsoSupported`=2件 |
| 5 | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・発見の残掃除） | 柱1/発見 | 残る solution help リンクの path 形式化・本番200 |
| 6 | 柱1: 新パス ja/pt/ar の indexed/impression 推移を週次記録し、Schema/canonical/内部リンクの効果を帰属・横展開判断（発見が始まったので順位化まで追う） | 柱1/測定 | indexed/impression 推移を週次記録・効いた施策を特定 |
| 7 | **柱4' B-2（ユーザー一度きり・任意）: 7/17 に AlternativeTo 登録1回**（ClipKeep は掲載適合。文面は `docs/ops/outreach/2026-07-12.md` / authority-plan.md B-2）。※Show HN/awesome は不適合で見送り（07-10 実地） | 柱4'/権威 | 登録1回・被リンク発生（ユーザー実行分） |
| 8 | 柱2: cron が実トピック捕捉時の `/trend/[slug]` populated-render 本番検証（P0-1〜P0-4 積み残し検証。優先1 の browser 起動修復が前提） | 柱2/検証 | 実トピックで index/sitemap 収録・本番200 確認 |
| 9 | 健全性: HC-5 の yaml 2.0–2.8.2 moderate を非 `--force` の `npm audit fix` で semver 内修正（**要ユーザーの承認マーカー `（承認済み・消化可）`。未付与なら据え置き**） | 健全性 | 承認済みなら層B+ で1件消化・テスト green |


> **2026-07-24 追記（日次ループ, #006 の並びのまま消化）**: 7/15〜7/23 の9日間はスケジュールタスク登録消失により
> **ループ未発火**（本リポジトリ起因ではない・7/23 再登録済）。復帰初回で #3 計測を記録・#4 を実装＆push したが
> **wrangler の OAuth 失効でデプロイのみ blocked**（要ユーザー `npx wrangler login` 1回）。
> あわせて **fxTwitter 401（本番56/56・約14日）** を発見し優先0 として先頭に置いた。
> ★プロセス上の教訓: 自前の linkable asset（status データ）が異常を14日間出し続けていたのに運用の入力に使えていなかった。
> **日次ループの健全性チェックに `/api/v1/platform-status` の per-PF uptime 確認を含めること**（本日から実施）。

> 完了アーカイブ（#005 並べ替え・実装履歴 #1-#13・旧バックログ #2-#4）は [`docs/archive/task-history.md`](docs/archive/task-history.md) へ移設。

## 健全性バックログ（要承認リファクタ — health-check 層C。ユーザー承認後のみ daily 等で実装）

> health-check（土曜）が積む層C項目。自動適用はしない。各項目: 何を/なぜ/影響/規模。
>
> **消化ルール（層B+, 2026-06-29 追加）**: 週次 health-check は、ここから **承認マーカー `（承認済み・消化可）` が付き・規模:小・D1/bindings 非依存・ガードレール非抵触** の項目を**週1件だけ**自動で消化（実装→DoD フルデプロイ→`[x]`）する。承認マーカーを付けるのはユーザーのみ。マーカーの無い項目は積まれたまま手を付けない。「中/大」「要人間判断」項目（HC-4/HC-5 等）は対象外で、消化したい場合は規模を「小」に分割するか個別に daily で実施する。

- [x] HC-1: ~~未配線の完成機能 `src/components/share-button.tsx`~~ → **削除**（2026-06-28、ユーザー判断）。理由: 共有後の遷移先・導線などのUX設計が未着手で、コンポーネント単体を残しても使えないため。再導入時は git 履歴から復元可。
- [x] HC-2: **未使用 export 5件の棚卸し** ← **完了（2026-06-29, 層B+ 消化, ver `0bc6a5a7`）**。個別判断＝配線1・除去4。配線: `SUPPORTED_LOCALES`（metadata-helper.ts）→ `app/layout.tsx` の JSON-LD `inLanguage` にハードコードされていた同一10ロケール配列を置換（DRY 単一化・本番で同値確認）。除去（in-app 呼び出し・配線先なし）: `hasServiceAccount`・`STATUS_FILE_PATH`（analytics-auth.mjs＝SAフォールバック/statusファイルは既存関数で完結）、`markTopicRemoved`・`unmarkTopicRemoved`（topic-store.ts＝撤去の書き込みは運用ツール trend-remove-topic.mjs が wrangler CLI 経由で実施、サイトは listRemovedSlugs の読み取りのみ）。knip 未使用 export **5→0**（残 `growth-summary.mjs` ファイルは spawn 起動の偽陽性・削除禁止で不変）。typecheck/lint/build PASS・vitest 33/33・リリースゲート PASS=29/0/1。runbook も書き込み=CLI 一本化に更新。
- [x] HC-3: **クリティカルパスのテスト導入完了**（2026-06-28）。テスト基盤＝**Vitest 4**（node env、`npm test`=`vitest run`）。北極星のイベント生成ロジックを `src/lib/analytics/ad-config.ts` に挙動非変更で抽出（`AD_SCRIPTS`/`looksLikeBot`/`buildAdEventPayload`/`adZoneEventName`）し `ad-config.test.ts` で検証、`middleware.ts`（ロケール rewrite ja/pt/ar＋canonical host 301）を `middleware.test.ts` で検証。計33 tests green。今後の新規ロジックは同パターンでテストを足す。
- [ ] HC-4: **依存更新の段階バッチ**（何を: next/eslint-config-next 15→16・typescript 5.7→6.0・wrangler 4.34→4.86・@types/node 22→26・eslint 9→10・@cloudflare/workers-types 4→5 等の major 含む更新。なぜ: 放置でセキュリティ/互換負債が蓄積。影響: 大（OpenNext/Cloudflare ビルド設定が敏感、要本番検証）。規模: 大。自動更新禁止＝専用の検証付きバッチで段階適用）。**2026-07-11 health-check 実測: outdated 18 件（前回 17 → @cloudflare/puppeteer 1.0.6→1.1.0 minor が新規計上。うち上記 major、minor/patch=@opennextjs/cloudflare 1.17→1.20・tailwindcss 4.2→4.3・react 19.0→19.2 等）。数値のみ更新、実装は未着手（要承認・規模:大）。**
- [ ] HC-5: **npm audit の切り分け**（何を: 大半が build-tool 系 transitive（wrangler/miniflare/ws/yaml チェーン）。runtime 出荷依存に該当するものを優先し `npm audit fix` を検証付きで適用、majorを要する `--force` 分は HC-4 と合流。なぜ: high は放置不可だが大半は出荷バンドル外の可能性。影響: 中。規模: 中）。**2026-07-11 health-check 実測: 22 件（high 12/moderate 8/low 2）＝前回（07-04）と同数・同内訳で横ばい。high は wrangler(OS Command Injection)＋miniflare→ws＝ wrangler@4.86 major(--force) 要で HC-4 合流。**yaml 2.0–2.8.2 moderate(Stack Overflow) のみ非 --force の `npm audit fix` で semver 範囲内修正可＝「規模:小・bindings 非依存」に切り出せる層B+ 候補（ただし承認マーカー未付与＝未承認のため今週も消化せず据え置き。ユーザーが `（承認済み・消化可）` を付ければ翌週以降の層B+ で消化可能）。**

## 作業中 (In Progress)
- [/] OPS-1: 獲得ゼロ問題の是正（2026-06-12 診断に基づく）
    - [x] 原因診断: 未デプロイ（/ja/ 404・旧sitemap）、hreflang全言語同一URL、?locale= canonical畳み込み、GA4認証失効、weekly review未記入
    - [x] main を本番デプロイし `/ja` 200 と path-based sitemap を本番確認（2026-06-12, ver 708c8fc4）
    - [x] canonical/hreflang の矛盾を修正（自己参照 canonical、hreflang は en/ja/pt/ar のみ、sitemap から ?locale= を全廃 5,486→508 URL）
    - [x] GA4/GSC 認証復旧（2026-06-15 確認: `.secrets/ga4-oauth-token.json` 有効、`npm run analytics:ga4` / `analytics:gsc` 両方成功・実データ取得。失効時は `npm run analytics:ga4:login` で再ログイン）
    - [x] GSC で sitemap 再送信（2026-06-16 ユーザー手動完了）とカバレッジ確認（indexed 実数化は 06-16 計測ツールで完了）
    - [x] ~~ホーム title から未対応の TikTok を除去~~ ❌不採用（2026-06-27）: TikTok は 2026-06-15 存続承認＝実稼働のため title は既に実態一致（成功指標既達）
    - [x] workers.dev 配信の重複対策（2026-06-27, ver `1c84eac0`、本番確認済み。非正規 workers.dev ホストを 301→clipkeep.net、test は不影響）
    - [x] blog / about / contact / legal / status の canonical を metadata-helper 方式に統一（2026-06-19, ver `d3c54c81`、本番確認済み。`buildLocaleAlternates` に統一、?locale= 自己参照 canonical 解消）
- [/] Phase 3.5: 収益最大化向けSEO多言語展開（ja / pt / ar）
    - [ ] プラットフォーム×言語のロングテールキーワードマップ作成（検索需要・競合弱さ・広告収益性・実装リスクで優先度付け）
    - [x] ja/pt/ar 向け Solution ページの内容充足（X/Reddit/Telegram中心、TikTok除外）← ja(06-13)/pt(06-14)/ar(06-18) で not-working クラスタ充足完了
    - [x] 各ロケールの `<title>` / `<meta description>` をlocaleファイルに追加
    - [x] hreflangタグの実装（`/ja/`, `/pt/`, `/ar/` URLパス対応）
    - [x] Sitemap の hreflang alternates 追加
    - [x] Schema.org（FAQ/HowTo）の多言語実装 ← 完了（2026-06-20, ver `0b329ec7`、本番確認済み。breadcrumb 全10ロケール化＋FAQPage を section 別 Q&A 化）

## 完了 (Done) / 更新メモ

過去の完了フェーズ（Phase 1-3 / PUBLIC-1 / P2-*）と日次更新メモ（2026-06-03〜07-13）は [`docs/archive/task-history.md`](docs/archive/task-history.md) へ移設した（日次詳細は `docs/ops/daily/`）。

## TikTok（無期限延期は 2026-06-15 解除 — extractor 稼働中）
方針: extractor 存続＋SEO 両輪（`docs/strategy/growth-strategy.md` 決定事項1）。抽出導線は本番稼働済み。
- [x] TikTok URLバリデーション仕様追加（`prepare` API） — `src/lib/extract/tiktok-url.ts`
- [x] TikTok extractor adapter 実装（job作成/進捗/結果） — `src/lib/extract/tiktok.ts`
- [x] TikTok Result UI（品質別DL候補） — 共通 result 導線で稼働
- [ ] TikTok failure taxonomy 定義（private/region/rate-limit等）※品質向上タスク（任意）
- [ ] TikTok向け API統合テストケース追加 ※品質向上タスク（任意）
- [ ] TikTok向け E2Eケース追加 ※品質向上タスク（任意）

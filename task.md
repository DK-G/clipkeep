<!-- CURRENT-START / ここだけを常に最新に保つ。ここより下は履歴で、読むのは必要時のみ。 -->
## 現在地（2026-07-30 日次ループ反映 ／ 週次レビュー #007 ベース）

> **2026-07-30 日次ループ**: `npm run check:loop` が **BLOCKER（wrangler 未ログイン・16日目）** で exit 1 →
> 本日の結末は **`status: blocked`**。優先0〜8 は全てデプロイ断絶／人間判断／承認待ちで塞がっているため、
> **唯一デプロイ面を持たない 優先9＝HC-8「`src/lib/extract/` にユニットテスト導入」を実施**（production 非改変）。
> vitest **44→73**（+29・全て初回 green＝既存挙動の忠実な記録）。URL 正規化の集約・失敗分類の区別・
> ホスト詐称拒否・短縮リンク素通し・**鮮度判定の「不明＝期限切れ」原則**を契約として固定。
> ★**副次発見（優先1 の起点）**: `src/lib/extract/twitter.ts:186-215` の fx-api 分岐は **401 をどの枝でも分類していない**
> ＝ログも cooldown も立たず黙って落ちる。本番が20日間出し続けている `http=401` はこの穴を通るため、
> **X 抽出の劣化が extractor 自身のログに現れない**（`provider_failed` すら出ない）。修正は本番検証が要るので優先1 へ引き継ぎ。
> 本変更は本番面を持たない（テスト3本の追加のみ）ので deploy は `n/a`。詳細 `docs/ops/daily/2026-07-30.md`。
> ★**`3bd3cb6` は依然 本番未反映（16日目）**＝`npx wrangler login` が全ての前提であることは変わらない。
> ※ 07-29 スロットは daily log が無く未発火と思われる。

## 現在地（2026-07-28 日次ループ反映 ／ 週次レビュー #007 ベース）

> **2026-07-28 日次ループ**: 優先0〜3 がすべて塞がっている（0=ユーザー操作待ち・1/2=デプロイ前提・3=KV binding＝要人間判断）ため、
> **優先4「日次ループの健全性チェック強化」を実施**＝`npm run check:loop`（`scripts/loop-health-check.mjs`）を新設。
> 4項目（**wrangler 認証**／health／sitemap `<loc>`／**per-PF uptime**）を1コマンドで検査し **BLOCKER なら exit 1**。
> 手順文書（playbook・AGENTS.md・**scheduled-task の SKILL.md**）も同時に更新。
> **初回実行で、過去2件の見落とし事故（14日のデプロイ断絶・18日の twitter 401）を両方とも即検出**。
> 本変更は本番面を持たない（`scripts/`+`docs/`+npm script）ので deploy は `n/a`。詳細 `docs/ops/daily/2026-07-28.md`。
> ★**`3bd3cb6` は依然 本番未反映（14日目）**＝`npx wrangler login` が全ての前提であることは変わらない。

## 現在地（2026-07-26・週次レビュー #007 反映）
- フェーズ: **リリース済み・グロース**（北極星 = Monetag タグロード数/日）。**主軸は A+B**（07-10 転換）＝templated stub 量産は停止のまま、Track A（linkable asset の被引用性）＋ Track B（ホワイトハット被リンク）。
- 進行中: 07-26 実測 28d = ad_script_load **119**（#006 24）／セッション **36**（9）／impressions **5**（4）／clicks 0／平均順位 37.0／indexed **36/100**／**未発見 63/100**（72→68→66→65→63・改善は継続だが鈍化）。
- ★**今週の最重要発見: 北極星の急増は獲得の改善ではない**。GA4 acquisition 実測で **Google オーガニックセッション 0・Direct 91%（60/66）**、ファネルは全段 0。**`ad_script_load` 119 / セッション 36 を「戦略が効いた」と読んではならない**。Phase L の実質指標は **impressions(5) / 未発見%(63) / Googleオーガニックセッション(0)** の3点のみ。
- 次の一手（バックログ先頭から1日1件）:
  1. **【ユーザー1回操作・全ての前提】`npx wrangler login`** → 直後に `npm run deploy:prod && npm run check:release:prod` で **`3bd3cb6`（Track A 6→9 PF）を出荷して閉じる**。
  2. **柱1/修復: fxTwitter 401 の切り分けと X 抽出経路の是正**（twitter uptime **0%・401 が約16日継続**）。
  3. 柱1' A-v2（`extractor_jobs` per-PF 実成功率の併記）／柱4' badge Referer の KV 集計＝被リンク代理指標。
- ★ブロッカー/外部待ち: ①**wrangler 未ログインで 12日間 デプロイ不能**（07-14 が最後の出荷）＝`3bd3cb6` が本番未反映・最優先課題の診断も出荷できない。**これが現在の最大の律速**（戦略ではなく運用）。②参照ドメイン数は GSC API 非対応で**自動取得不能が確定**（→代理指標＝上記3）。③**柱2 の 60s 緩和は失敗**（07-13 出荷が本番で13日・約52 cron 窓 稼働して `/trend/` 産出ゼロ）＝**「有料 Browser Rendering（危害①・要承認）」か「凍結」の二択に到達。レビュー推奨は凍結**。④X 抽出の実地確認は Turnstile（403 `TURNSTILE_MISSING`）で無人不可＝診断デプロイかユーザーの手動1回が要る。
- 直近の重い判断: **★プロセス上の教訓（#007）** — デプロイ経路の OAuth は「ループが回ることでのみリフレッシュされる」循環依存で、止まると失効し 12 日気付かれなかった。**日次ループの健全性チェックに `npx wrangler whoami` を追加**（`/api/v1/platform-status` の per-PF uptime 確認は 07-24 から実施中）。
<!-- CURRENT-END -->

# 作業タスクリスト: ClipKeep

## 戦略バックログ（日次ループはここの先頭から1件選ぶ。優先順位は週次レビューが管理）

正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日）
週次レビュー #007（2026-07-26）の詳細は [`docs/ops/weekly_review_2026-07-26.md`](docs/ops/weekly_review_2026-07-26.md)、前回 #006 は [`docs/ops/weekly_review_2026-07-12.md`](docs/ops/weekly_review_2026-07-12.md)。


### 翌週 戦略バックログ（#007, 2026-07-26 並べ替え。日次ループはここの先頭から1件）

> **主軸は A+B（07-10 転換・#006/#007 の実測で 2 度追認）**: 発見（未発見% ・indexed）は改善を続けるが、
> impressions は 4→5 で不変、かつ **#007 で Google オーガニック流入 0 が確定**＝順位化には**ドメイン権威・被リンク**が要る。
> よって **templated stub 量産は停止のまま**、**Track A（linkable asset の被引用性強化）＋ Track B（ホワイトハット被リンク）** を主軸とする。
>
> **ただし #007 時点の実務上の律速は戦略ではない**＝**wrangler 未ログインでデプロイが 12 日間 断絶**しており、
> どの柱の実装も本番に届かない。**優先0（ユーザー1回操作）が全てに優先する。**
> 正本: `docs/strategy/linkable-asset-plan.md` / `docs/strategy/authority-plan.md` / growth-strategy §4 柱1'・柱4'。

| 優先 | タスク | 柱/種別 | 成功指標 |
|---|---|---|---|
| **0** | **【ユーザー1回操作・全タスクの前提】`npx wrangler login`（または `CLOUDFLARE_API_TOKEN` 設定）でデプロイ経路を復旧** → 直後に `npm run deploy:prod && npm run check:release:prod` を実行し、07-24 に push 済みの **`3bd3cb6`（Track A プローブ 6→9 PF）を出荷して閉じる**（コードは main 済み・再実装不要）。※トークン発行は Claude 側では行わない（危害ゲート④） | 運用/blocker | `npx wrangler whoami` が認証済／`/api/v1/platform-status` の platforms が 6→**9**・`alsoSupported` 2件（Discord/Lemon8） |
| ~~1~~ | ~~**柱2 起動タイムアウトの緩和（30s→60s）**~~ ← **完了（2026-07-13, ver `34b713c7`, commit `3ecf807`）**。`LAUNCH_TIMEOUT_MS 30_000→60_000`。typecheck/lint/build PASS・vitest 33/33・release gate PASS=29/0/SKIP1・D1 remote PASS・本番 health 200/sitemap 200 loc509・`/trend/`=0。**効果は次 cron 窓（`0 */6 * * *`→2026-07-13T00:00Z〜）で被検証**。baseline heartbeat `2026-07-12T18:00:14Z`＝`browserLaunched:false`/`launchAttempts:3`。**但し書き（重要）**: 失敗モードは窓ごとに揺れる＝#006 が見た 00:02Z は `exceeded 30000ms`（タイムアウト）だが、本ループ観測の 18:00Z は **429 Rate limit exceeded**（アカウ水準クォータ）。60s 緩和はタイムアウト側のみ解消し 429 側には効かない。次数窓で 429 が支配的なら「無料枠 Browser Rendering が cron から安定起動しない」＝有料切替＝要ユーザー承認の分岐へ。詳細 docs/ops/daily/2026-07-13.md | 柱2/修復 | 次 cron 窓 heartbeat で `browserLaunched:true` or 別エラーへ前進（`exceeded` 消失） |
| ~~2~~ | ~~**柱1'/柱4' アセット被引用性の強化（本命・自律）**~~ ← **一部完了（2026-07-14, ver `1d946b55`, commit `1288df0`）**。`Dataset` 機械可読性向上＋引用しやすい一次データを実装＝公開 JSON 配信 `/api/v1/platform-status`（CORS開放・CC BY 4.0・cache）＋Dataset JSON-LD を harvest 適格へ強化（`distribution`(DataDownload/JSON)・`variableMeasured`→`PropertyValue`・`temporalCoverage`・`measurementTechnique`・`keywords`）＋ページに JSON 引用リンク。単一ビルダー `buildStatusExport`/`buildDatasetJsonLd` で page/JSON/JSON-LD の乖離排除。export.test.ts 6件。typecheck/lint/build PASS・vitest 39/39・release gate **PASS=27/FAIL=2/SKIP=1**（FAIL 2 は外部 telegram t.me の実一時障害＝本番も http=530/ローカルは DNS 解決不可・uptime 履歴は100%＝変更非起因）。本番 `/api/v1/platform-status` 200・JSON-LD 全項目反映を確認。**残（別日候補）: OG 画像（OpenNext edge 制約回避の安全策要設計）・A-v2 `extractor_jobs` per-PF success_rate 併記・プローブ拡大**。詳細 docs/ops/daily/2026-07-14.md | 柱1'・柱4'/資産・権威 | 被引用性を高める公開面を1つ追加・本番200（達成）／参照ドメイン数を週次追跡 |
| **1** | **柱1/修復: fxTwitter 401 の切り分けと X 抽出経路の是正**（2026-07-24 発見・**#007 で未解消を確認**）。★**2026-07-30 追記＝着手時の起点が特定済**: `src/lib/extract/twitter.ts:186-215` の fx-api 分岐は **HTTP 401 をどの枝でも分類していない**（403/429→cooldown＋`sawBotChallenge`、404→`POST_NOT_FOUND`、`ok`→解析、**401 はどれにも入らず** `rawMedia` 空のまま黙って次のフォールバックへ）。よって**本番で20日間続く 401 は extractor 自身のログに一切現れない**（`provider_failed` すら出ない）＝「切り分け不能」の一因はこの分類漏れ。診断エンドポイント以前に、まず 401 を明示分類してログに出すのが最小の一手。本番 `/api/v1/platform-status` で twitter が `http=401`・**uptime 0% が約16日継続**。ローカル residential IP からは同 URL が 200＝**fxTwitter が Cloudflare Workers の egress を弾いている**疑い。`src/lib/extract/twitter.ts:187` が同一条件で叩いており**主力 X の抽出が本番で恒常劣化している可能性**。★**#007 追記: 無人での実地確認は不可**＝`POST /api/v1/extract/prepare` は `403 TURNSTILE_MISSING`（Turnstile は設計通り機能）。よって **Worker 側の診断ログ or 一時診断エンドポイント**で `d.fxtwitter.com`・`vxtwitter.com` フォールバックの生死を測る。**優先0 の復旧が前提** | 柱1/修復 | 本番 Worker からの X 抽出が成功する経路を1つ確定・status の twitter が operational へ |
| **2** | **柱1' Track A: A-v2 = `extractor_jobs` の per-PF 実成功率を status 資産へ併記**（合成プローブ＝上流の到達性 と 実ジョブの成功率 は別物。二軸の併記は一次データとしての価値＝被引用性を明確に上げる。優先1 の結果とも接続する。07-14 の残タスクとして記録済み） | 柱1'/資産 | status page/JSON に per-PF 実成功率が出る・本番200 |
| ~~3~~ | ~~**発見%＋参照ドメイン数の週次判定**~~ ← **一部完了（2026-07-24 計測記録）**。28d: ad_script_load **85**（前回24）/ セッション **32**（9）/ impressions **5**（4）/ clicks 0 / pos **37.0**（54.3）/ indexed **34**（33）/ **未発見 65/100**（66＝72→68→66→65 で改善継続だが**鈍化** -6→-2→-1）。判定＝**発見改善は続くが律速は順位化＝権威**（#006 の読みを追認）。**ad_script_load/セッション急増は impressions 5 と整合せず＝検索流入起因ではない**（流入元内訳を次回確認）。撤退基準は微増につき**連続カウント=0 にリセット**。★**参照ドメイン数は Search Console API に links エンドポイントが無く自動取得不能と確定**→下の新規項目へ分割。詳細 docs/ops/daily/2026-07-24.md | 柱1/柱4'/測定 | 未発見%を毎週記録（達成）／参照ドメインは代理指標へ切替 |
| **3** | **柱4' 測定: badge の外部 Referer 集計＝被リンク代理指標の自前化**（`/platform-status/badge` へのリクエストの Referer ホストを Worker 側で集計＝**バッジ被埋め込み＝被リンクの実測**。GSC links API 不在の穴を自律運用で埋める。D1 スキーマ非依存＝KV 集計で設計すること）。★**#007 で優先度を上げた**: これが**主軸 A+B の唯一の計器**であり、無いままでは柱4' の成否を永久に判定できない。★**2026-07-28 追記＝自律実装 不可と判定**: KV 集計は **Cloudflare bindings（KV namespace）の追加**を伴い、日次ループ規則「D1 schema / bindings の変更が必要なタスクは実行せず要人間判断」に該当する。**着手にはユーザーの承認と KV namespace の作成が要る**（＝優先0 と同じ「一度きりの人間操作」クラス）。代案として bindings 不要の集計先（例: 既存 D1 テーブルへの追記＝これもスキーマ変更で不可／Analytics Engine＝これも binding）を検討したが、いずれも binding を要するため回避不能 | 柱4'/測定 | 外部 Referer ホスト数を週次で取得できる状態・本番200（**要ユーザー承認: KV namespace 作成**） |
| ~~4~~ | ~~**計測/運用: 日次ループの健全性チェックに `npx wrangler whoami` を追加**~~ ← **完了（2026-07-28, commit `abe6fbe`。deploy は n/a＝本番面なし）**。散文チェックリストではなく **`npm run check:loop`（`scripts/loop-health-check.mjs`）** として実装＝①`wrangler whoami`（デプロイ経路の認証）②`/api/v1/health` 200 ③`/sitemap.xml` 200＋`<loc>`>=100 ④`/api/v1/platform-status` の per-PF `status`/`uptimePct`（**`uptimePct<90` も劣化として拾う**＝最新1回が緑でも長期劣化を見逃さない）を1コマンドで検査し、**BLOCKER があれば exit 1**（無人実行が黙って先へ進めない）。出力末尾に daily log 貼り付け用 markdown 表。実装上の判断: whoami は exit code だけでなく**出力文字列でも判定**（未ログインでも exit 0 を返しうる）・`npx` でなく `process.execPath` で `node_modules/wrangler/bin/wrangler.js` を直接起動（Windows の `.cmd` spawn EINVAL 回避）・**PowerShell 非依存**。手順文書も同時更新＝playbook「1. Health Check」＋Daily Log Template、`AGENTS.md` Main commands、**scheduled-task の `SKILL.md` 手順3（＝実際に毎日読まれる手順書。ここを直さないとリポジトリ側だけ新しくなる）**。★**初回実行で過去2件の見落とし事故（14日間のデプロイ断絶・約18日間の twitter 401）を両方とも即検出**。typecheck/lint/build PASS・vitest 44/44（production 非改変）。詳細 docs/ops/daily/2026-07-28.md | 運用/計測 | 日次ログのテンプレに2項目が入り、失効・上流異常をその日に検知できる（達成） |
| **5** | **柱2: 明示的に凍結する（#007 提案2 (b)・推奨）**。07-13 出荷の起動タイムアウト 60s 緩和は**本番で13日・約52 cron 窓 稼働して産出ゼロ**（sitemap `/trend/` 0件・`/trending` 内リンク 0件）＝#006 が予告した分岐条件に到達し、**無償の打ち手は尽きた**。選択肢は (a) **有料 Browser Rendering 切替＝危害ゲート①金銭＝要ユーザー承認**、(b) **凍結して日次枠を柱1'/柱1 へ回す**。**検索流入が実質ゼロの現状ではトレンドページを産出できても順位化しない**ため (b) を推奨。cron 自体は無害・無課金なので停止しない。★**2026-07-30 追記＝自律実行 不可と判定**: (a) は金銭＝危害ゲート①、(b) も「柱2 を凍結する」という**戦略の変更を `docs/strategy/growth-strategy.md` に書く**行為であり、ガードレール「**戦略文書の書き換え禁止（ユーザー承認時を除く）**」に該当する。**#007 の推奨は (b) だが承認の記録が無い**ため日次ループでは着手しない＝**ユーザーの一言（「凍結でよい」）が要る**（優先0 と同じ「一度きりの人間判断」クラス） | 柱2/判断 | 凍結を明記し柱2 起因タスクをバックログから外す（またはユーザー承認を得て有料化） |
| ~~4~~ | ~~**柱1' Track A: プローブ・カバレッジ拡大**~~ ← **実装・push 完了／デプロイのみ blocked（2026-07-24, commit `3bd3cb6`）**。Pinterest/Facebook/Bilibili を実測プローブへ昇格（資産 6→**9 PF**）・`ALSO_SUPPORTED` は Discord/Lemon8 のみに縮小。accepted-status は**各 extractor の失敗モードに合わせ個別化**（Reddit/Threads と違い 401/403/412/429 は operational にせず `limited`）＝methodology に非対称を明記。typecheck/lint/build PASS・vitest **44/44**。**未達＝`npm run deploy:prod` が wrangler 未ログイン（OAuth が 7/14 以降の未発火9日間で失効）で実行不可**。ユーザーが `npx wrangler login` を1回実行後、`npm run deploy:prod && npm run check:release:prod` で閉じる（コードは main 済み・再実装不要） | 柱1'/資産 | 本番 `/api/v1/platform-status` の platforms が 6→9・`alsoSupported`=2件 |
| 6 | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・発見の残掃除） | 柱1/発見 | 残る solution help リンクの path 形式化・本番200 |
| 7 | 柱1: 新パス ja/pt/ar の indexed/impression 推移を週次記録し、Schema/canonical/内部リンクの効果を帰属・横展開判断（発見が始まったので順位化まで追う） | 柱1/測定 | indexed/impression 推移を週次記録・効いた施策を特定 |
| 8 | **柱4' B-2（ユーザー一度きり・任意）: AlternativeTo 登録1回**（7/17 予定分の実施有無が未確認＝未実施なら本週。ClipKeep は掲載適合。文面は `docs/ops/outreach/2026-07-26.md` / authority-plan.md B-2）。※Show HN/awesome は不適合で見送り（07-10 実地） | 柱4'/権威 | 登録1回・被リンク発生（ユーザー実行分） |
| ~~9~~ | ~~**健全性 HC-8: `src/lib/extract/` にユニットテスト導入**~~ ← **完了（2026-07-30。deploy は n/a＝本番面なし）**。純関数のみ対象＝`twitter-url.test.ts`(11)／`tiktok-url.test.ts`(5)／`freshness.test.ts`(13)。**vitest 44→73（+29・全て初回 green＝挙動変更なし）**。固定した契約: ①8通りの X URL 形が単一 `https://x.com/i/status/<id>` に畳まれる（http→https・trim・`?s=`・`#` 除去含む）②失敗分類 `X_PROFILE_URL_NOT_SUPPORTED`／`INVALID_X_STATUS_URL`／`UNSUPPORTED_HOST` の取り違え検知③**ホスト詐称拒否**（`x.com.evil.test`・`tiktok.com.evil.test`＝前方一致でなく集合一致）④短縮リンク（`t.co`/`vt.`/`vm.tiktok.com`）はクエリのみ落として素通し⑤**鮮度判定の「不明＝期限切れ」原則**（`expiresAt` 欠落・パース不能で再取得＝逆転すると死んだ署名 URL を返す）＋2分窓の内外・複数 media で1件でも stale なら発火・他PFジョブに反応しない。I/O を含む `extractTwitter` 等はモック設計が要るため対象外（HC-8 の「純関数分だけなら小」に忠実）。typecheck/lint/build PASS。★副次発見は優先1 へ記載。詳細 docs/ops/daily/2026-07-30.md | 健全性/品質 | extract 層の純関数にテストが入り green（達成） |

> **#007 で落としたもの（明示）**: ①#006 バックログ「発見%＋参照ドメイン数の週次判定」は、参照ドメインの自動取得が**原理的に不能**と確定したため**優先3（代理指標の実装）へ統合**し、発見%の記録は週次レビューの定常業務へ吸収した。②「柱2: `/trend/[slug]` populated-render 本番検証」は**優先5（柱2 凍結判断）に吸収**（産出ゼロのため検証対象が存在しない）。③HC-5（yaml moderate）は**ユーザーの承認マーカー未付与のため据え置き**、HC-6（`next` 15.2→15.5 security minor）は規模中＝層B+ 対象外で、**優先0 の復旧後に専用日次タスク**として扱う（本番 `_next/image` は 404＝実露出は低い見込み）。


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
> **2026-07-25 health-check（週次・復帰初回。07-18 は 7/15〜7/23 のタスク登録消失で未実施）**: status **green**（層B 変更0・層B+ 消化対象0＝承認マーカー付き項目が1件も無いため）。コードは緑（typecheck/lint/knip/madge PASS・vitest 44/44・循環0・衛生良好）。**悪化2点はいずれもコード外**＝①`npm audit` 22→24（high 12→17）で**初めて出荷ランタイム（`next`）に high**（→ HC-6 新規）、②**wrangler 未ログインでデプロイが2週間 blocked**＝`3bd3cb6` が本番未反映（platform-status が 6PF のまま）・**twitter uptime 0% が約15日継続**。本番は health 200 / sitemap 200(loc 509) で健全。詳細 [`docs/ops/health/2026-07-25.md`](docs/ops/health/2026-07-25.md)。
>
> **消化ルール（層B+, 2026-06-29 追加）**: 週次 health-check は、ここから **承認マーカー `（承認済み・消化可）` が付き・規模:小・D1/bindings 非依存・ガードレール非抵触** の項目を**週1件だけ**自動で消化（実装→DoD フルデプロイ→`[x]`）する。承認マーカーを付けるのはユーザーのみ。マーカーの無い項目は積まれたまま手を付けない。「中/大」「要人間判断」項目（HC-4/HC-5 等）は対象外で、消化したい場合は規模を「小」に分割するか個別に daily で実施する。

- [x] HC-1: ~~未配線の完成機能 `src/components/share-button.tsx`~~ → **削除**（2026-06-28、ユーザー判断）。理由: 共有後の遷移先・導線などのUX設計が未着手で、コンポーネント単体を残しても使えないため。再導入時は git 履歴から復元可。
- [x] HC-2: **未使用 export 5件の棚卸し** ← **完了（2026-06-29, 層B+ 消化, ver `0bc6a5a7`）**。個別判断＝配線1・除去4。配線: `SUPPORTED_LOCALES`（metadata-helper.ts）→ `app/layout.tsx` の JSON-LD `inLanguage` にハードコードされていた同一10ロケール配列を置換（DRY 単一化・本番で同値確認）。除去（in-app 呼び出し・配線先なし）: `hasServiceAccount`・`STATUS_FILE_PATH`（analytics-auth.mjs＝SAフォールバック/statusファイルは既存関数で完結）、`markTopicRemoved`・`unmarkTopicRemoved`（topic-store.ts＝撤去の書き込みは運用ツール trend-remove-topic.mjs が wrangler CLI 経由で実施、サイトは listRemovedSlugs の読み取りのみ）。knip 未使用 export **5→0**（残 `growth-summary.mjs` ファイルは spawn 起動の偽陽性・削除禁止で不変）。typecheck/lint/build PASS・vitest 33/33・リリースゲート PASS=29/0/1。runbook も書き込み=CLI 一本化に更新。
- [x] HC-3: **クリティカルパスのテスト導入完了**（2026-06-28）。テスト基盤＝**Vitest 4**（node env、`npm test`=`vitest run`）。北極星のイベント生成ロジックを `src/lib/analytics/ad-config.ts` に挙動非変更で抽出（`AD_SCRIPTS`/`looksLikeBot`/`buildAdEventPayload`/`adZoneEventName`）し `ad-config.test.ts` で検証、`middleware.ts`（ロケール rewrite ja/pt/ar＋canonical host 301）を `middleware.test.ts` で検証。計33 tests green。今後の新規ロジックは同パターンでテストを足す。
- [ ] HC-4: **依存更新の段階バッチ**（何を: next/eslint-config-next 15→16・typescript 5.7→7.0・wrangler 4.34→4.86・@types/node 22→26・eslint 9→10・@cloudflare/workers-types 4→5 等の major 含む更新。なぜ: 放置でセキュリティ/互換負債が蓄積。影響: 大（OpenNext/Cloudflare ビルド設定が敏感、要本番検証）。規模: 大。自動更新禁止＝専用の検証付きバッチで段階適用）。**2026-07-25 health-check 実測: outdated 18 件（前回 07-11 と同数だが各 latest が前進＝typescript latest 6.0→**7.0.2**・eslint 10.7→**10.8.0**・next 16.2.10→**16.2.11**・@cloudflare/workers-types **5.20260724.1**。wrangler は latest 表示 4.86 だが npx 通知では既に **4.114.0** が存在）。minor/patch=@opennextjs/cloudflare 1.17→1.20.2・tailwindcss 4.2→4.3.3・react 19.0→19.2.8・postcss 8.5.15→8.5.23・vitest 4.1.9→4.1.10 等。数値のみ更新、実装は未着手（要承認・規模:大）。**
- [ ] HC-5: **npm audit の切り分け**（何を: 大半が build-tool 系 transitive（wrangler/miniflare/ws/yaml チェーン）。runtime 出荷依存に該当するものを優先し `npm audit fix` を検証付きで適用、majorを要する `--force` 分は HC-4 と合流。なぜ: high は放置不可だが大半は出荷バンドル外の可能性。影響: 中。規模: 中）。**2026-07-25 health-check 実測: 24 件（high 17/moderate 4/low 3）＝前回 07-11 の 22 件（12/8/2）から**悪化**（2週で +2・high +5）。★**「全て build-tool 系 transitive」という従来の整理は今回で不成立**＝`next` 本体が DIRECT high になったため出荷ランタイム分は **HC-6 に分離**。本項目に残るのは build-tool 分（wrangler OS Command Injection・miniflare→ws・undici・sharp・js-yaml・flatted・picomatch・brace-expansion・basic-ftp・form-data・path-to-regexp・defu・fast-xml-parser/builder・ip-address・qs・body-parser・@eslint/plugin-kit）＝ wrangler@4.86 major(--force) 要で HC-4 合流。**yaml 2.0–2.8.2 moderate(Stack Overflow) のみ非 --force の `npm audit fix` で semver 範囲内修正可＝「規模:小・bindings 非依存」に切り出せる層B+ 候補（ただし承認マーカー未付与＝未承認のため今週も消化せず据え置き。ユーザーが `（承認済み・消化可）` を付ければ翌週以降の層B+ で消化可能）。**
- [ ] HC-6: **`next` 15.2.9 → 15.5.21（semver-minor・security）** ← **新規（2026-07-25 health-check）**。何を: 出荷ランタイム依存である `next` 本体の high advisory（Image Optimization API の **Cache Key Confusion** / **Content Injection**）を semver-minor 更新で解消。`postcss` の high 2件（`</style>` 未エスケープ XSS・sourceMappingURL 経由の任意ファイル読み取り）も npm の解決経路上この更新に紐づく。なぜ: 初めて**ビルド工具でなく出荷バンドル**に high が乗ったため HC-5 の「低露出」整理が効かない。影響: 中〜大（15.2→15.5 の minor 跨ぎ＝OpenNext/Cloudflare ビルドが敏感・要本番フル検証）。規模: 中（＝層B+ 対象外。要ユーザー承認、専用日次タスクか HC-4 バッチで実施）。**緊急度の暫定評価: `next/image` はコンポーネント4箇所で使用中だが本番 `https://clipkeep.net/_next/image?...` は **404**（OpenNext で当該最適化エンドポイント非提供）＝ Image Optimization 系の実露出は低い見込み（要再確認）。よって緊急デプロイは不要と判断したが、放置可の意味ではない。**
- [ ] HC-7: **`knip.json` の `ignoreBinaries: ["powershell"]` を削除** ← **新規（2026-07-25 health-check）**。何を: knip の Configuration hint（"Remove from ignoreBinaries"）に従い不要エントリを除去。なぜ: 設定の陳腐化除去（knip が powershell を解決できるようになった）。影響: 極小（dev ツール設定のみ・アプリ挙動非変更）。規模: 極小。**注意: `powershell` は `package.json` の `check:prod`/`check:release`/`check:test`/`check:release:prod`/`check:release:test` で実使用中。Windows ローカル前提なら削除して問題ないが、非 Windows 環境（CI 等）で knip を回すと再発する種類の指摘＝「常に Windows で実行する」前提の明示とセットで実施すること。**（層B では 設定値=対象外 として見送った項目）
- [x] HC-8: **`src/lib/extract/` にユニットテスト導入** ← **完了（2026-07-30 日次ループ, 純関数分。deploy n/a＝production 非改変）**。追加3本で **vitest 44→73**。残（任意・別項目）: I/O を含む `extractTwitter`／`extractTikTok` のモック付きテスト（＝失敗分類の網羅。規模:中）。以下は起票時の記述。何を: 抽出レイヤー 17 モジュール（`twitter.ts`/`tiktok.ts`/`twitter-url.ts`/`tiktok-url.ts`/`m3u8.ts` 等）が**テスト0本**。まずネットワーク非依存の純関数（URL パーサ・レスポンス整形・失敗分類）から Vitest を足す。なぜ: **プロダクトの中核経路かつ現在の最優先障害（fxTwitter 401・本番 X 抽出の恒常劣化）が起きている当のレイヤー**で回帰検知が皆無。既存テストは middleware / ad-config / platform-status の3系統のみ（44 tests）。影響: 小（テスト追加のみ・production 非改変）。規模: 小〜中（純関数分だけなら小）。

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

## 週次レビューの記録

> 先頭を占有していたため CURRENT ブロック導入時（2026-07-25）にここへ移した。**内容は当時のまま・削除していない**。詳細は各レビュー文書を参照。

> **2026-07-26 週次レビュー（#007）で並べ替え。#006 から 14 日空き**（7/15〜7/23 のタスク登録消失で 07-19 スロットが未実施）。計測は健全（SA・fresh・`blocked:false`）:
> 実測 28d: ad_script_load=**119**（#006 24）、セッション=**36**（9）、GSC impressions=**5**（4）、clicks 0、pos 37.0、indexed **36/100**、未発見 **63/100**（66→63）。
> ★**最重要: 北極星の急増は獲得の改善ではない**＝GA4 acquisition 実測で **Google オーガニックセッション 0・Direct 91%（60/66）**・ファネル全段 0。
> `ad_script_load` とセッションは Phase L の判定指標から外し、**impressions / 未発見% / Googleオーガニックセッション の3点で判定する**（#007 提案1）。
> **律速は #006 と同じ「順位化＝権威」で、Google 流入 0 という直接証拠が加わり診断は強化**。ただし**実務上の律速は戦略でなく「デプロイ経路の 12 日間断絶」**（wrangler 未ログイン）。
> **柱2 の 60s 緩和は失敗**（本番13日・約52 cron 窓で `/trend/` 産出ゼロ）＝**有料化（要承認）か凍結の二択に到達・推奨は凍結**（#007 提案2）。
> **柱4' は 2 週間 前進なし・かつ効果を測る計器が無い**＝badge Referer の代理指標を優先3 へ格上げ（#007 提案3）。
> 撤退基準: impressions 4→5 の**微増＝成長**につき**連続非成長=0（非該当）**。ただし母数5のノイズであり「改善の証拠」と読まないこと。
> 詳細: `docs/ops/weekly_review_2026-07-26.md`。前回: `#006 2026-07-12`。

> **2026-07-12（#006）以前の記録**: 詳細は [`docs/ops/weekly_review_2026-07-12.md`](docs/ops/weekly_review_2026-07-12.md)、前回は `#005 2026-07-05`。

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

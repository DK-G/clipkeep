<!-- CURRENT-START / ここだけを常に最新に保つ。ここより下は履歴で、読むのは必要時のみ。
     日次・週次ループへ: 「現在地」セクションはこのブロック内に**常に1つだけ**。更新は追記ではなく
     差し替えで行い、前回分はブロックの外（下の履歴側）へ送ること（D:\dev\AGENTS.md「CURRENT ブロック」）。 -->
## 現在地（2026-08-16 週次レビュー #010 反映）

- フェーズ: **リリース済み・グロース**（北極星 = Monetag タグロード数/日）。**主軸は A+B**（07-10 転換）＝templated stub 量産は停止のまま、Track A（linkable asset の被引用性）＋ Track B（ホワイトハット被リンク）。
- 実測 28d（as of 2026-08-16）: ad_script_load **429**（#009 336）／セッション **65**（57）／エンゲージメント率 **52.3%**（59.6%）／impressions **7**（8, query次元）／**26**（32, page次元）／**非ブランド impressions 0（3週連続）**／clicks 0／indexed **37/100**（37）／**未発見 61/100（62→61）**。
- ★★**#010 の最重要発見（計測）: GA4 `page_view` が初めて発火し、北極星のトラフィックが `page_view` を1回も出していないことが確定した**。`session_start` **223** に対し `page_view` は **4（activeUsers=1）**。`/` は **195 セッションで views 0**。一方 `/trending`→`gallery_card_click`→`/result/...`(2 views) という**人間の形をした導線は 1 ユーザー分だけ存在**。＝**28日間で人間らしいセッションは 1 件のみ**。**#007〜#009 が「views=0 は当プロパティで未計測」と説明してきたのは誤り**で、正しくは「**計測は生きているが発生していない**」（→§7 提案5 の教訓）。
- ★**#010 の判定: 両 impressions 系列がそろって減少**（query 8→7・page 32→26）＝#008 の合成ルールで**初めて「非成長」にカウント**（**連続 1/8**）。ただし実体は「先週より1人少ない人が『clipkeep』と検索した」だけ。**8期にわたり、この基準が判定しようとしている戦略は一度も実行されていない**（出荷5週連続0・日次ループ3週停止・デプロイ33日断絶）。
- ★**pt の優位は 3 週連続で再現**＝page次元で **pt 6/6 が pos 2〜7**（平均4.2・対象URLの顔ぶれも不変）。en **15**（19・`/` が 12→8 で減少が主因）／ja 3／es 1／hi 1／**ar は 3 週連続 0**。
- ★**Google オーガニックセッション 0（4週連続）・Direct 97.4%（221/227）・referral 0（2週連続）**。yandex organic のみ 2 件。
- ★★**ブロッカー（2週連続で無変化）: 日次ループは `enabled:false` のまま＝11 スロット連続 未発火・daily log 空白 17 日**。#009 が並べ替えた 13 件は**1 件も消費されなかった**（予告どおり）。**wrangler 未ログインでデプロイが 33 日間 断絶**（`3bd3cb6` 未反映 23日目）。twitter 401 は約37日継続。**本週の出荷 0 件**（コミットは health-check 記録 `48eca09` の1件のみ）。
- ★**柱2 凍結の判断材料が増えた**: 08-15 health-check の **HC-11**＝`@cloudflare/puppeteer`（DIRECT high）は**版を上げても直らない**ことが確定。**柱2 を凍結すれば puppeteer 依存ごと落とせて脆弱性が構造的に消える**＝凍結推奨の理由が「産出ゼロ」に「high 1件解消」が加わり二重化。
- 次の一手（**優先1/3/5/7 はデプロイ不要**。ただし日次ループ再有効化が前提）:
  1. **【ユーザー操作・3点】(a) 日次ループ再有効化 →(b) `npx wrangler login`＋`3bd3cb6` 出荷 →(c) KV namespace 作成**。
  2. **優先1: 非ブランド impressions ＋ page次元 ＋ ★`session_start`/`page_view` 乖離 の計測実装**（`scripts/growth-summary.mjs` のみ・新規API呼び出しゼロ）。
  3. **優先2: `twitter.ts:186-215` の 401 明示分類**（実装・テスト・push はデプロイ非依存で先行可）。
- ★ユーザー判断待ち: ①**柱2 を凍結してよいか**（**3週間 未回答**・HC-11 で価値上昇）②**ar を柱1 の優先ロケールから外す**か（**2週間 未回答**・§4本文の書き換えのため要承認）③**日次ループ停止中に週次レビューへデプロイ不要タスク1件の実装権限を与えるか**（#010 提案6・スケジュール定義の変更）。
- 詳細: [`docs/ops/weekly_review_2026-08-16.md`](docs/ops/weekly_review_2026-08-16.md)
<!-- CURRENT-END -->

## 現在地（2026-08-09 週次レビュー #009 反映）

- フェーズ: **リリース済み・グロース**（北極星 = Monetag タグロード数/日）。**主軸は A+B**（07-10 転換）＝templated stub 量産は停止のまま、Track A（linkable asset の被引用性）＋ Track B（ホワイトハット被リンク）。
- 実測 28d（as of 2026-08-09）: ad_script_load **336**（#008 237）／セッション **57**（65・**初の減少**）／エンゲージメント率 **59.6%**（55.4%）／impressions **8**（7, query次元）／**32**（33, page次元）／clicks 0／indexed **37/100**（36）／**未発見 62/100（63→62）**。
- ★★**#009 の最重要発見（運用）: 日次グロースループはスケジューラ上で `enabled: false`＝無効化されていた**。`lastRunAt 2026-07-29T21:46Z` で最後の daily log（07-30）と一致し、**07-31／08-03〜08-07 の 6 スロット連続で未発火**（2026-08 の daily log はゼロ件）。#008 が「発火率が5割を切っている」と記録して原因究明を見送った現象の**根本原因**。**バックログをどれだけ並べ替えても消費する主体が停止している**。再有効化はユーザー操作（優先0(a)）。
- ★**#009 の発見1（計測）: 撤退基準を駆動している query次元 impressions は全件がブランドクエリだった**。8件の内訳は `clipkeep` 7 ＋ `tubekeep` 1 で、**柱1 が狙う非ブランドの問題解決クエリからの impression は 0**。＝**撤退基準は「ノイズが大きい」のではなく「測る対象を間違えている」**（→優先1 で是正）。平均順位 30.1→16.4 も**順位改善ではなく表示クエリ構成の変化**。
- ★**#009 の発見2: 自サイト名 `clipkeep` でも position 6〜16（usa 15.7）・clicks 0**。固有名詞クエリで1位を取れない＝**ドメイン権威不足の最も直接的な実測**。同時に**ディレクトリ登録が最初に効く場所**の特定でもある（→優先12）。
- ★**#009 の訂正: #008 の「発見は頭打ち」判定は1週で覆った**。未発見 63→**62**・indexed 36→**37** で改善再開。**1週の横ばいを構造的な天井と断定したのが早計だった**（ただし+1はノイズ域）。
- ★**#009 の確定: pt の優位は2週連続で再現**＝page次元で **pt 6件中 6件が pos 2〜7**（平均4.2・#008 は7件中6件）。en 19（`/` は 11.75）／ja 4／es 2／hi 1／**ar は2週連続 0**。#008 優先6 のデータゲートを通過し**優先4 へ昇格**。
- ★**Google オーガニックセッション 0（3週連続）・Direct 96%（173/180）・referral ついに 0 件**。**セッション減（65→57）と ad_script_load 増（237→336）が同時成立**＝1セッションあたり 3.6→5.9 ロード＝非人間トラフィック説をさらに補強。
- ★**ブロッカー（4週連続）: wrangler 未ログインでデプロイが 26 日間 断絶**。`3bd3cb6`（6→9 PF）は本番未反映 16日目。twitter 401 は約30日継続（uptime 0% n=56）。**本週の出荷も 0 件**。
- ★**08-08 の週次健全性チェックは `status: skipped`**（未コミット docs 4件で作業ツリーが汚れていたため）。**本レビューで先にコミットして解消済**（内容＝SAキーを `D:\secrets\clipkeep\` へ退避した実作業の文書反映・コード0行）。
- 詳細: [`docs/ops/weekly_review_2026-08-09.md`](docs/ops/weekly_review_2026-08-09.md)

## 現在地（2026-08-02 週次レビュー #008 反映）

- フェーズ: **リリース済み・グロース**（北極星 = Monetag タグロード数/日）。**主軸は A+B**（07-10 転換）＝templated stub 量産は停止のまま、Track A（linkable asset の被引用性）＋ Track B（ホワイトハット被リンク）。
- 実測 28d（as of 2026-08-02）: ad_script_load **237**（#007 119）／セッション **65**（36）／エンゲージメント率 **55.4%**（72.2%）／impressions **7**（5, query次元）／**33**（page次元・新規）／clicks 0／indexed **36/100**（36）／**未発見 63/100（63→63）**。
- ★**#008 の発見1: 発見（インデックス）の改善が完全に停止**。未発見% は 72→68→66→65→63→**63** で、改善幅 −6→−2→−1→−2→**0**。sitemap 501 が 3 週間不変＝**Google に渡す新規 URL がゼロ**なので必然。**「発見」はもう伸ばせるレバーではない**。
- ★**#008 の発見2（計測の穴）: 従来の impressions 系列は GSC 匿名化で実測の約 1/4.7 しか捉えていなかった**。query×page×country×device 次元 = **7** に対し、同じ 28日窓の **page 次元 = 33**。**撤退基準がノイズ駆動になっている**（→ 優先1 で是正）。
- ★**#008 の発見3: page 次元で見ると pt だけが順位化している**。en 19 / **pt 7（うち 6 件が pos 2〜7）** / ja 4 / es 2 / hi 1、**ar は 0**。柱1「ja/pt/ar 優先」は実測に支持されていない（ただし各行1〜2 impr のノイズ域＝#009 で 2 週分を確認して確定）。
- ★**Google オーガニックセッション 0（2週連続）・Direct 91%（121/133）**。セッション倍増と同時にエンゲージメント率が 16.8pp 低下＝**非人間トラフィック説を補強**。`ad_script_load` 237 を成果と読まないこと（#007 提案1 の運用継続）。
- ★**ブロッカー（3週連続・最大）: wrangler 未ログインでデプロイが 19 日間 断絶**。`3bd3cb6`（6→9 PF）は push 済み・**本番未反映 9 日目**。本週の出荷は **0 件**（コミット3件は全て本番面なし）。
- ★twitter 401 は **直近14日のプローブ 56/56 すべて失敗**（uptime ローリング窓 = `HISTORY_MAX 56` × 6h = 14日／`src/lib/platform-status/probes.ts:267`）。プローブ自体は正常稼働（`checkedAt` fresh）。
- 次の一手（バックログ先頭から1日1件・**優先1/3/7 はデプロイ不要**なので断絶中でも消化できる）:
  1. **【ユーザー操作】`npx wrangler login`＋KV namespace 作成**（Cloudflare 作業をまとめて1回）→ `3bd3cb6` 出荷。
  2. **優先1: page 次元 impressions の計測実装**（`scripts/growth-summary.mjs` のみ・デプロイ不要・新規API呼び出しゼロ）。
  3. **優先2: `twitter.ts:186-215` の 401 明示分類**（実装・テスト・push はデプロイ非依存で先行可）。
- ★ユーザー判断待ち（1週間 未回答）: **柱2 を凍結してよいか**（#007 提案2 (b)・#008 提案3 で再提示。60s 緩和は本番20日・約80 cron 窓で `/trend/` 産出ゼロ）。
- 詳細: [`docs/ops/weekly_review_2026-08-02.md`](docs/ops/weekly_review_2026-08-02.md)

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

# 作業タスクリスト: ClipKeep

## 戦略バックログ（日次ループはここの先頭から1件選ぶ。優先順位は週次レビューが管理）

正本: `docs/strategy/growth-strategy.md`（北極星: Monetag タグロード数/日）
週次レビュー #010（2026-08-16）の詳細は [`docs/ops/weekly_review_2026-08-16.md`](docs/ops/weekly_review_2026-08-16.md)、前回 #009 は [`docs/ops/weekly_review_2026-08-09.md`](docs/ops/weekly_review_2026-08-09.md)。


### 翌週 戦略バックログ（**#010, 2026-08-16 並べ替え＝これが現行の正**。日次ループはここの先頭から1件）

> ★★**まず読むこと（#010 §4.1）**: **日次グロースループは 2 週連続で `enabled: false` のまま**
> （`lastRunAt 2026-07-29T21:46Z`・**11 スロット連続 未発火**＝07-31／08-03〜08-07／08-10〜08-14・**daily log 空白 17 日**）。
> **#009 が並べ替えた 13 件は、予告どおり 1 件も消費されなかった。** この表も、優先0(a) が解けない限り同じ運命をたどる。
> **バックログの精緻化より優先0 の解消が先である**（3 週連続で同じことを書いている）。
>
> **主軸は A+B のまま（07-10 転換・#006〜#010 の実測で 5 度追認）**。#010 で診断が 3 点 更新された:
> ① ★★**GA4 `page_view` が初発火（4件・1ユーザー）した一方、`session_start` は 223**。`/` は **195 セッションで views 0**。
>    ＝**計測は生きており、北極星のトラフィックは `page_view` を 1 度も出していない**。**28日間で人間の形をしたセッションは 1 件のみ**。
>    #007〜#009 の「views=0 は未計測だから」という説明は**誤りだったと確定**（→ 優先1 に (iii) 乖離の常時計測を追加）。
> ② ★**両 impressions 系列がそろって減少**（query 8→7・page 32→26）＝合成ルールで**初の「非成長」カウント（連続 1/8）**。
>    非ブランド impressions は **3 週連続 0**。ただし**この 8 期、基準が判定しようとしている戦略は一度も実行されていない**。
> ③ ★**柱2 凍結に セキュリティ上の利得が付いた**＝HC-11（`@cloudflare/puppeteer` の DIRECT high は版上げで直らない）は、
>    **柱2 を凍結して puppeteer 依存を落とせば構造的に消える**（→ 優先6 に結合）。
> かつ **pt の優位は 3 週連続で再現**（6/6 が pos 2〜7・対象URLの顔ぶれも不変・ar は 3 週連続 0）。
>
> **実務上の律速は 5 週連続で戦略ではない**＝**デプロイ断絶 33 日**（`3bd3cb6` 未反映 23日目）＋**日次ループ停止 3 週**。
> #010 では**デプロイ不要で完遂できるタスクを 4 件（優先1・3・5・7）** 上位に集めた。
> 正本: `docs/strategy/linkable-asset-plan.md` / `docs/strategy/authority-plan.md` / growth-strategy §4 柱1'・柱4'。

| 優先 | タスク | 柱/種別 | デプロイ要否 | 成功指標 |
|---|---|---|---|---|
| **0** | **【ユーザー操作・全タスクの前提／3点まとめて】** ★**(a) 日次ループの再有効化**＝スケジュールタスク `clipkeep-daily-growth-loop` が **2 週連続で `enabled: false`**（**11 スロット連続 未発火・daily log 空白 17 日**・#010 §4.1）。**これを戻さない限り以下のどのタスクも実行主体が存在しない。** ※再有効化は Claude 側では行わない（スケジューラの永続設定＝ユーザーの領分）。★**(b) `npx wrangler login`**（または `CLOUDFLARE_API_TOKEN` 設定）でデプロイ経路を復旧 → 直後に `npm run deploy:prod && npm run check:release:prod` で 07-24 push 済みの **`3bd3cb6`（Track A プローブ 6→9 PF）を出荷して閉じる**（コードは main 済み・再実装不要／**33 日間 断絶・未反映 23 日目**）。★**(c) 優先9 用の KV namespace 作成**（同じ Cloudflare 作業なのでユーザーの往復を1回で済ませる）。※トークン発行・namespace 作成は Claude 側では行わない（危害ゲート④／bindings 変更は要人間判断） | 運用/blocker | — | (a) `enabled: true` かつ翌営業日に daily log が生成される／(b) `npx wrangler whoami` が認証済・`/api/v1/platform-status` の platforms が 6→**9**・`alsoSupported` 2件（Discord/Lemon8）／(c) namespace 作成済み |
| **1** | **【自律可・デプロイ不要／3週連続で優先1・未着手】計測: `growth:review` に (i) 非ブランド impressions (ii) page 次元 impressions（locale 別・position 別） (iii) ★`session_start` と `page_view` の乖離 を追加**。理由＝(i)(ii) は #008/#009 と同じ（query 次元は**全件ブランドクエリ**で戦略の成否と因果的に無関係＝**戦略が完全に失敗していてもブランド検索が1件増えれば撤退カウンタがリセットされる**）。★**(iii) は #010 の新規**＝`session_start` 223 に対し `page_view` 4（1ユーザー）という乖離が、**「北極星が人間の閲覧をほぼ含まない」ことを毎週自動で可視化する**唯一の指標だから（§1.1）。実装は `latest-gsc-query-pages.csv` / `latest-gsc-pages.csv` / GA4 events の**既に取得済みデータの集計のみ＝新規 API 呼び出しゼロ**＝`scripts/growth-summary.mjs` の集計とサマリー出力の追加のみ。週次レビュー #010 §7 提案1 | 計測 | **不要** | `npm run growth:review` の出力とスナップショット JSON に「非ブランド impressions」「page 次元ロケール別内訳」「session_start/page_view 乖離」が出る |
| **2** | **柱1/修復: fxTwitter 401 の明示分類とログ化**。`src/lib/extract/twitter.ts:186-215` の fx-api 分岐は **HTTP 401 をどの枝でも分類していない**（403/429→cooldown＋`sawBotChallenge`、404→`POST_NOT_FOUND`、`ok`→解析、**401 はどれにも入らず** `rawMedia` 空のまま黙って次のフォールバックへ）＝**本番が約37日間 出し続けている 401 が extractor 自身のログに一切現れない**（`provider_failed` すら出ない）。まず 401 を明示分類してログに出すのが最小の一手。★**実装・ユニットテスト・push はデプロイ非依存で先行できる**（本番検証のみ優先0(b) の復旧が前提）。本番 status: twitter `http=401`・**uptime 0% n=56 が約37日継続**。ローカル residential IP からは同 URL が 200＝**fxTwitter が Workers egress を弾いている**疑い。※実地確認は `POST /api/v1/extract/prepare` が `403 TURNSTILE_MISSING` を返すため無人不可（Turnstile は設計通り機能・CAPTCHA 回避は行わない） | 柱1/修復 | 検証のみ要 | 401 が失敗分類に現れる・vitest green／（復旧後）status の twitter が operational へ |
| **3** | **【自律可・デプロイ不要】健全性 HC-9: 認証/レート制限レイヤーのユニットテスト**。`src/lib/rate-limit/extract.ts` の `getClientKey`（cf-connecting-ip→x-forwarded-for→'unknown' の優先順位）と in-memory バケットの窓/上限判定＝**純粋に近い部分から**。`verifyTurnstileToken` は `fetch`／`getCloudflareContext` のモックが要るため分割可。**"fail-closed であること"を契約として固定する**のが目的。★**08-15 health-check が「前半だけ切り出せば規模:小・bindings 非依存・production 非改変」と再確認**（テスト0本の状態が2週目） | 健全性/品質 | **不要** | rate-limit の純関数にテストが入り green（production 非改変） |
| **4** | **柱1: pt ロケール既存ページの内容深化**。データゲートは #009 で通過済＋**#010 で 3 週連続再現**＝pt は **6 impressions 中 6 件すべてが pos 2〜7**（平均4.2・対象URLの顔ぶれも #009 と完全一致）、対して en は 19→**15**（`/` が 12→8）、ja 3／es 1／hi 1、**ar は 3 週連続 0**。対象候補: `/pt`(pos2)／`/pt/blog/safest-video-downloader-sites`(pos2)／`/pt/latest`(pos4)／`/pt/blog/twitter-video-download-mp4`(pos7)／`blog/how-to-download-twitter-videos?locale=pt`(pos4)。**新規 URL は増やさない**（stub 量産停止方針を維持＝thin/doorway リスク非増）。★**#010 の変更: 実装・push はデプロイ非依存で先行できる**ことを明記（本番反映のみ優先0(b) 待ち）。※但し書き: 各行 1〜2 impression のノイズ域であり「3週連続の再現」は**偶然ではないの根拠**にはなるが「pt は上位表示できている」の根拠にはならない | 柱1/内容 | 本番反映のみ要 | pt ページの impressions/position が 2 週連続で改善 |
| **5** | **【自律可・デプロイ不要】健全性 HC-7: `knip.json` の `ignoreBinaries: ["powershell"]` を削除**（knip の Configuration hint "Remove from ignoreBinaries" に従う設定の陳腐化除去。影響: 極小＝dev ツール設定のみ・アプリ挙動非変更）。★**#009 の優先10 から繰り上げ**＝重要度ではなく、**デプロイ断絶5週・日次ループ停止3週のためデプロイ不要枠を上位へ集める**運用判断。※**注意**: `powershell` は `package.json` の `check:prod`/`check:release`/`check:test`/`check:release:prod`/`check:release:test` で**実使用中**。Windows ローカル前提なら削除して問題ないが、非 Windows 環境（CI 等）で knip を回すと再発する＝「常に Windows で実行する」前提の明示とセットで実施すること | 健全性/品質 | **不要** | knip PASS・`npm run check:*` が従来どおり動作（production 非改変） |
| **6** | **柱2: 凍結の可否をユーザーに確認する（#007 提案2(b)・#008/#009/#010 で再提示）**。07-13 出荷の起動タイムアウト 60s 緩和は**本番で 34 日・約136 cron 窓 稼働して産出ゼロ**（sitemap `/trend/` 0件・`/trending` 内リンク 0件）＝**無償の打ち手は尽きた**（4週連続で同一結論）。★★**#010 で判断材料が増えた**＝08-15 health-check の **HC-11** で `@cloudflare/puppeteer`（**DIRECT high**）は**最新 1.3.0 も同じ脆弱版を固定＝版上げでは直らない**ことが確定した。**柱2 を凍結すれば `src/lib/auto-trend.ts` / `src/lib/extract/browser.ts` の puppeteer 依存ごと落とせ、この high が構造的に消える**。選択肢は (a) **有料 Browser Rendering 切替＝危害ゲート①金銭＝要ユーザー承認**、(b) **凍結して日次枠を柱1'/柱1 へ回す**。**推奨は (b)**（産出ゼロ＋high 1件解消の二重の理由）。cron 自体は無害・無課金なので停止しない。★(b) も戦略文書の書き換えでガードレール抵触のため**ユーザーの一言（「凍結でよい」）が要る**。★**#010 時点で 3 週間 未回答** | 柱2/判断 | — | ユーザーの一言を得て task.md に明記し、柱2 起因タスクと puppeteer 依存（HC-11）の扱いを同時に確定する |
| **7** | **【自律可・デプロイ不要】健全性 HC-8 残: `extractTwitter`／`extractTikTok` の I/O モック付きテスト**（07-30 で純関数分は完了＝vitest 44→73。残りは**失敗分類の網羅**でモック設計が要る＝規模:中）。優先2 と同じレイヤーなので連続実施が自然 | 健全性/品質 | **不要** | extract 層の失敗分類にテストが入り green（production 非改変） |
| **8** | **健全性 HC-6: `next` 15.2.9 → `next@15.5.23`（security・緊急度 高）**。advisory 全文確認で **middleware redirect SSRF**(GHSA-4342-x723-ch2f) / **rewrites の HTTP request smuggling**(GHSA-ggv3-7p47-pfv8) / **rewrites 経由 SSRF**(GHSA-p9j2-gv94-2wf4) / **App Router の Middleware・Proxy bypass**(GHSA-267c-6grr-h53f, GHSA-26hh-7cqf-hhc6) / **middleware redirect の cache poisoning**(GHSA-3g8h-86w9-wvmq) / **RSC cache poisoning**(GHSA-wfc6-r584-vfw7) / **CSP nonce XSS**(GHSA-ffhc-5mcf-pf4q) / **Server Function endpoint の無認証開示**(GHSA-955p-x3mx-jcvp) が **ClipKeep の構成（App Router＋`middleware.ts` の locale rewrite＋canonical host 301）に直接該当し得る**。★**08-15 実測で修正先が 15.5.22→15.5.23 に前進**し、新規検出の `nanoid` high 2件（postcss 経由）も**同梱で解消される見込み**。実体は semver-minor だが `package.json` が `"next": "15.2.9"` 完全固定のため **`package.json` の版指定変更を伴う**＝層B/層B+ 不可。**要ユーザー承認・要本番フル検証**（優先0(b) の復旧後に早期実施を推奨） | 健全性/security | 要 | `next@15.5.23` で typecheck/lint/build/vitest PASS・本番フル検証 PASS |
| **9** | **柱4' 測定: badge の外部 Referer 集計＝被リンク代理指標の自前化**（`/platform-status/badge` の Referer ホストを Worker 側で KV 集計＝**バッジ被埋め込み＝被リンクの実測**。GSC links API 不在の穴を埋める＝**主軸 A+B の唯一の計器**で、**不在のまま5週間**）。★**2026-07-28 判定＝自律実装 不可**: KV 集計は **Cloudflare bindings（KV namespace）の追加**を伴い「D1 schema / bindings 変更は要人間判断」に該当（代案の D1 追記・Analytics Engine もいずれも binding 要で回避不能）。★**#010 で 5→9 に降格**＝**重要度の変更ではなく、自律不可の項目を上位に置いても日次ループが消費できない**ため（#008 で同じ理由の入れ替えを行った前例に倣う）。**優先0(c) と同時にユーザーへ依頼**。★#010 実測: GA4 referral は **2週連続で 0 件** | 柱4'/測定 | 要 | 外部 Referer ホスト数を週次で取得できる状態・本番200（**要ユーザー承認: KV namespace 作成**） |
| **10** | **柱1' Track A: A-v2 = `extractor_jobs` の per-PF 実成功率を status 資産へ併記**（合成プローブ＝上流の到達性 と 実ジョブの成功率 は別物。二軸の併記は一次データとしての価値＝被引用性を明確に上げる。優先2 の結果とも接続する。07-14 の残タスクとして記録済み） | 柱1'/資産 | 要 | status page/JSON に per-PF 実成功率が出る・本番200 |
| **11** | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・発見の残掃除） | 柱1/発見 | 要 | 残る solution help リンクの path 形式化・本番200 |
| **12** | **柱4' B-2（ユーザー一度きり・任意）: AlternativeTo 登録1回**（**5週連続で未確認**。ClipKeep は掲載適合）。★位置づけは #009 から不変＝**「被リンク一般」ではなく「ブランドクエリの実体解決」**。#010 実測でも `clipkeep` の position は **can 9 / ind 7 / nld 8 / usa 15.7・clicks 0** で**自サイト名で1位を取れない状態が2週連続**。★#010 の追加観察: **国の顔ぶれが毎週入れ替わる**（idn/phl が消え can が出現）＝ブランド想起は蓄積しておらず単発検索が数件あるだけ。成果の測り方＝全体 impressions ではなく **`clipkeep` クエリの position が 1 に近づくか**。文面は `docs/ops/outreach/2026-08-02.md`（正本）／差分は `docs/ops/outreach/2026-08-16.md`／authority-plan.md B-2。※Show HN/awesome は不適合で見送り（07-10 実地） | 柱4'/権威 | — | 登録1回・被リンク発生（ユーザー実行分）／`clipkeep` クエリ position が改善 |

> **#010 で落としたもの・変えたもの（明示）**:
> - **HC-7 を優先10 → 5 に繰り上げ**。重要度ではなく**デプロイ不要枠を上位へ集める運用判断**（#009 で 12→10 に上げた延長。日次ループ停止が 3 週に及ぶため）。
> - **柱4' KV（badge Referer）を優先5 → 9 に降格**。**自律不可の項目を上位に置いても消費されない**ため。**重要度の評価は不変＝主軸 A+B の唯一の計器**。
> - **優先1 に (iii)「`session_start`／`page_view` 乖離」を追加**（#010 §1.1 の発見を毎週自動で可視化する。同一スクリプト内・追加コストほぼゼロ）。
> - **優先4（pt 深化）のデプロイ要否を「要」→「本番反映のみ要」に明記変更**。デプロイ断絶5週の現状で「要デプロイ」とだけ書くと着手不能に見えるため（実装・push は先行できる）。
> - **優先6（柱2 判断）に HC-11 を結合**。凍結が「産出ゼロの整理」から「DIRECT high の構造的解消」を兼ねるようになったため。
> - **HC-10（`src/lib/rate-limit/extract.ts:59-60` の env parse に NaN ガードが無く潜在 fail-open）は今週もバックログに積んでいない**。理由不変: **セキュリティ性質を変える修正であり本番検証なしに出荷すべきでない**＝優先0(b) の復旧後に HC-9（優先3）とセットで扱う。実害は現時点でなし（3つの wrangler toml すべて正常値）。
> - HC-5（yaml moderate）は**ユーザーの承認マーカーが 6 週連続で未付与**のため据え置き。
> - **#009 の 13 件はすべて未着手のまま引き継いだ**（日次ループ停止のため 1 件も消費されなかった）。

---

### （履歴）#009, 2026-08-09 の並び ＝ 完了記録を含むため保存。**現行のバックログは上の #010**

> ★★**まず読むこと（#009 §4.1）**: **日次グロースループはスケジューラ上で `enabled: false`＝無効化されている**
> （`lastRunAt 2026-07-29T21:46Z`＝最後の daily log 07-30 と一致・**07-31／08-03〜08-07 の 6 スロット連続 未発火**・2026-08 の daily log はゼロ件）。
> **この表をどれだけ丁寧に並べ替えても、消費する主体が停止している限り 1 件も実行されない。**
> #008 が「デプロイ不要のタスクを3件用意した＝全部ブロックで日次枠が溶けるのを避けるため」と書いた配慮は、
> **そもそも日次枠自体が存在しなかったため空振りに終わった**。**優先0(a) の解消がこの表の全項目に優先する。**
>
> **主軸は A+B のまま（07-10 転換・#006〜#009 の実測で 4 度追認）**。#009 で診断が 3 点 更新された:
> ① ★**撤退基準を駆動している query次元 impressions は全件がブランドクエリ**（`clipkeep` 7＋`tubekeep` 1）＝
>    **非ブランド impressions は 0**＝柱1 が狙う需要には 1 度も到達していない。**基準は「ノイズが大きい」のではなく「測る対象を間違えている」**（→優先1）。
> ② ★**自サイト名 `clipkeep` でも position 6〜16・clicks 0**＝ドメイン権威不足の最も直接的な実測。**ディレクトリ登録が最初に効く場所**でもある（→優先12）。
> ③ ★**#008 の「発見は頭打ち」判定は1週で訂正**（未発見 63→**62**・indexed 36→**37** で改善再開）。1週の横ばいを構造的な天井と断定したのが早計だった。
> かつ **pt の優位は2週連続で再現**（page次元で **6/6 が pos 2〜7**・ar は2週連続0）＝#008 優先6 のデータゲート通過 → **優先4 へ昇格**。
>
> **実務上の律速は 4 週連続で戦略ではない**＝**wrangler 未ログインでデプロイが 26 日間 断絶**（`3bd3cb6` 未反映16日目）。
> #009 では**デプロイ不要で完遂できるタスクを 4 件（優先1・3・7・10）** 用意した（#008 の3件から1件増）。
> 正本: `docs/strategy/linkable-asset-plan.md` / `docs/strategy/authority-plan.md` / growth-strategy §4 柱1'・柱4'。

| 優先 | タスク | 柱/種別 | デプロイ要否 | 成功指標 |
|---|---|---|---|---|
| **0** | **【ユーザー操作・全タスクの前提／3点まとめて】** ★**(a) 日次ループの再有効化**＝スケジュールタスク `clipkeep-daily-growth-loop` が **`enabled: false`**（07-30 以降 **6 スロット連続 未発火**・#009 §4.1）。**これを戻さない限り以下のどのタスクも実行主体が存在しない**ので、(b) より先に置いている。※再有効化は Claude 側では行わない（スケジューラの永続設定＝ユーザーの領分）。★**(b) `npx wrangler login`**（または `CLOUDFLARE_API_TOKEN` 設定）でデプロイ経路を復旧 → 直後に `npm run deploy:prod && npm run check:release:prod` で 07-24 push 済みの **`3bd3cb6`（Track A プローブ 6→9 PF）を出荷して閉じる**（コードは main 済み・再実装不要）。★**(c) 優先5 用の KV namespace 作成**（同じ Cloudflare 作業なのでユーザーの往復を1回で済ませる）。※トークン発行・namespace 作成は Claude 側では行わない（危害ゲート④／bindings 変更は要人間判断） | 運用/blocker | — | (a) `enabled: true` かつ翌営業日に daily log が生成される／(b) `npx wrangler whoami` が認証済・`/api/v1/platform-status` の platforms が 6→**9**・`alsoSupported` 2件（Discord/Lemon8）／(c) namespace 作成済み |
| **1** | **【自律可・デプロイ不要／#008 優先1 を強化して継続】計測: `growth:review` に (i) 非ブランド impressions と (ii) page 次元 impressions（locale 別・position 別）を追加**。理由＝#008 は「query 次元は GSC 匿名化で実測の約21%（7 vs 33）」と診断したが、**#009 でより根本的な問題が判明**＝残った行は**全件がブランドクエリ**（`clipkeep` 7／`tubekeep` 1）で、**非ブランド impressions は 0**。つまりこの系列は過小なだけでなく**戦略の成否と因果的に無関係**であり、**戦略が完全に失敗していてもブランド検索が1件増えれば撤退カウンタが毎週リセットされる**。是正: `latest-gsc-query-pages.csv` の `query` 列でブランド名を除外した集計と、`latest-gsc-pages.csv` の locale 別集計を出す。**両CSVとも既に毎回取得済み＝新規 API 呼び出しゼロ**＝`scripts/growth-summary.mjs` の集計とサマリー出力の追加のみ。★**#008 で優先1 に置いたが日次ループ停止のため未着手**。週次レビュー #009 §7 提案1 | 計測 | **不要** | `npm run growth:review` の出力とスナップショット JSON に「非ブランド impressions」と page 次元ロケール別内訳（impressions/平均position）が出る |
| **2** | **柱1/修復: fxTwitter 401 の明示分類とログ化**。`src/lib/extract/twitter.ts:186-215` の fx-api 分岐は **HTTP 401 をどの枝でも分類していない**（403/429→cooldown＋`sawBotChallenge`、404→`POST_NOT_FOUND`、`ok`→解析、**401 はどれにも入らず** `rawMedia` 空のまま黙って次のフォールバックへ）＝**本番が約30日間 出し続けている 401 が extractor 自身のログに一切現れない**（`provider_failed` すら出ない）。まず 401 を明示分類してログに出すのが最小の一手。★**実装・ユニットテスト・push はデプロイ非依存で先行できる**（本番検証のみ優先0(b) の復旧が前提）。本番 status: twitter `http=401`・**uptime 0% n=56（直近14日の全プローブ失敗）が約30日継続**。ローカル residential IP からは同 URL が 200＝**fxTwitter が Workers egress を弾いている**疑い。※実地確認は `POST /api/v1/extract/prepare` が `403 TURNSTILE_MISSING` を返すため無人不可（Turnstile は設計通り機能・CAPTCHA 回避は行わない） | 柱1/修復 | 検証のみ要 | 401 が失敗分類に現れる・vitest green／（復旧後）本番 Worker からの X 抽出経路を1つ確定・status の twitter が operational へ |
| **3** | **【自律可・デプロイ不要】健全性 HC-9: 認証/レート制限レイヤーのユニットテスト**（08-01 health-check 起票）。`src/lib/rate-limit/extract.ts` の `getClientKey`（cf-connecting-ip→x-forwarded-for→'unknown' の優先順位）と in-memory バケットの窓/上限判定＝**純粋に近い部分から**。`verifyTurnstileToken` は `fetch`／`getCloudflareContext` のモックが要るため分割可（規模: 中）。**"fail-closed であること"を契約として固定する**のが目的。★health-check 手順5 は「`middleware.ts`（認証/レート制限）」を見るよう指示しているが**実際の `middleware.ts` は locale rewrite と canonical host 301 のみ**で、本当の認証/レート制限経路は検査されていなかった | 健全性/品質 | **不要** | rate-limit の純関数にテストが入り green（production 非改変） |
| **4** | ★**【#008 優先6 から昇格・データゲート通過】柱1: pt ロケール既存ページの内容深化**。#008 は「**#009 で 2 週分の page 次元データを確認してから着手**」というゲートを設けていた。**本週それをクリア**＝pt は **6 impressions 中 6 件すべてが pos 2〜7**（平均4.2・#008 は7件中6件＝比率はむしろ上昇）、対して en の主力 `/` は 11.75・ja 平均 9.8・es 13.5、**ar は 2 週連続で page 次元でも 0**。**pos 2〜7 の帯に安定して入っているのは pt だけ**という構図が 2 週連続で再現した。対象候補: `/pt`(pos2)／`/pt/blog/safest-video-downloader-sites`(pos2)／`/pt/latest`(pos4)／`/pt/blog/twitter-video-download-mp4`(pos7)／`blog/how-to-download-twitter-videos?locale=pt`(pos4)。**新規 URL は増やさない**（stub 量産停止方針を維持＝thin/doorway リスク非増）。※但し書き: 各行 1〜2 impression のノイズ域であり「2週連続の再現」は**偶然ではないの根拠**にはなるが「pt は上位表示できている」の根拠にはならない | 柱1/内容 | 要 | pt ページの impressions/position が 2 週連続で改善 |
| **5** | **柱4' 測定: badge の外部 Referer 集計＝被リンク代理指標の自前化**（`/platform-status/badge` の Referer ホストを Worker 側で KV 集計＝**バッジ被埋め込み＝被リンクの実測**。GSC links API 不在の穴を埋める＝**主軸 A+B の唯一の計器**で、**不在のまま4週間**）。★**2026-07-28 判定＝自律実装 不可**: KV 集計は **Cloudflare bindings（KV namespace）の追加**を伴い、日次ループ規則「D1 schema / bindings 変更は要人間判断」に該当（代案の D1 追記・Analytics Engine もいずれも binding 要で回避不能）。**優先0(c) と同時にユーザーへ依頼**。★#009 実測: GA4 referral が**ついに 0 件**（#008 の compfight.com 1件も消滅）＝被リンク由来の流入は観測上ゼロ | 柱4'/測定 | 要 | 外部 Referer ホスト数を週次で取得できる状態・本番200（**要ユーザー承認: KV namespace 作成**） |
| **6** | **柱2: 凍結の可否をユーザーに確認する（#007 提案2 (b)・#008 提案3・#009 提案3 で再々提示）**。07-13 出荷の起動タイムアウト 60s 緩和は**本番で 27 日・約108 cron 窓 稼働して産出ゼロ**（sitemap `/trend/` 0件・`/trending` 内リンク 0件）＝**無償の打ち手は尽きた**（3週連続で同一結論を追認）。選択肢は (a) **有料 Browser Rendering 切替＝危害ゲート①金銭＝要ユーザー承認**、(b) **凍結して日次枠を柱1'/柱1 へ回す**。**推奨は (b)**（検索流入が実質ゼロの現状ではトレンドページを産出できても順位化しない）。cron 自体は無害・無課金なので停止しない。★(b) も戦略文書の書き換えでガードレール抵触のため**ユーザーの一言（「凍結でよい」）が要る**。★**#009 時点で 2 週間 未回答**。回答が無い間 柱2 は事実上すでに凍結状態＝実害はバックログ上に判定不能項目が居座ることのみ | 柱2/判断 | — | ユーザーの一言を得て task.md に明記し、柱2 起因タスクをバックログから外す（またはユーザー承認を得て有料化） |
| **7** | **【自律可・デプロイ不要】健全性 HC-8 残: `extractTwitter`／`extractTikTok` の I/O モック付きテスト**（07-30 で純関数分は完了＝vitest 44→73。残りは**失敗分類の網羅**でモック設計が要る＝規模:中）。優先2 と同じレイヤーなので連続実施が自然 | 健全性/品質 | **不要** | extract 層の失敗分類にテストが入り green（production 非改変） |
| **8** | **健全性 HC-6: `next` 15.2.9 → 15.5.22（security・緊急度 高）**。08-01 health-check で緊急度を 中→高 に上方修正＝advisory 全文確認で **middleware redirect SSRF**(GHSA-4342-x723-ch2f) / **rewrites の HTTP request smuggling**(GHSA-ggv3-7p47-pfv8) / **rewrites 経由 SSRF**(GHSA-p9j2-gv94-2wf4) / **App Router の Middleware・Proxy bypass**(GHSA-267c-6grr-h53f, GHSA-26hh-7cqf-hhc6) / **middleware redirect の cache poisoning**(GHSA-3g8h-86w9-wvmq) / **RSC cache poisoning**(GHSA-wfc6-r584-vfw7) / **CSP nonce XSS**(GHSA-ffhc-5mcf-pf4q) / **Server Function endpoint の無認証開示**(GHSA-955p-x3mx-jcvp) が **ClipKeep の構成（App Router＋`middleware.ts` の locale rewrite＋canonical host 301）に直接該当し得る**と判明し、前回の「`/_next/image` が本番404だから低露出」という評価根拠が**不成立**。`postcss` high 3件も同じ更新に紐づく。実体は semver-minor だが `package.json` が `"next": "15.2.9"` 完全固定のため npm は `--force` 表示＝**`package.json` の版指定変更を伴う**ので層B/層B+ 不可。**要ユーザー承認・要本番フル検証**（優先0(b) の復旧後に早期実施を推奨） | 健全性/security | 要 | `next@15.5.22` で typecheck/lint/build/vitest PASS・本番フル検証 PASS |
| **9** | **柱1' Track A: A-v2 = `extractor_jobs` の per-PF 実成功率を status 資産へ併記**（合成プローブ＝上流の到達性 と 実ジョブの成功率 は別物。二軸の併記は一次データとしての価値＝被引用性を明確に上げる。優先2 の結果とも接続する。07-14 の残タスクとして記録済み） | 柱1'/資産 | 要 | status page/JSON に per-PF 実成功率が出る・本番200 |
| **10** | ★**【新規 #009・自律可・デプロイ不要】健全性 HC-7: `knip.json` の `ignoreBinaries: ["powershell"]` を削除**（knip の Configuration hint "Remove from ignoreBinaries" に従う設定の陳腐化除去。影響: 極小＝dev ツール設定のみ・アプリ挙動非変更）。★**繰り上げた理由は重要度ではなく運用**＝デプロイ断絶が4週続いているため、**デプロイ不要で消費できる枠を 3→4 件に増やす**目的（#008 まで健全性バックログに眠っていた項目）。※**注意**: `powershell` は `package.json` の `check:prod`/`check:release`/`check:test`/`check:release:prod`/`check:release:test` で**実使用中**。Windows ローカル前提なら削除して問題ないが、非 Windows 環境（CI 等）で knip を回すと再発する＝「常に Windows で実行する」前提の明示とセットで実施すること | 健全性/品質 | **不要** | knip PASS・`npm run check:*` が従来どおり動作（production 非改変） |
| **11** | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・発見の残掃除） | 柱1/発見 | 要 | 残る solution help リンクの path 形式化・本番200 |
| **12** | **柱4' B-2（ユーザー一度きり・任意）: AlternativeTo 登録1回**（7/17 予定分が未実施なら。**4週連続で未確認**。ClipKeep は掲載適合）。★**#009 で初めて実測の裏付けが付いた**＝自サイト名 `clipkeep` の position が **idn 6 / ind 7 / nld 8 / phl 7 / usa 15.7・clicks 0**＝**固有名詞クエリで1位を取れていない＝Google が「ClipKeep ↔ clipkeep.net」をまだ確信できていない**。信頼できる第三者ドメインが「ClipKeep」という名前でリンクすることがこの症状に最も直接的に効く＝**ディレクトリ登録は「被リンク一般」ではなく「ブランドクエリの実体解決」として位置づけ直す**。成果の測り方も変わる（全体 impressions ではなく **`clipkeep` クエリの position が 1 に近づくか**を見る）。文面は `docs/ops/outreach/2026-08-02.md`（正本）／差分は `docs/ops/outreach/2026-08-09.md`／authority-plan.md B-2。※Show HN/awesome は不適合で見送り（07-10 実地） | 柱4'/権威 | — | 登録1回・被リンク発生（ユーザー実行分）／`clipkeep` クエリ position が改善 |

> **#009 で落としたもの・変えたもの（明示）**:
> - **#008 優先6（pt 深化）を 6→4 に昇格**。#008 自身が設けた「2 週分の page 次元データ確認」ゲートを本週クリアしたため。
> - **HC-7 を健全性バックログから優先10 へ繰り上げ**。理由は重要度ではなく**「デプロイ不要で消費できる枠を増やす」という運用上の判断**（デプロイ断絶4週目）。
> - **優先0 に (a) 日次ループ再有効化を追加し、先頭に置いた**。(b) デプロイ復旧より先に書いたのは、**(b) だけ直しても実行主体が無ければ何も動かない**ため。
> - **#008 優先1 は未着手のまま継続**（日次ループ停止のため）。ただし #009 §2.1 の発見により**内容を強化**（page 次元だけでなく**非ブランド impressions** を主眼に）。
> - **HC-10（`src/lib/rate-limit/extract.ts:59-60` の env parse に NaN ガードが無く潜在 fail-open）は今週もバックログに積んでいない**。理由不変: **セキュリティ性質を変える修正であり本番検証なしに出荷すべきでない**＝優先0(b) の復旧後に HC-9（優先3）とセットで扱うのが正しい。実害は現時点でなし（3つの wrangler toml すべて正常値）。
> - HC-5（yaml moderate）は**ユーザーの承認マーカーが 5 週連続で未付与**のため据え置き。
> - **#009 提案2（`ar` を柱1 の優先ロケールから外し pt を筆頭に）は §4 本文の書き換え＝要ユーザー承認**のため、バックログには積まず週次レビュー文書の提案に留めた。承認が無くても優先4（pt 深化）は実行可能。

---

### （履歴）#008, 2026-08-02 の並び ＝ 完了記録を含むため保存。**現行のバックログは上の #009**

> **主軸は A+B のまま（07-10 転換・#006/#007/#008 の実測で 3 度追認）**。#008 で診断が 2 点 強化された:
> ① **発見（未発見%）の改善が完全停止**（72→68→66→65→63→**63**）＝sitemap 501 が 3 週間不変で新規 URL ゼロ＝**「発見」はもう伸ばせるレバーではない**。
> ② **page 次元で pt のみ pos 2〜7 に入っている**（en 19 / **pt 7** / ja 4 / es 2 / hi 1・**ar 0**）＝柱1 の仮説自体は棄却されていないが、賭け先は「広く」でなく「pt を深く」の可能性。
> かつ **従来の impressions 系列は GSC 匿名化で実測の約 1/4.7**（7 vs 33）＝**計器の是正が最優先**（優先1）。
>
> **実務上の律速は 3 週連続で戦略ではない**＝**wrangler 未ログインでデプロイが 19 日間 断絶**。
> ただし #008 では**デプロイ不要で完遂できるタスクを 3 件（優先1・3・7）** 用意した＝「全部ブロック」で日次枠を溶かさないため。
> 正本: `docs/strategy/linkable-asset-plan.md` / `docs/strategy/authority-plan.md` / growth-strategy §4 柱1'・柱4'。

| 優先 | タスク | 柱/種別 | デプロイ要否 | 成功指標 |
|---|---|---|---|---|
| **0** | **【ユーザー操作・全タスクの前提】`npx wrangler login`（または `CLOUDFLARE_API_TOKEN` 設定）でデプロイ経路を復旧** → 直後に `npm run deploy:prod && npm run check:release:prod` で 07-24 push 済みの **`3bd3cb6`（Track A プローブ 6→9 PF）を出荷して閉じる**（コードは main 済み・再実装不要）。★**#008 追記: あわせて優先4 用の KV namespace 作成も同時に依頼**（同じ Cloudflare 作業＝ユーザーの往復を1回で済ませる）。※トークン発行・namespace 作成は Claude 側では行わない（危害ゲート④／bindings 変更は要人間判断） | 運用/blocker | — | `npx wrangler whoami` が認証済／`/api/v1/platform-status` の platforms が 6→**9**・`alsoSupported` 2件（Discord/Lemon8） |
| **1** | **【新規 #008・自律可・デプロイ不要】計測: `growth:review` に page 次元 impressions（locale 別・position 別）の集計を追加**。理由＝週次レビューが毎回「GSC impressions」として記録してきた値は `dimensions:["query","page","country","device"]` 由来（`scripts/fetch-gsc-report.mjs:348,360`）で、**GSC の匿名化により実測の約 21% しか捉えていない**（7 vs 33）。母数が小さいほど影響が大きく、**撤退基準がノイズで駆動されている**。`latest-gsc-pages.csv`（`dimensions:["page"]`・28d）は**既に毎回取得済み＝新規 API 呼び出しゼロ**なので、`scripts/growth-summary.mjs` の集計とサマリー出力の追加のみ。週次レビュー #008 §7 提案1 | 計測 | **不要** | `npm run growth:review` の出力とスナップショット JSON に page 次元 impressions とロケール別内訳（impressions/平均position）が出る |
| **2** | **柱1/修復: fxTwitter 401 の明示分類とログ化**（#007 優先1 の最小の一手へ具体化）。`src/lib/extract/twitter.ts:186-215` の fx-api 分岐は **HTTP 401 をどの枝でも分類していない**（403/429→cooldown＋`sawBotChallenge`、404→`POST_NOT_FOUND`、`ok`→解析、**401 はどれにも入らず** `rawMedia` 空のまま黙って次のフォールバックへ）＝**本番が約23日間出し続けている 401 が extractor 自身のログに一切現れない**（`provider_failed` すら出ない）。まず 401 を明示分類してログに出すのが最小の一手。★**実装・ユニットテスト・push はデプロイ非依存で先行できる**（本番検証のみ優先0 の復旧が前提）。本番 status: twitter `http=401`・**直近14日のプローブ 56/56 全滅**（窓 = `HISTORY_MAX 56`×6h、`src/lib/platform-status/probes.ts:267`）。ローカル residential IP からは同 URL が 200＝**fxTwitter が Workers egress を弾いている**疑い。※実地確認は `POST /api/v1/extract/prepare` が `403 TURNSTILE_MISSING` を返すため無人不可（Turnstile は設計通り機能・CAPTCHA 回避は行わない） | 柱1/修復 | 検証のみ要 | 401 が失敗分類に現れる・vitest green／（復旧後）本番 Worker からの X 抽出経路を1つ確定・status の twitter が operational へ |
| **3** | **【新規 #008・自律可・デプロイ不要】健全性 HC-9: 認証/レート制限レイヤーのユニットテスト**（08-01 health-check 起票）。`src/lib/rate-limit/extract.ts` の `getClientKey`（cf-connecting-ip→x-forwarded-for→'unknown' の優先順位）と in-memory バケットの窓/上限判定＝**純粋に近い部分から**。`verifyTurnstileToken` は `fetch`／`getCloudflareContext` のモックが要るため分割可（規模: 中）。**"fail-closed であること"を契約として固定する**のが目的（Turnstile はリトライ枯渇時 false・レート制限は上限超過で 429）。★health-check 手順5 は「`middleware.ts`（認証/レート制限）」を見るよう指示しているが**実際の `middleware.ts` は locale rewrite と canonical host 301 のみ**で、本当の認証/レート制限経路は検査されていなかった | 健全性/品質 | **不要** | rate-limit の純関数にテストが入り green（production 非改変） |
| **4** | **柱4' 測定: badge の外部 Referer 集計＝被リンク代理指標の自前化**（`/platform-status/badge` の Referer ホストを Worker 側で KV 集計＝**バッジ被埋め込み＝被リンクの実測**。GSC links API 不在の穴を埋める＝**主軸 A+B の唯一の計器**）。★**2026-07-28 判定＝自律実装 不可**: KV 集計は **Cloudflare bindings（KV namespace）の追加**を伴い、日次ループ規則「D1 schema / bindings 変更は要人間判断」に該当（代案の D1 追記・Analytics Engine もいずれも binding 要で回避不能）。★**#008 で優先度を 3→4 に**（**降格ではない**＝自律不可と確定した以上バックログ上位に置いても日次ループが消費できないため、実際に消費できるタスクを繰り上げた。重要度の評価は不変）。**優先0 と同時にユーザーへ依頼**（同じ Cloudflare 作業） | 柱4'/測定 | 要 | 外部 Referer ホスト数を週次で取得できる状態・本番200（**要ユーザー承認: KV namespace 作成**） |
| **5** | **柱2: 凍結の可否をユーザーに確認する（#007 提案2 (b)・#008 提案3 で再提示）**。07-13 出荷の起動タイムアウト 60s 緩和は**本番で 20 日・約80 cron 窓 稼働して産出ゼロ**（sitemap `/trend/` 0件・`/trending` 内リンク 0件）＝#006 が予告した分岐条件に到達し、**無償の打ち手は尽きた**。選択肢は (a) **有料 Browser Rendering 切替＝危害ゲート①金銭＝要ユーザー承認**、(b) **凍結して日次枠を柱1'/柱1 へ回す**。**推奨は (b)**（検索流入が実質ゼロの現状ではトレンドページを産出できても順位化しない）。cron 自体は無害・無課金なので停止しない。★(b) も「柱2 を凍結する」＝**戦略文書の書き換え**でガードレール抵触のため**ユーザーの一言（「凍結でよい」）が要る**。★**#008 時点で 1 週間 未回答**。回答が無い間、柱2 は事実上すでに凍結状態（打ち手が無く日次枠も消費していない）＝実害はバックログ上に判定不能項目が居座ることのみ | 柱2/判断 | — | ユーザーの一言を得て task.md に明記し、柱2 起因タスクをバックログから外す（またはユーザー承認を得て有料化） |
| **6** | **【新規 #008・候補／今週は着手しない】柱1: pt ロケール既存ページの内容深化**。根拠＝page 次元実測で impression を取っているのは **en 19 / pt 7 / ja 4 / es 2 / hi 1** で、**pos 2〜7 の低順位帯に入っているのは pt のみ**（`/pt` pos 2・`/pt/blog/safest-video-downloader-sites` pos 2・`/pt/latest` pos 4・`/pt/blog/twitter-video-download-mp4` pos 7 ほか／**ar は page 次元でも 0**）。柱1 は「ja/pt/ar 優先」と定義されているが**実測は ja と ar を支持していない**。**新規 URL は増やさない**（stub 量産停止方針を維持＝thin/doorway リスク非増）。★**各行 1〜2 impression のノイズ域**のため、**#009 で 2 週分の page 次元データを確認してから確定**する（優先1 の実装が前提） | 柱1/内容 | 要 | pt ページの impressions/position が 2 週連続で改善 |
| **7** | **【自律可・デプロイ不要】健全性 HC-8 残: `extractTwitter`／`extractTikTok` の I/O モック付きテスト**（07-30 で純関数分は完了＝vitest 44→73。残りは**失敗分類の網羅**でモック設計が要る＝規模:中）。優先2 と同じレイヤーなので連続実施が自然 | 健全性/品質 | **不要** | extract 層の失敗分類にテストが入り green（production 非改変） |
| **8** | **健全性 HC-6: `next` 15.2.9 → 15.5.22（security・緊急度 高）**。★08-01 health-check で**緊急度を 中→高 に上方修正**＝advisory 全文確認で **middleware redirect SSRF**(GHSA-4342-x723-ch2f) / **rewrites の HTTP request smuggling**(GHSA-ggv3-7p47-pfv8) / **rewrites 経由 SSRF**(GHSA-p9j2-gv94-2wf4) / **App Router の Middleware・Proxy bypass**(GHSA-267c-6grr-h53f, GHSA-26hh-7cqf-hhc6) / **middleware redirect の cache poisoning**(GHSA-3g8h-86w9-wvmq) / **RSC cache poisoning**(GHSA-wfc6-r584-vfw7) / **CSP nonce XSS**(GHSA-ffhc-5mcf-pf4q) / **Server Function endpoint の無認証開示**(GHSA-955p-x3mx-jcvp) が **ClipKeep の構成（App Router＋`middleware.ts` の locale rewrite＋canonical host 301）に直接該当し得る**と判明し、前回の「`/_next/image` が本番404だから低露出」という評価根拠が**不成立**。`postcss` high 3件も同じ更新に紐づく。実体は semver-minor だが `package.json` が `"next": "15.2.9"` 完全固定のため npm は `--force` 表示＝**`package.json` の版指定変更を伴う**ので層B/層B+ 不可。**要ユーザー承認・要本番フル検証**（優先0 の復旧後に早期実施を推奨） | 健全性/security | 要 | `next@15.5.22` で typecheck/lint/build/vitest PASS・本番フル検証 PASS |
| **9** | **柱1' Track A: A-v2 = `extractor_jobs` の per-PF 実成功率を status 資産へ併記**（合成プローブ＝上流の到達性 と 実ジョブの成功率 は別物。二軸の併記は一次データとしての価値＝被引用性を明確に上げる。優先2 の結果とも接続する。07-14 の残タスクとして記録済み） | 柱1'/資産 | 要 | status page/JSON に per-PF 実成功率が出る・本番200 |
| **10** | 柱1: downloader help リンク（sns/telegram/tiktok/twitter 4本）＋ extractor-form/result-client の status 連動 help リンクの `?locale=`→path 形式化（06-29 積み残し・発見の残掃除） | 柱1/発見 | 要 | 残る solution help リンクの path 形式化・本番200 |
| **11** | **柱4' B-2（ユーザー一度きり・任意）: AlternativeTo 登録1回**（7/17 予定分の実施有無が未確認＝**3週連続で未確認**。ClipKeep は掲載適合。文面は `docs/ops/outreach/2026-08-02.md` / authority-plan.md B-2）。※Show HN/awesome は不適合で見送り（07-10 実地）。※**#009 でも未実施かつ KV 承認も無い場合、outreach 下書きの毎週生成を停止**し変更のある週のみ更新する運用へ切り替える（#008 §9） | 柱4'/権威 | — | 登録1回・被リンク発生（ユーザー実行分） |

> **#008 で落としたもの・変えたもの（明示）**:
> - #007 優先7「ja/pt/ar の indexed/impression 推移を週次記録」は、**優先1（page 次元計測の実装）と週次レビューの定常業務へ分割吸収**した（単独タスクとしては消滅）。
> - #007 優先3（badge Referer）は **3→4 に移動**。降格ではなく「自律不可と確定した項目を先頭付近に置いても日次ループが消費できない」という運用上の理由（重要度の評価は不変＝主軸の唯一の計器）。
> - **HC-10（`src/lib/rate-limit/extract.ts:59-60` の env parse に NaN ガードが無く潜在 fail-open）はバックログに積んでいない**。理由: **セキュリティ性質を変える修正であり本番検証なしに出荷すべきでない**＝優先0 の復旧後に HC-9（優先3）とセットで扱うのが正しい。実害は現時点でなし（`wrangler.toml`／`.test`／`.production` の3つとも正常値）。健全性バックログには記載済み。
> - HC-5（yaml moderate）は**ユーザーの承認マーカーが 4 週連続で未付与**のため据え置き。

---

### （履歴）#007, 2026-07-26 の並び ＝ 完了記録を含むため保存。**現行のバックログは上の #008**

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
> **2026-08-15 health-check（週次）**: status **green**（層B 変更0・層B+ 消化対象0＝承認マーカー付き項目が**4週連続**で1件も無い）。コードは緑（typecheck/lint/knip/madge PASS・**vitest 73**・循環0・衛生良好＝tracked 610 ファイルに誤コミット0）。★**今週の悪化は `npm audit` 24→28（high 17→22）**で、**増分4件はすべて puppeteer チェーン**＝`@cloudflare/puppeteer` が**初めて DIRECT high**（←`@puppeteer/browsers@2.2.4` ←`extract-zip` GHSA-jmr9-qjv8-65gv）。`nanoid` 2件は `postcss` 経由＝**HC-6 で一緒に解消される**ため新規負債ではない。★★**HC-6 の「推論ベースの低露出評価が後に不成立」だった反省を踏まえ、今回は実測した**＝出荷 Worker バンドル（`.open-next/` 1,353 ファイル）を grep し `cloudflare/puppeteer` 2ヒットに対し **`@puppeteer/browsers`/`extract-zip`/`yauzl` は 0ヒット**＝**脆弱な transitive は出荷バンドルに含まれない**（ただし当該ビルドは 07-24 製・minify 済み grep のため**暫定評価**）。★**さらに `@cloudflare/puppeteer` は最新 1.3.0 も同じ `@puppeteer/browsers@2.2.4` を固定しており「版を上げれば直る」枠に入らない**（npm の fixAvailable は 0.0.11＝**ダウングレード**）→ **HC-11 として新規起票**。**デプロイ断絶は5週連続**（`wrangler whoami`＝Not logged in・`3bd3cb6` 未反映）。本番は health 200 / sitemap 200(loc **509**・不変) で健全。詳細 [`docs/ops/health/2026-08-15.md`](docs/ops/health/2026-08-15.md)。
>
> **2026-08-08 health-check**: status **skipped**（未コミット docs 4件で作業ツリーが汚れていたため／#009 レビューでコミットして解消済）。詳細 [`docs/ops/health/2026-08-08.md`](docs/ops/health/2026-08-08.md)。
>
> **2026-08-01 health-check（週次）**: status **green**（層B 変更0・層B+ 消化対象0＝承認マーカー付き項目が3週連続で1件も無い）。コードは緑（typecheck/lint/knip/madge PASS・**vitest 73**・循環0・衛生良好）＝HC-8 消化でテスト 44→73 に増え、前回の最大の指摘（抽出レイヤー無テスト）は**解消**。★**今週の要点は「件数は横ばいだが中身が悪い」**＝`npm audit` は 24件(high 17)で前回と同数・同内訳だが、`next` advisory の全文確認で **middleware redirect SSRF / rewrites の HTTP request smuggling / App Router の Middleware・Proxy bypass / cache poisoning / CSP nonce XSS** 等が含まれると判明し、**前回の「`/_next/image` が404だから低露出」という HC-6 の評価根拠が不成立**（ClipKeep は App Router＋middleware rewrite 構成）→ **HC-6 の緊急度を上げた**（修正先も 15.5.21→**15.5.22**。`package.json` が `"next": "15.2.9"` 完全固定のため npm は `--force` 表示＝いずれにせよ要承認の専用タスク）。新規の穴2件＝**HC-9**（手順5 の言う「認証/レート制限」の実体は `middleware.ts` でなく `src/lib/rate-limit/extract.ts`・`src/lib/security/turnstile.ts` で**両方無テスト**）・**HC-10**（レート制限の env parseInt に NaN ガードなし＝**fail-open** 潜在バグ）。★**デプロイ断絶は3週連続・18日目**（`3bd3cb6` 未反映＝platform-status 6PF のまま／**twitter uptime 0% が約22日**）。本番は health 200 / sitemap 200(loc 509) で健全。詳細 [`docs/ops/health/2026-08-01.md`](docs/ops/health/2026-08-01.md)。
>
> **2026-07-25 health-check（週次・復帰初回。07-18 は 7/15〜7/23 のタスク登録消失で未実施）**: status **green**（層B 変更0・層B+ 消化対象0＝承認マーカー付き項目が1件も無いため）。コードは緑（typecheck/lint/knip/madge PASS・vitest 44/44・循環0・衛生良好）。**悪化2点はいずれもコード外**＝①`npm audit` 22→24（high 12→17）で**初めて出荷ランタイム（`next`）に high**（→ HC-6 新規）、②**wrangler 未ログインでデプロイが2週間 blocked**＝`3bd3cb6` が本番未反映（platform-status が 6PF のまま）・**twitter uptime 0% が約15日継続**。本番は health 200 / sitemap 200(loc 509) で健全。詳細 [`docs/ops/health/2026-07-25.md`](docs/ops/health/2026-07-25.md)。
>
> **消化ルール（層B+, 2026-06-29 追加）**: 週次 health-check は、ここから **承認マーカー `（承認済み・消化可）` が付き・規模:小・D1/bindings 非依存・ガードレール非抵触** の項目を**週1件だけ**自動で消化（実装→DoD フルデプロイ→`[x]`）する。承認マーカーを付けるのはユーザーのみ。マーカーの無い項目は積まれたまま手を付けない。「中/大」「要人間判断」項目（HC-4/HC-5 等）は対象外で、消化したい場合は規模を「小」に分割するか個別に daily で実施する。

- [x] HC-1: ~~未配線の完成機能 `src/components/share-button.tsx`~~ → **削除**（2026-06-28、ユーザー判断）。理由: 共有後の遷移先・導線などのUX設計が未着手で、コンポーネント単体を残しても使えないため。再導入時は git 履歴から復元可。
- [x] HC-2: **未使用 export 5件の棚卸し** ← **完了（2026-06-29, 層B+ 消化, ver `0bc6a5a7`）**。個別判断＝配線1・除去4。配線: `SUPPORTED_LOCALES`（metadata-helper.ts）→ `app/layout.tsx` の JSON-LD `inLanguage` にハードコードされていた同一10ロケール配列を置換（DRY 単一化・本番で同値確認）。除去（in-app 呼び出し・配線先なし）: `hasServiceAccount`・`STATUS_FILE_PATH`（analytics-auth.mjs＝SAフォールバック/statusファイルは既存関数で完結）、`markTopicRemoved`・`unmarkTopicRemoved`（topic-store.ts＝撤去の書き込みは運用ツール trend-remove-topic.mjs が wrangler CLI 経由で実施、サイトは listRemovedSlugs の読み取りのみ）。knip 未使用 export **5→0**（残 `growth-summary.mjs` ファイルは spawn 起動の偽陽性・削除禁止で不変）。typecheck/lint/build PASS・vitest 33/33・リリースゲート PASS=29/0/1。runbook も書き込み=CLI 一本化に更新。
- [x] HC-3: **クリティカルパスのテスト導入完了**（2026-06-28）。テスト基盤＝**Vitest 4**（node env、`npm test`=`vitest run`）。北極星のイベント生成ロジックを `src/lib/analytics/ad-config.ts` に挙動非変更で抽出（`AD_SCRIPTS`/`looksLikeBot`/`buildAdEventPayload`/`adZoneEventName`）し `ad-config.test.ts` で検証、`middleware.ts`（ロケール rewrite ja/pt/ar＋canonical host 301）を `middleware.test.ts` で検証。計33 tests green。今後の新規ロジックは同パターンでテストを足す。
- [ ] HC-4: **依存更新の段階バッチ**（何を: next/eslint-config-next 15→16・typescript 5.7→7.0・wrangler 4.34→4.86・@types/node 22→26・eslint 9→10・@cloudflare/workers-types 4→5 等の major 含む更新。なぜ: 放置でセキュリティ/互換負債が蓄積。影響: 大（OpenNext/Cloudflare ビルド設定が敏感、要本番検証）。規模: 大。自動更新禁止＝専用の検証付きバッチで段階適用）。**2026-07-25 health-check 実測: outdated 18 件（前回 07-11 と同数だが各 latest が前進＝typescript latest 6.0→**7.0.2**・eslint 10.7→**10.8.0**・next 16.2.10→**16.2.11**・@cloudflare/workers-types **5.20260724.1**。wrangler は latest 表示 4.86 だが npx 通知では既に **4.114.0** が存在）。minor/patch=@opennextjs/cloudflare 1.17→1.20.2・tailwindcss 4.2→4.3.3・react 19.0→19.2.8・postcss 8.5.15→8.5.23・vitest 4.1.9→4.1.10 等。数値のみ更新、実装は未着手（要承認・規模:大）。** **2026-08-01 health-check 実測: outdated **18 件**（3週連続で同数。latest はさらに前進＝`next`/`eslint-config-next` **16.2.12**・`@cloudflare/workers-types` **5.20260801.1**・`@cloudflare/puppeteer` **1.2.0**・`@types/react` **19.2.18**・`postcss` **8.5.25**。wrangler は npx 通知で **4.118.0**）。実装は引き続き未着手。** **2026-08-15 health-check 実測: outdated **18 件**（4週連続で同数。latest はさらに前進＝`next`/`eslint-config-next` **16.3.1**・`@cloudflare/workers-types` **5.20260815.1**・`eslint` **10.8.1**・`typescript` **7.0.2**・`@types/node` **26.2.0**・`@cloudflare/puppeteer` **1.3.0**。wrangler は npx 通知で **4.123.0**）。★**注意: `@cloudflare/puppeteer` はこのバッチで上げても脆弱性が解消しない**（1.3.0 も `@puppeteer/browsers@2.2.4` 固定）＝**HC-11 を参照**。実装は引き続き未着手。**
- [ ] HC-5: **npm audit の切り分け**（何を: 大半が build-tool 系 transitive（wrangler/miniflare/ws/yaml チェーン）。runtime 出荷依存に該当するものを優先し `npm audit fix` を検証付きで適用、majorを要する `--force` 分は HC-4 と合流。なぜ: high は放置不可だが大半は出荷バンドル外の可能性。影響: 中。規模: 中）。**2026-07-25 health-check 実測: 24 件（high 17/moderate 4/low 3）＝前回 07-11 の 22 件（12/8/2）から**悪化**（2週で +2・high +5）。★**「全て build-tool 系 transitive」という従来の整理は今回で不成立**＝`next` 本体が DIRECT high になったため出荷ランタイム分は **HC-6 に分離**。本項目に残るのは build-tool 分（wrangler OS Command Injection・miniflare→ws・undici・sharp・js-yaml・flatted・picomatch・brace-expansion・basic-ftp・form-data・path-to-regexp・defu・fast-xml-parser/builder・ip-address・qs・body-parser・@eslint/plugin-kit）＝ wrangler@4.86 major(--force) 要で HC-4 合流。**yaml 2.0–2.8.2 moderate(Stack Overflow) のみ非 --force の `npm audit fix` で semver 範囲内修正可＝「規模:小・bindings 非依存」に切り出せる層B+ 候補（ただし承認マーカー未付与＝未承認のため今週も消化せず据え置き。ユーザーが `（承認済み・消化可）` を付ければ翌週以降の層B+ で消化可能）。** **2026-08-01 health-check 実測: **24 件（high 17 / moderate 4 / low 3）＝前回と同数・同内訳で横ばい**。build-tool 分の構成も不変（`sharp`/`ws` は wrangler@4.86 major＝`--force` 要で HC-4 合流）。`yaml` moderate も**依然として唯一の「非 --force・規模:小・bindings 非依存」候補だが承認マーカー未付与のため3週連続で未消化**。★ただし件数横ばい＝現状維持ではない: `next` 分の実態悪化は HC-6 を参照。** **2026-08-15 health-check 実測: **28 件（high 22 / moderate 3 / low 3）＝24 件から悪化（+4・high +5）**。増分は**すべて puppeteer チェーン**（`@cloudflare/puppeteer`／`@puppeteer/browsers`／`extract-zip`）＋ `nanoid`。**`nanoid` は `postcss` 経由＝ HC-6 の `next@15.5.23` で同時解消**、**puppeteer 3件は版上げでは解消しない別種＝ HC-11 に分離**した。よって**本項目（build-tool 分）の構成自体は不変**（wrangler/miniflare/ws/sharp は `wrangler@4.86.0` 要＝HC-4 合流）。`yaml` moderate は**6週連続で承認マーカー未付与のため未消化**。**
- [ ] HC-6: **`next` 15.2.9 → 15.5.21（semver-minor・security）** ← **新規（2026-07-25 health-check）**。何を: 出荷ランタイム依存である `next` 本体の high advisory（Image Optimization API の **Cache Key Confusion** / **Content Injection**）を semver-minor 更新で解消。`postcss` の high 2件（`</style>` 未エスケープ XSS・sourceMappingURL 経由の任意ファイル読み取り）も npm の解決経路上この更新に紐づく。なぜ: 初めて**ビルド工具でなく出荷バンドル**に high が乗ったため HC-5 の「低露出」整理が効かない。影響: 中〜大（15.2→15.5 の minor 跨ぎ＝OpenNext/Cloudflare ビルドが敏感・要本番フル検証）。規模: 中（＝層B+ 対象外。要ユーザー承認、専用日次タスクか HC-4 バッチで実施）。**緊急度の暫定評価: `next/image` はコンポーネント4箇所で使用中だが本番 `https://clipkeep.net/_next/image?...` は **404**（OpenNext で当該最適化エンドポイント非提供）＝ Image Optimization 系の実露出は低い見込み（要再確認）。よって緊急デプロイは不要と判断したが、放置可の意味ではない。** ★★**2026-08-01 health-check で上方修正（緊急度: 中→高。規模は中のまま＝層B+ 対象外・要承認）**: advisory 全文を確認したところ影響範囲は `next 9.3.4-canary.0 - 16.3.0-preview.7` で、**画像最適化以外の経路が多数含まれる**ことが判明した。ClipKeep の構成（**App Router ＋ `middleware.ts` の locale rewrite ＋ canonical host 301**）に直接該当し得るものだけでも: **Improper Middleware Redirect Handling → SSRF**(GHSA-4342-x723-ch2f) / **HTTP request smuggling in rewrites**(GHSA-ggv3-7p47-pfv8) / **SSRF in rewrites via attacker-controlled destination hostname**(GHSA-p9j2-gv94-2wf4) / **Middleware・Proxy bypass in App Router via segment-prefetch**(GHSA-267c-6grr-h53f＋follow-up GHSA-26hh-7cqf-hhc6) / **Middleware redirects can be cache-poisoned**(GHSA-3g8h-86w9-wvmq) / **cache poisoning in RSC responses**(GHSA-wfc6-r584-vfw7) / **XSS with CSP nonces**(GHSA-ffhc-5mcf-pf4q) / **Unauthenticated disclosure of internal Server Function endpoints**(GHSA-955p-x3mx-jcvp)。**＝前回の「`/_next/image` が本番404だから実露出は低い」という評価根拠は middleware/rewrites 系 advisory を全くカバーしておらず不成立**。修正先は **`next@15.5.22`**（15.5.21 から前進）。実体は semver-minor だが `package.json` が **`"next": "15.2.9"` 完全固定**のため npm は `--force`（stated range 外）と表示＝**`package.json` の版指定変更を伴う**ので層B/層B+ では不可。`postcss` high 3件も同じ `next@15.5.22` に紐づく。**優先0（wrangler login）が解けたら、本項目を専用日次タスクとして早期に扱うことを推奨。** ★**2026-08-15 health-check 実測: 修正先が `next@15.5.22` → **`next@15.5.23`** に前進。`postcss` high も同じ経路で解消。さらに今週新たに検出された `nanoid` high 2件（GHSA-28wg-ghj8-5hjv / GHSA-2v37-7h3g-55p8）も `postcss` 経由＝**本更新に同梱される**（＝HC-6 を消化すると audit は最大 6件前後 減る見込み）。緊急度・規模・要承認の区分はいずれも据え置き（高／中／要承認）。デプロイ断絶5週目のため引き続き着手不能。**
- [ ] HC-7: **`knip.json` の `ignoreBinaries: ["powershell"]` を削除** ← **新規（2026-07-25 health-check）**。★**2026-08-09 週次レビュー #009 で戦略バックログ 優先10 へ繰り上げ**（重要度の変更ではなく、デプロイ断絶4週目のため**デプロイ不要で消費できる枠を増やす**運用上の判断）。何を: knip の Configuration hint（"Remove from ignoreBinaries"）に従い不要エントリを除去。なぜ: 設定の陳腐化除去（knip が powershell を解決できるようになった）。影響: 極小（dev ツール設定のみ・アプリ挙動非変更）。規模: 極小。**注意: `powershell` は `package.json` の `check:prod`/`check:release`/`check:test`/`check:release:prod`/`check:release:test` で実使用中。Windows ローカル前提なら削除して問題ないが、非 Windows 環境（CI 等）で knip を回すと再発する種類の指摘＝「常に Windows で実行する」前提の明示とセットで実施すること。**（層B では 設定値=対象外 として見送った項目）
- [x] HC-8: **`src/lib/extract/` にユニットテスト導入** ← **完了（2026-07-30 日次ループ, 純関数分。deploy n/a＝production 非改変）**。追加3本で **vitest 44→73**。残（任意・別項目）: I/O を含む `extractTwitter`／`extractTikTok` のモック付きテスト（＝失敗分類の網羅。規模:中）。以下は起票時の記述。何を: 抽出レイヤー 17 モジュール（`twitter.ts`/`tiktok.ts`/`twitter-url.ts`/`tiktok-url.ts`/`m3u8.ts` 等）が**テスト0本**。まずネットワーク非依存の純関数（URL パーサ・レスポンス整形・失敗分類）から Vitest を足す。なぜ: **プロダクトの中核経路かつ現在の最優先障害（fxTwitter 401・本番 X 抽出の恒常劣化）が起きている当のレイヤー**で回帰検知が皆無。既存テストは middleware / ad-config / platform-status の3系統のみ（44 tests）。影響: 小（テスト追加のみ・production 非改変）。規模: 小〜中（純関数分だけなら小）。
- [ ] HC-9: **認証/レート制限レイヤーが無テスト** ← **新規（2026-08-01 health-check）**。何を: `src/lib/rate-limit/extract.ts`（`checkExtractRateLimit`／`getClientKey`）と `src/lib/security/turnstile.ts`（`verifyTurnstileToken`）に**テストが1本も無い**。なぜ: health-check 手順5 は「`middleware.ts`（認証/レート制限）」のテスト有無を見るよう指示しているが、**実際の `middleware.ts` は認証もレート制限も行っていない**（72行・locale rewrite と canonical host 301 のみ・grep で該当語0件）。つまり手順5 は充足しているように見えて**本当の認証/レート制限経路は検査されていなかった**。ここは「fail-closed であること」が安全性の要（Turnstile はリトライ枯渇時に false を返す設計・レート制限は上限超過で 429）なので、その契約こそ回帰検知が要る。影響: 小（テスト追加のみ・production 非改変）。規模: 小〜中＝**`getClientKey`（cf-connecting-ip→x-forwarded-for→'unknown' の優先順位）と in-memory バケットの窓/上限判定は純粋に近く「小」**、`verifyTurnstileToken` は `fetch` と `getCloudflareContext` のモックが要るため「中」（分割可）。**2026-08-15 health-check: 未解消（2週目）。`src/**/*.test.ts` 6本を grep して `rate-limit`/`turnstile` 一致 0 件を再確認。★前半（`getClientKey` ＋ in-memory バケットの窓/上限判定）だけを切り出せば「規模:小・bindings 非依存・production 非改変」＝層B+ の消化条件を満たす**ため、承認マーカーを付けるならこの分割前提が扱いやすい（マーカーは未付与＝今週も未着手）。
- [ ] HC-10: **レート制限の env パースに NaN ガードが無く fail-open し得る** ← **新規（2026-08-01 health-check・コード読解で発見／未修正）**。何を: `src/lib/rate-limit/extract.ts:59-60` が `parseInt(process.env.RATE_LIMIT_LIMIT ?? '30', 10)` / `RATE_LIMIT_WINDOW_MS` を **NaN 検査なし**で使う。`??` は空文字を素通しするため、env が `""` や非数値だと `limit`/`windowMs` が `NaN` になり、`bucket.timestamps.length >= NaN` が常に false・`t > (now - NaN)` も常に false ＝ **レート制限が黙って無効化される（fail-open）**。なぜ: 抽出 API の乱用防止はコストと上流BAN に直結し、しかも**無効化が無音**（ログにも 429 にも現れない）＝ HC-9 の「fail-closed が契約」という性質に反する。影響: 小（数行）。ただし**セキュリティ性質の変更**＝挙動を変えるため層B/層B+ の自動修正では触らない。規模: 小。**現時点の実害はなし＝潜在**（`wrangler.toml`／`wrangler.test.toml`／`wrangler.production.toml` の3つとも `RATE_LIMIT_LIMIT="30"`・`RATE_LIMIT_WINDOW_MS="60000"` と正常値）。修正案: `Number.isFinite` で検査し不正時はデフォルトへフォールバック＋`console.warn`。HC-9 のテストと同時に入れるのが自然。**2026-08-15 health-check: 未修正のまま（2週目）。3つの wrangler toml が正常値である点も不変＝実害なしの潜在。方針も不変（本番検証が可能になってから HC-9 とセットで扱う）。**
- [ ] HC-11: **`@cloudflare/puppeteer` の high advisory に「前進する修正版」が存在しない** ← **新規（2026-08-15 health-check）**。何を: `@cloudflare/puppeteer`（DIRECT high）→ `@puppeteer/browsers@2.2.4`（脆弱範囲 <=2.13.2）→ `extract-zip`（**GHSA-jmr9-qjv8-65gv** unvalidated symlink path traversal）のチェーン。**最新 1.3.0 も 1.0.6 と同一の `@puppeteer/browsers@2.2.4` を固定**しており（`npm view @cloudflare/puppeteer@1.3.0 dependencies` と `@1.0.6` を照合して確認）、**アップグレードでは解消しない**。npm の `fixAvailable` は **`@cloudflare/puppeteer@0.0.11`＝ダウングレード**で採用不可。なぜ: 出荷コード（`src/lib/auto-trend.ts:1`・`src/lib/extract/browser.ts:1`）が import する DIRECT high であり、**HC-4「版を上げる段階バッチ」の枠組みで処理できない唯一の項目**だから。放置を選ぶにしても「放置する」と明示的に決める必要がある。影響: **現時点でランタイム露出は確認されず**＝出荷 Worker バンドル（`.open-next/` 1,353 ファイル）を grep したところ `cloudflare/puppeteer` 2ヒットに対し **`@puppeteer/browsers`/`extract-zip`/`yauzl`/`getInstalledBrowsers` はいずれも 0ヒット**（Cloudflare は Browser Rendering binding 経由のリモート起動＝ローカル Chrome 取得経路を通らない設計とも整合）。**ただし当該ビルドは 2026-07-24 製（デプロイ断絶のため以降未更新）＋ minify 済みバンドルへの文字列 grep ＝ 暫定評価**（HC-6 で同種の暫定評価が覆った前例があるため、デプロイ復旧後の再ビルドで要再確認）。選択肢: **(a) 依存ごと削除**＝柱2（trend スクリーンショット）は #007 で「有料化か**凍結**の二択・推奨は凍結」に到達済で、**凍結を確定すれば puppeteer 依存を落とせて脆弱性が構造的に消える**（最も筋が良い。ただし機能削除＝要ユーザー承認・規模:中）／(b) `overrides` で `@puppeteer/browsers` を >2.13.2 に強制（未検証・puppeteer 本体との整合リスク・規模:中）／(c) 露出なしを根拠に**受容を明文化**し audit の既知例外として記録（コード変更なし・規模:小）。規模: (a)中 / (b)中 / (c)小。**要ユーザー判断＝いずれも層B+ の自動消化対象外。**

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

> **2026-08-16 週次レビュー（#010）で並べ替え。#009 から 7 日＝正常間隔を3週維持**。計測は健全（SA・fresh・**7週連続で無人失効なし**）:
> 実測 28d: ad_script_load=**429**（#009 336）、セッション=**65**（57）、エンゲージメント率=**52.3%**（59.6%）、
> impressions=**7**（8, query次元）／**26**（32, page次元）、非ブランド impressions **0（3週連続）**、clicks 0、indexed **37/100**（37）、未発見 **61/100（62→61）**。
> ★★**最重要発見（計測）: GA4 `page_view` が初発火（4件・activeUsers 1）した一方、`session_start` は 223・`/` は 195 セッションで views 0**。
> ＝**計測は生きており、北極星のトラフィックは `page_view` を 1 度も出していない**＝**28日間で人間の形をしたセッションは 1 件のみ**
> （`/trending`→`gallery_card_click`→`/result/...` の導線が 1 ユーザー分だけ存在）。**#007〜#009 の「views=0 は当プロパティで未計測」という説明は誤りだったと確定**。
> 教訓（§7 提案5）: **ゼロが続く指標を「壊れている」と説明するなら、壊れている側の証拠を取る。取れないなら「ゼロである」とだけ記録し判断材料から外さない**（#008 の「発見は頭打ち」誤読と同じ型）。
> ★**撤退基準: 両系列がそろって減少**（query 8→7・page 32→26）＝#008 合成ルールで**初の「非成長」カウント（連続 1/8）**。
> ただし実体は「先週より1人少ない人が『clipkeep』と検索した」だけで、**8期にわたりこの基準が判定しようとしている戦略は一度も実行されていない**（出荷5週連続0）。
> ★**pt の優位は3週連続で再現**（6/6 が pos 2〜7・平均4.2・対象URLの顔ぶれ不変）。en 19→**15**（`/` 12→8）／ja 3／es 1／hi 1／**ar 3週連続 0**。
> **Google オーガニックセッション 0（4週連続）・Direct 97.4%（221/227）・referral 0（2週連続）**・yandex organic 2。
> ★★**運用: 日次ループは 2 週連続 `enabled:false`＝11 スロット連続 未発火・daily log 空白 17 日。#009 が並べ替えた 13 件は予告どおり 1 件も消費されなかった**。
> **デプロイ断絶 33 日**（`3bd3cb6` 未反映 23日目）・twitter 401 約37日・**本週の出荷 0 件**（コミットは health-check 記録 `48eca09` の1件のみ）。
> ★**柱2 凍結に セキュリティ上の利得**: HC-11（`@cloudflare/puppeteer` の DIRECT high は版上げで直らない）は**柱2 凍結で puppeteer 依存ごと消せる**→ 優先6 に結合。
> 詳細 [`docs/ops/weekly_review_2026-08-16.md`](docs/ops/weekly_review_2026-08-16.md)。

> **2026-08-09 週次レビュー（#009）で並べ替え。#008 から 7 日＝正常間隔を2週維持**。計測は健全（SA・fresh・**6週連続で無人失効なし**。08-05 に SA キーは `D:\secrets\clipkeep\` へ退避済＝本日の取得成功がその実証）:
> 実測 28d: ad_script_load=**336**（#008 237）、セッション=**57**（65・**初の減少**）、エンゲージメント率=**59.6%**（55.4%）、
> impressions=**8**（7, query次元）／**32**（33, page次元）、clicks 0、indexed **37/100**（36）、未発見 **62/100（63→62）**。
> ★★**最重要（運用）: 日次グロースループはスケジューラ上で `enabled: false`＝無効化されていた**。`lastRunAt 2026-07-29T21:46Z`＝最後の daily log（07-30）と一致し、**07-31／08-03〜08-07 の 6 スロット連続 未発火**（2026-08 の daily log はゼロ件）。#008 §7 提案5 が「発火率が5割を切っている」と記録して**リポジトリ外だからと原因究明を見送った**現象の根本原因を、本レビューでスケジューラを直接照会して特定した。**バックログをどれだけ並べ替えても消費する主体が停止していれば1件も実行されない**＝#008 が用意した「デプロイ不要3件」の配慮も空振りだった。→ 週次レビューは毎回 `enabled`/`lastRunAt`/`nextRunAt` を実測記録する運用へ（#009 §7 提案5）。
> ★**発見1（計測）: 撤退基準を駆動している query次元 impressions は全件がブランドクエリだった**（`clipkeep` 7＋`tubekeep` 1／**非ブランド impressions = 0**）。#008 は「匿名化で過小（7 vs 33）」と診断したが、実際はより根本的＝**測る対象を間違えている**。戦略が完全に失敗していてもブランド検索が1件増えれば毎週リセットされる。平均順位 30.1→16.4 も**順位改善ではなく表示クエリ構成の変化**。→ 優先1 を「非ブランド impressions」主眼に強化。
> ★**発見2: 自サイト名 `clipkeep` でも position 6〜16（usa 15.7）・clicks 0**＝固有名詞クエリで1位を取れない＝**ドメイン権威不足の最も直接的な実測**。同時に**ディレクトリ登録が最初に効く場所**の特定でもある（→優先12 の位置づけを「被リンク一般」から「ブランドクエリの実体解決」へ変更）。
> ★**訂正: #008 の「発見は頭打ち」判定は1週で覆った**（未発見 63→**62**・indexed 36→**37** で改善再開）。**1週の横ばいを構造的な天井と断定したのが早計だった**というプロセス上の反省（ただし +1 もノイズ域＝どちらの断定も弱い）。
> ★**確定: pt の優位は2週連続で再現**＝page次元で **pt 6件中 6件が pos 2〜7**（平均4.2・#008 は7件中6件）、en 19（`/` 11.75）／ja 4／es 2／hi 1／**ar 2週連続 0**。#008 優先6 のデータゲート通過 → **優先4 へ昇格**。ar を柱1 の優先ロケールから外す提案は §4 本文の書き換え＝要承認のため提案止まり。
> **Google オーガニックセッション 0（3週連続）・Direct 96%（173/180）・referral ついに 0 件**。**セッション減（65→57）と ad_script_load 増（237→336）が同時成立**＝1セッションあたり 3.6→5.9 ロード＝**非人間トラフィック説をさらに補強**。
> **ブロッカーは 4 週連続で同じ**＝wrangler 未ログインで**デプロイ 26 日間 断絶**・`3bd3cb6` 未反映 16 日目・twitter 401 約30日・**本週の出荷 0 件**。3つの自動ループのうち日次は無効化、週次健全性は 08-08 に `status: skipped`（未コミット docs 4件で作業ツリーが汚れていたため／**本レビューでコミットして解消**）、動いていたのは観測系（本レビュー）のみ。
> 撤退基準: query次元 7→8 の**増＝成長**につき**連続非成長=0（非該当）**。ただし**その「成長」の実体は誰かが1回多くブランド名を検索したこと**であり、**基準はノイズが大きいのではなく測る対象を間違えている**（#009 §6・§7 提案1）。
> 詳細: `docs/ops/weekly_review_2026-08-09.md`。前回: `#008 2026-08-02`。

> **2026-08-02 週次レビュー（#008）で並べ替え。#007 から 7 日＝正常間隔に復帰**。計測は健全（SA・fresh・`blocked:false`・5週連続で無人失効なし）:
> 実測 28d: ad_script_load=**237**（#007 119）、セッション=**65**（36）、エンゲージメント率=**55.4%**（72.2%）、
> impressions=**7**（5, query次元）／**33**（page次元・新規計測）、clicks 0、indexed **36/100**（36）、未発見 **63/100（63→63）**。
> ★**発見1: 発見の改善が完全停止**（72→68→66→65→63→**63**／改善幅 −6→−2→−1→−2→**0**）。sitemap 501 が 3 週間不変＝新規 URL ゼロの必然。**「発見」はもう伸ばせるレバーではない**。
> ★**発見2（計測の穴）: 従来の impressions 系列は GSC 匿名化で実測の約 1/4.7**（query×page×country×device 次元 7 に対し page 次元 33）。**撤退基準がノイズ駆動**＝優先1 で是正。
> ★**発見3: page 次元では pt だけが順位化**（en 19 / **pt 7・うち6件が pos 2〜7** / ja 4 / es 2 / hi 1・**ar 0**）。柱1「ja/pt/ar 優先」は実測に支持されず＝賭け先は「広く」でなく「pt を深く」の可能性（#009 で 2 週分確認後に確定）。
> **Google オーガニックセッション 0（2週連続）・Direct 91%（121/133）**でエンゲージメント率は 16.8pp 低下＝**非人間トラフィック説を補強**。`ad_script_load` 237 を成果と読まない（#007 提案1 継続）。
> **ブロッカーは 3 週連続で同じ**＝wrangler 未ログインで**デプロイ 19 日間 断絶**・`3bd3cb6` 未反映 9 日目・**本週の出荷 0 件**。
> twitter 401 は**直近14日のプローブ 56/56 全滅**（窓 = `HISTORY_MAX 56`×6h／`probes.ts:267`）。プローブ自体は正常稼働。
> 撤退基準: impressions 5→7 の**微増＝成長**につき**連続非成長=0（非該当）**。ただし母数7のノイズであり、かつ**その系列自体が匿名化で 1/4.7 に潰れている**＝カウンタのリセットを改善の証拠と読まないこと。
> 日次ループの発火率: 月〜金 5 枠のうち daily log が残ったのは **2 枠**（07-28・07-30）のみ＝#008 §7 提案5 で週次レビューが毎回カウントする運用にした。
> 詳細: `docs/ops/weekly_review_2026-08-02.md`。前回: `#007 2026-07-26`。

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

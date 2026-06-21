# 柱2: トレンド鮮度ページ生成パイプライン 設計書

ステータス: **DRAFT（実装前・ユーザー承認待ち）**
作成: 2026-06-21（日次ループ バックログ #7）
正本との関係: `docs/strategy/growth-strategy.md`「柱2: トレンド鮮度ページ（速攻型）」の実装設計。
本書は設計提案であり、実装着手・本番投入の前にユーザー承認を要する（特に §6 のスケール上限と §9 の D1 スキーマ）。

---

## 0. TL;DR（結論）

- **ページの単位を「動画1本＝1ページ」ではなく「トレンド・トピック＝1ページ」にする。** 動画単位は既存の
  `/result/[jobId]`（薄い・揮発的）が担い、これは sitemap 非収録のまま据え置く。新設するのは
  **トピックハブ `/trend/[topic-slug]`**（複数クリップ＋編集文＋FAQ を束ねる）。
- **大量自動生成はしない。** 量で押すとガードレール #1（ドアウェイ/自動生成スパム）に抵触し、現在の律速
  （インデックス反映遅延）を悪化させる。**品質ゲート**を通った少数の濃いページだけを公開・sitemap 収録する。
- **現状の致命的ギャップ**: `runAutoTrendUpdate()` はトレンド**キーワード**（twittrend.jp 由来）を取得しているが
  抽出ジョブ生成後に**破棄**している。「{トレンド} video download」ページにはこのトピック名が必須 →
  まずトピックを**永続化**する必要がある。
- **段階導入**: Phase 0（D1 スキーマ変更なし・MVP）→ Phase 1（専用テーブル＝**要人間承認**）。
- 鮮度ページは**腐る**。トレンドが死んだら sitemap から外し noindex/410 へ落とす**減衰ポリシー**を最初から組み込む。

---

## 1. 背景と目的

`growth-strategy.md` 柱2 の狙いは「既存の trending cron（毎時）を活用し、話題のバイラル動画・イベントに
紐づく検索クエリ向けページを自動生成・更新する」こと。新規ドメインでも「鮮度 × 低競合の窓」はインデックス
されやすい、という仮説に立つ。

ただし現在のフェーズは **Phase L（立ち上げ）**で、律速は「コンテンツ不足」ではなく
**インデックス/クロール反映の遅延**（週次レビュー #002, 2026-06-15）。したがって本パイプラインの設計目的は
「ページを大量に作ること」ではなく、

> **少数でも『発見されやすく・腐らない・スパム判定されない』鮮度ページの生産ラインを作る**

ことに置く。量産は Phase L のボトルネックを悪化させる純粋なリスクである。

---

## 2. 現状アーキテクチャの棚卸し（実装根拠）

| 要素 | 実体 | 役割 | インデックス |
|---|---|---|---|
| 毎時 cron | `src/worker.ts` `scheduled()` → `/api/admin/auto-trend?secret=` | トレンド更新の起点 | — |
| トレンド発見/抽出 | `src/lib/auto-trend.ts` `runAutoTrendUpdate()` | X(twittrend.jp+Yahoo realtime)/TikTok(explore) を Puppeteer 走査 → `createJob()` で抽出 → `recordAccess()` | — |
| 抽出ジョブ保管 | `src/lib/extract/store.ts`（D1 `extractor_jobs` / `job_stats`） | 抽出結果・公開可否・アクセス数 | — |
| トレンド一覧 | `app/trending/page.tsx` / `app/trending/[platform]/page.tsx` | `job_stats` を集計した CollectionPage（クライアント fetch） | sitemap 収録（`/trending`, `/trending/{platform}`） |
| 動画詳細 | `app/result/[jobId]/page.tsx` | 1 ジョブ＝1 ページ。VideoObject JSON-LD あり | **sitemap 非収録・実質孤立**（揮発的なので妥当） |
| プログラマティック SEO の手本 | `src/lib/solution-pages/store.ts` + `app/solution/[slug]/page.tsx` | 実コンテンツ＋hreflang＋canonical＋内部リンク（`getRelatedSolutions`） | sitemap 収録・内部リンク済み |
| sitemap | `app/sitemap.ts` | path-based 4ロケール（en/ja/pt/ar）、`buildLocaleAlternates` で hreflang | — |

### 2.1 現状の致命的ギャップ（設計の出発点）

`auto-trend.ts` の `discoverTrends()` は X トレンドの **keyword**（`xKeywords`, twittrend.jp の `.trend a`）を
取得して各 keyword で代表ツイートを1本選ぶが、**keyword 自体はジョブに保存されない**。`createJob(platform, url, "ja")`
が受け取るのは URL とロケールだけ。TikTok 側に至ってはトピック名（ハッシュタグ等）すら拾っていない。

→ 「**{トレンド} video download**」というクエリ向けページを作るには、まず **トピック名（keyword/hashtag/event）を
抽出時点で捕捉し、抽出ジョブに紐づけて永続化する**ことが前提条件になる。これが Phase 0 の中心作業。

---

## 3. 設計上の中心的緊張と意思決定

### 3.1 緊張: 「鮮度の量」 vs 「ドアウェイ/薄ページの罰」

- ガードレール #1: 「クローキング・ドアウェイページ・自動生成スパムの大量投下は禁止（ドメインごと失う）」。
- 律速: インデックス反映遅延。**薄い自動ページを大量投入すると**、クロールバジェットを食い、サイト全体の
  品質シグナルを下げ、狙った濃いページの index 昇格をさらに遅らせる（純粋な逆効果）。

### 3.2 決定: ページの「単位」をトピックにする

| 案 | 内容 | 判定 |
|---|---|---|
| A: 動画1本=1ページ | `/result/[jobId]` を sitemap 収録して鮮度ページ化 | ❌ 薄い・寿命が短い・スケールでドアウェイ化。**棄却** |
| B: トレンド・トピック=1ページ | `/trend/[topic-slug]`：1トピックに複数クリップ＋編集文＋FAQ を集約 | ✅ **採用**。1ページの情報量が担保され、URL 数も抑制 |
| C: プラットフォーム×期間の集約のみ | 既存 `/trending/[platform]` を強化 | △ 補完として併用（§7.4 内部リンク）。単体では「{トレンド}」クエリを取れない |

→ **B を採用**。動画単位は `/result/[jobId]` のまま（sitemap 非収録・noindex 寄り）に据え置き、
鮮度 SEO は**トピックハブ**に集約する。

### 3.3 決定: 量ではなく品質ゲートで絞る

「生成できるから出す」ではなく「**ゲートを通ったものだけ index 対象にする**」。具体ゲートは §5.3。

---

## 4. ページモデル定義: トピックハブ `/trend/[topic-slug]`

### 4.1 ルーティングとデータ
- 新ルート: `app/trend/[slug]/page.tsx`（`/solution/[slug]` を手本にした SSR ページ）。
- 1ページ = 1トピック（例: あるバイラルなハッシュタグ/イベント名）。
- 構成要素:
  1. **H1 + 導入文**: 「{トピック} の動画を保存・ダウンロードする方法」。トピックが何か（イベント/ミーム/
     ハッシュタグ）を1〜2段落で説明（編集文。テンプレ穴埋めでなく、トピック種別ごとの文面バリエーション）。
  2. **関連クリップのギャラリー**: そのトピックに紐づく**実抽出済み公開クリップ**（`job_stats`/`extractor_jobs`、
     `is_public=1`）を N 本サムネ表示。各クリップは `/result/[jobId]` への実 `<a href>`。
  3. **ダウンロード手順 + FAQ**: プラットフォーム別の保存手順（既存 solution の文面資産を再利用）＋
     「{トピック}の動画は保存できる？」等の FAQ（FAQPage JSON-LD）。
  4. **内部リンク nav**: 該当プラットフォームの downloader ページ・not-working solution・`/trending/{platform}`
     への実アンカー（`getRelatedSolutions()` 相当のグラフを再利用）。
  5. CTA: 該当 downloader への実アンカー。

### 4.2 slug 設計
- `slugify(topic)`（小文字・ASCII 化・ハイフン区切り）。衝突時はサフィックス。
- 非 ASCII トレンド（日本語ハッシュタグ等）は**音写でなく安定 ID 化**（例: `t-<shorthash>` + 表示名は本文へ）。
  検索クエリは本文・title・H1 で当てる方針（URL に語句を無理に詰めない＝ドアウェイ回避）。
- 一度発行した slug は不変（URL 安定性 = index 資産）。

### 4.3 ロケール
- まず **ja**（cron が `createJob(..., "ja")` で ja ジョブを生成しており日本トレンド源 twittrend.jp と整合）。
- 横展開は柱1 と同じく **pt / ar**。hreflang/canonical は `buildLocaleAlternates(path)` を再利用（en/ja/pt/ar+x-default）。
- 翻訳が無いトピックは当該ロケールを hreflang に出さない（空ページ量産の回避）。

---

## 5. データパイプライン設計

### 5.1 トピック捕捉（Phase 0 の核）
`runAutoTrendUpdate()` を拡張し、抽出ジョブにトピックを紐づける:
- X: `xKeywords` の各 keyword を、その keyword で見つけたツイート抽出ジョブの**トピックラベル**として保持。
- TikTok: explore ページ走査時にハッシュタグ/チャレンジ名を併せて拾う（無ければ `null`＝トピック無しジョブ）。
- 保持先は §6 の Phase 段階で異なる（Phase 0 = 既存テーブルの範囲 / Phase 1 = 専用テーブル）。

### 5.2 トピック・クラスタリング
- 同一トピックに複数クリップが集まるよう、正規化キー（小文字・記号除去・全半角統一）でグルーピング。
- 1トピックに付き最小 `MIN_CLIPS` 本（§5.3）集まって初めてページ化候補。

### 5.3 品質ゲート（**index 対象になる条件**＝全て満たすこと）
1. `MIN_CLIPS`（初期値 **3**）本以上の **抽出成功・公開（`is_public=1`）** クリップが紐づく。
2. 重複/再投稿クリップを dedup 後の本数で判定。
3. 本文の編集文・FAQ が**生成済み**（テンプレ素の穴埋めだけのページは不可）。
4. NG ワード/センシティブ・成人・著作権リスクの高いトピックは**除外**（ブロックリスト）。
5. 公開上限 `MAX_LIVE_TOPICS`（初期値 **小さく**、§6.1 で承認）— 上限超過時は新規公開を**キューに留める**（量産防止）。

ゲート未達のトピックは**ページを公開しない/sitemap に出さない**（下書き状態で保持）。

### 5.4 鮮度減衰（最初から実装する）
- 各トピックページに `lastTrendedAt` を持たせ、`STALE_AFTER`（初期値 **30 日**）アクセス/トレンド更新が無ければ:
  - sitemap から除外、`robots: noindex`、または恒久的に無価値なら **410 Gone**。
- 「腐った薄ページの山」を残さないことがガードレール適合の要。

---

## 6. 段階的実装計画

> 各 Phase は日次ループの「1日1デプロイ単位」に分割する。**Phase 1 以降の D1 スキーマ変更はループ単独では実行せず、
> 本書承認時に別途ユーザー判断を仰ぐ**（運用ルール: D1 schema / bindings 変更は要人間判断）。

### Phase 0 — スキーマ変更なし MVP（ループ単独で着手可）
- 目的: トピック捕捉と1ページ実装を**既存テーブルの範囲**で検証する。
- 手段の候補（どちらか、実装時に確定）:
  - (a) 既存 `extractor_jobs` の未使用カラム or 既存 JSON カラムにトピックラベルを格納できるか調査（スキーマ追加なしで載るなら採用）。
  - (b) 載せられない場合、**ビルド時 or KV/JSON キャッシュ**にトピック→jobIds のマップを置き、`/trend/[slug]` をその
    マップから生成（D1 スキーマ非依存）。
- 成果物: `/trend/[slug]` ルート1本、ja のみ、品質ゲート（手動承認込み）、sitemap への**条件付き**収録、減衰の骨組み。
- **この Phase は「ページの単位＝トピック」「品質ゲート」「減衰」の3原則を本番で検証することが目的**。スケールはしない。

### Phase 1 — 専用永続化（**要ユーザー承認**: D1 スキーマ）
- `trend_topics`（id, slug, display_name, platform, locale, status, first_seen_at, last_trended_at, clip_count, …）と
  ジョブ↔トピックの関連付けテーブルを追加（マイグレーション＋`check:release` 更新が必須）。
- cron 拡張でトピックを自動 upsert、品質ゲート自動判定、公開/減衰の自動遷移。

### Phase 2 — 多言語展開と自動編集文
- pt/ar への展開、トピック種別別の編集文テンプレ多様化、内部リンクグラフの自動接続。

### Phase 3 — 計測連動の最適化（**Phase G 解禁後**）
- どのトピック種別が impression/セッションを生むかを `growth:review` で測り、発見・生成の重みづけを更新。

---

## 7. SEO / i18n 詳細

### 7.1 canonical / hreflang
- `app/trend/[slug]/page.tsx` の `generateMetadata` は `buildLocaleAlternates(`/trend/${slug}`)` を使用
  （path-based 自己参照 canonical、`?locale=` ビューは English へ畳む — 既存方針と一致）。

### 7.2 sitemap
- `app/sitemap.ts` に **公開かつゲート通過済みトピックのみ**を動的追加（`priority: 0.6`,
  `changeFrequency: "daily"`, `lastModified: lastTrendedAt`）。減衰したものは**出さない**。
- ソースは Phase 0=キャッシュ/マップ、Phase 1=`trend_topics`（status='live'）。

### 7.3 JSON-LD
- `CollectionPage` + `ItemList`（クリップ）+ `BreadcrumbList`（Home > Trending > {topic}）+ `FAQPage`。
- ラベルは全ロケールローカライズ（2026-06-20 の breadcrumb ローカライズ修正と同方針）。

### 7.4 内部リンク（孤立防止＝2026-06-17 の教訓）
- `/trending` と `/trending/[platform]` から**実 `<a href>`** で当該トピックページへリンク（クローラー追跡可能に）。
- トピックページ→downloader / not-working solution / 他トピックへ相互リンク。
- ホーム被リンクは**ゲート最上位のトピックのみ**（薄リンクの氾濫を避ける）。

---

## 8. ガードレール適合チェック

| ガードレール（`growth-strategy.md` §6） | 本設計での対応 |
|---|---|
| ドアウェイ/自動生成スパムの大量投下禁止 | ページ単位をトピックに集約＋品質ゲート＋`MAX_LIVE_TOPICS` 上限＋減衰で**量を出さない**。URL に語句を詰めない |
| TikTok extractor 拡張は週次承認制 | 既存 fixer 経由のみ利用。新規スクレイピング拡大はしない（explore 走査は現状 `auto-trend.ts` の範囲内） |
| Instagram noindex 維持 | 本パイプラインは Instagram を対象に含めない |
| レート制限・広告ゾーン変更禁止 | 触れない |
| 戦略文書の書き換え禁止 | 本書は**新規設計文書**であり `growth-strategy.md` 本文は変更しない |
| 法務導線維持 | レイアウト共通のため影響なし |
| D1 schema / bindings 変更は要人間判断 | Phase 0 はスキーマ変更なし。Phase 1 のテーブル追加は**承認ゲート**として明示 |

---

## 9. 未決事項・要ユーザー判断

1. **`MAX_LIVE_TOPICS` / `MIN_CLIPS` / `STALE_AFTER` の初期値**（提案: 上限を小さく開始＝例 10〜20 トピック、3 本、30 日）。
2. **Phase 1 の D1 スキーマ追加**（`trend_topics` ＋関連テーブル、マイグレーション＋release check 更新）。
3. **トピック・ブロックリストの運用**（成人/著作/センシティブの除外基準）。
4. **非 ASCII slug の方針**（安定 ID 化 `t-<hash>` を提案）。
5. Phase 0 の格納方式 (a) 既存カラム流用 か (b) KV/JSON キャッシュ かは実装時の調査で確定。

---

## 10. 計測と撤退

- 北極星（Monetag タグロード/日）への寄与は「トピックページ経由セッション × ページ/セッション × ロード率」。
- **Phase L の評価軸はインデックス数・GSC impressions**（CVR ではない）。トピックページの **indexed 件数**と
  **impression** を `growth:review` で柱単位に観測。
- 撤退: 公開した鮮度ページが**数週で index されない/impression を生まない**なら、量を増やさず**生成を停止**して
  週次レビューで方針判断（柱1 への集中継続）。ガードレール上、伸びないページを積み増すことはしない。

---

## 付録: 主要ファイル参照
- cron 起点: `src/worker.ts` `scheduled()`
- 発見/抽出: `src/lib/auto-trend.ts`（`discoverTrends()` のトピック保持が Phase 0 の改修点）
- 抽出保管: `src/lib/extract/store.ts`（`extractor_jobs` / `job_stats`）
- 手本ページ: `app/solution/[slug]/page.tsx` / `src/lib/solution-pages/store.ts`（`getRelatedSolutions`）
- sitemap: `app/sitemap.ts`（`buildLocaleAlternates`）
- 既存トレンド一覧: `app/trending/[platform]/page.tsx`

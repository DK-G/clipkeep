# ロングテールキーワードマップ: id / hi / tr（次の言語展開）

最終更新: 2026-07-02（日次ループ, 柱1 バックログ #5）
正本参照: `docs/strategy/growth-strategy.md`（北極星 = Monetag タグロード数/日）／`AGENTS.md` Launch-Phase KPI Gate

> **位置づけ**: この文書は id（インドネシア語）/ hi（ヒンディー語）/ tr（トルコ語）への
> 柱1（多言語ロングテール SEO）展開の**優先順位付けとページ制作順の設計**。ja/pt/ar に続く
> 次の3言語の「どのプラットフォーム × どの意図クラスタを、どの順で本文充足するか」を決める。
> 実際の本文充足は日次ループが1言語×1クラスタ単位で消化する（本文書はその発注書）。

---

## 0. 方法と限界（誠実性ノート）

- **有償キーワードツール（Ahrefs / SEMrush / Google Keyword Planner）は本環境で未接続**。
  そのため各クエリの「検索需要」は**絶対ボリュームではなく方向性推定**であり、根拠は
  (a) 各国のプラットフォーム利用シェア（2026 実測, §1 出典）、(b) ダウンロード系クエリの
  普遍的パターン（"cara download" / "video download kaise" / "video indir" 等の定型）、
  (c) ClipKeep 既存の en/ja/pt/ar での意図クラスタ構造。
- 数値は **相対スコア（1–5）** で表現し、絶対値は主張しない。GSC impressions が積み上がった段階で
  週次レビューが実測に置き換える（このマップは「どこを先に掘るか」の仮説であり、実測で更新する）。
- **ガードレール遵守**: 薄ページ量産・自動生成スパムはしない。各ページは ja/pt/ar と同等の
  s1/s2/s3 本文（実用的トラブルシュート）を持つもののみ制作対象とする。

---

## 1. 市場プロファイル（2026 実測ベース）

各言語の「ClipKeep がダウンローダーを持つプラットフォーム」に絞って評価する。
**Instagram は noindex/maintenance 継続（ガードレール）＝全市場で対象外**。

### id — インドネシア語（インドネシア中心, ~1.8億 SNS ユーザー / 人口比 62.9%）
- 上位: WhatsApp > Instagram > **X/Twitter(3位)** > **TikTok(4位)** > **Facebook(5位)**。
- **TikTok は広告リーチ最大（1.8億到達, 女性18+でほぼ100%）**＝ダウンロード需要も最大級。
- Telegram もインドネシアで普及。ClipKeep 対象の勝ち筋: **TikTok / X / Facebook / Telegram**。
- Monetag: **tier-3（CPM 低・ボリューム最大）**＝1本のヒットで大量 impression を狙う。
- 言語: 標準インドネシア語。"cara ... " / "tidak bisa ... " 構文が定型。

### hi — ヒンディー語（インド中心, 2026 で 9億+ オンライン人口・世界2位）
- 上位: WhatsApp > Instagram > Facebook > **Telegram(4位, 3.84億)** > Messenger。X 浸透率 42.9%。
- **Telegram はインドが世界1位のダウンロード国＝突出した勝ち筋**。
- **⚠ TikTok はインドで 2020 以降 BAN 継続＝正規の検索需要はほぼ消滅**。
  → **tiktok 系の hi ページは制作しない**（需要ゼロ・実装リスク＝無価値ページ）。
- ClipKeep 対象の勝ち筋: **Telegram(突出) / Facebook / X**。
- Monetag: **tier-3（CPM 最低・ボリューム桁違い）**。
- 言語: デーヴァナーガリー正書法を基本とし、Hinglish（ローマ字）併記が実利。
  現状 store.ts の hi は telegram がローマ字・lemon8 がデーヴァナーガリーで**表記が不統一**（要是正）。

### tr — トルコ語（トルコ中心, ~6.2億 … 6,230万 SNS ユーザー / 人口比 70.9%）
- 上位: **Instagram > X/Twitter(2位) > WhatsApp > Facebook(浸透 91.7%) > TikTok(5位, 成長中)**。
- **X/Twitter はトルコで歴史的に極めて強い（2位）＝突出した勝ち筋**。
- ClipKeep 対象の勝ち筋: **X(突出) / Facebook / TikTok**。
- Monetag: **tier-2〜3（id/hi より CPM 高め）**＝1 visit あたり収益効率が3市場で最良。
- 言語: トルコ語。"... video indir" / "... nasıl indirilir" / "filigransız" 構文が定型。

---

## 2. 意図クラスタ（既存タクソノミーに準拠）

ClipKeep の solution ページは以下のクラスタで構成される（`src/lib/solution-pages/store.ts`）。
id/hi/tr でも同一クラスタを流用する（新規クラスタは作らない＝構造の一貫性）。

| クラスタ | 代表 slug | 意図 | 優先度の傾向 |
|---|---|---|---|
| A. platform-not-working | `{platform}-video-downloader-not-working` | 高意図・問題解決（最有力） | **最優先** |
| B. watermark | `how-to-download-without-watermark` | 「透かしなし保存」 | 高（TikTok 圏で特に） |
| C. device | `video-download-not-working-on-{iphone,android}` 等 | 端末別トラブル | 中 |
| D. quality/format | `best-quality-download-settings`, `video-format-mp4-vs-webm` | 画質・形式 | 中 |
| E. trust/legal | `video-downloader-safe-guide`, `is-video-downloader-legal` | 安全性・合法性 | 低〜中 |
| F. year/trend | `{platform}-video-download-2026` | 鮮度クエリ | 中（柱2 と重複注意） |

- **クラスタ A（not-working）が最有力**: 検索意図が明確・競合が en 大手に薄い tier-2/3 言語・
  ClipKeep の実 extractor 導線に直結（CVR も高い）。id/hi/tr の初期投資は **A に集中**する。
- クラスタ B（watermark）は TikTok が強い id で相乗。
- クラスタ F（2026）は柱2（トレンド鮮度ページ `/trend/[slug]`）と意図が重なるため、
  柱2 が本番稼働するまでは**過剰生成を避ける**（重複カニバリ回避）。

---

## 3. スコアリング・マトリクス（プラットフォーム × 言語）

各セルを **需要 / 競合弱さ / 広告収益（Monetag）/ 実装容易性** の4軸 1–5 で採点し、
合計を**優先スコア**とする（高いほど先に制作）。実装容易性 = 既存 stub の有無・extractor 安定性。

凡例: 需要D / 競合弱さC / 収益R / 実装容易E → **合計**

### id（インドネシア語）
| プラットフォーム | D | C | R | E | 合計 | メモ |
|---|:-:|:-:|:-:|:-:|:-:|---|
| **TikTok** (A+B) | 5 | 4 | 4 | 4 | **17** | 広告リーチ最大・stub 有・extractor 稼働。透かしなし(B)と相乗 |
| **X/Twitter** (A) | 4 | 4 | 4 | 4 | **16** | 3位・stub 有・extractor 安定 |
| **Facebook** (A) | 4 | 4 | 4 | 3 | **15** | 5位だが巨大・en fallback（新規 id 本文要） |
| **Telegram** (A) | 3 | 5 | 3 | 4 | **15** | 普及・競合薄・stub 有 |

### hi（ヒンディー語）
| プラットフォーム | D | C | R | E | 合計 | メモ |
|---|:-:|:-:|:-:|:-:|:-:|---|
| **Telegram** (A) | 5 | 5 | 3 | 4 | **17** | 世界1位DL国・突出・stub 有。**最有力** |
| **Facebook** (A) | 4 | 4 | 3 | 3 | **14** | 巨大・en fallback（新規 hi 本文要） |
| **X/Twitter** (A) | 4 | 4 | 3 | 4 | **15** | 浸透 42.9%・stub 有 |
| ~~TikTok~~ | 1 | – | – | – | **除外** | **インド BAN＝需要消滅。制作しない** |

### tr（トルコ語）
| プラットフォーム | D | C | R | E | 合計 | メモ |
|---|:-:|:-:|:-:|:-:|:-:|---|
| **X/Twitter** (A) | 5 | 4 | 4 | 4 | **17** | 2位・歴史的に強い・stub 有・CPM 良。**最有力** |
| **Facebook** (A) | 4 | 4 | 4 | 3 | **15** | 浸透 91.7%・en fallback（新規 tr 本文要） |
| **TikTok** (A+B) | 3 | 4 | 4 | 4 | **15** | 5位・成長中・stub 有 |

> **収益効率の補正**: tr は Monetag tier が id/hi より上のため、同スコアなら **tr を前倒し**する
> （1本の index で得られる収益が高い＝立ち上げ期の北極星寄与が大きい）。

---

## 4. 推奨制作順（日次ループの発注書）

各行 = 「1言語 × 1プラットフォームの not-working（クラスタ A）本文を ja/pt/ar 同等の
s1/s2/s3 まで充足し、内部リンク・canonical・hreflang を確認して本番デプロイ」= 1日1タスク単位。
既存 stub（store.ts の多言語 `pages`）があるものは**充足**、en fallback のものは**新規 locale 本文**。

| 順 | 言語 | ページ | 種別 | 根拠 |
|:-:|---|---|---|---|
| 1 | tr | twitter-not-working | stub 充足 | tr 最有力(17)・CPM 良・X はトルコ2位 |
| 2 | hi | telegram-not-working | stub 充足 | hi 最有力(17)・世界1位DL国 |
| 3 | id | tiktok-not-working | stub 充足 | id 最有力(17)・広告リーチ最大 |
| 4 | id | twitter-not-working | stub 充足 | id 16・3位 |
| 5 | tr | tiktok-not-working | stub 充足 | tr 15・成長中・透かしなし相乗 |
| 6 | hi | twitter-not-working | stub 充足 | hi 15 |
| 7 | id | telegram-not-working | stub 充足 | id 15・競合薄 |
| 8 | tr | facebook-not-working | **新規 tr** | tr 15・浸透 91.7%（en fallback 解消） |
| 9 | id | facebook-not-working | **新規 id** | id 15（en fallback 解消） |
| 10 | hi | facebook-not-working | **新規 hi** | hi 14（en fallback 解消） |

- 8–10（facebook-not-working）は現状 `enPages`＝全 locale で英語フォールバック。
  多言語 `pages` レコード化（telegram/twitter/tiktok と同じ構造）が前提＝実装規模やや大。
  → 先に既存 stub 充足（1–7）で早期に impression を狙い、facebook 系は基盤整備後に着手。
- クラスタ B（watermark）の id 充足は、3（id-tiktok）完了後に相乗ページとして追加候補。
- **hi の表記統一**（デーヴァナーガリー基準＋Hinglish 併記）は 2（hi-telegram）着手時に
  併せて是正し、以降の hi ページの基準とする。

---

## 5. ローカル言語クエリ例（本文・見出しの語彙合わせ用）

実本文の見出し／導入で拾うべき定型。**キーワード停め込み（stuffing）はしない**＝自然文に織り込む。

**id（インドネシア語）**
- `cara download video {tiktok/twitter/facebook}` / `download video {platform} tanpa watermark`
- `{platform} tidak bisa di-download` / `kenapa video {platform} gagal disimpan`
- `download video {platform} kualitas HD`

**hi（ヒンディー / Hinglish）**
- `{telegram/facebook/twitter} video download kaise kare` / `वीडियो डाउनलोड कैसे करें`
- `{platform} video download nahi ho raha` / `{platform} se video kaise save kare`
- `telegram video download` （インドで極めて高頻度）

**tr（トルコ語）**
- `{twitter/facebook/tiktok} video indir` / `{platform} video nasıl indirilir`
- `filigransız video indirme` / `{platform} videosu indirilemiyor`
- `{platform} video kaydetme`

---

## 6. ガードレール・チェックリスト（各ページ制作時）

- [ ] Instagram は対象外（noindex/maintenance 維持）。
- [ ] **hi で TikTok ページを作らない**（インド BAN＝需要ゼロ・無価値ページ）。
- [ ] 薄ページにしない（s1/s2/s3 の実用本文・端末別/失敗種別の具体を含む）。
- [ ] 内部リンクは `getLocalizedPath` 正本（path 形式、`?locale=` を混ぜない）。
- [ ] canonical は自己参照 path 形式、hreflang は en/ja/pt/ar+x-default の既存方針に整合
      （注: id/hi/tr は現状 `?locale=` クエリ形式のロケール＝path 化は別途 middleware/hreflang
      拡張が必要。本マップは**本文充足**を対象とし、id/hi/tr の path 化は将来の別タスク）。
- [ ] extractor 導線（CTA）が実在プラットフォームを指す。
- [ ] クラスタ F（2026）は柱2 と重複するため単独量産しない。

---

## 7. 週次レビューへの引き継ぎ

- 本マップの 1–7（stub 充足）を**柱1 の次期デイリー候補**として `task.md` バックログへ反映。
- 制作後は GSC で当該 locale/platform の impression・indexed 推移を追い、
  スコアの「需要 D」を実測で更新する（このマップは仮説→実測で継続改訂）。
- 効果は柱単位で判定（個別ページの帰属は無理をしない — 戦略 §8 準拠）。

### 出典（市場データ, 2026）
- インドネシア: [Digital 2026 Indonesia (Campaign Brief Asia)](https://campaignbriefasia.com/2025/11/06/digital-2026-indonesia-reveals-social-media-user-identities-increased-26-to-180-million/) / [Statcounter Indonesia](https://gs.statcounter.com/social-media-stats/all/indonesia)
- インド: [India Social Media Statistics 2026 (Global Statistics)](https://www.theglobalstatistics.com/india-social-media-statistics/) / [Statcounter India](https://gs.statcounter.com/social-media-stats/all/india)
- トルコ: [Digital 2026 Turkey (DataReportal)](https://datareportal.com/reports/digital-2026-turkey) / [NapoleonCat Turkey 2026](https://stats.napoleoncat.com/social-media-users-in-turkey/2026/) / [Statcounter Turkey](https://gs.statcounter.com/social-media-stats/all/turkey)

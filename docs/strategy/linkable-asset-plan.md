# 柱1' linkable asset 計画（Track A）

作成: 2026-07-10（ユーザー承認 A+B に基づく準備）
正本参照: `docs/strategy/growth-strategy.md` §4 柱1'（linkable asset）／`AGENTS.md` DoD

> **狙い**: 「templated な not-working ページの量産」を止め、**他サイトが自発的に引用・リンクしたくなる
> 独自データ資産**を作る。真因（ドメイン権威・被リンクの欠如）に純オーガニックで効かせる唯一の道。
> Track B（権威）と対で、この asset を「リンクの受け皿＝link magnet」にする。

## なぜ templated 量産をやめるか（調査根拠, 2026-07-10）

- 「Google 未発見」68/100・impressions 4・平均順位は 33.5→54.3 と悪化。数週間の充足作業で獲得は不動。
- Google 公式: **URL 数千未満のサイトで crawl budget は非問題**＝発見律速は予算でなく**権威/信頼**。
- templated（変数だけ違う）ページ群は 2025–26 品質更新で **thin/doorway 判定→"Discovered not indexed" 恒常化**。
- 詳細な調査ログは daily 2026-07-10 参照。

## 資産の中身（＝独自データ）

**「ClipKeep Download Status — プラットフォーム別の実稼働データ」**。
ダウンローダー比較・トラブル記事を書くブロガー/ジャーナリストが**一次データとして引用できる**、
traffic 量に依存しない独自の稼働データを公開する。既存インフラで作れる:

- データ源1（既存）: D1 `extractor_jobs`（`platform` × `status` completed/failed）＋`evaluatePlatformQualityGate`
  の per-platform success_rate ロジック（`src/lib/extract/store.ts`）。**スキーマ変更不要＝読み取りのみ**。
- データ源2（既存）: リリースゲートの合成プローブ（fxtwitter / t.me / reddit / threads 等への HEAD/GET）
  ＝**ユーザー流入ゼロでも自前でデータを生成できる**（現状 7 sessions/28d では源1だけだと n が小さいため、
  合成プローブで母数非依存の稼働データを併用するのが要）。

## 最小実行ステップ（1ステップ＝1日1デプロイ単位）

> 各ステップは AGENTS.md DoD（push→deploy:prod→check:release:prod→本番確認→daily log）で閉じる。
> **D1 スキーマ変更・bindings 変更はしない**（読み取り＋KV 書き込みのみ）。

- [ ] **A-v0（最小・次の1デプロイ）**: 公開ページ `/platform-status`（または既存 `/status` を拡張）に
  **合成プローブ表**を追加。各対応 PF（TikTok/X/Telegram/Reddit/Threads/Facebook…）へ既知の公開サンプル
  URL でリクエストし、**pass/fail＋応答時間＋"last checked"** を SSR 表示。プローブ実体はリリースゲートの
  probe ロジックを再利用。保存なしのライブ判定で可（短 TTL キャッシュ）。→ *即・独自データ。母数非依存。*
- [ ] **A-v1（履歴化）**: 軽量 cron（HTTP プローブのみ・browser 不使用）で定期プローブし結果を **KV `TREND_KV`**
  に追記、ページに **「7日 uptime %」** を per-PF 表示。→ *"uptime データ" として被引用性が上がる。*
- [ ] **A-v2（源1 併記）**: `extractor_jobs` の per-PF success_rate（実利用ベース, n を明記）を uptime と併記。
- [ ] **A-v3（SEO/被リンク受け）**: canonical・`schema.org/Dataset`（or MonitoringService）・
  hub からの内部リンク・OpenGraph 整備。**埋め込み用「status バッジ」snippet**（例: 他サイトが貼れる
  ライブ稼働バッジ＝貼られると自然被リンク）を提供＝Track B の link magnet 化。

## 品質・ガードレール

- 各ページは「変数を抜いても generic にならない」＝**独自データを持つ**もののみ（薄ページ量産の逆）。
- §6 ガードレール（クローキング/ドアウェイ/スパム）非抵触。プローブは対象 PF の公開 URL への通常アクセスのみ。
- 計測の正直性: 母数 n・最終確認時刻・プローブ方式を明記（実測でないものを実測と偽らない）。

## 成功指標

- 短期: A-v0/v1 本番公開・独自データが live。
- 中期(1–3ヶ月): 当該ページの indexed 化・外部からの被参照/被リンク発生（Track B と合わせて判定）。

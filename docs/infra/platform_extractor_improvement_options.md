# Platform Extractor Improvement Options

Date: 2026-03-26
Status: Deferred implementation notes
Purpose: 現時点では実装しない改善案を整理し、あとで再開しやすくする

## Scope

この文書は、抽出ロジックのうち「改善余地はあるが、現時点では実装しない」と判断した案をまとめる。

対象:
- Bilibili
- Lemon8
- Telegram
- Threads

判断基準:
- 現在の ClipKeep 構成で実装コストが重すぎないか
- public downloader として運用しやすいか
- secrets / cookie / login session を新たに必要としないか
- 仕様変更時の保守負荷が高すぎないか

## 1. Bilibili

### Current state

現行実装:
- `view` API で `cid` を取得
- `playurl` API で `durl` を取得
- `backup_url` の先頭を fallback として使用
- browser fallback は `video` のみ成功扱い

### Deferred improvement

候補:
- WBI 対応の追加
- `backup_url` の評価強化
- DASH / audio-video 分離への対応
- cookie なし範囲での高品質ルート改善

### Merits

- 今より成功率が上がる可能性が高い
- `VIDEO_URL_NOT_RESOLVED` を減らせる
- Bilibili 対応の実用性が一段上がる

### Drawbacks

- WBI は実装も保守も複雑
- 高品質を狙うと cookie / session 前提に寄りやすい
- public downloader としては運用負荷が急増する

### Current judgment

部分採用は妥当。
ただし、`SESSDATA` や login cookie 前提まで進むのは現時点では見送る。

## 2. Lemon8

### Current state

現行実装:
- `v.lemon8-app.com` 短縮URLの展開
- `og:video` / `og:image` ベースの専用 extractor
- 失敗時のみ browser fallback

### Deferred improvement

候補:
- hidden API を使った item_id 解決
- detail API から structured media を取得
- `og:*` 依存を減らす

### Merits

- structured data が取れれば成功率が上がる可能性がある
- Lemon8 固有情報を安定して取得できる可能性がある

### Drawbacks

- hidden API は壊れやすい
- ByteDance 系は anti-bot と仕様変更が激しい
- 継続運用コストに対してリターンが読みにくい

### Current judgment

現時点では不採用寄り。
今の `og:* + browser fallback` を維持し、hidden API は安定ソースが確認できた場合のみ再検討する。

## 3. Telegram

### Current state

現行実装:
- `t.me` / `telegram.me` の public post URL を受理
- `?embed=1` ベースの web extractor
- video / image fallback
- downloader landing は active support に戻してある

### Deferred improvement

候補:
- MTProto / Telethon / gramjs ベースの extractor service
- Worker 外の別サービス化
- large file / signed URL / private-like cases への対応強化

### Merits

- 成功率を大きく引き上げられる可能性がある
- web embed の限界を超えられる
- Telegram を差別化要素として強くできる

### Drawbacks

- 非常に重い
- secrets / session / account 運用が必要
- 別インフラと別監視が必要
- abuse / rate limit / account risk がある

### Current judgment

現時点では不採用。
今は `embed=1` 路線の軽量 public extraction を維持する。
将来、別 extractor service を切る判断が出たときに再検討する。

## 4. Threads

### Current state

現行実装:
- 専用 extractor を主経路として使用
- `og:video` / `og:image` ベース
- 失敗時のみ browser fallback
- `threads.com` / `threads.net` の整合は修正済み

### Deferred improvement

候補:
- browser fallback の強化
- request capture
- hidden JSON / script data 抽出
- `og:*` 依存の縮小

### Merits

- 現行より安定しやすい
- Meta 側の HTML 変化に多少強くなる
- public tool の範囲を比較的維持しやすい

### Drawbacks

- browser 処理が重くなる
- request capture は複雑
- anti-bot や login wall の根本解決ではない
- Meta 側の変更追従は必要

### Current judgment

部分採用候補として最も有力。
ただし現時点では見送り。
次に extractor 強化へ着手するなら、最初の候補は Threads にする。

## Priority if resumed later

現時点で再開する場合の優先順:
1. Threads
2. Bilibili
3. Telegram
4. Lemon8

理由:
- Threads は今の構成の延長で強化しやすい
- Bilibili は難しいが改善余地が大きい
- Telegram は効果は大きいが重すぎる
- Lemon8 は投資対効果が最も読みにくい

## Operational rule

この文書の改善案は、次の条件が満たされた場合にのみ実装検討へ戻す。

- 現行ロジックで実機失敗が繰り返し確認された
- public tool として許容できる運用コストに収まる
- secrets / session / external service の導入判断が済んでいる
- 追加の保守負荷を受け入れる理由がある

# Reddit Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Reddit only

## 1. Goal

Reddit 対応は Telegram のような大規模分離ではなく、現行ロジックを保ちながら安定化する。

目的:

- 現行抽出の成功率を把握しやすくする
- 外部依存の失敗を制御する
- 無理な対象を MVP から外す

## 2. Current Path

現行コード: [reddit.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\reddit.ts)

現在の抽出順:

1. `reddit.com` を `rxddit.com` へ置換
2. fixer 側 HTML の `og:video` / `og:image` を抽出
3. fixer 失敗時は元の Reddit HTML を取得
4. 元ページの `og:video` を見る

補足:

- 現状は HTML / OG 依存だが、Reddit では `.json` payload の方が構造的に安定している
- ただし MVP では全面移行せず、安定化観点の知見として扱う

## 3. Scope

MVP で対象にするもの:

- 公開 Reddit post URL
- 単体 video post
- 単体 image post

MVP で対象外にするもの:

- private / quarantined / gated content
- comments 全体
- gallery の完全再現
- Reddit hosted 以外の外部埋め込みを全救済すること
- NSFW / age-gated content

## 4. Main Risks

現行コードから見える主要リスク:

1. `rxddit` 依存が強い
2. `og:video` 依存で gallery や変則構造に弱い
3. 元 Reddit HTML 側も meta 変化に弱い
4. 取得失敗時の分類が粗い
5. Reddit hosted video は audio / video 分離や 403 が起きやすい

## 5. Stability Policy

Reddit は X と同様、全面改修ではなく安定化を優先する。

やること:

- path ごとの成功 / 失敗を記録
- `rxddit failure` と `original page failure` を分ける
- 対象外ケースを早期に落とす
- success / failed cache を入れる

## 6. Supported Input

受け付ける URL:

- `https://www.reddit.com/r/.../comments/...`
- `https://reddit.com/r/.../comments/...`
- `https://redd.it/...`

補足:

- title slug は識別上の本質ではない
- valid post URL なら `.json` 付加で構造データ取得が可能な場合がある

非対応:

- subreddit top
- search
- user profile
- comment permalink 単独

## 7. URL Normalization

正規化ルール:

1. `reddit.com` を canonical に統一
2. `redd.it` short URL は最終 post URL に寄せる
3. 不要クエリは除去
4. post 単位で cache key を作る

## 8. Fallback Policy

抽出順は現行を維持する。

1. fixer path
2. original page path
3. 必要なら browser fallback

browser fallback は Reddit では常用しない。  
meta 抽出が壊れた時の最終手段に留める。

将来候補:

- `.json` payload を gallery / preview 系だけに限定利用する
- ただし MVP では HTML / OG 中心の現行 path を維持する

## 9. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `POST_NOT_FOUND`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `UPSTREAM_TEMPORARY_FAILURE`
- `UPSTREAM_FORMAT_CHANGED`
- `AGE_GATED`
- `AUDIO_STREAM_UNAVAILABLE`

分類原則:

- `rxddit` 側で取れなかったのか
- 元ページでも取れなかったのか
- 対象外構造だったのか

を分けて残す。

## 10. Cache Policy

保存対象:

- normalized URL
- chosen path
- media URL
- thumb URL
- media type
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

## 11. Download Policy

download は proxy 前提に寄せる。

理由:

- upstream URL 失効
- referer / hotlinking
- 直リンク露出の抑制

補足:

- Reddit hosted video は silent fallback しか安定しないケースがある
- audio + video の完全結合は MVP scope 外に置く

## 12. Logging

最低限必要:

- input URL
- normalized URL
- path chosen
- fixer success / fail
- original success / fail
- final status
- processing time
- error code

## 13. MVP Boundary

MVP でやること:

1. fixer / original の二段 fallback を維持
2. path 別ログ
3. success / failed cache
4. 失敗分類
5. NSFW / age-gated を明示的に除外

MVP でやらないこと:

- gallery 完全対応
- Reddit API ベース全面移行
- comment / thread 全体抽出
- full audio + video merge

## 14. Key Design Rule

Reddit は「複雑な取得機構を増やす」より、「今ある経路の壊れ方を分解して運用しやすくする」を優先する。

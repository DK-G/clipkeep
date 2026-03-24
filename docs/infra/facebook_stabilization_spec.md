# Facebook Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Facebook only

## 1. Goal

Facebook は Meta 系の中でも制約が強く、MVP では現行の公開ページ抽出を壊さず、対応境界を明確にする。

目的:

- 現行 `og:video` / `video_url` 抽出を前提に整理する
- login / anti-bot 制約の強い対象を早期に落とす
- 失敗分類と cache を追加しやすくする

## 2. Current Path

現行コード: [facebook.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\facebook.ts)

現在の抽出:

1. 対象 URL を fetch
2. `og:video` を探す
3. 無ければ `"video_url"` 断片を探す
4. 無ければ `og:image`
5. `og:title` を補助で使う

補足:

- `watch`, `share`, `reel`, `fb.watch` など複数 URL 形があるため、正規化が重要

## 3. Scope

MVP で対象にするもの:

- 公開 Facebook post URL
- 公開動画 post
- `watch` / `share` / `reel` / `fb.watch` の公開動画 URL

対象外:

- login required content
- private profile / page / group content
- reels / stories の完全対応
- multi-variant の完全選択
- live

## 4. Main Risks

1. Meta 側 anti-bot の影響を受けやすい
2. login wall によって public fetch が崩れやすい
3. `og:*` と埋め込み断片の両方が変化しやすい
4. thumbnail のみ取得して見かけ上成功しやすい
5. DASH 分離で muted video になりやすい
6. CDN media URL が短時間で失効する

## 5. Stability Policy

Facebook は feature を広げない。

方針:

- 公開 post / video に限定
- success 条件を厳しめにする
- error code 分類を先に整える
- browser fallback は最終手段

## 6. Supported Input

受け付ける URL:

- `https://www.facebook.com/...`
- `https://fb.watch/...`
- `https://www.facebook.com/watch/?v={id}`
- `https://www.facebook.com/share/v/{id}/`
- `https://www.facebook.com/reel/{id}`

対象外:

- profile top
- group top
- login wall 前提 URL

## 7. URL Normalization

正規化ルール:

1. 不要クエリ削除
2. watch URL は canonical post / video URL に寄せられるなら寄せる
3. post 単位で cache key を作る

補足:

- `fb.watch` は redirect 解決を先に行う

## 8. Success Criteria

MVP success:

- download 可能な video URL を返せる

`og:image` だけの取得は、Bilibili と同様に補助情報であり、動画抽出成功とはみなさない。

## 9. Fallback Policy

抽出順:

1. `og:video`
2. embedded `video_url`
3. browser fallback

browser fallback は最終手段であり、常用しない。

補足:

- 将来的には `mbasic` 系 SSR path を補助経路にする余地がある
- ただし MVP では public metadata path 維持を優先する

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `PRIVATE_OR_RESTRICTED`
- `MEDIA_NOT_FOUND`
- `VIDEO_URL_NOT_RESOLVED`
- `UPSTREAM_FORMAT_CHANGED`
- `UPSTREAM_TEMPORARY_FAILURE`
- `LOGIN_WALL`
- `DOWNLOAD_EXPIRED`
- `AUDIO_STREAM_UNAVAILABLE`

## 11. Cache Policy

保存対象:

- normalized URL
- resolved video URL
- thumbnail
- title
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

## 12. Download Policy

download は proxy 前提に寄せる。

理由:

- 直リンク失効
- referer 制約
- URL 露出抑制

追加方針:

- CDN URL は長期保存前提にしない
- extract 成功後は早期保存または短TTL運用に寄せる

## 13. Logging

必要ログ:

- input URL
- normalized URL
- `og:video` success / fail
- embedded `video_url` success / fail
- final status
- error code
- processing time

## 14. MVP Boundary

MVP でやること:

1. 現行 public path を維持
2. success 条件の厳格化
3. error code 分類
4. success / failed cache
5. watch / reel / share / short URL の正規化

MVP でやらないこと:

- Facebook API ベース全面移行
- 認証付き取得
- multi-quality 完全対応
- DASH muxing の本格対応

## 15. Key Design Rule

Facebook は「public page から取れた時だけ成功」に寄せ、thumbnail だけの疑似成功を避ける。

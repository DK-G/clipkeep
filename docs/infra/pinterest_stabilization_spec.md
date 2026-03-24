# Pinterest Stabilization Spec

Date: 2026-03-23
Status: Draft for implementation review
Scope: Pinterest only

## 1. Goal

Pinterest は公開 Pin ページを対象に、埋め込み JSON を主経路として安定抽出する。

目的:

- public pin URL のみを対象にする
- image pin と video pin を分けて扱う
- DOM ではなく埋め込み JSON を主経路にする

## 2. Current Direction

Pinterest は Antigravity 側で実装進行中のため、この仕様は clipkeep 全体の安定化観点からの整理である。

優先方針:

1. public pin page を取得
2. `__PWS_DATA__` など埋め込み JSON を解析
3. image / video source を抽出
4. direct media URL は proxy or immediate fetch 前提で扱う

## 3. Supported Input

MVP で対象にするもの:

- `https://www.pinterest.com/pin/{id}/`
- 公開 image pin
- 公開 video pin

MVP で対象外:

- board
- profile
- private pin
- nested board / feed scraping
- Idea Pin 完全対応

## 4. Stable Input Forms

安定入力:

- standard pin URL
- short URL があれば canonical pin URL に解決

補足:

- locale サブドメインや短縮 URL があっても、内部では canonical pin URL に統一する

## 5. Main Risks

1. DOM 上の visible image は thumbnail に過ぎないことが多い
2. video pin は HLS や複数 quality source を持つことがある
3. public page は JS 依存が強く、単純 HTTP だけだと取りこぼすことがある
4. anti-bot や CAPTCHA が強化される可能性がある
5. hidden API に依存すると保守コストが跳ねる

## 6. Stability Policy

Pinterest は official API ではなく public pin page と埋め込み JSON を使う。

方針:

- DOM scrape ではなく embedded JSON を主経路にする
- image と video で別成功条件を持つ
- hidden API は MVP scope 外
- anti-bot を踏みやすい board/profile scraping はやらない

## 7. URL Normalization

正規化ルール:

1. short URL は canonical pin URL に解決
2. 不要クエリ削除
3. pin id を内部識別子として保持
4. cache key は normalized URL または pin id

## 8. Extraction Path

MVP の抽出順:

1. public pin page HTML
2. embedded JSON parse
3. image or video candidate resolve
4. 失敗

見る対象:

- `__PWS_DATA__`
- 類似の初期 state JSON
- pin resource 内の image source
- video source list

## 9. Success Criteria

Image success:

- 高解像度 image URL を 1 件返せる

Video success:

- download 可能な video URL を 1 件返せる

補足:

- thumbnail だけの取得は成功とみなさない
- HLS しか無い場合は MVP では失敗扱いでもよい

## 10. Failure Classification

エラーコード例:

- `INVALID_URL`
- `UNSUPPORTED_URL`
- `PIN_NOT_FOUND`
- `PIN_DATA_NOT_FOUND`
- `MEDIA_NOT_FOUND`
- `VIDEO_URL_NOT_RESOLVED`
- `ANTI_BOT_BLOCKED`
- `UPSTREAM_FORMAT_CHANGED`

## 11. Cache Policy

保存対象:

- normalized URL
- pin id
- media type
- media URL
- thumbnail
- ttl

TTL:

- success cache: `6h` から `24h`
- failed cache: `10m` から `30m`

## 12. Download Policy

download は proxy または immediate fetch 前提。

理由:

- media URL の変動
- anti-hotlink
- long-term hotlink 回避

## 13. Logging

必要ログ:

- input URL
- normalized URL
- pin id
- JSON path success / fail
- image resolved / not resolved
- video resolved / not resolved
- final status
- error code

## 14. MVP Boundary

MVP でやること:

1. public pin page 限定
2. embedded JSON 解析
3. image / video の基本抽出
4. error code 分類
5. success / failed cache

MVP でやらないこと:

- board / profile scraping
- private pin
- hidden API 依存
- Idea Pin 完全対応
- HLS remux の本格対応

## 15. Key Design Rule

Pinterest は「public pin page + embedded JSON」を主経路に固定し、DOM や hidden API への依存を最小化する。

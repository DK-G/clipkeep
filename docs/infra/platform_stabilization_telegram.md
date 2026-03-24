# Telegram Extraction Stabilization Notes

Date: 2026-03-23
Scope: Telegram only
Purpose: clipkeep の抽出安定化に向けた事前調査メモ。Pinterest は Antigravity 側で進行中のため別管理。

## 1. Stable Facts

- 公開 Telegram 投稿の単発抽出では `?embed=1` 付き URL が最も扱いやすい。
- `?embed=1` を使うと、通常ページよりも HTML が軽くなり、`<video>` や画像要素を直接拾いやすい。
- 公開 Web プレビューでは private channel / private group のメディアは安定して扱えない。
- Telegram の video CDN URL は恒久 URL ではなく、期限付きトークンを含むケースがある。
- photo 系 URL は video より安定しやすい。
- 一部の大きな動画では embed HTML に `video` タグが出ず、通常の HTML パースだけでは拾えない事例がある。

## 2. Risks For Clipkeep

- 現行実装は `?embed=1` HTML を取得し、`<video src>` と `<source src>` を抽出するだけなので、large video 欠落ケースに弱い。
- 動画 URL が短時間で失効する場合、抽出成功後に保存や再訪が遅れるとダウンロード失敗に見える。
- Telegram CDN 側で Referer や hotlinking 条件が厳しくなると、抽出後の再生・保存が不安定化する。
- Cloudflare Workers 上で Browser Rendering を fallback に使う場合、Telegram では通常 fetch で十分なケースが多い一方、無闇に browser fallback へ逃がすとコストと遅延が増える。
- アルバム投稿では複数 media の対応関係がずれやすく、thumbnail の紐付け精度が落ちる。

## 3. Current Code Fit

- 現行コード: [telegram.ts](C:\dev\portfolio\web\clipkeep\src\lib\extract\telegram.ts)
- 良い点:
  - `?embed=1` 前提に寄せている
  - `video` と `source` の両方を拾っている
  - 軽量で、Browser Rendering 前提ではない
- 弱い点:
  - image 抽出が実質未対応
  - album の個別 media 構造解析がない
  - URL 失効前提の扱いがない
  - large video 欠落時の第2経路がない

## 4. Stabilization Recommendations

1. Telegram は `fetch(embed)` を主経路として維持する。
2. 抽出直後に result を返すだけでなく、video URL が期限付きである前提を UI と保存ポリシーに入れる。
3. `video/source` 不在時の fallback を明示する。
4. image / album の抽出規則を追加で整理する。
5. proxy ダウンロード時は Referer と User-Agent を安定的に付与する。
6. Telegram では browser fallback を常用しない。

## 5. Priority Questions Before Implementation

- Telegram の large video 欠落時に、公開 Web だけで取れる代替経路があるか。
- album 投稿で image / video の順序を壊さず抽出するには、どの DOM 断片を見るべきか。
- result ページ再訪時に、期限切れ video URL をどう再取得するか。

## 6. Suggested Next Task

- 次の単独調査対象は `Twitter/X`。
- 見る論点:
  - 非公式 fixer 依存の脆さ
  - HEAD redirect 戦略の安定性
  - oEmbed / official API の限界
  - Cloudflare Workers 上での fallback 方針

# GA4 Weekly Review Template (ClipKeep)

最終更新: 2026-03-15

## 対象期間
- Week: YYYY-MM-DD 〜 YYYY-MM-DD

## 入力値（GA4）
- `extract_submit`:
- `processing_complete`:
- `download_actual_start`:
- `error_displayed`:
- `blog_cta_click`:
- `gallery_card_click`:
- `result_related_click`:

## 派生指標
- Extract完了率 = `processing_complete / extract_submit`
- Download開始率 = `download_actual_start / processing_complete`
- Error率 = `error_displayed / extract_submit`
- Blog CTA率 = `blog_cta_click / blog pageviews`
- Result継続率 = `result_related_click / download_actual_start`
- 先週比（各イベント件数）

## セグメント確認
- platform別（twitter / telegram / tiktok）
- locale別（en / es / ar）
- gallery_section別（recent / trending）

## 判定
- 良化:
  - Extract完了率 が先週比 +10%以上
  - Download開始率 が先週比 +10%以上
  - Error率 が先週比 -10%以上
- 悪化:
  - Extract完了率またはDownload開始率が先週比 -10%以下
  - Error率が先週比 +10%以上

## アクション
- 良化時:
  - 伸びた導線を他ページへ横展開
- 悪化時:
  - クリック箇所の文言/配置見直しを1件起票
  - 失敗理由または結果ページ導線の改善候補を1つ投入

## メモ
- 実施したUI変更:
- 懸念点:
- 次週タスク:


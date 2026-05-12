# KPI Dashboard Definition (ClipKeep)

## 1. Core KPI
- Extract Submit Count
  - Definition: `extract_submit` event count
  - View: daily / weekly / monthly
- Extract Completion Rate
  - Definition: `processing_complete / extract_submit`
  - Goal: increase over time
- Solution-to-Extractor CTR
  - Definition: extractor遷移イベント / solution page views
- Degraded Ratio
  - Definition: (`429` + `503`) responses / total prepare requests
- Country Mix
  - Definition: country別セッション/イベント比率（Top 10）

## 2. Secondary KPI
- Result Page View Count (`result_view`)
- Error Rate (`failed` flow ratio)
- Platform Mix (telegram vs twitter)

## 3. Segments
- Locale: `en`, `ar`, `ja`, `pt` — **SEO優先を ja / pt / ar に設定**
- Platform: `tiktok`, `twitter`, `reddit` — **抽出安定プラットフォームに限定**
- Device: mobile / desktop
- Region: top countries

## 4. Dashboard Panels (Recommended)
1. Traffic & Submit Trends
2. Conversion Funnel (submit -> result -> completed)
3. Solution Page Performance
4. Error / Degraded Monitoring
5. Geo & Locale Split
6. **SEO Organic ランキング**（Search Console連携）— ja/pt/ar・プラットフォーム別クリック数

## 5. Update Cadence
- Daily check: degraded ratio, failure spikes
- Weekly review: conversion changes, page-level bottlenecks
- Monthly review: roadmap impact and SEO/solution expansion priorities

## 6. Data Sources
- GA4 events (`extract_submit`, `extract_prepare_success`, `result_view`, `processing_complete`, `download_actual_start`, `error_displayed`)
- API logs (`429`, `503`, `4xx`, `5xx`)

## 7. Acceptance Criteria
- All core KPI visible on one dashboard
- Locale/platform filters available
- Weekly report template agreed by owner

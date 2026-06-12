# spec.md

> このファイルはAI向けの開発仕様書。READMEとは別物。  
> 新しいセッション開始時はこのファイルを最初に読み込ませること。

-----

## 1. コンセプト

- **概要**: SNSメディア抽出ハブ。Telegram・X等の動画・画像を取得できる導線と、「保存できない」「動かない」等の問題解決ページを組み合わせたWebサービス（**ClipKeep**）。
- **設計思想 / 譲れない核**: SEO/AISOファースト。各ページが明確な検索意図を持ち、入力→DLまでの最短導線を維持する。RTL含む10言語対応は品質まで担保。test/prodデプロイは設定ファイルレベルで分離し、混同しない。
- **ターゲットユーザー**: SNS動画・画像を手軽に保存したいユーザー（世界規模、多言語）。
- **現在のフェーズ**: 立ち上げ段階・改善継続中。Telegram / X の基本フロー稼働中。詳細は [`docs/core/plan.md`](docs/core/plan.md)、フェーズ計画は [`docs/core/RoadMap.md`](docs/core/RoadMap.md) を参照。

-----

## 2. 技術スタック

| 領域 | 採用技術 | バージョン | 選定理由 |
|---|---|---|---|
| フロントエンド + API | Next.js App Router (Route Handlers) | - | SSR・SEO・API統合が一体 |
| ランタイム / インフラ | Cloudflare Workers (OpenNext) | - | エッジ配信、低レイテンシ |
| データ | Cloudflare D1 | - | SQLite互換、エッジDB |
| レート制限 | Durable Object endpoint | - | Worker間ステート共有 |
| スケジュールタスク | Worker Cron (`0 * * * *`) | - | トレンド自動更新 |
| 言語 | TypeScript | - | - |

-----

## 3. アーキテクチャ

### ディレクトリ構成

```
/app             # Next.js App Router ルート
/docs
  /core          # plan.md, RoadMap.md
  /api           # api_contract.md
  /ops           # daily_growth_optimization_playbook.md, feed_behavior.md
  /analytics     # GA4エクスポートとレビューエントリポイント
task.md          # 実行タスクバックログ
memo.md          # 調査メモ
```

### データの流れ

```
ユーザー（検索流入）
  ↓ 問題解決ページ / SNS別導線
  ↓ URL入力 → Route Handler → 抽出API呼び出し
  ↓ 結果表示（メディア候補一覧）
  ↓ 保存実行
```

-----

## 4. 制約・禁止事項 ★最重要

- **デプロイ設定の混同禁止**: `wrangler.test.toml` と `wrangler.production.toml` を混同しない。`wrangler.toml` の手動切り替えに依存しない。デプロイ前は `check:release:test` / `check:release:prod` を必ず通す。
- **10言語・RTL保証**: `en/ja/ar/es/pt/fr/id/hi/de/tr` の UI / metadata / SEO 導線を壊さない。RTL 表示品質も含む。
- **法務導線の維持**: Privacy、Terms、免責、問い合わせ導線の到達性を壊さない（ユーザー信頼目的。2026-06-12 以降 AdSense 審査は追わず、収益化は Monetag 一本。正本: `docs/strategy/growth-strategy.md`）。
- **D1 schema変更時の同期**: Cloudflare bindings、Durable Object、Cron を変更する場合は migrations・wrangler設定・release checks を同時に更新する。
- **Analyticsは参考情報**: GA4 / GSC エクスポートは改善判断の材料であり、自動的なプロダクト変更トリガーにしない。`npm run growth:review` はデータ収集のみ。
- **生成物をコミットしない**: `.env`, `.env.local`, `.secrets`, `.wrangler`, `.next`, `.open-next` はローカル/生成物であり、仕様・レビューの正本にしない。
- **Instagram**: 既存の maintenance placeholder と noindex 運用を維持する。勝手に再有効化しない。

-----

## 5. 命名・コーディング規約

- **言語**: TypeScript（Next.js App Router標準）。
- **命名規則**: Next.js慣例に従う（ページ: `page.tsx`、APIルート: `route.ts`）。
- **多言語**: 翻訳ファイルを言語コードごとに管理。UI文言は翻訳ファイル経由。
- **コメント方針**: コード内コメントは英語。ドキュメントは日本語。

-----

## 6. 既知の落とし穴

- **RTL対応の漏れ**: arなど右から左の言語はCSSレイアウトが崩れやすい。変更時はRTL言語でも目視確認する。
- **Durable Object状態**: レート制限のDurable Objectはグローバルステートを持つ。誤ったキー設計でレート制限が機能しなくなる。
- **D1のマイグレーション管理**: スキーマ変更時はD1マイグレーションファイルを漏れなく作成しないとtest/prod間で乖離する。
- **SNS側のAPI変更**: 抽出ロジックはSNS側の仕様変更で突然動かなくなる。プラットフォーム別に安定性モニタリングが必要。

-----

## 7. 決定ログ

- `2026-xx-xx` **Instagram を maintenance モードに**: 再有効化コストと安定性から、現状は noindex + placeholder で維持。

-----

## 8. 未解決 / TODO（仕様レベル）

- TikTok専用フロー（SnapTik参考UX）の実装判断
- SEOページを初期20本→中期100本へ拡張するスケジュール
- AdSense本審査通過に向けた法務導線の完成度確認
- Durable Object / D1 スキーマの正式ドキュメント化


## 検証ツール (Validation Tools)

現在のプロジェクトで実装・導入されている検証ツールは以下の通りです：

- ESLint
- TypeScript

# プロジェクト計画: Clipkeep（SNS Media Extraction Hub）

## 1. 概要
**Clipkeep** は、SNS 上のコンテンツを保存・管理したい需要に対応するための高度な SNS メディア抽出ハブです。  
一般的なダウンローダーと異なり、**AISO（AI Search Optimization）**、**多言語 SEO（RTL / アラビア語対応を含む）**を重視し、ファクト確認やコミュニティ主導メタデータを扱える構成を目指します。

## 2. コアアイデンティティと戦略
- **サービス名**: Clipkeep (`clipkeep.app` 想定)
- **コンセプト**: Social Media Media Extraction Hub
- **ターゲットレイヤー**:
  - **Tool Layer**: 各 SNS に対応する高性能ダウンローダー群
  - **Solution Layer**: 「How to download...」「Not working fix」などの問題解決ページを用意し、AISO / SEO 流入を獲得する
- **多言語優先**: 英語とアラビア語（RTL UI 対応）を優先する

## 3. 高度機能
Clipkeep には、リンク安全性とメタデータ精度を担保するためのコミュニティ投票機構と Facts システムを組み込む。

- **Fact System**: プロジェクトやダウンローダー状態を追記型で管理する `FactItems`
- **Layered Voting**:
  - **Unique View**: 安定 ID 単位で 1 票を集計する、人間の合意に近い指標
  - **Multi View**: 生の票数・熱量をそのまま見るトレンド指標
- **Audience Scaling**: 匿名ユーザーでも投票やタグ追加は可能にし、Facts 編集はログインユーザーに限定する
- **Cost Guard**: 非ログイン状態や高負荷時には `degraded` モードで応答し、インフラコストを抑える

## 4. 技術スタック
- **Frontend**: Next.js（SSR、i18n、SEO 優先）
- **Backend**: Node.js / FastAPI
- **Infrastructure**: Cloudflare（Pages、D1、Durable Objects）
- **Styling**: RTL 対応を含むプレミアム志向の UI

## 5. メタデータ / 分類情報
- **Project ID**: `clipkeep`
- **Category**: `web`
- **Type**: `nextjs` / `fullstack`

## 6. 実装フェーズ
- **Phase 0: Bootstrap**: `new-project.ps1 web clipkeep` を実行する
- **Phase 1: Tool MVP**: Twitter / TikTok ダウンローダーを EN / AR で提供する
- **Phase 2: AISO Solution Layer**: SEO 最適化された Problem Pages を追加する
- **Phase 3: Community Layer**: Facts と Layered Voting を統合する
- **Phase 4: Telegram Guide**: 専用ボットとガイド導線を整備する

## 7. 運用ルール
- 初期化手順は `playbooks/new-project.md` に従う
- 依存関係運用は `docs/DEPENDENCY_RULES.md` に従う（pnpm、Volta pinning）
- 定期的に `scripts/doctor.ps1` で健全性確認を行う

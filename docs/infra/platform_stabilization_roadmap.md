# Platform Stabilization Roadmap

Date: 2026-03-23
Status: Active
Purpose: supported platform 全体の抽出安定化に関する役割分担と優先キューを定義する

## 1. Role Division

| Stage | User (Human) | Codex (Assistant) |
| --- | --- | --- |
| Input | 不安定なプラットフォームの特定、403/404 や live site 上の失敗報告 | ログ、既存コード、抽出成功率の確認 |
| Research | テスト URL、地域差、実運用上の文脈提供 | NotebookLM による個別プラットフォーム調査、内部 API や metadata 調査 |
| Spec | Success Criteria の最終決定 | `*_stabilization_spec.md` の作成・更新 |
| Logic | 実装方針の承認 | [MAIN] 正規化、fallback、cache、error classification の実装 |
| Infra | 本番 D1 / Pages / Cloudflare 側設定の管理 | Workers コード、`store.ts`、proxy、job 処理の更新 |
| Verification | live site 上の最終 UX 確認 | `npm run typecheck`、必要なローカル検証、デプロイ前チェック |

## 2. Priority Queue

### Batch 1

#### Bilibili

- Priority: High
- Problem: thumbnail しか返らず、動画 URL を取れないことが多い
- Goal: 内部 API / player data / `cid` 解決を踏まえて、動画解決条件を安定化する

#### TikTok

- Priority: Medium
- Problem: TikWM など第三者 upstream 依存が強く壊れやすい
- Goal: short URL 解決を安定化し、upstream path ごとのログと cache を入れる

#### Reddit

- Priority: Medium
- Problem: gallery 構造と audio / video 分離で取りこぼしが出やすい
- Goal: D1 cache と error classification を強化し、deleted / private / age-gated を分離する

## 3. Stabilization Protocol

各プラットフォームで、Codex は以下の順で進める。

1. Refine Normalization

- tracker 除去
- domain canonicalization
- deterministic job key の確認

2. Implement Multi-Path Fallback

- `API -> Direct -> Scraper`
- 既存 path がある場合は全面改修ではなく順序と失敗条件の整理を優先

3. Implement Error Classification

- upstream error を内部コードへ写像する
- 例: `PRIVATE_POST`, `BOT_CHALLENGED`, `RATE_LIMITED`, `DOWNLOAD_EXPIRED`

4. Add D1 Caching

- success TTL: `24h`
- failed TTL: `10m` から `30m`
- 実装対象: `store.ts` または job / result 保存層

5. Log Success Path

- どの path で成功したかを保存
- `sourcePath` 相当の情報を media / job 結果へ残す

## 4. Current Reference Docs

- [telegram_extractor_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\telegram_extractor_spec.md)
- [x_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\x_stabilization_spec.md)
- [reddit_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\reddit_stabilization_spec.md)
- [bluesky_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\bluesky_stabilization_spec.md)
- [bilibili_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\bilibili_stabilization_spec.md)
- [discord_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\discord_stabilization_spec.md)
- [threads_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\threads_stabilization_spec.md)
- [facebook_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\facebook_stabilization_spec.md)
- [lemon8_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\lemon8_stabilization_spec.md)
- [tiktok_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\tiktok_stabilization_spec.md)
- [pinterest_stabilization_spec.md](C:\dev\portfolio\web\clipkeep\docs\infra\pinterest_stabilization_spec.md)

## 5. Working Rule

- 調査は `1 notebook = 1 platform` を守る
- mixed notebook は参照専用とする
- 実装は priority queue 順に進める
- 本番設定変更は user 主導、コード変更は Codex 主導で進める

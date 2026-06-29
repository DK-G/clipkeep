# トレンドトピックの鮮度減衰・個別撤去 運用メモ（柱2 P0-4）

設計正本: `docs/strategy/trend-freshness-pages-design.md` §5.4。
対象コード: `src/lib/trends/topic-store.ts`（`isStale` / `listLiveTopics` / `listRemovedSlugs`
＝撤去リストの**読み取り**のみ）、`src/lib/trends/live.ts`（`isSlugRemoved`）、
`app/trend/[slug]/page.tsx`、`app/sitemap.ts`。撤去リストへの**書き込み**（add/remove）は
サイト本体には持たず、運用ツール `scripts/trend-remove-topic.mjs`（`npm run trend:topic`）が
wrangler CLI 経由で本番 KV の `topics:removed` を直接更新する（2026-06-29 HC-2 で未配線の
`markTopicRemoved`/`unmarkTopicRemoved` を topic-store から除去・書き込みは CLI に一本化）。

## 2系統の「下げ方」

| 種別 | トリガ | 挙動 | 用途 |
|---|---|---|---|
| **鮮度減衰（自動）** | `lastTrendedAt` が `STALE_AFTER_DAYS`（=30日）超過 | sitemap 除外 ＋ `/trend/[slug]` は **200 のまま noindex**（コンテンツは残す） | トレンドが自然に古くなった「腐り」対策 |
| **個別撤去（手動）** | `topics:removed` 配列に slug を追加 | sitemap 除外 ＋ `/trend/[slug]` を **404**（コンテンツ消去）＋ index 対象から除外 | 不適切・誤検出など**問題トピックの即時撤去**（事後対応路） |

- どちらも `listLiveTopics()`（sitemap・内部リンク・index 可否の単一正本）で判定するため、
  下がったトピックは sitemap / `/trending` 内部リンク / index からまとめて消える。
- 撤去は **デプロイ不要**（KV 書き込みのみで即時反映）。`topics:removed` は cron の upsert
  （`topic:*` / `topics:index`）とは別キーなので、同一トピックが再トレンドしても撤去状態は保持される。

## 個別撤去の手順（運用ツール）

> ⚠️ 本番 KV を直接変更する。`--remote` 必須（付け忘れるとローカル ns を見て空に見える＝2026-06-22 の教訓）。

```bash
# 現在の撤去リストを確認（読み取りのみ・安全）
npm run trend:topic -- list

# 問題トピックを撤去（/trend/<slug> が即 404・sitemap/index から除外）
npm run trend:topic -- remove t-abc123

# 誤撤去を復帰（条件を満たせば live ゲートに再加入）
npm run trend:topic -- restore t-abc123

# test 環境を対象にする場合
npm run trend:topic -- list --test
```

撤去後の確認: `curl -I https://clipkeep.net/trend/<slug>` が **404** を返すこと、
`https://clipkeep.net/sitemap.xml` に当該 `/trend/<slug>` が含まれないこと。

## 手動フォールバック（ツールが使えない場合）

`scripts/trend-remove-topic.mjs` は wrangler CLI を叩くだけなので、直接でも可能:

```bash
# 取得
npx wrangler kv key get topics:removed --binding TREND_KV -c wrangler.production.toml --remote
# 上書き（JSON 配列をそのまま渡す）
npx wrangler kv key put topics:removed '["t-abc123"]' --binding TREND_KV -c wrangler.production.toml --remote
```

## 404 と 410 について

設計 §5.4 は「恒久的に無価値なら 410 Gone」と記すが、Next.js App Router は
サーバコンポーネントから任意ステータス（410）を返す公式手段が無いため、Phase 0 では
撤去を **404（`notFound()`）** で実装している。404 / 410 はいずれも Google の
インデックス削除シグナルとして等価に扱われる。真の 410 が必要になった場合は
middleware / route handler で `/trend/*` を処理する拡張を別タスクで検討する。

## しきい値の調整

`STALE_AFTER_DAYS`（`src/lib/trends/topic-store.ts`）は保守的に 30 日で開始。
週次レビューで indexed / impression の実測を見て1ダイヤルずつ調整する
（`MIN_CLIPS` / `MAX_LIVE_TOPICS` と同じ運用方針）。

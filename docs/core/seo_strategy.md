# SEO 多言語展開戦略（ClipKeep）

## 基本方針

**ランチェスター戦略 × ロングテール戦略**

英語市場で真正面から戦うのではなく、**競合の薄い言語×ニッチクエリ**を先行占領する。
大手ダウンローダーサイトは英語圏向けに最適化されており、日本語・ポルトガル語・アラビア語では
コンテンツ品質・RTL対応・ローカライズともに不十分な競合が多い。

---

## ターゲット言語

| 言語 | ロケール | 主なターゲット地域 | 競合状況 |
|---|---|---|---|
| 日本語 | `ja` | 日本 | SNS保存系ツールは英語or雑なJP翻訳が多い |
| ポルトガル語 | `pt` (pt-BR優先) | ブラジル | SaaS/ツール系の良質PT翻訳が少ない |
| アラビア語 | `ar` | MENA全域 | RTL対応ツールが希少、競合が薄い |

---

## 対象プラットフォーム

ダウンロード機能が安定稼働済みの3プラットフォームに絞る。

| プラットフォーム | ロングテールクエリ例（日本語） | 特性 |
|---|---|---|
| **TikTok** | 「TikTok 動画 保存 できない」「TikTokショート ダウンロード PC」 | 保存需要が最も高い |
| **X (Twitter)** | 「Xの動画 保存方法」「Twitterスペース 録音 保存」 | スペース保存クエリが独自 |
| **Reddit** | 「Reddit 動画 ダウンロード」「Reddit GIF 保存」 | 英語偏重で他言語が手薄 |

---

## 技術SEO チェックリスト

### 1. hreflang 実装
```html
<link rel="alternate" hreflang="ja" href="https://clipkeep.app/ja/..." />
<link rel="alternate" hreflang="pt" href="https://clipkeep.app/pt/..." />
<link rel="alternate" hreflang="ar" href="https://clipkeep.app/ar/..." />
<link rel="alternate" hreflang="x-default" href="https://clipkeep.app/en/..." />
```
- [ ] `app/layout.tsx` または `generateMetadata` に実装
- [ ] URLパス構造を `/[locale]/...` に統一

### 2. ロケール別 Metadata
```typescript
// 各 generateMetadata に言語別 title/description を設定
// src/lib/i18n/locales/[module]/ja.ts 等に追加済み構造を活用
```
- [ ] TikTok解説ページ: ja/pt/ar の title/description
- [ ] X解説ページ: ja/pt/ar の title/description
- [ ] Reddit解説ページ: ja/pt/ar の title/description

### 3. Sitemap hreflang alternates
```typescript
// app/sitemap.ts で alternates.languages を全ロケール分列挙
```
- [ ] sitemap.ts に ja/pt/ar URLを追加

### 4. Schema.org 多言語化
- [ ] FAQ スキーマを ja/pt/ar で実装（各プラットフォームのHow-toページ）
- [ ] HowTo スキーマで「ダウンロード手順」を構造化

---

## ロングテールキーワードマップ

### TikTok × 日本語
| クエリ | 月間想定 | 競合度 |
|---|---|---|
| TikTok 動画 保存 PC | 中 | 低 |
| TikTokショート ダウンロード | 低 | 低 |
| TikTok 音楽だけ 保存 | 低 | 極低 |
| TikTok 非公開 保存 できない | 低 | 極低 |

### X × 日本語
| クエリ | 月間想定 | 競合度 |
|---|---|---|
| Twitter 動画 保存方法 スマホ | 中 | 低 |
| Xスペース 録音 保存 | 低 | 極低 |
| ツイッター GIF 保存 | 低 | 低 |

### Reddit × ポルトガル語 (pt-BR)
| クエリ | 月間想定 | 競合度 |
|---|---|---|
| como baixar vídeo do Reddit | 低 | 極低 |
| Reddit salvar vídeo | 低 | 極低 |

### TikTok × アラビア語
| クエリ | 月間想定 | 競合度 |
|---|---|---|
| تحميل فيديو تيك توك | 低〜中 | 低 |
| حفظ فيديو تيك توك بدون علامة مائية | 低 | 極低 |

---

## グロースループ（点検 → 改善）

```
[Search Console] 
  → 各言語のクリック/表示数を週次確認
  → クリック率が低いページ = titleを改善
  → 表示されていないページ = hreflang/sitemapを確認

[ロケール辞書更新]
  → src/lib/i18n/locales/[module]/ja.ts 等を更新
  → lint + typecheck → deploy

[Solution ページ拡充]
  → 競合が低いロングテールを発見したらページを追加
  → プラットフォーム × 言語 × 問題パターンの組み合わせ
```

---

## 進捗管理

| タスク | 状態 | 担当フェーズ |
|---|---|---|
| i18n 基盤リファクタリング | ✅ 完了 | Phase 3 |
| hreflang 実装 | ⬜ 未着手 | Phase 3.5 |
| ロケール別 metadata 追加 | ⬜ 未着手 | Phase 3.5 |
| キーワードマップ完成 | ⬜ 未着手 | Phase 3.5 |
| ja/pt/ar Solution ページ充足 | ⬜ 未着手 | Phase 3.5 |
| Schema.org 多言語化 | ⬜ 未着手 | Phase 3.5 |
| Sitemap hreflang | ⬜ 未着手 | Phase 3.5 |

**変更目的**:
- `ja` / `pt` / `ar` の path-based hreflang を追加し、sitemap alternates と solution 系 locale metadata を揃えるため。

**変更概要**:
- `middleware.ts`: `/ja/*` `/pt/*` `/ar/*` を既存 `?locale=` 形式へ rewrite する locale path 互換層を追加。
- `src/lib/metadata-helper.ts`: localized URL / alternates 生成を共通化し、path-based hreflang を helper 化。
- `app/layout.tsx`, `app/sitemap.ts`, `app/faq/page.tsx`, `app/latest/page.tsx`, `app/trending/page.tsx`, `app/solution/[slug]/page.tsx`: hreflang / canonical / sitemap alternates を helper ベースへ更新。
- `src/lib/i18n/types.ts`, `src/lib/i18n/locales/solution/{ja,pt,ar}.ts`: solution locale metadata 文言を追加。
- `task.md`: Phase 3.5 の完了チェックと作業メモを更新。

**確認方法**:
1. 人間環境で `npm run lint` を実行する。
2. 人間環境で `npm run typecheck` を実行する。
3. 人間環境で `npm run build` を実行する。
4. `/ja/faq`, `/pt/trending`, `/ar/solution/<slug>` が既存ページへ rewrite され、`<link rel="alternate">` と sitemap alternates が path-based URL を返すことを確認する。

**既知の課題**:
- この Codex sandbox では `node.exe` 実行が `Access is denied` で拒否されるため、`npm run lint` / `npm run typecheck` / `npm run build` は未実行。
- 既存の query-string locale リンクは一部残っており、今回は hreflang/canonical/sitemap と rewrite 層を優先している。

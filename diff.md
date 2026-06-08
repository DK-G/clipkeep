**変更目的**:
- `ja` / `pt` / `ar` の path-based hreflang を追加し、sitemap alternates と solution 系 locale metadata を揃えるため。

**変更概要**:
- `middleware.ts`: `/ja/*` `/pt/*` `/ar/*` を既存 `?locale=` 形式へ rewrite する locale path 互換層を追加。
- `src/lib/metadata-helper.ts`: localized URL / alternates 生成を共通化し、path-based hreflang を helper 化。
- `app/layout.tsx`, `app/sitemap.ts`, `app/faq/page.tsx`, `app/latest/page.tsx`, `app/trending/page.tsx`, `app/solution/[slug]/page.tsx`: hreflang / canonical / sitemap alternates を helper ベースへ更新。
- `src/lib/i18n/types.ts`, `src/lib/i18n/locales/solution/{ja,pt,ar}.ts`: solution locale metadata 文言を追加。
- `task.md`: Phase 3.5 の完了チェックと作業メモを更新。

**確認方法**:
1. `npm run typecheck`（成功）
2. `npm run lint`（成功）
3. `npm run build`（成功）
4. `/ja/faq`, `/pt/trending`, `/ar/solution/<slug>` が既存ページへ rewrite され、`<link rel="alternate">` と sitemap alternates が path-based URL を返すことをブラウザで確認する。

**既知の課題**:
- 既存の query-string locale リンクは一部残っており、今回は hreflang/canonical/sitemap と rewrite 層を優先している。
- `/ja|pt|ar` rewrite のブラウザ確認は未実行。

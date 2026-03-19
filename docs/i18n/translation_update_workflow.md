# Translation Update Workflow

## Purpose
Use this checklist when adding or changing user-facing copy to keep all locales consistent.

## Supported locales
- `en` (default)
- `ja`, `ar`, `es`, `pt`, `fr`, `id`, `hi`, `de`, `tr`

## 1. Where to update text
1. Prefer shared dictionaries in `src/lib/i18n/ui.ts`.
2. Avoid hard-coded strings in page/components.
3. If a page currently has local dictionary data, move it into `ui.ts` when touching it.

## 2. Copy quality rules
1. Write natural, short UI text for each locale.
2. Avoid machine-literal wording and mixed-language terms (e.g., `downloader` left untranslated when not intended).
3. Keep labels consistent between menu, footer, metadata, and page body.

## 3. SEO alignment rules
1. For localized pages, update `generateMetadata` titles/descriptions for all supported locales.
2. Update `alternates.languages` with all supported locale URLs.
3. Ensure `app/sitemap.ts` includes the same locale coverage, unless route-level constraints exist.

## 4. Validation commands
Run after every translation change:
```powershell
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run typecheck
```

## 5. Review checklist before commit
- [ ] No new hard-coded UI copy in components/pages
- [ ] `ui.ts` dictionary updated for all target locales
- [ ] Metadata and sitemap locale sets are aligned
- [ ] `lint` and `typecheck` passed
- [ ] Commit message uses `feat(i18n)` or `fix(i18n)` or `refactor(i18n)`

## 6. Suggested commit scopes
- `feat(i18n): add localized copy for <area>`
- `fix(i18n): refine translation quality for <area>`
- `refactor(i18n): centralize <area> copy into shared dictionaries`

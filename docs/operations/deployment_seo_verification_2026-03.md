# Deployment and SEO Verification Notes (2026-03)

## Scope
This note consolidates temporary command outputs that were previously stored as ad-hoc files:
- `build_output.log`, `build_output_v3.log`
- `deploy_error.txt`, `d1_list.txt`
- `pages_json.txt`, `pages_list.txt`
- `scripts/seo_results.txt`, `scripts/seo_results_v2.txt`

Raw outputs were intentionally not preserved in git history because they are environment-specific and quickly become stale.

## Keep as historical facts
- Build succeeded on Next.js `15.2.9` after lint/type checks, with only `next/no-img-element` warnings in result cards.
- Wrangler deploy succeeded and produced a Worker deployment URL with D1/asset/env bindings attached.
- `wrangler pages project list --format json` failed (`Unknown argument: format`) in the tested Wrangler version.
- D1 listing confirmed `clipkeep-db` exists in production.

## SEO verification summary
Two phases were observed:
1. Initial run had title duplication such as `... | ClipKeep | ClipKeep`.
2. Follow-up run (`seo_results_v2`) confirmed duplication was removed.

Representative status after fix:
- Downloader pages: canonical and Twitter card present, JSON-LD count expected.
- `/about` and `/contact`: title format normalized.
- `/faq`: currently resolves to home-like metadata and should be periodically rechecked if FAQ-specific metadata is required.

## Decision on temporary scripts
The following files were ad-hoc investigation scripts (not stable test assets):
- `scripts/test_canonical_tiktok.js`
- `scripts/test_canonical_tiktok_get.js`
- `scripts/test_instagram_extract.js`
- `scripts/test_kktiktok.js`
- `scripts/test_live_extraction.js`
- `scripts/test_live_extraction_fetch.js`
- `scripts/test_tiktok_extract.js`
- `scripts/verify_seo.js`

Decision: do not keep as formal documentation. If needed later, rebuild as maintained scripts under a dedicated `scripts/qa/` set with shared options and deterministic assertions.

## Recommended permanent assets
- Keep automated gates already in repository (`scripts/release_gate.ps1`, `scripts/prod_release_check.ps1`).
- Keep this note as the historical record for March 2026 troubleshooting outcomes.

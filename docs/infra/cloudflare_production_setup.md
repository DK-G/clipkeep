# Cloudflare Production Setup

## Purpose
- Define the current production deployment baseline for ClipKeep.
- Avoid target mix-ups between `clipkeep-web` and `clipkeep-web-test`.

## Current Assumption
- Runtime: Cloudflare Workers via OpenNext
- Production worker config: `wrangler.production.toml`
- Test worker config: `wrangler.test.toml`

## 1. Preconditions
- Repository: `C:\dev\portfolio\web\clipkeep`
- Cloudflare account and Wrangler login are ready
- Production domain is already connected
- D1 database `clipkeep-db` exists

## 2. Production Config Files
- `wrangler.production.toml`
  - Worker name: `clipkeep-web`
  - `NEXT_PUBLIC_SITE_URL=https://clipkeep.net`
- `wrangler.test.toml`
  - Worker name: `clipkeep-web-test`
  - `NEXT_PUBLIC_SITE_URL=https://clipkeep-web-test.liminality-3110.workers.dev`

Do not switch targets by editing `wrangler.toml` manually.

## 3. Required Environment Values
- `RATE_LIMIT_DO_ENDPOINT`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`
- Turnstile keys

If secrets are not managed in config, set them with Wrangler:
```powershell
npx wrangler secret put <KEY>
```

## 4. Production Migration
```powershell
cd C:\dev\portfolio\web\clipkeep
npm run d1:migrate:remote
```

## 5. Production Release Flow
1. Validate target and smoke check:
```powershell
npm run check:release:prod
```
2. Deploy production worker:
```powershell
npm run deploy:prod
```
3. Verify:
- `https://clipkeep.net/` returns `200`
- `https://clipkeep.net/api/v1/health` returns `200`
- metadata / canonical / JSON-LD point to `clipkeep.net`

## 6. Test Release Flow
1. Validate target:
```powershell
npm run check:release:test
```
2. Deploy test worker:
```powershell
npm run deploy:test
```

## 7. Post-Deploy Checks
- Home page loads
- Key downloader pages load
- Gallery APIs return `200`
- status page is reachable
- metadata / Open Graph / Twitter / JSON-LD use the expected domain

## 8. Rollback
1. Re-deploy the last known good commit to the same target
2. Re-run the release gate
3. Update status page if user-facing degradation exists

## References
- [docs/infra/deployment_profiles.md](C:\dev\portfolio\web\clipkeep\docs\infra\deployment_profiles.md)
- [docs/ops/release_flow.md](C:\dev\portfolio\web\clipkeep\docs\ops\release_flow.md)
- [docs/infra/d1_migration.md](C:\dev\portfolio\web\clipkeep\docs\infra\d1_migration.md)
- [docs/infra/rate_limit_do_setup.md](C:\dev\portfolio\web\clipkeep\docs\infra\rate_limit_do_setup.md)

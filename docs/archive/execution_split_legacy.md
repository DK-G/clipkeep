# Legacy Execution Split

## Status
- Archived on 2026-03-24
- Reason: written for an older Cloudflare Pages-centered flow

## Why archived
- Current release flow uses:
  - `wrangler.production.toml`
  - `wrangler.test.toml`
  - `check:release:test`
  - `check:release:prod`
- The old document assumed manual external steps that no longer match the current deploy model.

## Replacement
- [docs/infra/deployment_profiles.md](D:\dev\repos\clipkeep\docs\infra\deployment_profiles.md)
- [docs/infra/cloudflare_production_setup.md](D:\dev\repos\clipkeep\docs\infra\cloudflare_production_setup.md)
- [docs/ops/release_flow.md](D:\dev\repos\clipkeep\docs\ops\release_flow.md)

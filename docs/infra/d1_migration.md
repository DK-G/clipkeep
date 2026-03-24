# D1 Migration Guide

## Prerequisites
- Cloudflare account and D1 database created
- `wrangler.production.toml` and `wrangler.test.toml` reviewed
- Wrangler authenticated (`wrangler login`)

## Files
- `docs/api/db_schema.sql`: canonical schema
- `migrations/0001_init.sql`: first migration

## Commands
- Local apply:
  - `npm run d1:migrate:local`
- Remote apply:
  - `npm run d1:migrate:remote`

## Notes
- Remote migration should be run only after the release target is confirmed
- Use `docs/ops/release_flow.md` and `docs/infra/deployment_profiles.md` as the release baseline
- Run remote migration only after confirming local apply succeeds

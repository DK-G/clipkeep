# D1 Migration Guide

## Prerequisites
- Cloudflare account and D1 database created
- `wrangler.toml` updated with real `database_id`
- Wrangler authenticated (`wrangler login`)

## Files
- `db_schema.sql`: canonical schema
- `migrations/0001_init.sql`: first migration

## Commands
- Local apply:
  - `npm run d1:migrate:local`
- Remote apply:
  - `npm run d1:migrate:remote`

## Notes
- Current schema targets platforms: `telegram`, `twitter`, `tiktok`
- Run remote migration only after confirming local apply succeeds.

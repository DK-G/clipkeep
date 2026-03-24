# Release Flow

## Goal
- Make deploy steps deterministic.
- Catch wrong-target deploys before publish.

## Test Release
1. Run checks:
```powershell
npm run typecheck
npm run lint
npm run check:release:test
```
2. Deploy:
```powershell
npm run deploy:test
```
3. Verify:
- Home page returns `200`
- Key downloader pages return `200`
- Metadata and JSON-LD point to the test domain

## Production Release
1. Confirm target:
```powershell
npm run check:release:prod
```
2. Deploy:
```powershell
npm run deploy:prod
```
3. Verify:
- `https://clipkeep.net` returns `200`
- `/api/v1/health` returns `200`
- canonical / Open Graph / Twitter / JSON-LD use production domain

## Stop Conditions
- `check:release:*` fails
- `wrangler` target name does not match expected Worker
- test deploy output still points metadata to production unexpectedly
- production deploy leaves smoke check failures

## Notes
- `wrangler.toml` should be treated as the production baseline, not a toggle switch.
- Use `wrangler.production.toml` and `wrangler.test.toml` explicitly for releases.

# Deployment Profiles

## Purpose
- Prevent accidental deployment to the wrong Cloudflare Worker.
- Keep `test` and `prod` URL output aligned with the actual target environment.

## Config Files
- `wrangler.production.toml`
  - Worker: `clipkeep-web`
  - `NEXT_PUBLIC_SITE_URL=https://clipkeep.net`
- `wrangler.test.toml`
  - Worker: `clipkeep-web-test`
  - `NEXT_PUBLIC_SITE_URL=https://clipkeep-web-test.liminality-3110.workers.dev`

## Default Rule
- Do not switch deployment target by editing `wrangler.toml` manually.
- Use dedicated scripts instead.

## Commands
- Test deploy:
```powershell
npm run deploy:test
```
- Production deploy:
```powershell
npm run deploy:prod
```

## Validation Commands
- Test gate:
```powershell
npm run check:release:test
```
- Production gate:
```powershell
npm run check:release:prod
```

## Required Environment Behavior
- Metadata, canonical, Open Graph, Twitter card, sitemap, robots, and JSON-LD must use `NEXT_PUBLIC_SITE_URL`.
- New pages must not hardcode `https://clipkeep.net`.

## Current Exceptions
- `src/lib/site-url.ts` keeps `https://clipkeep.net` only as the fallback default.
- This is acceptable as a last fallback, but active environments must provide `NEXT_PUBLIC_SITE_URL`.

## Deprecated Routes
- Instagram routes remain in code only as maintenance placeholders.
- They must stay `noindex` and must not be added back into sitemap.

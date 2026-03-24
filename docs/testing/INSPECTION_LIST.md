# Inspection List

## Core
- [ ] Home renders without broken layout
- [ ] Key downloader pages render without broken layout
- [ ] Result page renders expected state

## Locale
- [ ] `en / ja / ar / es / pt / fr / id / hi / de / tr` で主要ページの翻訳漏れがない
- [ ] RTL page spacing is correct
- [ ] Arabic menu and footer are mirrored correctly

## SEO / Metadata
- [ ] canonical exists
- [ ] hreflang exists
- [ ] Open Graph exists
- [ ] Twitter card exists
- [ ] JSON-LD exists where expected
- [ ] test環境では `NEXT_PUBLIC_SITE_URL` が test domain を返す
- [ ] production環境では `NEXT_PUBLIC_SITE_URL` が production domain を返す

## Release
- [ ] `npm run check:release:test` passed
- [ ] `npm run check:release:prod` passed
- [ ] smoke check passed

# ClipKeep UI Flow (Multilingual + Arabic RTL)

## Scope
- Locale: `en`, `ja`, `ar`, `es`, `pt`, `fr`, `id`, `hi`, `de`, `tr`
- Direction: `ar=rtl`, other locales=`ltr`
- MVP surfaces: Home, Downloader pages, Gallery (Trend/Latest), Result, Solution, Legal/FAQ/About/Contact, Temporary Limited

## Priority Platforms
1. Telegram
2. X
3. TikTok (later)

## Flow
- Home -> Downloader / Gallery / Blog / Solution
- Downloader -> Result
- Result -> related Solution / Gallery / downloader retry
- On `SERVICE_DEGRADED`: Downloader / Result -> Temporary Limited

## Notes
- Locale switching is query-based (`?locale=xx`) rather than locale-prefixed paths.
- Arabic requires separate visual QA for direction, spacing, icon mirroring, and mixed URL/number rendering.
- Test and production verification must be run against the correct Worker profile before UI sign-off.

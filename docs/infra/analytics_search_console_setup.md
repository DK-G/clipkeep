# Analytics & Search Console Setup (ClipKeep)

## A. GA4 Setup
1. Open Google Analytics and create a GA4 property for `clipkeep.com`.
2. Create a Web Data Stream for `https://clipkeep.com`.
3. Copy Measurement ID (`G-XXXXXXXXXX`).
4. Set env variable:
   - `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
5. Restart app (`npm run dev`) and verify network calls to `www.googletagmanager.com`.

## B. Event Verification
Expected events:
- `extract_submit`
- `extract_submit_degraded`
- `result_view`
- `extract_completed`
- `solution_view`

Check in GA4 DebugView after local interaction with app pages.

## C. Search Console Setup
1. Add property for `https://clipkeep.com` in Search Console.
2. Verify ownership (DNS TXT recommended).
3. Submit sitemap:
   - `https://clipkeep.com/sitemap.xml`
4. Monitor indexing and coverage issues.

## D. KPI Dashboard Baseline (suggested)
- Extract submit count (daily/weekly)
- Extract completion rate
- Solution page CTR to extractor
- Country split (top 10)
- Degraded response ratio (429/503)

## E. Completion Criteria
- GA4 property active with at least one verified event in DebugView.
- Search Console property verified and sitemap submitted.
- KPI dashboard section definitions agreed.

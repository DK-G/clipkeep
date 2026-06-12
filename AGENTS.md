# Project Agent Guide

This project is managed from the portfolio workspace at `C:\dev\portfolio`.
Coding sessions should normally start in this project folder. This file is the
local entrypoint for agents working on this project.

## Shared Portfolio Rules

Use these shared files as the source of truth for cross-project behavior:

- Common guide: `C:\dev\portfolio\AGENTS.md`
- Shared routines: `C:\dev\portfolio\docs\skills\`
- Portfolio playbooks: `C:\dev\portfolio\playbooks\`

Keep this file focused on project-specific context. Do not copy the full shared
routine bodies into this project.

## Local Read Order

Read local files in this order:

1. `task.md` for the current work and handoff notes
2. `docs/core/plan.md` for scope, constraints, and non-goals
3. `docs/core/RoadMap.md` for roadmap and epics
4. `docs/INDEX.md` for the documentation map
5. `README.md` for setup and commands

## Routine Invocation

When the user invokes one of these names, read the matching portfolio routine:

- `bynote`: `C:\dev\portfolio\docs\skills\bynote.md`
- `bythink`: `C:\dev\portfolio\docs\skills\bythink.md`
- `bycheck`: `C:\dev\portfolio\docs\skills\bycheck.md`
- `bygit`: `C:\dev\portfolio\docs\skills\bygit.md`
- `bystitch`: `C:\dev\portfolio\docs\skills\bystitch.md`
- `bysearch`: `C:\dev\portfolio\docs\skills\bysearch.md`

If the shared file cannot be read, continue with the same intent using local
primary sources and mention the unavailable shared file in the result.

## Definition of Done (MANDATORY for every improvement loop)

A change is NOT complete at commit time. Every loop iteration must finish all of:

1. Implement + verify locally (`npm run typecheck`, `npm run lint`, `npm run build`).
2. Merge to `main` and push to `origin/main` (or leave an explicit handoff note in
   `AGENT_RESULT.md` if push is blocked, marked `status: blocked-needs-push`).
3. Deploy to production: `npm run deploy:prod`.
4. Run the release gate against production: `npm run check:release:prod`.
5. Verify the changed surface on the LIVE site (https://clipkeep.net), not localhost.
   Example: locale path work requires `https://clipkeep.net/ja/` to return 200 and
   `https://clipkeep.net/sitemap.xml` to reflect the new URL format.
6. Record the deployed version ID and live-verification results in the daily log
   (`docs/ops/daily/YYYY-MM-DD.md`).

If any step cannot be executed, the iteration result must say so explicitly.
"Committed but not deployed" silently is the failure mode that stalled growth in
2026-05/06 — never repeat it.

## Launch-Phase KPI Gate (added 2026-06-12)

Until BOTH of the following are true, treat acquisition as the only growth priority:

- Google-indexed pages (Search Console coverage) >= 50
- Search impressions (GSC, last 28 days) >= 1,000

Task selection is governed by `docs/strategy/growth-strategy.md` (the strategy
charter — north star: Monetag tag loads/day via the GA4 `ad_script_load` event).
Read it before picking any growth task. While below these thresholds:

- North-star metrics are **indexed page count** and **GSC impressions** — not page
  views, not funnel CVR.
- CVR / funnel micro-optimization (form friction, event consistency, download-button
  tuning) is FROZEN. Do not select these as daily tasks.
- Eligible daily tasks: deploy/indexing fixes, sitemap/canonical/hreflang correctness,
  ja/pt/ar solution-page content fill (long-tail keywords), internal linking,
  GSC sitemap submission and coverage triage, analytics auth repair.
- Weekly review (`docs/ops/weekly_review_playbook.md`) must record actual numbers.
  A review with TBD values counts as a failed iteration.

## Project-Specific Notes

- Main stack: Next.js App Router, React 19, TypeScript, OpenNext for Cloudflare, Cloudflare D1, Durable Object rate limiting, Worker Cron.
- Main commands: `npm run dev`, `npm run build`, `npm run typecheck`, `npm run cf:build`, `npm run check:release:test`, `npm run check:release:prod`, `npm run growth:review`.
- Deployment target: Cloudflare Workers. Test deploy uses `wrangler.test.toml`; production deploy uses `wrangler.production.toml`.
- Important constraints: keep multilingual support for `en/ja/ar/es/pt/fr/id/hi/de/tr`; preserve API contracts under `docs/api/`; do not change D1 schema or Cloudflare bindings without updating migrations and release checks; keep legal pages reachable (user trust — AdSense review is no longer pursued per `docs/strategy/growth-strategy.md`, monetization is Monetag only).
- Known risks: OpenNext build/deploy settings are sensitive; rate-limit thresholds affect extraction UX; analytics exports in `docs/analytics/` are review inputs, not automatic product decisions; `.env`, `.env.local`, `.secrets`, `.wrangler`, `.next`, and `.open-next` must remain local artifacts.

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

## Project-Specific Notes

- Main stack: Next.js App Router, React 19, TypeScript, OpenNext for Cloudflare, Cloudflare D1, Durable Object rate limiting, Worker Cron.
- Main commands: `npm run dev`, `npm run build`, `npm run typecheck`, `npm run cf:build`, `npm run check:release:test`, `npm run check:release:prod`, `npm run growth:review`.
- Deployment target: Cloudflare Workers. Test deploy uses `wrangler.test.toml`; production deploy uses `wrangler.production.toml`.
- Important constraints: keep multilingual support for `en/ja/ar/es/pt/fr/id/hi/de/tr`; preserve API contracts under `docs/api/`; do not change D1 schema or Cloudflare bindings without updating migrations and release checks; keep AdSense/legal pages reachable.
- Known risks: OpenNext build/deploy settings are sensitive; rate-limit thresholds affect extraction UX; analytics exports in `docs/analytics/` are review inputs, not automatic product decisions; `.env`, `.env.local`, `.secrets`, `.wrangler`, `.next`, and `.open-next` must remain local artifacts.

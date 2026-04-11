# ClipKeep

ClipKeep is an SNS media extraction hub focused on SEO/AISO discoverability and safe, community-driven metadata.

## Goal
- Provide practical media extraction workflows for major SNS platforms.
- Offer solution pages for troubleshooting and usage guidance.
- Support multilingual delivery for `en/ja/ar/es/pt/fr/id/hi/de/tr`.

## Stack (Current)
- Frontend + API: Next.js App Router (Route Handlers)
- Runtime/Infra: Cloudflare Workers (OpenNext)
- Data: Cloudflare D1
- Rate Limit: Durable Object endpoint
- Scheduled Task: Worker Cron (`0 * * * *`) for auto-trend refresh

## Current Phase
- 立ち上げ段階 / 改善継続中

## Core Docs
- `docs/INDEX.md`: 全ドキュメント索引
- `docs/core/plan.md`: Master specification
- `docs/core/RoadMap.md`: Phase roadmap and epics
- `docs/api/api_contract.md`: API behavior contract (current)
- `docs/ops/feed_behavior.md`: Trend/Recent feed rules
- `task.md`: Executable task backlog (daily)
- `memo.md`: Notes and investigations

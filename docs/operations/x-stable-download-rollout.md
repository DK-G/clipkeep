# X Stable Download Rollout

Last updated: 2026-04-11

## Scope
- Stabilize X/Twitter extraction and download continuity.
- Keep common entry UX unchanged.
- Prioritize incremental hardening over large rewrites.

## Implemented Foundations
- Theme 1: anti-bot fallback continuity in `extractTwitter`.
- Theme 2: strict X URL validation and short-link normalization.
- Theme 3: expiry-aware refresh trigger for X jobs/results.
- Theme 4: upstream dependency checks in release smoke script.

## Phase Plan
1. Phase 1 (now): deploy fallback continuity + URL validation + expiry refresh.
2. Phase 2: tune cooldown window/provider ordering using production metrics.
3. Phase 3: extend upstream checks with known-status synthetic extraction probe set.

## Operational Metrics
- `x_refresh_trigger_rate`
- `x_refresh_success_rate`
- `x_bot_challenged_rate`
- `x_provider_cooldown_hits`
- `x_download_start_rate_mobile`
- `x_upstream_health_pass_rate` (from release check)

## Release Gate
- Hold promotion if:
- `/api/v1/extract/jobs/[jobId]` p95 latency regresses >= 25%.
- `BOT_CHALLENGED` share regresses >= 1.5x baseline for 24h.
- Release check upstream probes fail.

## Rollback Rules
1. If extraction latency/error budget is breached, disable expiry refresh trigger first.
2. If fallback behavior causes instability, revert provider cooldown logic.
3. Keep strict URL validation unless critical false-reject cases are confirmed.

## Verification Checklist
- Valid X status URL -> extraction succeeds and returns proxy variants.
- Invalid/non-X URL -> rejected at prepare route.
- Simulated provider anti-bot -> fallback path still attempts subsequent providers.
- Old X result with stale media -> transitions to processing, then fresh variants.
- `scripts/prod_release_check.ps1` reports PASS for upstream X checks.

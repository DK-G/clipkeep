# Threads Stable Download Rollout

Last updated: 2026-04-11

## Scope
- Stabilize Threads extraction/download behavior with lightweight public-page logic.
- Keep existing common entry UX unchanged.
- Prioritize clear failure classification and safe refresh over heavy extractor expansion.

## Implemented Foundations
- Theme 1: strict Threads URL validation/canonicalization at prepare layer.
- Theme 2: refined failure classification (`RATE_LIMITED`, `AGE_GATED`, `UPSTREAM_FORMAT_CHANGED`).
- Theme 3: expiry-aware refresh trigger for Threads jobs/results.
- Theme 4: Threads checks/probes added to production release check script.

## Phase Plan
1. Phase 1 (now): deploy Theme 1-4 changes.
2. Phase 2: observe failure-mix and refresh behavior in production metrics.
3. Phase 3: tune extractor heuristics only if specific failure clusters persist.

## Operational Metrics
- `threads_invalid_url_reject_rate`
- `threads_refresh_trigger_rate`
- `threads_refresh_success_rate`
- `threads_upstream_format_changed_rate`
- `threads_rate_limited_rate`
- `threads_upstream_health_pass_rate` (from release check)

## Release Gate
- Hold promotion if:
- Threads checks in `scripts/prod_release_check.ps1` fail.
- `/api/v1/extract/jobs/[jobId]` p95 latency regresses >= 25%.
- Threads extraction failure rate regresses >= 1.5x baseline.

## Rollback Rules
1. If latency or error budget is breached, disable Threads refresh trigger first.
2. If failure classification introduces noisy false positives, revert only new code mapping while keeping URL validation.
3. Keep strict URL validation unless verified false negatives require temporary relaxation.

## Verification Checklist
- Valid `threads.com`/`threads.net` post URL: accepted and normalized.
- Unsupported Threads URL (profile/root): rejected in prepare route.
- Stale Threads result: transitions to processing then returns fresh variants.
- Release check: Threads download/latest/trending/API/upstream probes PASS.

# Telegram Stable Download Rollout

Last updated: 2026-04-11

## Scope
- Stabilize Telegram extraction and result-download behavior in current architecture.
- Keep existing UX and avoid heavy refactor (no MTProto service split).

## Implemented Foundations
- Theme 1: media index propagation on result download action.
- Theme 2: Telegram URL validation hardening at prepare layer.
- Theme 3: expiry-aware refresh trigger for Telegram jobs/results.
- Theme 4: Telegram upstream probes in release check script.

## Phase Plan
1. Phase 1 (now): deploy Theme 1-3 behavior changes.
2. Phase 2: observe refresh and media-index conversion metrics.
3. Phase 3: tune parser robustness only where metrics show failure clusters.

## Operational Metrics
- `telegram_media_index_access_rate`
- `telegram_refresh_trigger_rate`
- `telegram_refresh_success_rate`
- `telegram_invalid_url_reject_rate`
- `telegram_upstream_probe_pass_rate`

## Release Gate
- Hold promotion if:
- Telegram probes in `prod_release_check.ps1` fail.
- `/api/v1/extract/jobs/[jobId]` p95 latency regresses >= 25%.
- Telegram extraction failure rate regresses >= 1.5x baseline.

## Rollback Rules
1. If regressions are observed, disable Telegram refresh trigger first.
2. If conversion drops after index propagation, revert index write on guard completion.
3. Keep URL validation strict unless confirmed false negatives require temporary relaxation.

## Verification Checklist
- Public Telegram post with album: selected media download records index.
- Invalid/private-style URL: rejected in prepare route.
- Stale Telegram result: transitions to processing then fresh variants.
- Release check: Telegram embed/proxy probes PASS.

# TikTok Stable Download Rollout

Last updated: 2026-04-11

## Scope
- Stabilize TikTok result-page downloads across mobile/desktop.
- Keep common entry UX unchanged.
- Prefer incremental changes over large refactor.

## Implemented Foundations
- Theme A: `expiresAt`-based stale detection with force refresh trigger.
- Theme B: strict TikTok URL normalization/validation at prepare + extractor boundary.
- Theme C: anti-bot tolerant fallback flow with provider cooldown.
- Theme D: strict proxy URL parsing/allowlist checks.

## Phase Plan
1. Phase 1 (now): freshness regeneration + strict TikTok URL validation.
2. Phase 2: anti-bot fallback tuning (provider order, cooldown window, retry policy).
3. Phase 3: proxy hardening validation tests and regression monitoring.

## Operational Metrics
- `tiktok_refresh_trigger_rate`: stale jobs that trigger refresh.
- `tiktok_refresh_success_rate`: refresh-triggered jobs that complete.
- `tiktok_download_start_rate_mobile`: mobile download starts from result page.
- `tiktok_antibot_rate`: provider responses resulting in 403/429.
- `proxy_domain_reject_rate`: proxy requests rejected by strict validation.

## Release Gate
- Do not proceed to next phase if either condition is true:
- Result page p95 latency regresses by >= 25%.
- 5xx rate on `/api/v1/extract/jobs/[jobId]` or `/api/v1/extract/proxy` regresses by >= 1.5x baseline.

## Rollback Rules
1. If latency or error gate is breached, disable freshness-trigger behavior first.
2. If proxy rejection spikes unexpectedly, temporarily relax to previous allowlist logic via hotfix branch.
3. Keep URL validation strict unless critical false negatives are confirmed.

## Verification Checklist
- Open stale TikTok result URL and confirm `processing` then fresh variants appear.
- Confirm malformed/non-TikTok URL is rejected in prepare API.
- Confirm 403/429 from first provider still allows fallback attempts.
- Confirm proxy rejects private/internal host targets.

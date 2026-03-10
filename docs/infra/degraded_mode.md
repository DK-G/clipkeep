# ClipKeep Degraded Mode Spec (MVP)

## 1. Purpose
Maintain core user guidance under load/failure while protecting infrastructure cost.

## 2. Trigger Conditions (initial thresholds)

### T1: Upstream error rate
- Window: last 5 minutes
- Condition: upstream failure ratio >= 25%
- Metric: `upstream_failed / total_extract_attempts`

### T2: Queue delay
- Window: rolling 3 minutes
- Condition: p95 queue wait >= 8 seconds

### T3: Concurrency pressure
- Condition: active extraction jobs >= 500

### T4: Manual override
- Operator flag: `DEGRADED_FORCE=true`

## 3. Recovery Conditions
- Exit degraded only if all below hold for 10 continuous minutes:
  - error ratio < 10%
  - p95 queue wait < 4 seconds
  - active jobs < 300
  - manual override is off

## 4. Behavior Changes

### API
- Set `meta.degraded = true` in all responses.
- `/extract/prepare` may return `503 SERVICE_DEGRADED` with retry hints.
- `/solution-pages/*` and `/health` remain available.

### UI
- Show degraded banner at top.
- Replace extractor submit CTA with retry guidance when 503 returned.
- Promote links to troubleshooting pages.

### Voting/Facts
- Read operations continue.
- Write-like high-frequency operations may be rate-limited first.

## 5. Response Contract (503)
- `error.code = SERVICE_DEGRADED`
- `error.details.retryAfterSec`
- `error.details.helpPageSlug`

## 6. Logging/Observability
- Emit event: `degraded_mode_entered` / `degraded_mode_exited`
- Track counters:
  - `degraded_requests_total`
  - `degraded_503_total`
  - `degraded_duration_seconds`

## 7. Operational Notes
- Start with conservative thresholds and tune weekly.
- Keep thresholds in env/config, not hard-coded.
- Record each toggle reason in ops log.

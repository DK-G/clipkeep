# Trend / Recent Feed Behavior

## Purpose
- Keep feed behavior deterministic and avoid broken cards in gallery surfaces.

## Common Inclusion Rules
- Include only jobs that satisfy all:
  - `status='completed'`
  - `is_public=1`
  - `thumbnail_url IS NOT NULL`
- Exclude `queued`, `processing`, and `failed` from gallery cards.

## Trending
- Data source: `extractor_jobs` + `job_stats`
- Ranking:
  - `SUM(job_stats.count)` in selected range (`today|week|month`) descending
  - recency tie-break
- Intended meaning:
  - Top performing public downloads in the selected time window.

## Recent
- Data source: `extractor_jobs`
- Ordering:
  - `COALESCE(last_accessed_at, created_at) DESC`
- Range filter:
  - Apply on `COALESCE(last_accessed_at, created_at)`, not only `created_at`.
- Intended meaning:
  - Most recently accessed successful public downloads.

## Job Stability Policy
- Normal access should reuse previously completed job results.
- Failed refresh must not overwrite a previously completed job to failed.
- Failed jobs should not trigger automatic retry loops from polling endpoints.

## Auto-Trend (Current)
- Scheduler: hourly (`0 * * * *`)
- Per-run target:
  - X: 1
  - TikTok: 1
- Goal:
  - Keep top feeds moving without aggressive volume inflation.


# ClipKeep API I/O Contract (Current)

## 1. Scope
- Runtime: Next.js Route Handlers on Cloudflare Workers
- Base path: `/api/v1`
- Primary locale set: `en/ja/ar/es/pt/fr/id/hi/de/tr`
- Supported extract platforms:
  - `tiktok`, `twitter`, `telegram`, `reddit`, `facebook`, `pinterest`, `threads`, `bluesky`, `discord`, `bilibili`, `lemon8`
  - Alias accepted: `x` -> normalized to `twitter`

## 2. Response Rules
- Success envelope: `ok=true`, `data`, `meta`
- Error envelope: `ok=false`, `error`, `meta`
- `meta.requestId` is included

## 3. Extraction Endpoints

### 3.1 POST `/api/v1/extract/prepare`
- Queues extraction after input validation/rate-limit checks.
- Response:
  - `202` accepted (job queued/processing)
  - `4xx/5xx` for validation, rate-limit, or degraded failures

### 3.2 GET `/api/v1/extract/jobs/{jobId}`
- Returns current job state and variants.
- Status model:
  - `queued|processing`: progress response
  - `completed`: download variants included
  - `failed`: warnings included
- Refresh policy:
  - Expiring direct links for supported platforms are refreshed via `forceRefresh`.
  - Failed jobs are not auto-retried on polling.
  - Previously completed jobs are treated as stable cache on normal access.

### 3.3 GET `/api/v1/extract/proxy`
- Proxies downloadable media URLs and supports download intent (`dl=1`).

## 4. Gallery Endpoints

### 4.1 GET `/api/v1/gallery/trending`
- Query: `platform`, `limit`, `offset`, `range=today|week|month`
- Inclusion rules:
  - `status='completed'`
  - `is_public=1`
  - `thumbnail_url IS NOT NULL`
- Ranking:
  - By `SUM(job_stats.count)` in selected range, then recency tie-break.

### 4.2 GET `/api/v1/gallery/recent`
- Query: `platform`, `limit`, `offset`, `range=today|week|month`
- Inclusion rules:
  - `status='completed'`
  - `is_public=1`
  - `thumbnail_url IS NOT NULL`
- Ranking:
  - `ORDER BY COALESCE(last_accessed_at, created_at) DESC`
  - Range filter also uses `COALESCE(last_accessed_at, created_at)`.

### 4.3 POST `/api/v1/gallery/access/{jobId}`
- Records view/download access and updates `job_stats`.
- Also updates `last_accessed_at` for recent feed ordering.

## 5. Admin/Scheduler Endpoint

### 5.1 GET `/api/admin/auto-trend`
- Protected by `secret` query.
- Called by Worker cron (`0 * * * *`) and manually for diagnostics.
- Current target volume:
  - X: up to 1 item/hour
  - TikTok: up to 1 item/hour
- If discovery fails, fallback candidates may be selected from existing completed public jobs.

## 6. Other Endpoints
- `GET /api/v1/solution-pages/{slug}`
- `GET /api/v1/health`

## 7. Core Error Codes (Representative)
- `INVALID_REQUEST` -> 400
- `UNSUPPORTED_PLATFORM` -> 400
- `INVALID_URL` -> 400
- `RATE_LIMITED` -> 429
- `JOB_NOT_FOUND` -> 404
- `SERVICE_DEGRADED` -> 503
- `INTERNAL_ERROR` -> 500


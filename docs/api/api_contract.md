# ClipKeep API I/O Contract (MVP v0.3)

## 1. Scope
- Runtime: Node.js (Next.js Route Handler)
- Locale: `en`, `ar`
- Platforms:
  - MVP: `telegram`, `twitter`
  - Alias accepted: `x` -> internally normalized to `twitter`
  - Later: `tiktok`

## 2. Common Rules
- Base path: `/api/v1`
- Response envelope: `ok`, `data`, `meta`
- Error envelope: `ok=false`, `error`, `meta`
- `x-request-id` supported

## 3. Endpoint Contracts

### 3.1 POST `/api/v1/extract/prepare`
Request:
```json
{ "url": "https://t.me/...", "platform": "telegram", "locale": "en" }
```
Response:
- `202` with `jobId`, `status=queued`, `pollAfterMs`

### 3.2 GET `/api/v1/extract/jobs/{jobId}`
- Returns job status/result:
  - processing/queued: `{ jobId, status, progress }`
  - completed: `{ jobId, status, media, warnings }`

### 3.3 GET `/api/v1/solution-pages/{slug}`
- Returns localized solution page content

### 3.4 GET `/api/v1/health`
- Returns service health and degraded flag

## 4. Error Codes
- `INVALID_REQUEST` -> 400
- `UNSUPPORTED_PLATFORM` -> 400
- `INVALID_URL` -> 400
- `RATE_LIMITED` -> 429
- `JOB_NOT_FOUND` -> 404
- `UPSTREAM_FAILED` -> 502
- `SERVICE_DEGRADED` -> 503
- `INTERNAL_ERROR` -> 500
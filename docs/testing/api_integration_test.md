# API Integration Test (P2-13)

## Prerequisites
- Start ClipKeep app locally (example: `http://localhost:3000`).
- API base path should be `/api/v1`.

## Command
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\api_integration_tests.ps1
```

## Optional
- If degraded mode is forced and you want strict verification of 503:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\api_integration_tests.ps1 -Require503
```

## Covered Cases
- `GET /health` => `200`
- `POST /extract/prepare` => `400` (missing fields)
- `POST /extract/prepare` => `400` (unsupported platform)
- `POST /extract/prepare` => `400` (invalid url)
- `POST /extract/prepare` => `202` or `503` (strict 503 optional)
- `GET /extract/jobs/{jobId}` => `200` (if `jobId` available)
- `GET /extract/jobs/{missing}` => `404`
- `GET /solution-pages/{slug}` => `200`
- `GET /solution-pages/{missing}` => `404`
- `GET /solution-pages/{slug}?locale=invalid` => `400`
- `POST /extract/prepare` burst => `429` (rate limit verification)

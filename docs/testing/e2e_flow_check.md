# E2E Flow Check (P2-14)

## Goal
Validate MVP user flow:
- Home -> Extractor submit -> Result -> Solution
- Degraded fallback: Extractor/Result -> Temporary Limited Solution

## Command
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\e2e_flow_check.ps1
```

## Degraded strict mode
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\e2e_flow_check.ps1 -ExpectDegraded
```

## Covered checks
- `GET /` => 200
- `GET /solution/{slug}` => 200
- `POST /api/v1/extract/prepare` => 202 or 503
- `GET /result/{jobId}` => 200 (if jobId exists)
- `GET /api/v1/extract/jobs/{jobId}` => 200 (if jobId exists)
- Degraded時: `GET /solution/{helpSlug}` => 200

## Notes
- If API/Web is not running locally, script fails with connection error.
- This script validates flow reachability; visual assertions remain manual.

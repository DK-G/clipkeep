param(
  [string]$DatabaseName = "clipkeep-db",
  [switch]$SkipD1,
  [switch]$VerboseLog
)

$ErrorActionPreference = "Stop"

function Run-Step {
  param(
    [string]$Name,
    [scriptblock]$Action
  )

  Write-Host "==> $Name"
  & $Action
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FAIL: $Name"
    exit $LASTEXITCODE
  }
  Write-Host "PASS: $Name"
}

Run-Step -Name "Production smoke check" -Action {
  powershell -ExecutionPolicy Bypass -File .\scripts\prod_release_check.ps1
}

if (-not $SkipD1) {
  Run-Step -Name "D1 migration status check (remote)" -Action {
    $output = & npx wrangler d1 migrations list $DatabaseName --remote 2>&1 | Out-String
    if ($VerboseLog) {
      Write-Host $output
    }

    if ([string]::IsNullOrWhiteSpace($output)) {
      Write-Host "Unable to read migration status output."
      exit 1
    }

    if ($output -match "(?i)\bpending\b|\bnot applied\b|\bunapplied\b") {
      Write-Host "Found unapplied migrations in remote D1."
      Write-Host $output
      exit 1
    }
  }
}

Write-Host "Release gate passed."
exit 0

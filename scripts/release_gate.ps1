param(
  [string]$DatabaseName = "clipkeep-db",
  [string]$ConfigPath = ".\wrangler.production.toml",
  [string]$ExpectedWorkerName = "clipkeep-web",
  [string]$WebBaseUrl = "https://clipkeep.net",
  [string]$ApiBaseUrl = "https://clipkeep.net/api/v1",
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
  try {
    & $Action
    Write-Host "PASS: $Name"
  } catch {
    Write-Host "FAIL: $Name"
    Write-Host $_.Exception.Message
    exit 1
  }
}

Run-Step -Name "Wrangler config target check" -Action {
  if (-not (Test-Path -LiteralPath $ConfigPath)) {
    throw "Missing wrangler config: $ConfigPath"
  }

  $content = Get-Content -LiteralPath $ConfigPath -Raw
  if ($content -notmatch 'name\s*=\s*"([^"]+)"') {
    throw "Unable to read worker name from $ConfigPath"
  }

  $workerName = $Matches[1]
  if ($workerName -ne $ExpectedWorkerName) {
    throw "Worker name mismatch. expected=$ExpectedWorkerName actual=$workerName"
  }
}

Run-Step -Name "Release smoke check" -Action {
  powershell -ExecutionPolicy Bypass -File .\scripts\prod_release_check.ps1 -WebBaseUrl $WebBaseUrl -ApiBaseUrl $ApiBaseUrl
}

if (-not $SkipD1) {
  Run-Step -Name "D1 migration status check (remote)" -Action {
    $output = & npx wrangler d1 migrations list $DatabaseName --remote 2>&1 | Out-String
    if ($VerboseLog) {
      Write-Host $output
    }

    if ([string]::IsNullOrWhiteSpace($output)) {
      throw "Unable to read migration status output."
    }

    if ($output -match "(?i)\bpending\b|\bnot applied\b|\bunapplied\b") {
      throw "Found unapplied migrations in remote D1.`n$output"
    }
  }
}

Write-Host "Release gate passed."
exit 0

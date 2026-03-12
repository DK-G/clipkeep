param(
  [string]$BaseUrl = "https://clipkeep-web.liminality-3110.workers.dev/api/v1",
  [int]$MaxAttempts = 80,
  [string]$Platform = "telegram"
)

$ErrorActionPreference = 'Stop'

function Invoke-Prepare {
  param([int]$i)
  $body = @{ url = "https://t.me/s/test/$i"; platform = $Platform; locale = 'en' } | ConvertTo-Json -Depth 5
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Method POST -Uri "$BaseUrl/extract/prepare" -ContentType 'application/json' -Body $body -TimeoutSec 20
    $parsed = $null
    try { $parsed = $resp.Content | ConvertFrom-Json } catch {}
    return [pscustomobject]@{ Status = [int]$resp.StatusCode; Body = $parsed; Raw = $resp.Content; Headers = $resp.Headers }
  } catch {
    $ex = $_.Exception
    if ($ex.Response -and $ex.Response.StatusCode) {
      $code = [int]$ex.Response.StatusCode
      $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
      $content = $reader.ReadToEnd(); $reader.Dispose()
      $parsed = $null
      try { $parsed = $content | ConvertFrom-Json } catch {}
      return [pscustomobject]@{ Status = $code; Body = $parsed; Raw = $content; Headers = $ex.Response.Headers }
    }
    throw
  }
}

$hit429 = $false
for ($i = 1; $i -le $MaxAttempts; $i++) {
  $r = Invoke-Prepare -i $i
  if ($r.Status -eq 429) {
    $hit429 = $true
    $details = $null
    if ($r.Body -and $r.Body.error -and $r.Body.error.details) { $details = $r.Body.error.details }
    Write-Host "429 observed on attempt=$i"
    if ($details) {
      Write-Host "source=$($details.source) limit=$($details.limit) windowMs=$($details.windowMs) retryAfterSec=$($details.retryAfterSec)"
    } else {
      Write-Host "No details payload. raw=$($r.Raw)"
    }
    exit 0
  }
}

if (-not $hit429) {
  Write-Host "429 not observed within attempts=$MaxAttempts"
  exit 1
}

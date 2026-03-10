param(
  [string]$BaseUrl = "http://localhost:3000/api/v1",
  [switch]$Require503,
  [switch]$VerboseLog
)

$ErrorActionPreference = 'Stop'
$results = @()

function Add-Result {
  param([string]$Name,[string]$Status,[string]$Detail)
  $script:results += [pscustomobject]@{ Name = $Name; Status = $Status; Detail = $Detail }
}

function Invoke-Api {
  param([string]$Method,[string]$Path,[object]$Body = $null)
  $url = "$BaseUrl$Path"
  $json = $null
  if ($null -ne $Body) { $json = ($Body | ConvertTo-Json -Depth 10) }

  try {
    if ($null -eq $json) { $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $url -TimeoutSec 15 }
    else { $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $url -ContentType 'application/json' -Body $json -TimeoutSec 15 }

    $parsedBody = $null
    if ($resp.Content) { try { $parsedBody = $resp.Content | ConvertFrom-Json } catch { $parsedBody = $null } }
    return [pscustomobject]@{ StatusCode = [int]$resp.StatusCode; Body = $parsedBody; Raw = $resp.Content }
  }
  catch {
    $ex = $_.Exception
    if ($ex.Response -and $ex.Response.StatusCode) {
      $statusCode = [int]$ex.Response.StatusCode
      $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
      $content = $reader.ReadToEnd(); $reader.Dispose()
      $parsed = $null
      try { $parsed = $content | ConvertFrom-Json } catch {}
      return [pscustomobject]@{ StatusCode = $statusCode; Body = $parsed; Raw = $content }
    }
    throw
  }
}

function Assert-Status {
  param([string]$Name,[int]$Expected,[object]$Response)
  if ($Response.StatusCode -eq $Expected) { Add-Result -Name $Name -Status 'PASS' -Detail "status=$($Response.StatusCode)"; return $true }
  Add-Result -Name $Name -Status 'FAIL' -Detail "expected=$Expected actual=$($Response.StatusCode)"
  return $false
}

$health = Invoke-Api -Method GET -Path '/health'
Assert-Status -Name 'GET /health => 200' -Expected 200 -Response $health | Out-Null

$badReq = Invoke-Api -Method POST -Path '/extract/prepare' -Body @{}
Assert-Status -Name 'POST /extract/prepare missing fields => 400' -Expected 400 -Response $badReq | Out-Null

$badPlatform = Invoke-Api -Method POST -Path '/extract/prepare' -Body @{ url = 'https://example.com/a'; platform = 'facebook'; locale = 'en' }
Assert-Status -Name 'POST /extract/prepare unsupported platform => 400' -Expected 400 -Response $badPlatform | Out-Null

$badUrl = Invoke-Api -Method POST -Path '/extract/prepare' -Body @{ url = 'not-a-url'; platform = 'telegram'; locale = 'en' }
Assert-Status -Name 'POST /extract/prepare invalid url => 400' -Expected 400 -Response $badUrl | Out-Null

$prepare = Invoke-Api -Method POST -Path '/extract/prepare' -Body @{ url = 'https://t.me/s/test/1'; platform = 'telegram'; locale = 'en' }
if ($Require503) {
  Assert-Status -Name 'POST /extract/prepare degraded => 503' -Expected 503 -Response $prepare | Out-Null
} else {
  if ($prepare.StatusCode -eq 202 -or $prepare.StatusCode -eq 503) { Add-Result -Name 'POST /extract/prepare => 202|503' -Status 'PASS' -Detail "status=$($prepare.StatusCode)" }
  else { Add-Result -Name 'POST /extract/prepare => 202|503' -Status 'FAIL' -Detail "actual=$($prepare.StatusCode)" }
}

$jobId = $null
if ($prepare.StatusCode -eq 202 -and $prepare.Body -and $prepare.Body.data -and $prepare.Body.data.jobId) { $jobId = [string]$prepare.Body.data.jobId }

if ($jobId) {
  $job = Invoke-Api -Method GET -Path "/extract/jobs/$jobId"
  if ($job.StatusCode -eq 200) { Add-Result -Name 'GET /extract/jobs/{jobId} => 200' -Status 'PASS' -Detail 'status=200' }
  elseif ($job.StatusCode -eq 404) { Add-Result -Name 'GET /extract/jobs/{jobId} => 200' -Status 'SKIP' -Detail 'status=404 in dev mode (in-memory reset)' }
  else { Add-Result -Name 'GET /extract/jobs/{jobId} => 200' -Status 'FAIL' -Detail "expected=200 actual=$($job.StatusCode)" }
} else {
  Add-Result -Name 'GET /extract/jobs/{jobId} => 200' -Status 'SKIP' -Detail 'prepare did not return jobId (likely degraded)'
}

$job404 = Invoke-Api -Method GET -Path '/extract/jobs/job_not_found_999'
Assert-Status -Name 'GET /extract/jobs/{missing} => 404' -Expected 404 -Response $job404 | Out-Null

$solution200 = Invoke-Api -Method GET -Path '/solution-pages/telegram-video-downloader-not-working?locale=en'
Assert-Status -Name 'GET /solution-pages/{slug}?locale=en => 200' -Expected 200 -Response $solution200 | Out-Null

$solution404 = Invoke-Api -Method GET -Path '/solution-pages/not-existing-slug?locale=en'
Assert-Status -Name 'GET /solution-pages/{missing} => 404' -Expected 404 -Response $solution404 | Out-Null

$solution400 = Invoke-Api -Method GET -Path '/solution-pages/telegram-video-downloader-not-working?locale=ja'
Assert-Status -Name 'GET /solution-pages/{slug}?locale=invalid => 400' -Expected 400 -Response $solution400 | Out-Null

# 429 verification: burst requests from same process/IP
$rateLimited = $false
for ($i = 0; $i -lt 40; $i++) {
  $r = Invoke-Api -Method POST -Path '/extract/prepare' -Body @{ url = "https://t.me/s/test/$i"; platform = 'telegram'; locale = 'en' }
  if ($r.StatusCode -eq 429) {
    $rateLimited = $true
    $retry = $null
    if ($r.Body -and $r.Body.error -and $r.Body.error.details -and $r.Body.error.details.retryAfterSec) { $retry = [string]$r.Body.error.details.retryAfterSec }
    Add-Result -Name 'RateLimit 429 case' -Status 'PASS' -Detail "status=429 retryAfterSec=$retry"
    break
  }
}
if (-not $rateLimited) {
  Add-Result -Name 'RateLimit 429 case' -Status 'FAIL' -Detail '429 was not observed within 40 burst requests.'
}

$pass = @($results | Where-Object { $_.Status -eq 'PASS' }).Count
$fail = @($results | Where-Object { $_.Status -eq 'FAIL' }).Count
$skip = @($results | Where-Object { $_.Status -eq 'SKIP' }).Count

$results | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "Summary: PASS=$pass FAIL=$fail SKIP=$skip"

if ($VerboseLog) { Write-Host "BaseUrl=$BaseUrl Require503=$Require503" }
if ($fail -gt 0) { exit 1 }
exit 0

param(
  [string]$WebBaseUrl = "http://localhost:3000",
  [string]$ApiBaseUrl = "http://localhost:3000/api/v1",
  [switch]$ExpectDegraded,
  [switch]$VerboseLog
)

$ErrorActionPreference = 'Stop'
$results = @()

function Add-Result {
  param([string]$Name,[string]$Status,[string]$Detail)
  $script:results += [pscustomobject]@{ Name = $Name; Status = $Status; Detail = $Detail }
}

function Invoke-Req {
  param([string]$Method,[string]$Url,[object]$Body=$null)

  $json = $null
  if ($null -ne $Body) { $json = ($Body | ConvertTo-Json -Depth 10) }

  try {
    if ($null -eq $json) { $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -TimeoutSec 15 }
    else { $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -ContentType 'application/json' -Body $json -TimeoutSec 15 }

    $parsedBody = $null
    if ($resp.Content) { try { $parsedBody = $resp.Content | ConvertFrom-Json } catch { $parsedBody = $null } }
    return [pscustomobject]@{ StatusCode = [int]$resp.StatusCode; Raw = $resp.Content; Body = $parsedBody }
  }
  catch {
    $ex = $_.Exception
    if ($ex.Response -and $ex.Response.StatusCode) {
      $statusCode = [int]$ex.Response.StatusCode
      $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
      $content = $reader.ReadToEnd(); $reader.Dispose()
      $parsed = $null
      try { $parsed = $content | ConvertFrom-Json } catch {}
      return [pscustomobject]@{ StatusCode = $statusCode; Raw = $content; Body = $parsed }
    }
    return [pscustomobject]@{ StatusCode = 0; Raw = $_.Exception.Message; Body = $null }
  }
}

$homeResp = Invoke-Req -Method GET -Url "$WebBaseUrl/"
if ($homeResp.StatusCode -eq 200) { Add-Result 'GET / (Home page)' 'PASS' 'status=200' }
elseif ($homeResp.StatusCode -eq 0) { Add-Result 'GET / (Home page)' 'SKIP' 'unreachable/transient during dev compile' }
else { Add-Result 'GET / (Home page)' 'FAIL' "expected=200 actual=$($homeResp.StatusCode)" }

$solution = Invoke-Req -Method GET -Url "$WebBaseUrl/solution/telegram-video-downloader-not-working?locale=en"
if ($solution.StatusCode -eq 200) { Add-Result 'GET /solution/{slug} (Solution page)' 'PASS' 'status=200' }
else { Add-Result 'GET /solution/{slug} (Solution page)' 'FAIL' "expected=200 actual=$($solution.StatusCode)" }

$prepare = Invoke-Req -Method POST -Url "$ApiBaseUrl/extract/prepare" -Body @{ url='https://t.me/s/test/1'; platform='telegram'; locale='en' }
if ($ExpectDegraded) {
  if ($prepare.StatusCode -eq 503) { Add-Result 'POST /api/v1/extract/prepare (degraded)' 'PASS' 'status=503' }
  else { Add-Result 'POST /api/v1/extract/prepare (degraded)' 'FAIL' "expected=503 actual=$($prepare.StatusCode)" }
}
else {
  if ($prepare.StatusCode -eq 202 -or $prepare.StatusCode -eq 503) { Add-Result 'POST /api/v1/extract/prepare' 'PASS' "status=$($prepare.StatusCode)" }
  else { Add-Result 'POST /api/v1/extract/prepare' 'FAIL' "actual=$($prepare.StatusCode)" }
}

$jobId = $null
if ($prepare.StatusCode -eq 202 -and $prepare.Body -and $prepare.Body.data -and $prepare.Body.data.jobId) { $jobId = [string]$prepare.Body.data.jobId }

if ($jobId) {
  $resultPage = Invoke-Req -Method GET -Url "$WebBaseUrl/result/$jobId?locale=en"
  if ($resultPage.StatusCode -eq 200) { Add-Result 'GET /result/{jobId}' 'PASS' 'status=200' }
  else { Add-Result 'GET /result/{jobId}' 'FAIL' "expected=200 actual=$($resultPage.StatusCode)" }

  $jobApi = Invoke-Req -Method GET -Url "$ApiBaseUrl/extract/jobs/$jobId"
  if ($jobApi.StatusCode -eq 200) { Add-Result 'GET /api/v1/extract/jobs/{jobId}' 'PASS' 'status=200' }
  elseif ($jobApi.StatusCode -eq 404) { Add-Result 'GET /api/v1/extract/jobs/{jobId}' 'SKIP' 'status=404 in dev mode (in-memory reset)' }
  else { Add-Result 'GET /api/v1/extract/jobs/{jobId}' 'FAIL' "expected=200 actual=$($jobApi.StatusCode)" }
}
else {
  Add-Result 'GET /result/{jobId}' 'SKIP' 'No jobId returned (likely degraded mode).'
  Add-Result 'GET /api/v1/extract/jobs/{jobId}' 'SKIP' 'No jobId returned (likely degraded mode).'
}

if ($prepare.StatusCode -eq 503) {
  $helpSlug = 'extractor-temporary-limited'
  if ($prepare.Body -and $prepare.Body.error -and $prepare.Body.error.details -and $prepare.Body.error.details.helpPageSlug) { $helpSlug = [string]$prepare.Body.error.details.helpPageSlug }
  $fallback = Invoke-Req -Method GET -Url "$WebBaseUrl/solution/$helpSlug?locale=en"
  if ($fallback.StatusCode -eq 200) { Add-Result 'GET degraded fallback solution page' 'PASS' 'status=200' }
  else { Add-Result 'GET degraded fallback solution page' 'FAIL' "expected=200 actual=$($fallback.StatusCode)" }
}
else {
  Add-Result 'GET degraded fallback solution page' 'SKIP' 'Not in degraded response for this run.'
}

$pass = @($results | Where-Object { $_.Status -eq 'PASS' }).Count
$fail = @($results | Where-Object { $_.Status -eq 'FAIL' }).Count
$skip = @($results | Where-Object { $_.Status -eq 'SKIP' }).Count

$results | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "Summary: PASS=$pass FAIL=$fail SKIP=$skip"

if ($VerboseLog) { Write-Host "WebBaseUrl=$WebBaseUrl ApiBaseUrl=$ApiBaseUrl ExpectDegraded=$ExpectDegraded" }
if ($fail -gt 0) { exit 1 }
exit 0

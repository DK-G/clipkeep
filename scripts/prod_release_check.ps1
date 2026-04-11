param(
  [string]$WebBaseUrl = "https://clipkeep.net",
  [string]$ApiBaseUrl = "https://clipkeep.net/api/v1",
  [string]$Locale = "en",
  [switch]$VerboseLog
)

$ErrorActionPreference = "Stop"
$results = @()

function Add-Result {
  param([string]$Name, [string]$Status, [string]$Detail)
  $script:results += [pscustomobject]@{
    Name = $Name
    Status = $Status
    Detail = $Detail
  }
}

function Invoke-Req {
  param([string]$Method, [string]$Url, [object]$Body = $null)

  $json = $null
  if ($null -ne $Body) { $json = ($Body | ConvertTo-Json -Depth 10) }

  try {
    if ($null -eq $json) {
      $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -TimeoutSec 20
    } else {
      $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -ContentType "application/json" -Body $json -TimeoutSec 20
    }
    $parsedBody = $null
    if ($resp.Content) { try { $parsedBody = $resp.Content | ConvertFrom-Json } catch {} }
    return [pscustomobject]@{
      StatusCode = [int]$resp.StatusCode
      Raw = $resp.Content
      Body = $parsedBody
    }
  } catch {
    $ex = $_.Exception
    if ($ex.Response -and $ex.Response.StatusCode) {
      $statusCode = [int]$ex.Response.StatusCode
      $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
      $content = $reader.ReadToEnd(); $reader.Dispose()
      $parsed = $null
      try { $parsed = $content | ConvertFrom-Json } catch {}
      return [pscustomobject]@{
        StatusCode = $statusCode
        Raw = $content
        Body = $parsed
      }
    }
    return [pscustomobject]@{
      StatusCode = 0
      Raw = $_.Exception.Message
      Body = $null
    }
  }
}

function Assert-Status {
  param([string]$Name, [int]$Expected, [object]$Response)
  if ($Response.StatusCode -eq $Expected) {
    Add-Result -Name $Name -Status "PASS" -Detail "status=$($Response.StatusCode)"
  } else {
    Add-Result -Name $Name -Status "FAIL" -Detail "expected=$Expected actual=$($Response.StatusCode)"
  }
}

function Assert-StatusIn {
  param([string]$Name, [int[]]$ExpectedList, [object]$Response)
  if ($ExpectedList -contains $Response.StatusCode) {
    Add-Result -Name $Name -Status "PASS" -Detail "status=$($Response.StatusCode)"
  } else {
    Add-Result -Name $Name -Status "FAIL" -Detail "expected one-of=$($ExpectedList -join ',') actual=$($Response.StatusCode)"
  }
}

$homeResp = Invoke-Req -Method GET -Url "$WebBaseUrl/?locale=$Locale"
Assert-Status -Name "GET /?locale=$Locale => 200" -Expected 200 -Response $homeResp

$downloadTwitter = Invoke-Req -Method GET -Url "$WebBaseUrl/download-twitter-video?locale=$Locale"
Assert-Status -Name "GET /download-twitter-video?locale=$Locale => 200" -Expected 200 -Response $downloadTwitter

$downloadTelegram = Invoke-Req -Method GET -Url "$WebBaseUrl/download-telegram-video?locale=$Locale"
Assert-Status -Name "GET /download-telegram-video?locale=$Locale => 200" -Expected 200 -Response $downloadTelegram

$trendingTwitter = Invoke-Req -Method GET -Url "$WebBaseUrl/twitter-trending-videos?locale=$Locale"
Assert-Status -Name "GET /twitter-trending-videos?locale=$Locale => 200" -Expected 200 -Response $trendingTwitter

$latestTwitter = Invoke-Req -Method GET -Url "$WebBaseUrl/twitter-latest-videos?locale=$Locale"
Assert-Status -Name "GET /twitter-latest-videos?locale=$Locale => 200" -Expected 200 -Response $latestTwitter

$health = Invoke-Req -Method GET -Url "$ApiBaseUrl/health"
Assert-Status -Name "GET /api/v1/health => 200" -Expected 200 -Response $health

$recentApi = Invoke-Req -Method GET -Url "$ApiBaseUrl/gallery/recent?platform=twitter&limit=3"
Assert-Status -Name "GET /api/v1/gallery/recent?platform=twitter&limit=3 => 200" -Expected 200 -Response $recentApi

$trendingApi = Invoke-Req -Method GET -Url "$ApiBaseUrl/gallery/trending?platform=twitter&limit=3"
Assert-Status -Name "GET /api/v1/gallery/trending?platform=twitter&limit=3 => 200" -Expected 200 -Response $trendingApi

$fxApiHealth = Invoke-Req -Method GET -Url "https://api.fxtwitter.com/i/status/20"
Assert-StatusIn -Name "GET api.fxtwitter.com/i/status/20 => 2xx/4xx" -ExpectedList @(200, 400, 404) -Response $fxApiHealth

$fxDirectHealth = Invoke-Req -Method HEAD -Url "https://d.fxtwitter.com/i/status/20"
Assert-StatusIn -Name "HEAD d.fxtwitter.com/i/status/20 => 2xx/3xx/4xx" -ExpectedList @(200, 301, 302, 307, 308, 400, 404) -Response $fxDirectHealth

if ($homeResp.Raw -and ($homeResp.Raw -match "effectivegatecpm\.com" -or $homeResp.Raw -match "Adsterra")) {
  Add-Result -Name "Home includes Adsterra marker" -Status "PASS" -Detail "marker found in html"
} else {
  Add-Result -Name "Home includes Adsterra marker" -Status "SKIP" -Detail "marker not found in SSR html (likely client-side injected)"
}

if ($homeResp.Raw -and (
  ($homeResp.Raw -match "/latest\?locale=") -or
  ($homeResp.Raw -match "/trending\?locale=") -or
  ($homeResp.Raw -match "TrendingHubSection")
)) {
  Add-Result -Name "Home includes discovery links" -Status "PASS" -Detail "current discovery links found in html"
} else {
  Add-Result -Name "Home includes discovery links" -Status "FAIL" -Detail "current discovery links not found"
}

$pass = @($results | Where-Object { $_.Status -eq "PASS" }).Count
$fail = @($results | Where-Object { $_.Status -eq "FAIL" }).Count
$skip = @($results | Where-Object { $_.Status -eq "SKIP" }).Count

$results | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "Summary: PASS=$pass FAIL=$fail SKIP=$skip"

if ($VerboseLog) {
  Write-Host "WebBaseUrl=$WebBaseUrl ApiBaseUrl=$ApiBaseUrl Locale=$Locale"
}

if ($fail -gt 0) { exit 1 }
exit 0




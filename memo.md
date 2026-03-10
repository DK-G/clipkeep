PS C:\dev\portfolio\web\clipkeep> npm run dev

> clipkeep@0.1.0 dev
> next dev

   ▲ Next.js 15.2.1
   - Local:        http://localhost:3000
   - Network:      http://172.26.9.154:3000

 ✓ Starting...
 ✓ Ready in 2.4s
 ○ Compiling /api/v1/health ...
 ✓ Compiled /api/v1/health in 2.3s (376 modules)
 GET /api/v1/health 200 in 2590ms
 ⚠ Your page app/page.tsx did not have a root layout. We created app\layout.tsx for you.
 ○ Compiling / ...
 ✓ Compiled / in 1078ms (684 modules)
 GET / 200 in 1226ms
 PS C:\dev\portfolio\web\clipkeep> powershell -ExecutionPolicy Bypass -File .\scripts\api_integration_tests.ps1
if : The term 'if' is not recognized as the name of a cmdlet, function, script file,
 or operable program. Check the spelling of the name, or if a path was included, ver
ify that the path is correct and try again.
At C:\dev\portfolio\web\clipkeep\scripts\api_integration_tests.ps1:40 char:15
+       Body = (if ($resp.Content) { $resp.Content | ConvertFrom-Json } ...
+               ~~
    + CategoryInfo          : ObjectNotFound: (if:String) [], ParentContainsErrorRe
   cordException
    + FullyQualifiedErrorId : CommandNotFoundException

PS C:\dev\portfolio\web\clipkeep> powershell -ExecutionPolicy Bypass -File .\scripts\e2e_flow_check.ps1
if : The term 'if' is not recognized as the name of a cmdlet, function, script file,
 or operable program. Check the spelling of the name, or if a path was included, ver
ify that the path is correct and try again.
At C:\dev\portfolio\web\clipkeep\scripts\e2e_flow_check.ps1:27 char:96
+ ... Code = [int]$resp.StatusCode; Raw = $resp.Content; Body = (if ($resp. ...
+                                                                ~~
    + CategoryInfo          : ObjectNotFound: (if:String) [], ParentContainsErrorRe
   cordException
    + FullyQualifiedErrorId : CommandNotFoundException
# Script de Diagnostic Railway Avancé
# Aide à identifier pourquoi le health check échoue

param(
    [string]$RailwayUrl = "",
    [switch]$Detailed
)

function Test-RailwayHealth {
    param([string]$Url, [string]$Path, [string]$Name, [int]$Timeout = 30)
    
    Write-Host "`n🧪 Testing $Name..." -ForegroundColor Cyan
    Write-Host "URL: $Url$Path" -ForegroundColor Gray
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        # Test avec différentes méthodes
        $webRequest = [System.Net.WebRequest]::Create("$Url$Path")
        $webRequest.Timeout = $Timeout * 1000
        $webRequest.Method = "GET"
        
        $response = $webRequest.GetResponse()
        $stopwatch.Stop()
        
        $statusCode = [int]$response.StatusCode
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        Write-Host "✅ SUCCESS: $Name" -ForegroundColor Green
        Write-Host "   Status: $statusCode" -ForegroundColor Gray
        Write-Host "   Response Time: ${responseTime}ms" -ForegroundColor Gray
        Write-Host "   Content Type: $($response.ContentType)" -ForegroundColor Gray
        
        $response.Close()
        return $true
        
    } catch [System.Net.WebException] {
        $stopwatch.Stop()
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        Write-Host "❌ FAILED: $Name" -ForegroundColor Red
        Write-Host "   Time: ${responseTime}ms" -ForegroundColor Gray
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        }
        
        return $false
        
    } catch {
        Write-Host "❌ ERROR: $Name" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Configuration
Write-Host "🔍 RAILWAY HEALTH CHECK DIAGNOSTICS" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Blue

if ([string]::IsNullOrEmpty($RailwayUrl)) {
    Write-Host "⚠️  Railway URL required!" -ForegroundColor Yellow
    Write-Host "Usage: .\diagnose-railway.ps1 -RailwayUrl 'https://your-app.railway.app'" -ForegroundColor Gray
    
    Write-Host "`n📋 To find your Railway URL:" -ForegroundColor Cyan
    Write-Host "1. Go to Railway Dashboard" -ForegroundColor White
    Write-Host "2. Select your project" -ForegroundColor White
    Write-Host "3. Click on your service" -ForegroundColor White
    Write-Host "4. Look for 'Domains' section" -ForegroundColor White
    Write-Host "5. Copy the .railway.app URL" -ForegroundColor White
    exit 1
}

Write-Host "Target: $RailwayUrl" -ForegroundColor Gray
Write-Host "Timeout: 30 seconds per test" -ForegroundColor Gray

# Tests séquentiels
$tests = @(
    @{ Path = "/ping"; Name = "Ping Endpoint (Railway Health Check)" },
    @{ Path = "/health"; Name = "Basic Health Endpoint" },
    @{ Path = "/health/detailed"; Name = "Detailed Health Endpoint" },
    @{ Path = "/api/courses"; Name = "API Endpoint Test" }
)

$results = @{}
foreach ($test in $tests) {
    $results[$test.Name] = Test-RailwayHealth -Url $RailwayUrl -Path $test.Path -Name $test.Name
    Start-Sleep -Seconds 2
}

# Tests spécifiques Railway
Write-Host "`n🚂 RAILWAY-SPECIFIC TESTS" -ForegroundColor Yellow
Write-Host ("=" * 40) -ForegroundColor Yellow

# Test timeout Railway (60s)
Write-Host "`n⏱️  Testing Railway Health Check Timeout (60s)..." -ForegroundColor Cyan
$railwayHealthOk = Test-RailwayHealth -Url $RailwayUrl -Path "/ping" -Name "Railway Health Check (60s timeout)" -Timeout 60

# Test avec curl-like request
Write-Host "`n🌐 Testing HTTP Headers..." -ForegroundColor Cyan
try {
    $headers = Invoke-WebRequest -Uri "$RailwayUrl/ping" -Method HEAD -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Headers OK" -ForegroundColor Green
    Write-Host "   Server: $($headers.Headers['Server'])" -ForegroundColor Gray
    Write-Host "   Content-Type: $($headers.Headers['Content-Type'])" -ForegroundColor Gray
} catch {
    Write-Host "❌ Headers test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Résumé final
Write-Host "`n" + ("=" * 60) -ForegroundColor Blue
Write-Host "📊 DIAGNOSTIC RESULTS" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Blue

$totalTests = $results.Count
$passedTests = ($results.Values | Where-Object { $_ -eq $true }).Count

foreach ($result in $results.GetEnumerator()) {
    $status = if ($result.Value) { "PASS" } else { "FAIL" }
    $color = if ($result.Value) { "Green" } else { "Red" }
    Write-Host "$($result.Key): $status" -ForegroundColor $color
}

Write-Host "`nOverall: $passedTests/$totalTests tests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

# Recommandations
Write-Host "`n🔧 TROUBLESHOOTING RECOMMENDATIONS:" -ForegroundColor Cyan

if (-not $results["Ping Endpoint (Railway Health Check)"]) {
    Write-Host "❌ PRIMARY ISSUE: /ping endpoint not responding" -ForegroundColor Red
    Write-Host "   Possible causes:" -ForegroundColor Yellow
    Write-Host "   • Server not starting properly" -ForegroundColor White
    Write-Host "   • Port configuration issue" -ForegroundColor White
    Write-Host "   • Database connection blocking startup" -ForegroundColor White
    Write-Host "   • Build failed" -ForegroundColor White
    
    Write-Host "`n🔍 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check Railway deploy logs" -ForegroundColor White
    Write-Host "   2. Verify environment variables" -ForegroundColor White
    Write-Host "   3. Try simplified railway.json config" -ForegroundColor White
    Write-Host "   4. Check if DATABASE_URL is causing issues" -ForegroundColor White
    
} elseif ($passedTests -eq $totalTests) {
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "   Your Railway deployment appears to be working correctly." -ForegroundColor Green
    Write-Host "   If Railway still shows health check failures, check:" -ForegroundColor Yellow
    Write-Host "   • Railway dashboard configuration" -ForegroundColor White
    Write-Host "   • Health check path setting (/ping)" -ForegroundColor White
    Write-Host "   • Timeout configuration (should be 60-120s)" -ForegroundColor White
    
} else {
    Write-Host "⚠️  PARTIAL SUCCESS" -ForegroundColor Yellow
    Write-Host "   Basic health check works but some features may be broken." -ForegroundColor Yellow
    Write-Host "   Check Railway logs for specific error details." -ForegroundColor Yellow
}

Write-Host "`n📋 Quick Railway Config Check:" -ForegroundColor Cyan
Write-Host "   • Health Check Path: /ping" -ForegroundColor White
Write-Host "   • Timeout: 60-120 seconds" -ForegroundColor White
Write-Host "   • Restart Policy: ON_FAILURE" -ForegroundColor White
Write-Host "   • Environment: NODE_ENV=production" -ForegroundColor White

exit $(if ($results["Ping Endpoint (Railway Health Check)"]) { 0 } else { 1 })
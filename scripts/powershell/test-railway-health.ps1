# Railway Deployment Health Check Script
# Teste les endpoints de santé et vérifie la configuration

param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$Production
)

if ($Production) {
    # URL de production Railway (à remplacer par votre URL)
    $BaseUrl = "https://your-app.railway.app"
    Write-Host "Testing PRODUCTION deployment: $BaseUrl" -ForegroundColor Yellow
} else {
    Write-Host "Testing LOCAL deployment: $BaseUrl" -ForegroundColor Cyan
}

function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Name
    )
    
    try {
        Write-Host "`nTesting $Name..." -ForegroundColor Cyan
        Write-Host "URL: $Url" -ForegroundColor Gray
        
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 30
        
        Write-Host "✅ SUCCESS: $Name" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
        return $true
        
    } catch {
        Write-Host "❌ FAILED: $Name" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Tests des endpoints
Write-Host "`n" + ("=" * 60) -ForegroundColor Blue
Write-Host "           RAILWAY HEALTH CHECK TESTS" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Blue

$pingSuccess = Test-Endpoint "$BaseUrl/ping" "Simple Ping Endpoint"
$healthSuccess = Test-Endpoint "$BaseUrl/health" "Detailed Health Endpoint"

# Test d'un endpoint API
$apiSuccess = Test-Endpoint "$BaseUrl/api/courses" "Courses API Endpoint"

# Résumé
Write-Host "`n" + ("=" * 60) -ForegroundColor Blue
Write-Host "                    RESULTS" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Blue

$totalTests = 3
$passedTests = 0
if ($pingSuccess) { $passedTests++ }
if ($healthSuccess) { $passedTests++ }  
if ($apiSuccess) { $passedTests++ }

Write-Host "`nPing Endpoint: $(if($pingSuccess) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if($pingSuccess) { 'Green' } else { 'Red' })
Write-Host "Health Endpoint: $(if($healthSuccess) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if($healthSuccess) { 'Green' } else { 'Red' })
Write-Host "API Endpoint: $(if($apiSuccess) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if($apiSuccess) { 'Green' } else { 'Red' })

Write-Host "`nTotal: $passedTests/$totalTests tests passed" -ForegroundColor $(if($passedTests -eq $totalTests) { 'Green' } else { 'Yellow' })

if ($passedTests -eq $totalTests) {
    Write-Host "`n🎉 ALL TESTS PASSED! Railway deployment should work." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check your configuration." -ForegroundColor Yellow
}

# Recommandations
Write-Host "`n📋 Railway Configuration Checklist:" -ForegroundColor Cyan
Write-Host "1. ✅ Use /ping endpoint for healthcheck (simple, no DB dependency)" -ForegroundColor Green
Write-Host "2. ✅ Set PORT environment variable (Railway provides this)" -ForegroundColor Green
Write-Host "3. ✅ Configure DATABASE_URL (Railway PostgreSQL)" -ForegroundColor Green
Write-Host "4. ✅ Set NODE_ENV=production" -ForegroundColor Green
Write-Host "5. ✅ Configure CORS_ORIGIN for your frontend" -ForegroundColor Green

exit $(if($passedTests -eq $totalTests) { 0 } else { 1 })
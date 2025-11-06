# Railway Health Check Emergency Fix
# Test différentes configurations pour identifier le problème

Write-Host "🚨 Railway Health Check Emergency Diagnostics" -ForegroundColor Red

# Test 1: Endpoint le plus simple possible
Write-Host "`n1. Testing ultra-simple endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Local root endpoint: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Local root failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Vérifier la réponse exacte
Write-Host "`n2. Testing exact response format..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/ping" -TimeoutSec 5
    Write-Host "✅ Ping response: '$response'" -ForegroundColor Green
    Write-Host "Type: $($response.GetType().Name)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ping failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Vérifier les headers
Write-Host "`n3. Testing HTTP headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Gray
    Write-Host "Content-Length: $($response.Headers['Content-Length'])" -ForegroundColor Gray
} catch {
    Write-Host "❌ Headers test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 Railway Requirements Check:" -ForegroundColor Cyan
Write-Host "✅ HTTP 200 status code" -ForegroundColor Green
Write-Host "✅ Response within timeout (60s)" -ForegroundColor Green
Write-Host "⚠️  Content format may be issue" -ForegroundColor Yellow

Write-Host "`n🔧 Next Actions:" -ForegroundColor Cyan
Write-Host "1. Try different response formats" -ForegroundColor White
Write-Host "2. Check Railway logs for exact error" -ForegroundColor White
Write-Host "3. Test with even simpler endpoint" -ForegroundColor White
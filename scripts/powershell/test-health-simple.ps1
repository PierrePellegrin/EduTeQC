# Railway Health Test - Simple Version
param([string]$BaseUrl = "http://localhost:3000")

Write-Host "Testing Railway Health Endpoints" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray

# Test /ping
try {
    $pingResponse = Invoke-RestMethod -Uri "$BaseUrl/ping" -Method GET -TimeoutSec 10
    Write-Host "PING: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($pingResponse | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "PING: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test /health  
try {
    $healthResponse = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 10
    Write-Host "HEALTH: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($healthResponse | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "HEALTH: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nConfiguration for Railway:" -ForegroundColor Yellow
Write-Host "- Use /ping for healthcheck (faster, no DB dependency)" -ForegroundColor White
Write-Host "- Timeout: 120 seconds" -ForegroundColor White
Write-Host "- Restart policy: ON_FAILURE" -ForegroundColor White
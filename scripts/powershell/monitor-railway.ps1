# Script de Surveillance du Déploiement Railway
# Vérifie le statut du déploiement et teste les endpoints

param(
    [string]$RailwayUrl = "",
    [switch]$WaitForDeploy,
    [int]$TimeoutMinutes = 10
)

Write-Host "🚂 Railway Deployment Monitor" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Blue

if ([string]::IsNullOrEmpty($RailwayUrl)) {
    Write-Host "⚠️  Railway URL not provided. Please check your Railway dashboard for the URL." -ForegroundColor Yellow
    Write-Host "Usage: .\scripts\powershell\monitor-railway.ps1 -RailwayUrl 'https://your-app.railway.app'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📋 What to check in Railway Dashboard:" -ForegroundColor Cyan
    Write-Host "1. Go to your Railway project" -ForegroundColor White
    Write-Host "2. Check 'Deployments' tab for build status" -ForegroundColor White
    Write-Host "3. Look for your latest commit in the build list" -ForegroundColor White
    Write-Host "4. Check 'Variables' tab for health check configuration" -ForegroundColor White
    Write-Host "5. Check 'Settings' → 'Deploy' for health check path" -ForegroundColor White
    exit 1
}

Write-Host "Target URL: $RailwayUrl" -ForegroundColor Gray
Write-Host "Timeout: $TimeoutMinutes minutes" -ForegroundColor Gray

if ($WaitForDeploy) {
    Write-Host "`nWaiting for deployment to complete..." -ForegroundColor Yellow
    $startTime = Get-Date
    $maxTime = $startTime.AddMinutes($TimeoutMinutes)
    
    do {
        Write-Host "Checking deployment status..." -ForegroundColor Gray
        
        try {
            $response = Invoke-WebRequest -Uri "$RailwayUrl/ping" -Method GET -TimeoutSec 10 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Deployment is LIVE!" -ForegroundColor Green
                break
            }
        } catch {
            Write-Host "⏳ Still deploying... ($(($maxTime - (Get-Date)).TotalMinutes.ToString('F1')) min remaining)" -ForegroundColor Yellow
        }
        
        Start-Sleep -Seconds 30
        
    } while ((Get-Date) -lt $maxTime)
    
    if ((Get-Date) -ge $maxTime) {
        Write-Host "❌ Deployment timeout reached!" -ForegroundColor Red
        exit 1
    }
}

# Test des endpoints
Write-Host "`n🧪 Testing Railway Endpoints..." -ForegroundColor Cyan

function Test-RailwayEndpoint {
    param([string]$Endpoint, [string]$Name)
    
    try {
        Write-Host "`nTesting $Name..." -ForegroundColor White
        $response = Invoke-RestMethod -Uri "$RailwayUrl$Endpoint" -Method GET -TimeoutSec 15
        Write-Host "✅ $Name: SUCCESS" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "❌ $Name: FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

$pingOk = Test-RailwayEndpoint "/ping" "Health Check (Ping)"
$healthOk = Test-RailwayEndpoint "/health" "Detailed Health"
$apiOk = Test-RailwayEndpoint "/api/courses" "Courses API"

# Résumé
Write-Host "`n" + ("=" * 50) -ForegroundColor Blue
Write-Host "📊 DEPLOYMENT RESULTS" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Blue

$total = 3
$passed = 0
if ($pingOk) { $passed++ }
if ($healthOk) { $passed++ }
if ($apiOk) { $passed++ }

Write-Host "`nHealth Check: $(if($pingOk) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if($pingOk) { 'Green' } else { 'Red' })
Write-Host "Detailed Health: $(if($healthOk) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if($healthOk) { 'Green' } else { 'Red' })
Write-Host "API Endpoints: $(if($apiOk) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if($apiOk) { 'Green' } else { 'Red' })

Write-Host "`nOverall: $passed/$total endpoints working" -ForegroundColor $(if($passed -eq $total) { 'Green' } else { 'Yellow' })

if ($passed -eq $total) {
    Write-Host "`n🎉 RAILWAY DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Your backend is live and fully functional." -ForegroundColor Green
} elseif ($pingOk) {
    Write-Host "`n⚠️  Basic deployment successful, but some features may not work." -ForegroundColor Yellow
    Write-Host "Check Railway logs for API/database issues." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ DEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "Check Railway logs and configuration." -ForegroundColor Red
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check Railway dashboard for deploy logs" -ForegroundColor White
Write-Host "2. Verify environment variables are set" -ForegroundColor White
Write-Host "3. Test with your frontend application" -ForegroundColor White
Write-Host "4. Monitor application logs for any issues" -ForegroundColor White

exit $(if($passed -ge 1) { 0 } else { 1 })
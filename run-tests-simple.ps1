# Script de Tests de Non-Régression - EduTeQC

Write-Host "🔒 Tests de Non-Régression EduTeQC" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

$totalTests = 0
$passedTests = 0
$failedTests = 0

function Test-Section {
    param($Name, $Command, $WorkingDirectory)
    
    Write-Host "`n🧪 Testing: $Name" -ForegroundColor Cyan
    $global:totalTests++
    
    try {
        Push-Location $WorkingDirectory
        $result = Invoke-Expression $Command
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PASS: $Name" -ForegroundColor Green
            $global:passedTests++
        } else {
            Write-Host "❌ FAIL: $Name" -ForegroundColor Red
            $global:failedTests++
        }
    } catch {
        Write-Host "❌ FAIL: $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $global:failedTests++
    } finally {
        Pop-Location
    }
}

# Tests Backend
Write-Host "`n🔧 TESTS BACKEND" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow

Test-Section "Backend API Regression Tests" "npm run test:regression" "backend"

# Tests Frontend
Write-Host "`n📱 TESTS FRONTEND" -ForegroundColor Yellow  
Write-Host "------------------------------" -ForegroundColor Yellow

Test-Section "React Components Regression Tests" "npm test -- --testPathPatterns=regression --passWithNoTests" "mobile"

# Tests End-to-End
Write-Host "`n🔄 TESTS END-TO-END" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow

# Vérifier que le serveur backend est démarré
$backendRunning = $false
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
    if ($response.status -eq "OK") {
        $backendRunning = $true
    }
} catch {
    Write-Host "⚠️  Backend server not running - E2E tests may fail" -ForegroundColor Yellow
}

Test-Section "End-to-End API Tests" "node e2e-tests.js" "tests"

# Résultats finaux
Write-Host "`n" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue
Write-Host "📊 RÉSULTATS FINAUX" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

Write-Host "✅ Tests réussis: $passedTests" -ForegroundColor Green
Write-Host "❌ Tests échoués: $failedTests" -ForegroundColor Red

if ($totalTests -gt 0) {
    $successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
    Write-Host "📈 Taux de réussite: $successRate%" -ForegroundColor Yellow
}

if ($failedTests -eq 0) {
    Write-Host "`n🎉 TOUS LES TESTS DE NON-RÉGRESSION ONT RÉUSSI !" -ForegroundColor Green
    Write-Host "✨ Votre code est prêt pour la production." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n💥 CERTAINS TESTS ONT ÉCHOUÉ !" -ForegroundColor Red
    Write-Host "🔍 Vérifiez les logs ci-dessus pour plus de détails." -ForegroundColor Red
    exit 1
}
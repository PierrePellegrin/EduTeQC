# 🔒 Script de Tests de Non-Régression - EduTeQC
# Ce script lance tous les tests de non-régression localement

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$E2EOnly,
    [switch]$All = $true
)

Write-Host "🔒 Tests de Non-Régression EduTeQC" -ForegroundColor Blue
Write-Host ("=" * 50) -ForegroundColor Blue

$rootPath = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent
$backendPath = Join-Path $rootPath "backend"
$mobilePath = Join-Path $rootPath "mobile"
$testsPath = Join-Path $rootPath "tools"

$totalTests = 0
$passedTests = 0
$failedTests = 0

function Test-Command {
    param($Name, $Command, $WorkingDirectory = $rootPath)
    
    Write-Host "🧪 Testing: $Name" -ForegroundColor Cyan
    
    try {
        $process = Start-Process -FilePath "powershell" -ArgumentList "-Command", $Command -WorkingDirectory $WorkingDirectory -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ PASS: $Name" -ForegroundColor Green
            $script:passedTests++
        } else {
            Write-Host "❌ FAIL: $Name (Exit Code: $($process.ExitCode))" -ForegroundColor Red
            $script:failedTests++
        }
    } catch {
        Write-Host "❌ FAIL: $Name (Exception: $($_.Exception.Message))" -ForegroundColor Red
        $script:failedTests++
    }
    
    $script:totalTests++
}

# Tests Backend
if ($BackendOnly -or $All) {
    Write-Host "`n🔧 TESTS BACKEND" -ForegroundColor Yellow
    Write-Host ("-" * 30) -ForegroundColor Yellow
    
    # Tests de régression API
    Test-Command "Backend API Regression Tests" "npm run test:regression" $backendPath
}

# Tests Frontend
if ($FrontendOnly -or $All) {
    Write-Host "`n📱 TESTS FRONTEND" -ForegroundColor Yellow
    Write-Host ("-" * 30) -ForegroundColor Yellow
    
    # Tests de composants React
    Test-Command "React Components Regression Tests" "npm test -- --testPathPatterns=regression --passWithNoTests" $mobilePath
}

# Tests End-to-End
if ($E2EOnly -or $All) {
    Write-Host "`n🔄 TESTS END-TO-END" -ForegroundColor Yellow
    Write-Host ("-" * 30) -ForegroundColor Yellow
    
    # Vérifier que le serveur backend est démarré
    $backendRunning = $false
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get -TimeoutSec 5
        if ($response.status -eq "OK") {
            $backendRunning = $true
        }
    } catch {
        Write-Host "⚠️  Backend server not running. Starting it..." -ForegroundColor Yellow
    }
    
    if (!$backendRunning) {
        Write-Host "🚀 Starting backend server..." -ForegroundColor Cyan
        Start-Process -FilePath "powershell" -ArgumentList "-Command", "npm run dev" -WorkingDirectory $backendPath
        Start-Sleep -Seconds 10
    }
    
    # Tests E2E
    Test-Command "End-to-End API Tests" "node e2e-tests.js" $testsPath
}

# Résultats finaux
Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Blue
Write-Host "📊 RÉSULTATS FINAUX" -ForegroundColor Blue
Write-Host ("=" * 50) -ForegroundColor Blue

Write-Host "✅ Tests réussis: $passedTests" -ForegroundColor Green
Write-Host "❌ Tests échoués: $failedTests" -ForegroundColor Red

if ($totalTests -gt 0) {
    $successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
    Write-Host "📈 Taux de réussite: $successRate%" -ForegroundColor Yellow
}

if ($failedTests -eq 0) {
    Write-Host "`n🎉 TOUS LES TESTS DE NON-RÉGRESSION ONT RÉUSSI !" -ForegroundColor Green
    Write-Host "✨ Votre code est prêt pour la production." -ForegroundColor Green
} else {
    Write-Host "`n💥 CERTAINS TESTS ONT ÉCHOUÉ !" -ForegroundColor Red
    Write-Host "🔍 Vérifiez les logs ci-dessus pour plus de détails." -ForegroundColor Red
    Write-Host "🛠️ Corrigez les problèmes avant de continuer." -ForegroundColor Red
}

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Blue

# Exit avec le code approprié
if ($failedTests -gt 0) {
    exit 1
} else {
    exit 0
}
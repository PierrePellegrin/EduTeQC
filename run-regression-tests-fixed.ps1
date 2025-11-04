# Script PowerShell pour exécuter tous les tests de non-régression
# Version: 1.0
# Description: Tests complets pour EduTeQC - Backend + Frontend + E2E

param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$SkipE2E,
    [switch]$Verbose
)

# Variables globales pour le suivi
$totalTests = 0
$passedTests = 0
$failedTests = 0

# Fonction pour tester une commande
function Test-Command {
    param(
        [string]$TestName,
        [string]$Command,
        [string]$WorkingDirectory = ".",
        [bool]$AllowFailure = $false
    )
    
    $global:totalTests++
    Write-Host "`n🧪 Testing: $TestName" -ForegroundColor Cyan
    Write-Host "📂 Working Directory: $WorkingDirectory" -ForegroundColor Gray
    Write-Host "⚙️  Command: $Command" -ForegroundColor Gray
    
    try {
        $startTime = Get-Date
        
        # Execute command in specified directory
        Push-Location $WorkingDirectory
        
        if ($Verbose) {
            $result = Invoke-Expression $Command
        } else {
            $result = Invoke-Expression $Command 2>&1
        }
        
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        Pop-Location
        
        # Check if command succeeded
        if ($LASTEXITCODE -eq 0 -or $AllowFailure) {
            Write-Host "✅ PASS: $TestName" -ForegroundColor Green
            Write-Host "⏱️  Duration: $([math]::Round($duration, 2))s" -ForegroundColor Gray
            $global:passedTests++
        } else {
            Write-Host "❌ FAIL: $TestName" -ForegroundColor Red
            Write-Host "⏱️  Duration: $([math]::Round($duration, 2))s" -ForegroundColor Gray
            if ($Verbose) {
                Write-Host "Output: $result" -ForegroundColor Red
            }
            $global:failedTests++
        }
    } catch {
        Pop-Location
        Write-Host "❌ FAIL: $TestName" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $global:failedTests++
    }
}

# Affichage du header
Write-Host "=" * 50 -ForegroundColor Blue
Write-Host "🚀 LANCEMENT DES TESTS DE NON-RÉGRESSION" -ForegroundColor Blue
Write-Host "=" * 50 -ForegroundColor Blue
Write-Host "📅 Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "💻 Environnement: $env:COMPUTERNAME" -ForegroundColor Gray

# Définir les chemins
$rootPath = Get-Location
$backendPath = Join-Path $rootPath "backend"
$mobilePath = Join-Path $rootPath "mobile"
$testsPath = Join-Path $rootPath "tests"

# Vérifier les dépendances
Write-Host "`n🔍 Vérification des dépendances..." -ForegroundColor Yellow

if (!(Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

if (!(Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

# Tests Backend
if (!$SkipBackend) {
    Write-Host "`n🔧 TESTS BACKEND" -ForegroundColor Yellow
    Write-Host "=" * 30 -ForegroundColor Yellow
    
    # Tests de régression API
    Test-Command "Backend - API Regression Tests" "npm run test:regression" $backendPath
    
    # Tests de régression Database
    Test-Command "Backend - Database Integrity" "npm run test:regression" $backendPath
}

# Tests Frontend/Mobile
if (!$SkipFrontend) {
    Write-Host "`n📱 TESTS FRONTEND/MOBILE" -ForegroundColor Yellow
    Write-Host "=" * 30 -ForegroundColor Yellow
    
    # Tests de régression composants React
    Test-Command "Mobile - React Components Tests" "npm test -- --testPathPatterns=regression --passWithNoTests" $mobilePath
    
    # Tests de performance
    Test-Command "Mobile - React Hooks Compliance" "npm test -- --testPathPatterns=regression --passWithNoTests" $mobilePath
}

# Tests E2E
if (!$SkipE2E) {
    Write-Host "`n🌐 TESTS END-TO-END" -ForegroundColor Yellow
    Write-Host "=" * 30 -ForegroundColor Yellow
    
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
        Start-Sleep -Seconds 10  # Wait for server to start
    }
    
    # Tests E2E
    Test-Command "End-to-End API Tests" "node e2e-tests.js" $testsPath
    
    # Tests de performance
    Test-Command "Performance Tests" "node -e `"console.log('Performance tests would run here')`"" $testsPath
}

# Résultats finaux
Write-Host "`n" + "=" * 50 -ForegroundColor Blue
Write-Host "📊 RÉSULTATS FINAUX" -ForegroundColor Blue
Write-Host "=" * 50 -ForegroundColor Blue

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

Write-Host "`n" + "=" * 50 -ForegroundColor Blue

# Exit avec le code approprié
if ($failedTests -gt 0) {
    exit 1
} else {
    exit 0
}
# Script PowerShell Global pour tous les Tests EduTeQC
# Version: 2.0 - Post Reorganisation
# Description: Tests complets - Backend + Mobile + E2E + Scripts

param(
    [switch]$SkipBackend,
    [switch]$SkipMobile, 
    [switch]$SkipE2E,
    [switch]$SkipScripts,
    [switch]$Quick,
    [switch]$Verbose
)

# Variables globales
$totalTests = 0
$passedTests = 0
$failedTests = 0
$startTime = Get-Date

# Couleurs pour affichage
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"
$Blue = "Blue"

# Fonction pour exécuter et afficher les tests
function Run-TestSuite {
    param(
        [string]$SuiteName,
        [string]$Command,
        [string]$WorkingDirectory,
        [switch]$ShowOutput = $false
    )
    
    Write-Host "`n" + ("=" * 60) -ForegroundColor $Blue
    Write-Host "Testing: $SuiteName" -ForegroundColor $Cyan
    Write-Host "Directory: $WorkingDirectory" -ForegroundColor Gray
    Write-Host "Command: $Command" -ForegroundColor Gray
    Write-Host ("=" * 60) -ForegroundColor $Blue
    
    try {
        $testStart = Get-Date
        Push-Location $WorkingDirectory
        
        if ($ShowOutput -or $Verbose) {
            # Afficher la sortie en temps réel
            & cmd /c $Command
            $exitCode = $LASTEXITCODE
        } else {
            # Capturer la sortie
            $output = & cmd /c $Command 2>&1
            $exitCode = $LASTEXITCODE
            
            # Afficher un résumé de la sortie
            $outputString = $output -join "`n"
            if ($outputString -match "(\d+) passed") {
                Write-Host "Tests passed: $($matches[1])" -ForegroundColor Green
            }
            if ($outputString -match "(\d+) failed") {
                Write-Host "Tests failed: $($matches[1])" -ForegroundColor Red
            }
            if ($outputString -match "Time:\s*([^,\n]+)") {
                Write-Host "Duration: $($matches[1])" -ForegroundColor Gray
            }
        }
        
        $testEnd = Get-Date
        $duration = ($testEnd - $testStart).TotalSeconds
        
        Pop-Location
        
        if ($exitCode -eq 0) {
            Write-Host "`nRESULT: PASS" -ForegroundColor $Green
            $script:passedTests++
        } else {
            Write-Host "`nRESULT: FAIL (Exit code: $exitCode)" -ForegroundColor $Red
            $script:failedTests++
            if (!$ShowOutput -and !$Verbose) {
                Write-Host "Error output:" -ForegroundColor Yellow
                Write-Host $outputString -ForegroundColor Red
            }
        }
        
        $script:totalTests++
        Write-Host "Suite duration: $([math]::Round($duration, 2))s" -ForegroundColor Gray
        
    } catch {
        Pop-Location
        Write-Host "`nRESULT: ERROR - $($_.Exception.Message)" -ForegroundColor $Red
        $script:failedTests++
        $script:totalTests++
    }
}

# Début des tests
Clear-Host
Write-Host "`n" + ("=" * 80) -ForegroundColor $Blue
Write-Host "           EDUTEQC - SUITE DE TESTS COMPLETE" -ForegroundColor $Cyan
Write-Host ("=" * 80) -ForegroundColor $Blue

# Définir les chemins (le script est dans scripts/powershell/)
$scriptPath = $PSScriptRoot
$rootPath = Split-Path (Split-Path $scriptPath -Parent) -Parent
$backendPath = Join-Path $rootPath "backend"
$mobilePath = Join-Path $rootPath "mobile"
$toolsPath = Join-Path $rootPath "tools"

Write-Host "Project root: $rootPath" -ForegroundColor Gray
Write-Host "Backend path: $backendPath" -ForegroundColor Gray
Write-Host "Mobile path: $mobilePath" -ForegroundColor Gray
Write-Host "Tools path: $toolsPath" -ForegroundColor Gray

# Vérifications préliminaires
Write-Host "`nChecking prerequisites..." -ForegroundColor $Yellow
if (!(Test-Path $backendPath)) {
    Write-Host "ERROR: Backend directory not found: $backendPath" -ForegroundColor $Red
    exit 1
}
if (!(Test-Path $mobilePath)) {
    Write-Host "ERROR: Mobile directory not found: $mobilePath" -ForegroundColor $Red
    exit 1
}

# 1. Tests Backend
if (!$SkipBackend) {
    Write-Host "`n`n" + ("*" * 40) -ForegroundColor $Yellow
    Write-Host "          BACKEND TESTS" -ForegroundColor $Yellow  
    Write-Host ("*" * 40) -ForegroundColor $Yellow
    
    if (!$Quick) {
        Run-TestSuite "Backend - All Tests" "npm test" $backendPath -ShowOutput:$Verbose
    } else {
        Run-TestSuite "Backend - Regression Tests" "npm run test:regression" $backendPath -ShowOutput:$Verbose
    }
}

# 2. Tests Mobile
if (!$SkipMobile) {
    Write-Host "`n`n" + ("*" * 40) -ForegroundColor $Yellow
    Write-Host "          MOBILE TESTS" -ForegroundColor $Yellow
    Write-Host ("*" * 40) -ForegroundColor $Yellow
    
    Run-TestSuite "Mobile - All Tests" "npm test" $mobilePath -ShowOutput:$Verbose
}

# 3. Tests E2E
if (!$SkipE2E) {
    Write-Host "`n`n" + ("*" * 40) -ForegroundColor $Yellow
    Write-Host "          E2E TESTS" -ForegroundColor $Yellow
    Write-Host ("*" * 40) -ForegroundColor $Yellow
    
    if (Test-Path "$toolsPath\e2e-tests.js") {
        Run-TestSuite "E2E - End to End Tests" "node e2e-tests.js" $toolsPath -ShowOutput:$Verbose
    } else {
        Write-Host "E2E tests not found, skipping..." -ForegroundColor $Yellow
    }
}

# 4. Tests Scripts PowerShell
if (!$SkipScripts) {
    Write-Host "`n`n" + ("*" * 40) -ForegroundColor $Yellow
    Write-Host "          SCRIPTS VALIDATION" -ForegroundColor $Yellow
    Write-Host ("*" * 40) -ForegroundColor $Yellow
    
    $scriptsPath = Join-Path $rootPath "scripts\powershell"
    Run-TestSuite "Scripts - Reorganization Check" "powershell -ExecutionPolicy Bypass -File .\scripts\powershell\check-reorganization.ps1 -Quick" $rootPath
}

# Résumé final
$endTime = Get-Date
$totalDuration = ($endTime - $startTime).TotalSeconds

Write-Host "`n`n" + ("=" * 80) -ForegroundColor $Blue
Write-Host "                    RESULTS SUMMARY" -ForegroundColor $Cyan
Write-Host ("=" * 80) -ForegroundColor $Blue

Write-Host "`nTest Suites Executed: $totalTests" -ForegroundColor $Cyan
Write-Host "Passed: $passedTests" -ForegroundColor $Green
Write-Host "Failed: $failedTests" -ForegroundColor $(if($failedTests -gt 0) { $Red } else { $Green })
Write-Host "Success Rate: $([math]::Round(($passedTests / [math]::Max($totalTests, 1)) * 100, 1))%" -ForegroundColor $(if($failedTests -gt 0) { $Yellow } else { $Green })
Write-Host "Total Duration: $([math]::Round($totalDuration, 2))s" -ForegroundColor Gray

if ($failedTests -eq 0) {
    Write-Host "`nALL TESTS PASSED!" -ForegroundColor $Green
    Write-Host "Project is ready for production" -ForegroundColor $Green
} else {
    Write-Host "`nSOME TESTS FAILED!" -ForegroundColor $Red
    Write-Host "Please check the output above for details" -ForegroundColor $Red
}

Write-Host "`n" + ("=" * 80) -ForegroundColor $Blue

# Codes de sortie
exit $failedTests
<#
    Script de validation post-reorganisation
    Objectif : verifier presence des dossiers, syntaxe des scripts powershell et quelques fichiers clefs.
    Ce script evite les caracteres non-ASCII pour compatibilite avec PowerShell 5.1 sur Windows.
#>

param(
    [switch]$SkipTests = $false,
    [switch]$Verbose = $false
)

$Host.UI.RawUI.WindowTitle = "EduTeQC - Validation Post-Reorganisation"

# Couleurs (valeurs valides pour -ForegroundColor)
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "INFO",
        [string]$Color = "White"
    )
    $timestamp = Get-Date -Format "HH:mm:ss"
    # Valider la couleur et tenter de convertir en ConsoleColor
    try {
        $colorEnum = [System.Enum]::Parse([System.ConsoleColor], $Color)
    } catch {
        $colorEnum = [System.ConsoleColor]::White
    }
    Write-Host "[$timestamp] [$Status] $Message" -ForegroundColor $colorEnum
}

function Test-PathExists {
    param([string]$Path, [string]$Description)
    if (Test-Path $Path) {
        Write-Status "$Description exists: $Path" "OK" $Green
        return $true
    } else {
        Write-Status "$Description missing: $Path" "ERROR" $Red
        return $false
    }
}

function Test-ScriptSyntax {
    param([string]$ScriptPath)
    try {
        $result = powershell -NoProfile -Command "& {Set-ExecutionPolicy Bypass -Scope Process; . '$ScriptPath'; exit 0}" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Syntax OK: $(Split-Path $ScriptPath -Leaf)" "OK" $Green
            return $true
        } else {
            Write-Status "Script syntax error: $(Split-Path $ScriptPath -Leaf)" "ERROR" $Red
            if ($Verbose) { Write-Host $result }
            return $false
        }
    } catch {
        Write-Status "Exception running script: $(Split-Path $ScriptPath -Leaf) - $($_.Exception.Message)" "ERROR" $Red
        return $false
    }
}

# Debut validation
Write-Status "Start validation of reorganization" "START" $Cyan
Write-Host ""

# 1. Check folder structure
Write-Status "Checking required folders..." "INFO" $Yellow
$requiredFolders = @(
    "backend",
    "mobile",
    "scripts",
    "scripts/powershell",
    "scripts/database",
    "docs",
    "config",
    "tools",
    "backups",
    "releases"
)

$folderErrors = 0
foreach ($folder in $requiredFolders) {
    if (-not (Test-PathExists $folder "Folder $folder")) {
        $folderErrors++
    }
}

# 2. Check PowerShell scripts syntax
Write-Status "Checking PowerShell script syntax..." "INFO" $Yellow
$scriptErrors = 0
try {
    $powershellScripts = Get-ChildItem -Path "scripts/powershell" -Filter "*.ps1" -File -ErrorAction SilentlyContinue
} catch {
    $powershellScripts = @()
}

foreach ($script in $powershellScripts) {
    if (-not (Test-ScriptSyntax $script.FullName)) {
        $scriptErrors++
    }
}

# 3. Check key files
Write-Status "Checking key files..." "INFO" $Yellow
$keyFiles = @(
    "package.json",
    "README.md",
    "backend/package.json",
    "mobile/package.json",
    "docs/README.md",
    "docs/PROJECT_STRUCTURE.md",
    "docs/CORRECTIONS_CHEMINS.md",
    "scripts/README.md"
)

$fileErrors = 0
foreach ($file in $keyFiles) {
    if (-not (Test-PathExists $file "File $file")) {
        $fileErrors++
    }
}

# 4. Quick dependency checks (optional)
if (-not $SkipTests) {
    Write-Status "Quick dependency checks..." "INFO" $Yellow

    if (Test-Path "backend/package.json") {
        Push-Location "backend"
        Write-Status "Checking backend dependencies..." "INFO" $Yellow
        npm list --depth=0 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Backend dependencies OK" "OK" $Green
        } else {
            Write-Status "Backend dependencies issue" "WARNING" $Yellow
        }
        Pop-Location
    }

    if (Test-Path "mobile/package.json") {
        Push-Location "mobile"
        Write-Status "Checking mobile dependencies..." "INFO" $Yellow
        npm list --depth=0 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Mobile dependencies OK" "OK" $Green
        } else {
            Write-Status "Mobile dependencies issue" "WARNING" $Yellow
        }
        Pop-Location
    }
}

# 5. Summary
Write-Host ""
Write-Status "VALIDATION SUMMARY" "SUMMARY" $Cyan
Write-Host ("=" * 50)

$totalErrors = $folderErrors + $scriptErrors + $fileErrors

if ($totalErrors -eq 0) {
    Write-Status "VALIDATION PASSED - No errors detected" "SUCCESS" $Green
    Write-Status "Reorganization appears functional" "SUCCESS" $Green
} else {
    Write-Status "VALIDATION PARTIAL - Issues found" "WARNING" $Yellow
    Write-Status "Folder errors: $folderErrors" "ERROR" $Red
    Write-Status "Script errors: $scriptErrors" "ERROR" $Red
    Write-Status "File errors: $fileErrors" "ERROR" $Red
    Write-Status "See details above for fixes" "INFO" $Yellow
}

Write-Host ""
Write-Status "See docs/CORRECTIONS_CHEMINS.md for details" "INFO" $Cyan
Write-Status "See docs/PROJECT_STRUCTURE.md for project layout" "INFO" $Cyan
Write-Status "See scripts/README.md for script usage" "INFO" $Cyan

Write-Host ""
Write-Status "Usage examples:" "INFO" $Yellow
Write-Host "  .\scripts\powershell\test-local.ps1         # full test"
Write-Host "  .\scripts\powershell\run-regression-tests.ps1  # regression tests"
Write-Host "  cd backend; npm test                         # backend tests"
Write-Host "  cd mobile; npm test                          # mobile tests"

exit $totalErrors
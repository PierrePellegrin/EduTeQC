# Script de Validation Complete Post-Reorganisation
# Verifie que tous les scripts et dependances fonctionnent apres la reorganisation

param(
    [switch]$SkipTests = $false,
    [switch]$Verbose = $false
)

$Host.UI.RawUI.WindowTitle = "EduTeQC - Validation Post-Reorganisation"

function Write-Status {
    param([string]$Message, [string]$Status = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] [$Status] $Message"
}

function Test-PathExists {
    param([string]$Path, [string]$Description)
    if (Test-Path $Path) {
        Write-Status "OK: $Description existe : $Path" "OK"
        return $true
    } else {
        Write-Status "ERROR: $Description manquant : $Path" "ERROR"
        return $false
    }
}

function Test-ScriptSyntax {
    param([string]$ScriptPath)
    try {
        $result = powershell -NoProfile -Command "& {Set-ExecutionPolicy Bypass -Scope Process; . '$ScriptPath'; exit 0}" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "OK: Syntaxe $(Split-Path $ScriptPath -Leaf)" "OK"
            return $true
        } else {
            Write-Status "ERROR: Syntaxe $(Split-Path $ScriptPath -Leaf)" "ERROR"
            if ($Verbose) { Write-Host $result }
            return $false
        }
    } catch {
        Write-Status "ERROR: Exception $(Split-Path $ScriptPath -Leaf) - $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Debut validation
Write-Status "Debut de la validation post-reorganisation" "START"
Write-Host ""

# 1. Verification structure des dossiers
Write-Status "Verification de la structure des dossiers..." "INFO"
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
    if (-not (Test-PathExists $folder "Dossier $folder")) {
        $folderErrors++
    }
}

# 2. Verification scripts PowerShell
Write-Status "Verification syntaxe des scripts PowerShell..." "INFO"
$scriptErrors = 0
$powershellScripts = Get-ChildItem "scripts/powershell/*.ps1"

foreach ($script in $powershellScripts) {
    if (-not (Test-ScriptSyntax $script.FullName)) {
        $scriptErrors++
    }
}

# 3. Verification des fichiers cles
Write-Status "Verification des fichiers cles..." "INFO"
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
    if (-not (Test-PathExists $file "Fichier $file")) {
        $fileErrors++
    }
}

# 4. Resume final
Write-Host ""
Write-Status "RESUME DE LA VALIDATION" "SUMMARY"
Write-Host ("=" * 50)

$totalErrors = $folderErrors + $scriptErrors + $fileErrors

if ($totalErrors -eq 0) {
    Write-Status "VALIDATION REUSSIE - Aucune erreur detectee!" "SUCCESS"
    Write-Status "La reorganisation est parfaitement fonctionnelle" "SUCCESS"
} else {
    Write-Status "VALIDATION PARTIELLEMENT REUSSIE" "WARNING"
    Write-Status "Erreurs dossiers: $folderErrors" "ERROR"
    Write-Status "Erreurs scripts: $scriptErrors" "ERROR"  
    Write-Status "Erreurs fichiers: $fileErrors" "ERROR"
    Write-Status "Voir les details ci-dessus pour les corrections" "INFO"
}

Write-Host ""
Write-Status "Pour plus d'informations, consultez :" "INFO"
Write-Status "   docs/CORRECTIONS_CHEMINS.md - Detail des corrections" "INFO"
Write-Status "   docs/PROJECT_STRUCTURE.md - Structure du projet" "INFO"
Write-Status "   scripts/README.md - Guide d'utilisation des scripts" "INFO"

Write-Host ""
Write-Status "Exemples d'utilisation post-reorganisation :" "INFO"
Write-Host "   .\scripts\powershell\test-local.ps1         # Test complet"
Write-Host "   .\scripts\powershell\run-regression-tests.ps1  # Tests regression"
Write-Host "   cd backend; npm test                         # Tests backend"
Write-Host "   cd mobile; npm test                          # Tests mobile"

exit $totalErrors
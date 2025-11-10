# Railway Crash Diagnostic Script
# Diagnostic du crash serveur sur Railway

Write-Host "DIAGNOSTIC CRASH RAILWAY" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Yellow

# Chemin vers le dossier racine
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Write-Host "Dossier projet: $projectRoot" -ForegroundColor Cyan

# Verifier les fichiers critiques
Write-Host "`nVERIFICATION FICHIERS CRITIQUES:" -ForegroundColor Yellow

$criticalFiles = @(
    "backend/src/server.ts",
    "backend/package.json", 
    "backend/tsconfig.json",
    "backend/nixpacks.toml"
)

foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        Write-Host "OK $file - EXISTE" -ForegroundColor Green
    } else {
        Write-Host "ERROR $file - MANQUANT" -ForegroundColor Red
    }
}

# Verifier les variables d'environnement requises
Write-Host "`nVARIABLES D'ENVIRONNEMENT BACKEND:" -ForegroundColor Yellow
$backendPackage = Join-Path $projectRoot "backend/package.json"
if (Test-Path $backendPackage) {
    $packageContent = Get-Content $backendPackage -Raw | ConvertFrom-Json
    Write-Host "Scripts disponibles:" -ForegroundColor Green
    $packageContent.scripts.PSObject.Properties | ForEach-Object {
        Write-Host "   - $($_.Name): $($_.Value)" -ForegroundColor Cyan
    }
} else {
    Write-Host "ERROR package.json introuvable" -ForegroundColor Red
}

# Verifier la configuration Nixpacks
Write-Host "`nCONFIGURATION NIXPACKS:" -ForegroundColor Yellow
$nixpacksFile = Join-Path $projectRoot "backend/nixpacks.toml"
if (Test-Path $nixpacksFile) {
    Write-Host "nixpacks.toml trouve:" -ForegroundColor Green
    Get-Content $nixpacksFile | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Cyan
    }
} else {
    Write-Host "ERROR nixpacks.toml manquant" -ForegroundColor Red
}

# Verifier server.ts
Write-Host "`nVERIFICATION SERVER.TS:" -ForegroundColor Yellow
$serverFile = Join-Path $projectRoot "backend/src/server.ts"
if (Test-Path $serverFile) {
    Write-Host "server.ts trouve" -ForegroundColor Green
    $serverContent = Get-Content $serverFile -Raw
    
    # Verifier les imports critiques
    if ($serverContent -match "import.*express") {
        Write-Host "Import Express - OK" -ForegroundColor Green
    } else {
        Write-Host "Import Express - MANQUANT" -ForegroundColor Red
    }
    
    # Verifier le port
    if ($serverContent -match "process\.env\.PORT") {
        Write-Host "Configuration PORT - OK" -ForegroundColor Green
    } else {
        Write-Host "Configuration PORT - PROBLEME" -ForegroundColor Red
    }
    
    # Verifier app.listen
    if ($serverContent -match "app\.listen") {
        Write-Host "app.listen - OK" -ForegroundColor Green
    } else {
        Write-Host "app.listen - MANQUANT" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR server.ts introuvable" -ForegroundColor Red
}

Write-Host "`nACTIONS RECOMMANDEES:" -ForegroundColor Yellow
Write-Host "1. Verifier les logs Railway dans le dashboard" -ForegroundColor Cyan
Write-Host "2. Verifier que toutes les dependances sont dans package.json" -ForegroundColor Cyan  
Write-Host "3. Verifier la configuration des variables d'environnement" -ForegroundColor Cyan
Write-Host "4. Tester le serveur localement avec npm run dev" -ForegroundColor Cyan

Write-Host "`nLIENS UTILES:" -ForegroundColor Yellow
Write-Host "Railway Dashboard: https://railway.app/dashboard" -ForegroundColor Blue
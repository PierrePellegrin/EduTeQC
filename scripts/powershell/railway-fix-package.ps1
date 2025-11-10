# Railway Fix Package.json Script
# Correction du package.json pour Railway

Write-Host "CORRECTION PACKAGE.JSON POUR RAILWAY" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Yellow

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$backendPackage = Join-Path $projectRoot "backend/package.json"

Write-Host "Dossier projet: $projectRoot" -ForegroundColor Cyan
Write-Host "Chemin package.json: $backendPackage" -ForegroundColor Cyan

if (Test-Path $backendPackage) {
    Write-Host "`nLecture du package.json..." -ForegroundColor Yellow
    $packageContent = Get-Content $backendPackage -Raw | ConvertFrom-Json
    
    # Verifier si la dependance problematique existe
    if ($packageContent.dependencies."eduteqc") {
        Write-Host "ERROR: Dependance problematique trouvee: eduteqc: $($packageContent.dependencies."eduteqc")" -ForegroundColor Red
        
        # Supprimer la dependance problematique
        $packageContent.dependencies.PSObject.Properties.Remove("eduteqc")
        Write-Host "Suppression de la dependance 'eduteqc'..." -ForegroundColor Yellow
        
        # Sauvegarder le package.json corrige
        $packageJson = $packageContent | ConvertTo-Json -Depth 10
        Set-Content -Path $backendPackage -Value $packageJson -Encoding UTF8
        
        Write-Host "OK: package.json corrige et sauvegarde" -ForegroundColor Green
    } else {
        Write-Host "OK: Aucune dependance problematique trouvee" -ForegroundColor Green
    }
    
    Write-Host "`nVerification des scripts Railway..." -ForegroundColor Yellow
    if ($packageContent.scripts."railway:start") {
        Write-Host "OK: Script railway:start present: $($packageContent.scripts."railway:start")" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Script railway:start manquant" -ForegroundColor Yellow
    }
    
    if ($packageContent.scripts."start") {
        Write-Host "OK: Script start present: $($packageContent.scripts."start")" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Script start manquant" -ForegroundColor Red
    }
    
} else {
    Write-Host "ERROR: package.json introuvable a $backendPackage" -ForegroundColor Red
}

Write-Host "`nACTIONS SUIVANTES:" -ForegroundColor Yellow
Write-Host "1. Commit et push des corrections" -ForegroundColor Cyan
Write-Host "2. Verifier les logs Railway" -ForegroundColor Cyan
Write-Host "3. Tester les endpoints apres redeploi" -ForegroundColor Cyan
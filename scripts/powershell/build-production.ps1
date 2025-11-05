# 📱 Script de Build Production EduTeQC

Write-Host "🚀 Build Production EduTeQC - Démarrage..." -ForegroundColor Green

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "mobile\package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet EduTeQCV2" -ForegroundColor Red
    exit 1
}

# Demander l'URL de l'API de production
$apiUrl = Read-Host "🔗 Entrez l'URL de votre API de production (ex: https://your-app.railway.app/api)"

if ([string]::IsNullOrWhiteSpace($apiUrl)) {
    Write-Host "❌ URL de l'API requise pour le build de production" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Configuration de l'API: $apiUrl" -ForegroundColor Yellow

# Mettre à jour la configuration
$configPath = "mobile\src\config\api.config.ts"
$configContent = Get-Content $configPath -Raw
$configContent = $configContent -replace "https://your-app-name\.railway\.app/api", $apiUrl
Set-Content $configPath $configContent

Write-Host "✅ Configuration API mise à jour" -ForegroundColor Green

# Nettoyer les builds précédents
Write-Host "🧹 Nettoyage des builds précédents..." -ForegroundColor Yellow
if (Test-Path "mobile\android") {
    Remove-Item "mobile\android" -Recurse -Force
}

# Prebuild
Write-Host "🔧 Prebuild Android..." -ForegroundColor Yellow
cd mobile
npx expo prebuild --platform android --clear

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du prebuild" -ForegroundColor Red
    cd ..
    exit 1
}

# Build Release
Write-Host "🏗️ Build APK Release..." -ForegroundColor Yellow
cd android
.\gradlew assembleRelease

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    cd ..\..
    exit 1
}

cd ..\..

# Vérifier le résultat
$apkPath = "mobile\android\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apkPath) {
    $apkInfo = Get-Item $apkPath
    $sizeInMB = [math]::Round($apkInfo.Length / 1MB, 1)
    
    Write-Host "🎉 Build réussi!" -ForegroundColor Green
    Write-Host "📱 APK créé: $apkPath" -ForegroundColor Cyan
    Write-Host "📦 Taille: $sizeInMB MB" -ForegroundColor Cyan
    Write-Host "📅 Créé le: $($apkInfo.LastWriteTime)" -ForegroundColor Cyan
    
    Write-Host "`n🔗 Pour installer sur votre appareil:" -ForegroundColor Yellow
    Write-Host "   adb install `"$apkPath`"" -ForegroundColor White
    
} else {
    Write-Host "❌ APK non trouvé: $apkPath" -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ Build de production terminé avec succès!" -ForegroundColor Green
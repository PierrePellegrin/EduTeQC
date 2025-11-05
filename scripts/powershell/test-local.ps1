# 🧪 Script de Test Local EduTeQC

Write-Host "🧪 Test Local EduTeQC - Démarrage..." -ForegroundColor Green

# Obtenir le chemin racine du projet (2 niveaux au-dessus)
$rootPath = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent
Set-Location $rootPath

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "mobile\package.json") -or -not (Test-Path "backend\package.json")) {
    Write-Host "❌ Erreur: Impossible de trouver les dossiers mobile et backend" -ForegroundColor Red
    Write-Host "📁 Chemin actuel: $rootPath" -ForegroundColor Yellow
    exit 1
}

# Obtenir l'IP locale pour les tests sur appareil physique
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi).IPAddress | Select-Object -First 1
if ([string]::IsNullOrWhiteSpace($localIP)) {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp).IPAddress | Select-Object -First 1
}

Write-Host "🌐 IP locale détectée: $localIP" -ForegroundColor Cyan
Write-Host "📱 Pour tester sur appareil physique, utilisez: http://$localIP:3000/api" -ForegroundColor Yellow

# Vérifier PostgreSQL
Write-Host "`n🔍 Vérification de PostgreSQL..." -ForegroundColor Yellow
$pgStatus = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
if ($pgStatus -and $pgStatus.Status -eq "Running") {
    Write-Host "✅ PostgreSQL est en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "⚠️ PostgreSQL ne semble pas être en cours d'exécution" -ForegroundColor Yellow
    Write-Host "   Démarrez PostgreSQL avant de continuer" -ForegroundColor White
}

# Démarrer le backend
Write-Host "`n🔧 Démarrage du backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "⏳ Attente du démarrage du backend (5 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Tester la connexion au backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend accessible: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend pas encore accessible, vérifiez la fenêtre du backend" -ForegroundColor Yellow
}

# Démarrer l'application mobile
Write-Host "`n📱 Démarrage de l'application mobile..." -ForegroundColor Yellow
cd mobile
npm start

Write-Host "`n🎯 Instructions de test:" -ForegroundColor Cyan
Write-Host "1. Scannez le QR code avec Expo Go sur votre téléphone" -ForegroundColor White
Write-Host "2. Ou appuyez sur 'a' pour ouvrir sur l'émulateur Android" -ForegroundColor White
Write-Host "3. Ou appuyez sur 'i' pour ouvrir sur le simulateur iOS" -ForegroundColor White
Write-Host "`n🔑 Comptes de test:" -ForegroundColor Cyan
Write-Host "   Admin: admin@eduteqc.com / admin123" -ForegroundColor White
Write-Host "   Client: client@eduteqc.com / client123" -ForegroundColor White
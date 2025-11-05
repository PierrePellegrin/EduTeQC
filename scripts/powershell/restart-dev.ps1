# ===============================================
# 🔄 Script de Redémarrage Complet - EduTeQCV2
# ===============================================
# Nettoie complètement puis redémarre le backend et le mobile
# Usage: .\restart-dev.ps1

param(
    [switch]$BackendOnly,
    [switch]$MobileOnly,
    [switch]$NoStart
)

Write-Host "🔄 REDÉMARRAGE COMPLET DE L'ENVIRONNEMENT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Phase 1: Nettoyage complet
Write-Host ""
Write-Host "🧹 Phase 1: Nettoyage..." -ForegroundColor Yellow

# Exécuter le script de nettoyage rapide
& "$PSScriptRoot\kill-all-quick.ps1"

# Attendre un peu pour que tout se ferme proprement
Start-Sleep -Seconds 2

if ($NoStart) {
    Write-Host ""
    Write-Host "✅ Nettoyage terminé. Pas de redémarrage demandé." -ForegroundColor Green
    exit 0
}

# Phase 2: Redémarrage
Write-Host ""
Write-Host "🚀 Phase 2: Redémarrage..." -ForegroundColor Yellow

# Vérifier qu'on est dans le bon répertoire
if (-not (Test-Path ".\backend") -or -not (Test-Path ".\mobile")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet EduTeQCV2" -ForegroundColor Red
    exit 1
}

if (-not $MobileOnly) {
    Write-Host ""
    Write-Host "🔧 Démarrage du backend..." -ForegroundColor Blue
    
    # Ouvrir un nouveau terminal pour le backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 Backend EduTeQCV2' -ForegroundColor Green; npm run dev"
    
    # Attendre que le backend démarre
    Write-Host "⏳ Attente du démarrage du backend (5 secondes)..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}

if (-not $BackendOnly) {
    Write-Host ""
    Write-Host "📱 Démarrage de l'application mobile..." -ForegroundColor Blue
    
    # Ouvrir un nouveau terminal pour le mobile
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\mobile'; Write-Host '📱 Application Mobile EduTeQCV2' -ForegroundColor Green; npm start"
}

Write-Host ""
Write-Host "🎉 Redémarrage terminé !" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

if (-not $MobileOnly) {
    Write-Host "🔧 Backend disponible sur: http://localhost:3000" -ForegroundColor White
}

if (-not $BackendOnly) {
    Write-Host "📱 Interface mobile disponible via Expo" -ForegroundColor White
}

Write-Host ""
Write-Host "🧪 Comptes de test:" -ForegroundColor White
Write-Host "  Admin: admin@eduteqc.com / admin123" -ForegroundColor Gray
Write-Host "  Client: client@eduteqc.com / client123" -ForegroundColor Gray
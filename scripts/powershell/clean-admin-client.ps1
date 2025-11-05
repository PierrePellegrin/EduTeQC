# Script PowerShell pour nettoyer les donnees client de l'Admin
# Usage: .\clean-admin-client.ps1

Write-Host "🧹 NETTOYAGE DES DONNEES CLIENT ADMIN" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que nous sommes dans le bon repertoire
$currentPath = Get-Location
if (-not (Test-Path "prisma\clean-admin-client-data.ts")) {
    Write-Host "❌ Erreur: Ce script doit etre execute depuis le dossier backend" -ForegroundColor Red
    Write-Host "💡 Essayez: cd C:\Projet\EduTeQCV2\backend" -ForegroundColor Yellow
    exit 1
}

Write-Host "📊 Affichage des statistiques actuelles..." -ForegroundColor Yellow
Write-Host ""

# Executer le script de statistiques
try {
    npx tsx prisma/admin-client-stats.ts
    
    Write-Host ""
    Write-Host "✅ Operation terminee avec succes !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Pour supprimer manuellement via API, utilisez:" -ForegroundColor Cyan
    Write-Host "   GET    /api/admin/admin-client-stats" -ForegroundColor Gray
    Write-Host "   DELETE /api/admin/admin-client-data" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 Pour executer directement le nettoyage:" -ForegroundColor Cyan
    Write-Host "   npx tsx prisma/clean-admin-client-data.ts" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Erreur lors de l'execution: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
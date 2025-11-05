# Script simple pour nettoyer les donnees client Admin

Write-Host "Nettoyage des donnees client Admin..." -ForegroundColor Yellow

try {
    npx tsx prisma/admin-client-stats.ts
    Write-Host "Operation terminee !" -ForegroundColor Green
} catch {
    Write-Host "Erreur detectee" -ForegroundColor Red
}
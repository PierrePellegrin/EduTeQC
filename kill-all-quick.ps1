# ===============================================
# ⚡ Script de Nettoyage Rapide - EduTeQCV2
# ===============================================
# Version rapide et silencieuse pour un nettoyage express
# Usage: .\kill-all-quick.ps1

Write-Host "⚡ Nettoyage rapide en cours..." -ForegroundColor Yellow

# Tuer tous les processus de développement d'un coup
$processes = @("node", "java", "qemu-system-x86_64", "adb")
foreach ($process in $processes) {
    Get-Process -Name $process -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

# Tuer les processus Expo/Metro
Get-Process | Where-Object {$_.ProcessName -like "*expo*" -or $_.ProcessName -like "*metro*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Arrêter ADB
& adb kill-server 2>$null

# Libérer les ports avec kill-port
try {
    & npx kill-port 3000 8081 8082 8083 2>$null
} catch {
    # Ignorer les erreurs
}

Write-Host "✅ Nettoyage terminé !" -ForegroundColor Green
# ===============================================
# 🧹 Script de Nettoyage Complet - EduTeQCV2
# ===============================================
# Tue tous les processus de développement et libère les ports
# Usage: .\kill-all-dev.ps1

Write-Host "🧹 NETTOYAGE COMPLET DE L'ENVIRONNEMENT DE DÉVELOPPEMENT" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher les résultats avec couleurs
function Write-Result {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )
    
    switch ($Status) {
        "SUCCESS" { Write-Host "✅ $Message" -ForegroundColor Green }
        "ERROR" { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "⚠️ $Message" -ForegroundColor Yellow }
        "INFO" { Write-Host "ℹ️ $Message" -ForegroundColor Blue }
    }
}

Write-Host "🔄 Phase 1: Arrêt des processus Node.js..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        taskkill /f /im node.exe 2>$null
        Write-Result "Processus Node.js tues ($($nodeProcesses.Count) processus)" "SUCCESS"
    } else {
        Write-Result "Aucun processus Node.js trouvé" "INFO"
    }
} catch {
    Write-Result "Erreur lors de l'arrêt des processus Node.js: $($_.Exception.Message)" "ERROR"
}

Write-Host ""
Write-Host "🔄 Phase 2: Arrêt des processus Java/Android..." -ForegroundColor Yellow

# Tuer les processus Java (Gradle, émulateur)
try {
    $javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
    if ($javaProcesses) {
        taskkill /f /im java.exe 2>$null
        Write-Result "Processus Java tues ($($javaProcesses.Count) processus)" "SUCCESS"
    } else {
        Write-Result "Aucun processus Java trouvé" "INFO"
    }
} catch {
    Write-Result "Erreur lors de l'arrêt des processus Java: $($_.Exception.Message)" "ERROR"
}

# Tuer l'émulateur Android (QEMU)
try {
    $qemuProcesses = Get-Process -Name "qemu-system-x86_64" -ErrorAction SilentlyContinue
    if ($qemuProcesses) {
        taskkill /f /im qemu-system-x86_64.exe 2>$null
        Write-Result "Émulateur Android tué" "SUCCESS"
    } else {
        Write-Result "Aucun émulateur Android trouvé" "INFO"
    }
} catch {
    Write-Result "Erreur lors de l'arrêt de l'émulateur: $($_.Exception.Message)" "ERROR"
}

# Tuer ADB
try {
    $adbProcesses = Get-Process -Name "adb" -ErrorAction SilentlyContinue
    if ($adbProcesses) {
        taskkill /f /im adb.exe 2>$null
        Write-Result "ADB tué" "SUCCESS"
    } else {
        Write-Result "Aucun processus ADB trouvé" "INFO"
    }
} catch {
    Write-Result "Erreur lors de l'arrêt d'ADB: $($_.Exception.Message)" "ERROR"
}

Write-Host ""
Write-Host "🔄 Phase 3: Nettoyage des processus Expo/Metro..." -ForegroundColor Yellow

# Tuer tous les processus contenant expo ou metro
try {
    $expoMetroProcesses = Get-Process | Where-Object {$_.ProcessName -like "*expo*" -or $_.ProcessName -like "*metro*"}
    if ($expoMetroProcesses) {
        $expoMetroProcesses | Stop-Process -Force
        Write-Result "Processus Expo/Metro tues ($($expoMetroProcesses.Count) processus)" "SUCCESS"
    } else {
        Write-Result "Aucun processus Expo/Metro trouvé" "INFO"
    }
} catch {
    Write-Result "Erreur lors de l'arrêt des processus Expo/Metro: $($_.Exception.Message)" "ERROR"
}

Write-Host ""
Write-Host "🔄 Phase 4: Arrêt du serveur ADB..." -ForegroundColor Yellow

try {
    & adb kill-server 2>$null
    Write-Result "Serveur ADB arrêté" "SUCCESS"
} catch {
    Write-Result "Erreur lors de l'arrêt du serveur ADB: $($_.Exception.Message)" "ERROR"
}

Write-Host ""
Write-Host "🔄 Phase 5: Libération des ports..." -ForegroundColor Yellow

$ports = @(3000, 8081, 8082, 8083, 5432)
$killedPorts = @()

foreach ($port in $ports) {
    try {
        # Vérifier si le port est utilisé
        $connections = netstat -ano | Select-String ":$port "
        if ($connections) {
            # Extraire le PID
            $pids = $connections | ForEach-Object {
                ($_ -split '\s+')[-1]
            } | Sort-Object -Unique
            
            foreach ($pid in $pids) {
                if ($pid -and $pid -match '^\d+$') {
                    try {
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        $killedPorts += $port
                    } catch {
                        # Ignorer les erreurs de processus déjà fermés
                    }
                }
            }
        }
    } catch {
        # Utiliser kill-port comme fallback
        try {
            & npx kill-port $port 2>$null
            $killedPorts += $port
        } catch {
            Write-Result "Impossible de libérer le port $port" "WARNING"
        }
    }
}

if ($killedPorts.Count -gt 0) {
    Write-Result "Ports libérés: $($killedPorts -join ', ')" "SUCCESS"
} else {
    Write-Result "Aucun port à libérer" "INFO"
}

Write-Host ""
Write-Host "🔄 Phase 6: Vérification finale..." -ForegroundColor Yellow

# Vérifier qu'aucun processus Node.js n'est en cours
$remainingNode = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($remainingNode) {
    Write-Result "Processus Node.js encore actifs: $($remainingNode.Count)" "WARNING"
} else {
    Write-Result "Aucun processus Node.js actif" "SUCCESS"
}

# Vérifier les ports critiques
$criticalPorts = @(3000, 8081)
$busyPorts = @()

foreach ($port in $criticalPorts) {
    $connections = netstat -ano | Select-String ":$port " -Quiet
    if ($connections) {
        $busyPorts += $port
    }
}

if ($busyPorts.Count -gt 0) {
    Write-Result "Ports encore occupés: $($busyPorts -join ', ')" "WARNING"
} else {
    Write-Result "Tous les ports critiques sont libres" "SUCCESS"
}

Write-Host ""
Write-Host "🎉 NETTOYAGE TERMINÉ !" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Environnement prêt pour un nouveau démarrage:" -ForegroundColor White
Write-Host "  • Backend: cd backend; npm run dev" -ForegroundColor Gray
Write-Host "  • Mobile:  cd mobile; npm start" -ForegroundColor Gray
Write-Host "  • Tests:   npm run test" -ForegroundColor Gray
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
# Script de Nettoyage Complet - EduTeQCV2
# Tue tous les processus de developpement et libere les ports

Write-Host "Nettoyage complet de l'environnement de developpement" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Phase 1: Arret des processus Node.js
Write-Host "Phase 1: Arret des processus Node.js..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        taskkill /f /im node.exe 2>$null
        Write-Host "OK - Processus Node.js tues ($($nodeProcesses.Count) processus)" -ForegroundColor Green
    } else {
        Write-Host "INFO - Aucun processus Node.js trouve" -ForegroundColor Blue
    }
} catch {
    Write-Host "ERREUR - Impossible d'arreter les processus Node.js" -ForegroundColor Red
}

# Phase 2: Arret des processus Java/Android
Write-Host ""
Write-Host "Phase 2: Arret des processus Java/Android..." -ForegroundColor Yellow

try {
    $javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
    if ($javaProcesses) {
        taskkill /f /im java.exe 2>$null
        Write-Host "OK - Processus Java tues ($($javaProcesses.Count) processus)" -ForegroundColor Green
    } else {
        Write-Host "INFO - Aucun processus Java trouve" -ForegroundColor Blue
    }
} catch {
    Write-Host "ERREUR - Impossible d'arreter les processus Java" -ForegroundColor Red
}

try {
    $qemuProcesses = Get-Process -Name "qemu-system-x86_64" -ErrorAction SilentlyContinue
    if ($qemuProcesses) {
        taskkill /f /im qemu-system-x86_64.exe 2>$null
        Write-Host "OK - Emulateur Android tue" -ForegroundColor Green
    } else {
        Write-Host "INFO - Aucun emulateur Android trouve" -ForegroundColor Blue
    }
} catch {
    Write-Host "ERREUR - Impossible d'arreter l'emulateur" -ForegroundColor Red
}

try {
    $adbProcesses = Get-Process -Name "adb" -ErrorAction SilentlyContinue
    if ($adbProcesses) {
        taskkill /f /im adb.exe 2>$null
        Write-Host "OK - ADB tue" -ForegroundColor Green
    } else {
        Write-Host "INFO - Aucun processus ADB trouve" -ForegroundColor Blue
    }
} catch {
    Write-Host "ERREUR - Impossible d'arreter ADB" -ForegroundColor Red
}

# Phase 3: Nettoyage des processus Expo/Metro
Write-Host ""
Write-Host "Phase 3: Nettoyage des processus Expo/Metro..." -ForegroundColor Yellow

try {
    $expoMetroProcesses = Get-Process | Where-Object {$_.ProcessName -like "*expo*" -or $_.ProcessName -like "*metro*"}
    if ($expoMetroProcesses) {
        $expoMetroProcesses | Stop-Process -Force
        Write-Host "OK - Processus Expo/Metro tues ($($expoMetroProcesses.Count) processus)" -ForegroundColor Green
    } else {
        Write-Host "INFO - Aucun processus Expo/Metro trouve" -ForegroundColor Blue
    }
} catch {
    Write-Host "ERREUR - Impossible d'arreter les processus Expo/Metro" -ForegroundColor Red
}

# Phase 4: Arret du serveur ADB
Write-Host ""
Write-Host "Phase 4: Arret du serveur ADB..." -ForegroundColor Yellow

try {
    & adb kill-server 2>$null
    Write-Host "OK - Serveur ADB arrete" -ForegroundColor Green
} catch {
    Write-Host "ERREUR - Impossible d'arreter le serveur ADB" -ForegroundColor Red
}

# Phase 5: Liberation des ports
Write-Host ""
Write-Host "Phase 5: Liberation des ports..." -ForegroundColor Yellow

$ports = @(3000, 8081, 8082, 8083, 5432)
$killedPorts = @()

foreach ($port in $ports) {
    try {
        $connections = netstat -ano | Select-String ":$port "
        if ($connections) {
            $pids = $connections | ForEach-Object {
                ($_ -split '\s+')[-1]
            } | Sort-Object -Unique
            
            foreach ($pid in $pids) {
                if ($pid -and $pid -match '^\d+$') {
                    try {
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        $killedPorts += $port
                    } catch {
                        # Ignorer les erreurs
                    }
                }
            }
        }
    } catch {
        try {
            & npx kill-port $port 2>$null
            $killedPorts += $port
        } catch {
            Write-Host "ATTENTION - Impossible de liberer le port $port" -ForegroundColor Yellow
        }
    }
}

if ($killedPorts.Count -gt 0) {
    Write-Host "OK - Ports liberes: $($killedPorts -join ', ')" -ForegroundColor Green
} else {
    Write-Host "INFO - Aucun port a liberer" -ForegroundColor Blue
}

# Phase 6: Verification finale
Write-Host ""
Write-Host "Phase 6: Verification finale..." -ForegroundColor Yellow

$remainingNode = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($remainingNode) {
    Write-Host "ATTENTION - Processus Node.js encore actifs: $($remainingNode.Count)" -ForegroundColor Yellow
} else {
    Write-Host "OK - Aucun processus Node.js actif" -ForegroundColor Green
}

$criticalPorts = @(3000, 8081)
$busyPorts = @()

foreach ($port in $criticalPorts) {
    $connections = netstat -ano | Select-String ":$port " -Quiet
    if ($connections) {
        $busyPorts += $port
    }
}

if ($busyPorts.Count -gt 0) {
    Write-Host "ATTENTION - Ports encore occupes: $($busyPorts -join ', ')" -ForegroundColor Yellow
} else {
    Write-Host "OK - Tous les ports critiques sont libres" -ForegroundColor Green
}

Write-Host ""
Write-Host "NETTOYAGE TERMINE !" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "Environnement pret pour un nouveau demarrage:" -ForegroundColor White
Write-Host "  Backend: cd backend; npm run dev" -ForegroundColor Gray
Write-Host "  Mobile:  cd mobile; npm start" -ForegroundColor Gray
Write-Host "  Tests:   npm run test" -ForegroundColor Gray
Write-Host ""
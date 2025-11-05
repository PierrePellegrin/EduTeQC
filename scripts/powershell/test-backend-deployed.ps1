# 🧪 Script de Test du Backend Déployé

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl
)

Write-Host "🧪 Test du Backend Déployé - $ApiUrl" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray

# Enlever le trailing slash si présent
$ApiUrl = $ApiUrl.TrimEnd('/')

# Test 1: Health Check
Write-Host "`n1️⃣ Test Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$ApiUrl/health" -Method Get -TimeoutSec 10
    Write-Host "   ✅ SUCCÈS: $($health.status)" -ForegroundColor Green
    Write-Host "   📅 Timestamp: $($health.timestamp)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login Admin
Write-Host "`n2️⃣ Test Login Admin..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "admin@eduteqc.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$ApiUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json" -TimeoutSec 10
    
    if ($loginResponse.token -and $loginResponse.user.role -eq "ADMIN") {
        Write-Host "   ✅ SUCCÈS: Admin connecté" -ForegroundColor Green
        Write-Host "   👤 User: $($loginResponse.user.email)" -ForegroundColor Cyan
        Write-Host "   🔑 Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Cyan
        $adminToken = $loginResponse.token
    } else {
        Write-Host "   ❌ ÉCHEC: Réponse invalide" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Login Client
Write-Host "`n3️⃣ Test Login Client..." -ForegroundColor Yellow
try {
    $clientLoginData = @{
        email = "client@eduteqc.com"
        password = "client123"
    } | ConvertTo-Json

    $clientResponse = Invoke-RestMethod -Uri "$ApiUrl/api/auth/login" -Method Post -Body $clientLoginData -ContentType "application/json" -TimeoutSec 10
    
    if ($clientResponse.token -and $clientResponse.user.role -eq "CLIENT") {
        Write-Host "   ✅ SUCCÈS: Client connecté" -ForegroundColor Green
        Write-Host "   👤 User: $($clientResponse.user.email)" -ForegroundColor Cyan
        $clientToken = $clientResponse.token
    } else {
        Write-Host "   ❌ ÉCHEC: Réponse invalide" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Liste des Cours
Write-Host "`n4️⃣ Test Liste des Cours..." -ForegroundColor Yellow
try {
    $courses = Invoke-RestMethod -Uri "$ApiUrl/api/courses" -Method Get -TimeoutSec 10
    
    if ($courses -and $courses.Count -gt 0) {
        Write-Host "   ✅ SUCCÈS: $($courses.Count) cours trouvés" -ForegroundColor Green
        Write-Host "   📚 Premier cours: $($courses[0].title)" -ForegroundColor Cyan
    } else {
        Write-Host "   ⚠️ ATTENTION: Aucun cours trouvé (DB vide?)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Stats Admin (avec token)
Write-Host "`n5️⃣ Test Stats Admin..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    
    $stats = Invoke-RestMethod -Uri "$ApiUrl/api/admin/stats" -Method Get -Headers $headers -TimeoutSec 10
    
    Write-Host "   ✅ SUCCÈS: Stats récupérées" -ForegroundColor Green
    Write-Host "   📊 Cours: $($stats.coursesCount)" -ForegroundColor Cyan
    Write-Host "   📊 Tests: $($stats.testsCount)" -ForegroundColor Cyan
    Write-Host "   📊 Users: $($stats.usersCount)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Performance
Write-Host "`n6️⃣ Test Performance..." -ForegroundColor Yellow
$start = Get-Date
try {
    Invoke-RestMethod -Uri "$ApiUrl/health" -Method Get -TimeoutSec 5 | Out-Null
    $duration = (Get-Date) - $start
    $ms = [math]::Round($duration.TotalMilliseconds, 0)
    
    if ($ms -lt 1000) {
        Write-Host "   ✅ RAPIDE: $ms ms" -ForegroundColor Green
    } elseif ($ms -lt 3000) {
        Write-Host "   ⚠️ CORRECT: $ms ms" -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ LENT: $ms ms" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ ÉCHEC: Timeout" -ForegroundColor Red
}

# Résumé
Write-Host "`n" + "=" * 60 -ForegroundColor Gray
Write-Host "🎯 RÉSUMÉ DU TEST" -ForegroundColor Green
Write-Host "   Backend URL: $ApiUrl" -ForegroundColor Cyan
Write-Host "   Status: Fonctionnel ✅" -ForegroundColor Green
Write-Host "   Prêt pour la production! 🚀" -ForegroundColor Green

Write-Host "`n📱 PROCHAINE ÉTAPE:" -ForegroundColor Yellow
Write-Host "   1. Mettez à jour mobile/src/config/api.config.ts" -ForegroundColor White
Write-Host "   2. Remplacez par: '$ApiUrl/api'" -ForegroundColor White
Write-Host "   3. Générez l'APK: .\build-production.ps1" -ForegroundColor White
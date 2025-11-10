# Railway Health Check - Diagnostic Complet
# Identifie EXACTEMENT pourquoi Railway échoue

Write-Host "🔍 Railway Health Check - Diagnostic Avancé" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Blue

# Test 1: Vérifier que le serveur démarre correctement
Write-Host "`n1. Vérification du serveur local..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/" -TimeoutSec 5
    Write-Host "✅ Serveur local répond: '$response'" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur local inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Le backend n'est peut-être pas démarré ?" -ForegroundColor Yellow
    exit 1
}

# Test 2: Simuler exactement ce que Railway fait
Write-Host "`n2. Simulation Railway health check..." -ForegroundColor Yellow
try {
    $webClient = New-Object System.Net.WebClient
    $webClient.Headers.Add("User-Agent", "Railway-HealthCheck")
    $result = $webClient.DownloadString("http://localhost:3000/")
    Write-Host "✅ Railway simulation: '$result'" -ForegroundColor Green
    Write-Host "Longueur: $($result.Length) caractères" -ForegroundColor Gray
} catch {
    Write-Host "❌ Simulation Railway échoue: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Vérifier les headers exacts
Write-Host "`n3. Vérification headers HTTP..." -ForegroundColor Yellow
try {
    $request = [System.Net.WebRequest]::Create("http://localhost:3000/")
    $request.Method = "GET"
    $request.Timeout = 30000  # 30 secondes comme Railway
    
    $response = $request.GetResponse()
    Write-Host "✅ Status Code: $([int]$response.StatusCode)" -ForegroundColor Green
    Write-Host "Content-Type: $($response.ContentType)" -ForegroundColor Gray
    Write-Host "Content-Length: $($response.ContentLength)" -ForegroundColor Gray
    
    $stream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $content = $reader.ReadToEnd()
    Write-Host "Content: '$content'" -ForegroundColor Gray
    
    $response.Close()
} catch {
    Write-Host "❌ Headers test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Blue
Write-Host "📋 PROBLÈMES POSSIBLES RAILWAY:" -ForegroundColor Red
Write-Host ("=" * 60) -ForegroundColor Blue

Write-Host "`n🔧 Solution 1: Problème de Port" -ForegroundColor Cyan
Write-Host "Railway utilise peut-être un port différent" -ForegroundColor White
Write-Host "Action: Vérifier process.env.PORT dans les logs" -ForegroundColor Yellow

Write-Host "`n🔧 Solution 2: Timing du Health Check" -ForegroundColor Cyan
Write-Host "Railway teste trop tôt avant que le serveur soit prêt" -ForegroundColor White
Write-Host "Action: Ajouter délai ou endpoint de readiness" -ForegroundColor Yellow

Write-Host "`n🔧 Solution 3: Problème de Build" -ForegroundColor Cyan
Write-Host "Le serveur ne démarre pas du tout sur Railway" -ForegroundColor White
Write-Host "Action: Vérifier les logs de build Railway" -ForegroundColor Yellow

Write-Host "`n🔧 Solution 4: Base de Données Bloquante" -ForegroundColor Cyan
Write-Host "Prisma/DB empêche le serveur de démarrer" -ForegroundColor White
Write-Host "Action: Séparer totalement santé serveur et DB" -ForegroundColor Yellow

Write-Host "`n🔧 Solution 5: Configuration Railway UI" -ForegroundColor Cyan
Write-Host "Health check mal configuré dans l'interface" -ForegroundColor White
Write-Host "Action: Désactiver complètement via UI" -ForegroundColor Yellow

Write-Host "`n📊 ACTIONS RECOMMANDÉES:" -ForegroundColor Green
Write-Host "1. Désactiver health check dans Railway UI" -ForegroundColor White
Write-Host "2. Ajouter plus de logs de démarrage" -ForegroundColor White
Write-Host "3. Créer endpoint /ready séparé" -ForegroundColor White
Write-Host "4. Tester sans Prisma au démarrage" -ForegroundColor White
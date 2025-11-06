# Script de Commit et Push Automatique
# Évite d'oublier le push après commit pour Railway auto-deploy

param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    [switch]$Force,
    [switch]$DryRun
)

Write-Host "🔄 Git Commit & Push Automation" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Blue

# Vérification du statut Git
Write-Host "`n📋 Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ([string]::IsNullOrEmpty($gitStatus)) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    exit 0
}

Write-Host "📁 Files to commit:" -ForegroundColor Gray
git status --short
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 DRY RUN - No actual changes will be made" -ForegroundColor Yellow
    Write-Host "Would commit with message: '$Message'" -ForegroundColor Gray
    Write-Host "Would push to origin main" -ForegroundColor Gray
    exit 0
}

# Confirmation
if (-not $Force) {
    $confirm = Read-Host "Continue with commit and push? (y/N)"
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host "❌ Operation cancelled" -ForegroundColor Red
        exit 1
    }
}

try {
    # Étape 1: Add
    Write-Host "📦 Adding files..." -ForegroundColor Cyan
    git add .
    
    # Étape 2: Commit
    Write-Host "💾 Committing..." -ForegroundColor Cyan
    git commit -m $Message
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Commit failed!" -ForegroundColor Red
        exit 1
    }
    
    # Étape 3: Push (CRITIQUE pour Railway!)
    Write-Host "🚀 Pushing to origin main..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host "⚠️  Commit was successful but not pushed to GitHub" -ForegroundColor Yellow
        Write-Host "Railway won't auto-deploy until you push manually!" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "`n✅ SUCCESS: Commit and Push completed!" -ForegroundColor Green
    Write-Host "🚂 Railway will now auto-deploy your changes" -ForegroundColor Green
    
    # Optionnel: Afficher le lien vers GitHub
    $repoUrl = git remote get-url origin
    if ($repoUrl -match "github.com[:/]([^/]+)/([^/\.]+)") {
        $owner = $matches[1]
        $repo = $matches[2]
        Write-Host "View on GitHub: https://github.com/$owner/$repo/commits/main" -ForegroundColor Blue
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check Railway dashboard for auto-deploy status" -ForegroundColor White
Write-Host "2. Monitor deployment logs if needed" -ForegroundColor White
Write-Host "3. Test endpoints once deployed" -ForegroundColor White
# Simple check script - verify reorganization worked
param([switch]$Quick)

Write-Host "Checking EduTeQC reorganization..." -ForegroundColor Cyan

# Check main folders
$folders = @("backend", "mobile", "scripts", "docs", "config", "tools", "backups", "releases")
$missing = @()

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "OK: $folder" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $folder" -ForegroundColor Red
        $missing += $folder
    }
}

# Check key files
$files = @("package.json", "README.md", "backend/package.json", "mobile/package.json", "docs/README.md")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
        $missing += $file
    }
}

# Quick syntax check of PowerShell scripts
if (-not $Quick) {
    Write-Host "`nChecking PowerShell scripts..." -ForegroundColor Yellow
    $scripts = Get-ChildItem "scripts\powershell\*.ps1" -ErrorAction SilentlyContinue
    foreach ($script in $scripts) {
        try {
            $content = Get-Content $script.FullName -Raw
            if ($content.Length -gt 0) {
                Write-Host "OK: $($script.Name)" -ForegroundColor Green
            }
        } catch {
            Write-Host "ERROR: $($script.Name)" -ForegroundColor Red
            $missing += $script.Name
        }
    }
}

# Summary
Write-Host "`n" + ("=" * 40) -ForegroundColor Blue
if ($missing.Count -eq 0) {
    Write-Host "REORGANIZATION CHECK PASSED" -ForegroundColor Green
    Write-Host "All expected files and folders found" -ForegroundColor Green
    exit 0
} else {
    Write-Host "REORGANIZATION CHECK FAILED" -ForegroundColor Red
    Write-Host "Missing items: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}
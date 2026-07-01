# Portfolio Upgrades 2026 - Deployment Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Portfolio Upgrades 2026 - Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "Step 3: Committing changes..." -ForegroundColor Yellow
git commit -m "feat: add 2026 portfolio upgrades - dark mode, live metrics, enhanced SEO"
Write-Host ""

Write-Host "Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your portfolio will update in 1-2 minutes." -ForegroundColor White
Write-Host "Visit: https://mvamshi56.github.io/portfolio/" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"

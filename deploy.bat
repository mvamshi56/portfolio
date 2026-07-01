@echo off
echo ========================================
echo Portfolio Upgrades 2026 - Deployment
echo ========================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Committing changes...
git commit -m "feat: add 2026 portfolio upgrades - dark mode, live metrics, enhanced SEO"
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your portfolio will update in 1-2 minutes.
echo Visit: https://mvamshi56.github.io/portfolio/
echo.
pause

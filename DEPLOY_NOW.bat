@echo off
cd /d "%~dp0"

echo.
echo =========================================
echo  Portfolio Upgrades 2026 - DEPLOYING
echo =========================================
echo.

echo [1/4] Adding files...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed. Make sure Git is installed.
    pause
    exit /b 1
)
echo     Done!
echo.

echo [2/4] Committing changes...
git commit -m "feat: add 2026 portfolio upgrades - dark mode, live metrics, enhanced SEO, accessibility"
if %errorlevel% neq 0 (
    echo WARNING: Commit may have failed or no changes detected.
)
echo     Done!
echo.

echo [3/4] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Push failed. Check your credentials or network.
    pause
    exit /b 1
)
echo     Done!
echo.

echo [4/4] Deployment Complete!
echo.
echo =========================================
echo  SUCCESS! Your portfolio is deploying
echo =========================================
echo.
echo Your portfolio will be live in 1-2 minutes at:
echo https://mvamshi56.github.io/portfolio/
echo.
echo New Features Active:
echo  - Dark/Light Mode Toggle
echo  - Live GitHub Metrics
echo  - Enhanced SEO
echo  - Smooth Animations
echo  - Better Accessibility
echo.
pause

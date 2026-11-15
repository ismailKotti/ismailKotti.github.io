@echo off
echo ========================================================
echo   Ismail Kotti Portfolio - GitHub Deployment Helper
echo ========================================================
echo.
git branch -M main
git add .
git commit -m "update portfolio"
echo.
echo Connecting to GitHub repository...
git remote remove origin 2>nul
git remote add origin https://github.com/ismailKotti/ismailKotti.github.io.git
echo Pushing to GitHub main branch...
git push -u origin main
echo.
echo If push succeeded, your site will be live in 1-2 minutes at:
echo https://ismailkotti.github.io
echo.
pause

@echo off
setlocal
title MarocJobScope - Demarrage
echo ========================================
echo   MarocJobScope - Lancement du projet
echo ========================================

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] Node.js n'est pas installe sur cette machine.
    echo Rendez-vous sur https://nodejs.org pour l'installer (v18+).
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Installation de pnpm...
    call npm install -g pnpm
)

cd /d "%~dp0apps\web"

if not exist "node_modules" (
    echo [INFO] Installation des dependances...
    call pnpm install
)

start "" http://localhost:3000
echo [START] Lancement du serveur sur http://localhost:3000...
call pnpm dev
pause

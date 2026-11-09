<#
.SYNOPSIS
    Script de démarrage rapide pour MarocJobScope Web.
.DESCRIPTION
    Vérifie les prérequis (Node.js, pnpm), installe les dépendances si nécessaire,
    ouvre le navigateur et lance le serveur de développement.
#>

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MarocJobScope — Lancement du projet  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Vérification de Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERREUR] Node.js n'est pas installe sur cette machine." -ForegroundColor Red
    Write-Host "Veuillez installer Node.js (version 18 ou superieure) : https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node -v
Write-Host "[OK] Node.js detecte : $nodeVersion" -ForegroundColor Green

# 2. Vérification de pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "[INFO] pnpm n'est pas installe. Installation en cours..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERREUR] Echec de l'installation de pnpm." -ForegroundColor Red
        exit 1
    }
}

$pnpmVersion = pnpm -v
Write-Host "[OK] pnpm detecte : v$pnpmVersion" -ForegroundColor Green

# 3. Positionnement dans apps/web
$webDir = Join-Path $PSScriptRoot "apps\web"
if (-not (Test-Path $webDir)) {
    Write-Host "[ERREUR] Le dossier apps\web est introuvable." -ForegroundColor Red
    exit 1
}

Set-Location $webDir

# 4. Installation des dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installation des dependances (apps/web)..." -ForegroundColor Yellow
    pnpm install
} else {
    Write-Host "[OK] Dependances deja presentes." -ForegroundColor Green
}

# 5. Lancement du serveur et ouverture du navigateur
Write-Host "`n[START] Lancement du serveur de developpement sur http://localhost:3000..." -ForegroundColor Cyan

# Ouverture différée du navigateur (2s pour laisser Next.js initialiser)
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
} | Out-Null

pnpm dev

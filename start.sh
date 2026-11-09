#!/usr/bin/env bash
set -e

echo "========================================"
echo "  MarocJobScope — Lancement du projet"
echo "========================================"

# 1. Vérification de Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "[ERREUR] Node.js n'est pas installé. Rendez-vous sur https://nodejs.org (v18+)"
    exit 1
fi

echo "[OK] Node.js détecté : $(node -v)"

# 2. Vérification de pnpm
if ! command -v pnpm >/dev/null 2>&1; then
    echo "[INFO] Installation de pnpm..."
    npm install -g pnpm
fi

echo "[OK] pnpm détecté : $(pnpm -v)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/apps/web"

# 3. Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installation des dépendances..."
    pnpm install
else
    echo "[OK] Dépendances déjà présentes."
fi

# 4. Ouvrir le navigateur si disponible
if command -v xdg-open >/dev/null 2>&1; then
    (sleep 2 && xdg-open "http://localhost:3000") &
elif command -v open >/dev/null 2>&1; then
    (sleep 2 && open "http://localhost:3000") &
fi

echo "[START] Lancement du serveur sur http://localhost:3000..."
pnpm dev

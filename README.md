# MarocJobScope

Plateforme d'observation et d'analyse du marché de l'emploi au Maroc.

> ⚠️ **Bandeau Démo** : Cette interface fonctionne actuellement avec un jeu complet de **données de démonstration locales** (300 offres fictives, répartition géographique, indicateurs de tendances et compétences). Aucune base externe ou configuration `.env` requise pour visualiser le site.

---

## 🚀 Démarrage Rapide

### Sur Windows

- **Méthode 1 (Double-clic)** : Double-cliquez simplement sur `start.bat`.
- **Méthode 2 (PowerShell)** :
  ```powershell
  .\start.ps1
  ```

### Sur macOS / Linux / WSL

```bash
chmod +x start.sh
./start.sh
```

---

## 🛠️ Démarrage Manuel

1. Assurez-vous d'avoir **Node.js** (v18+) installé.
2. Installez `pnpm` si ce n'est pas fait :
   ```bash
   npm install -g pnpm
   ```
3. Rendez-vous dans le dossier web, installez et lancez :
   ```bash
   cd apps/web
   pnpm install
   pnpm dev
   ```
4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📄 Pages disponibles

- **Accueil & KPIs du marché** : `http://localhost:3000/`
- **Explorateur d'offres d'emploi** : `http://localhost:3000/offres`
- **Filtres (ex. Casablanca)** : `http://localhost:3000/offres?ville=Casablanca`
- **Fiche offre détaillée** : `http://localhost:3000/offres/demo-0001`

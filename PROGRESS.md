# MarocJobScope — PROGRESS

## Session: 2026-11-09

### État constaté
- Dépôt : 3 commits existants (phase 1a, phase 1b, export fixtures)
- `apps/web` : Next.js 14.2.35, données locales (demo-data.ts, 300 offres fictives)
- `apps/api` : **n'existe pas** — pas de backend FastAPI
- Pages : `/` (accueil), `/offres`, `/offres/[id]`, `not-found.tsx`
- Pas de page `/pipeline`

### Nettoyage effectué
- 3 processus node.exe du projet tués (PIDs 10280, 10144, 20280)
- Port 3000 libéré
- `.next` incomplet supprimé (BUILD_ID absent)
- `.run` supprimé

### Corrections
- `reveal.tsx` : vérifié — aucune prop en double, code propre (useReducedMotion → div, sinon motion.div)
- `.gitignore` : ajout de `.run/` et exception `!apps/**/lib/` (évite que `lib/` de Python n'ignore `apps/web/lib/`)

### Vérifications — tout vert ✅
| Commande | Résultat |
|---|---|
| `pnpm lint` | ✅ No ESLint warnings or errors |
| `pnpm exec tsc --noEmit` | ✅ Exit code 0, aucune erreur |
| `pnpm build` | ✅ Compiled successfully, 6 pages générées |

### Build de production — résultats
```
Route (app)                              Size     First Load JS
┌ ○ /                                    112 kB          245 kB
├ ○ /_not-found                          139 B          87.7 kB
├ ○ /icon.svg                            0 B                0 B
├ ○ /offres                              11.2 kB         143 kB
└ ƒ /offres/[id]                         179 B          96.4 kB
+ First Load JS shared by all            87.5 kB
```

### Tests HTTP (mode dev, timeout 90 s)

| Route | Code | Temps | Note |
|---|---|---|---|
| `/` | 200 | 20 433 ms | Cold compilation |
| `/offres` | 200 | 20 446 ms | Cold compilation |
| `/offres?ville=Casablanca` | 200 | 1 082 ms | Route déjà compilée |
| `/offres/demo-0001` | 200 | 2 696 ms | Cold compilation [id] |
| `/offres/nonexistent-id-xyz` | 404 | 257 ms | 404 propre ✅ |
| `/` (warm) | 200 | 598 ms | ✅ |
| `/offres` (warm) | 200 | 419 ms | ✅ |

### Diagnostic : lenteur /offres (~20 s)
**Cause** : compilation à froid en mode dev (Next.js compile la route au premier accès). Les requêtes suivantes sont rapides (<600 ms). **Pas de boucle de rendu ni de bug**.

### Ce qui n'est pas fait
- `apps/api` : n'existe pas, aucun backend FastAPI
- Page `/pipeline` : n'existe pas
- Aucun scraping lancé (interdit par les règles)

### Dépôt distant (GitHub)
- Remote configuré : `https://github.com/achmaouiayoub120-beep/MarocJobScope.git`
- Branche `main` synchronisée et poussée avec succès (`origin/main`).

### Commande pour relancer le site
```powershell
cd C:\Users\ayoub\Downloads\gestion_agile-main\apps\web
pnpm dev
# → http://localhost:3000
```

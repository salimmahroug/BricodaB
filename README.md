# Brico Dab Zarzis — boutique en ligne

Site e-commerce de **Brico Dab Zarzis** (quincaillerie, outillage, matériaux de construction), aux couleurs de Brico Dab (jaune / noir / anthracite).

## Stack technique

- **`web/`** — le site et le tableau de bord admin, en **Next.js** (React, App Router).
- **`server/`** — l'API, en **Node.js** + **Express**.
- **Base de données SQLite** (fichier local, créée et remplie automatiquement au premier démarrage) : comptes clients, catalogue, commandes.

Le site (port 3000) et l'API (port 4000) tournent comme deux processus séparés ; Next.js relaie les appels `/api/*` vers l'API Express (voir `web/next.config.js`), donc le navigateur ne voit qu'une seule adresse et les cookies de connexion fonctionnent normalement.

## Fonctionnalités

- Accueil, boutique, catégories, recherche, filtres, fiche produit, panier, favoris
- **Comptes clients** : inscription, connexion, page « Mon compte » avec historique des commandes
- Commande avec paiement à la livraison, envoyée sur WhatsApp au **26 118 124**, et enregistrée dans la base de données
- **Tableau de bord admin** (`/admin`) : statistiques, gestion des produits (CRUD), des catégories, des commandes (changement de statut) et des clients
- Pages Contact (carte Google Maps), À propos / FAQ
- 100 % responsive

## Démarrer le projet

Nécessite [Node.js](https://nodejs.org/) (v18 ou plus récent).

```bash
npm run install:all   # installe les dépendances de web/ et server/
npm run dev           # démarre l'API (port 4000) et le site (port 3000) ensemble
```

Puis ouvrez :
- **Site** : http://localhost:3000
- **Admin** : http://localhost:3000/admin

Au tout premier démarrage, l'API :
1. Crée automatiquement la base de données SQLite (`server/data/bricodab.db`) et y importe le catalogue de départ (52 produits, 12 catégories).
2. Crée un compte administrateur :
   - **E-mail** : `admin@bricodab.tn`
   - **Mot de passe** : `admin123`

   ⚠️ **Changez ce mot de passe dès la première connexion** (ou définissez `ADMIN_EMAIL` / `ADMIN_PASSWORD` en variables d'environnement avant le tout premier démarrage pour choisir vos propres identifiants).

### Lancer chaque partie séparément

```bash
npm run dev --prefix server   # API seule, http://localhost:4000
npm run dev --prefix web      # Site seul, http://localhost:3000 (proxifie vers l'API ci-dessus)
```

### Construire pour la production

```bash
npm run build --prefix web    # build Next.js optimisé
npm run start --prefix server # API
npm run start --prefix web    # site (après le build)
```

Ou, depuis la racine : `npm run build` puis `npm start` (démarre l'API et le site construits, ensemble).

### Variables d'environnement (facultatif)

| Variable | Où | Rôle | Par défaut |
|---|---|---|---|
| `PORT` | `server/` | Port de l'API | `4000` |
| `JWT_SECRET` | `server/` | Clé de signature des sessions — **à définir en production** | valeur de développement |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `server/` | Identifiants du compte admin créé au premier démarrage | `admin@bricodab.tn` / `admin123` |
| `WEB_ORIGIN` | `server/` | Origine autorisée en CORS (accès direct à l'API hors proxy) | `http://localhost:3000` |
| `API_ORIGIN` | `web/` | Adresse de l'API que Next.js doit proxifier | `http://localhost:4000` |

## Modifier le contenu

Tout se gère depuis le tableau de bord `/admin` : produits, catégories, commandes, clients. Aucun fichier à éditer à la main pour le catalogue.

Les photos se placent dans `web/public/assets/img/` puis se référencent via le champ « Image » du formulaire produit (ex. `assets/img/mon-produit.jpg`). Sans photo, une illustration est générée automatiquement.

## Structure du projet

```
server/                      → API Express + base de données SQLite
  ├─ index.js                 → point d'entrée, montage des routes
  ├─ db.js                    → schéma + amorçage de la base
  ├─ auth-utils.js            → sessions (JWT en cookie httpOnly)
  ├─ routes/                  → auth, produits, catégories, commandes, admin
  └─ data/                    → base de données (créée automatiquement, ignorée par git)

web/                          → site + admin, Next.js (App Router)
  ├─ app/(site)/               → pages publiques (accueil, boutique, panier, compte…)
  ├─ app/(admin)/admin/        → tableau de bord admin (sa propre mise en page)
  ├─ components/               → composants partagés (Header, ProductCard, StoreContext…)
  ├─ components/admin/         → composants du tableau de bord
  ├─ lib/                      → utilitaires (API, formats, stockage local)
  └─ public/assets/img/        → images du site
```

# Brico Dab Zarzis — boutique en ligne

Site e-commerce de **Brico Dab Zarzis** (quincaillerie, outillage, matériaux de construction), inspiré de la mise en page de bricola.tn, aux couleurs de Brico Dab (jaune / noir / anthracite).

Le projet fonctionne dans **deux modes** :

- **Mode statique** (sans rien installer) : le site s'ouvre tel quel, le catalogue vient du fichier `assets/js/data.js`, le panier/favoris sont sauvegardés dans le navigateur. Pas de comptes clients, pas de tableau de bord.
- **Mode complet** (avec le serveur Node fourni) : vrais comptes clients (inscription/connexion), commandes enregistrées dans une base de données, et un **tableau de bord admin** pour gérer produits, catégories, commandes et clients. Le site bascule **automatiquement** en mode complet dès que le serveur tourne — aucune modification à faire.

## Fonctionnalités du site

- Accueil : slider, catégories, bannières promo, onglets Promotions / Meilleures ventes / Nouveautés, marques, magasin
- Pages catégorie et boutique avec filtres (marque, prix) et tri, recherche avec suggestions
- Fiche produit, panier, favoris, commande avec paiement à la livraison (envoyée sur WhatsApp au **26 118 124**)
- **Comptes clients** : inscription, connexion, page « Mon compte » avec historique des commandes
- Pages Contact (carte Google Maps), À propos / FAQ
- Animations (apparition au défilement, scène 3D légère), 100 % responsive

## Tableau de bord admin

Accessible sur `/admin` une fois le serveur démarré :
- **Tableau de bord** : chiffre d'affaires, nombre de commandes, clients, alertes de stock faible
- **Produits** : ajouter / modifier / supprimer, prix, promo, stock, images, description
- **Commandes** : liste complète, changement de statut (en attente / confirmée / livrée / annulée)
- **Clients** : liste des comptes inscrits
- **Catégories** : ajouter / modifier / supprimer

## Démarrer le mode complet (site + API + base de données + admin)

Nécessite [Node.js](https://nodejs.org/) (v18 ou plus récent).

```bash
npm install
npm start
```

Puis ouvrez :
- **Site** : http://localhost:3000
- **Admin** : http://localhost:3000/admin

Au tout premier démarrage, le serveur :
1. Crée automatiquement la base de données SQLite (`server/data/bricodab.db`) et y importe le catalogue de départ (52 produits, 12 catégories).
2. Crée un compte administrateur :
   - **E-mail** : `admin@bricodab.tn`
   - **Mot de passe** : `admin123`

   ⚠️ **Changez ce mot de passe dès la première connexion** (ou définissez `ADMIN_EMAIL` / `ADMIN_PASSWORD` en variables d'environnement avant le tout premier démarrage pour choisir vos propres identifiants).

### Variables d'environnement (facultatif)

| Variable | Rôle | Par défaut |
|---|---|---|
| `PORT` | Port du serveur | `3000` |
| `JWT_SECRET` | Clé de signature des sessions — **à définir en production** | valeur de développement |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Identifiants du compte admin créé au premier démarrage | `admin@bricodab.tn` / `admin123` |

## Mode statique seul (sans serveur)

Aucun build nécessaire :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Hébergeable tel quel sur GitHub Pages, Netlify, Vercel ou n'importe quel hébergeur statique — mais sans comptes clients ni tableau de bord admin (ceux-ci nécessitent le serveur Node).

## Modifier le contenu

- **Avec le serveur** : gérez produits et catégories directement depuis `/admin`.
- **Sans serveur (mode statique)** : modifiez `assets/js/data.js` — `STORE` (téléphone, adresse, horaires…), `CATEGORIES`, `PRODUCTS`.

Les photos se placent dans `assets/img/` puis se référencent via le champ image du produit (`img` dans data.js, ou le champ « Image » dans le formulaire admin). Sans photo, une illustration est générée automatiquement.

> ⚠️ Les prix et une partie des produits du catalogue de départ sont des exemples : remplacez-les par vos vrais tarifs (depuis l'admin ou dans `data.js`).

## Structure du projet

```
index.html, assets/          → site public (fonctionne seul, en statique)
admin/                       → tableau de bord admin (nécessite le serveur)
server/                      → serveur Node/Express, API, base SQLite
  ├─ db.js                   → schéma + amorçage de la base
  ├─ auth-utils.js           → sessions (JWT en cookie httpOnly)
  ├─ routes/                 → auth, produits, catégories, commandes, admin
  └─ data/                   → base de données (créée automatiquement, ignorée par git)
```

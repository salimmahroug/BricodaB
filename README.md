# Brico Dab Zarzis — boutique en ligne

Site e-commerce de **Brico Dab Zarzis** (quincaillerie, outillage, matériaux de construction), inspiré de la mise en page de bricola.tn, aux couleurs de Brico Dab (jaune / noir / anthracite).

## Fonctionnalités
- Accueil : slider, catégories, bannières promo, onglets Promotions / Meilleures ventes / Nouveautés, marques, magasin
- Pages catégorie et boutique avec filtres (marque, prix) et tri
- Recherche avec suggestions instantanées
- Fiche produit (quantité, favoris, caractéristiques, commander sur WhatsApp)
- Panier (mini-panier + page panier), favoris — sauvegardés dans le navigateur
- Commande avec paiement à la livraison : la commande est envoyée sur WhatsApp au **26 118 124**
- Pages Contact (carte Google Maps) et À propos / FAQ
- Responsive (mobile, tablette, ordinateur)

## Lancer le site
Aucun build nécessaire (HTML / CSS / JavaScript) :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Hébergeable tel quel sur GitHub Pages, Netlify, Vercel ou n'importe quel hébergeur.

## Modifier le contenu
Tout le catalogue est dans `assets/js/data.js` :
- `STORE` : téléphone, adresse, horaires, frais de livraison
- `CATEGORIES` : catégories
- `PRODUCTS` : produits (nom, prix, ancien prix, marque, photo `img`, tags `new` / `best` / `promo`)

Les photos se placent dans `assets/img/` puis se référencent via le champ `img` d'un produit.
Sans photo, une illustration est générée automatiquement.

> ⚠️ Les prix et une partie des produits sont des exemples : remplacez-les par vos vrais tarifs.

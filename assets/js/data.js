/* =========================================================
   Brico Dab Zarzis — données boutique
   Modifiez ce fichier pour mettre à jour le catalogue.
   Prix en dinars tunisiens (DT). Les prix ci-dessous sont
   des exemples : remplacez-les par vos vrais tarifs.
   ========================================================= */
window.STORE = {
  name: "Brico Dab",
  city: "Zarzis",
  slogan: "Tout pour vos projets !",
  sloganAr: "كل ما يلزمك للبناء ... تلقاه عنا !",
  phone: "26 118 124",
  phoneIntl: "21626118124",
  email: "contact@bricodab.tn",
  address: "Zarzis, Médenine — Tunisie",
  hours: "Lun – Sam : 8h00 – 19h00 · Dim : 8h00 – 13h00",
  facebook: "https://www.facebook.com/search/top?q=Brico%20Dab%20Zarzis",
  freeShippingFrom: 300,
  shippingFee: 8,
  mapQuery: "Zarzis, Tunisie"
};

window.CATEGORIES = [
  { slug: "outillage-electroportatif", name: "Outillage électroportatif", icon: "drill", desc: "Perceuses, meuleuses, visseuses, scies… les meilleures marques au meilleur prix." },
  { slug: "outillage-a-main", name: "Outillage à main", icon: "hammer", desc: "Marteaux, tournevis, clés, pinces et coffrets pour tous vos travaux." },
  { slug: "quincaillerie", name: "Quincaillerie", icon: "bolt", desc: "Visserie, chevilles, serrures, charnières et accessoires de quincaillerie." },
  { slug: "plomberie-sanitaire", name: "Plomberie & Sanitaire", icon: "faucet", desc: "Robinetterie, raccords, tuyaux et accessoires sanitaires." },
  { slug: "electricite-eclairage", name: "Électricité & Éclairage", icon: "bulb", desc: "Câbles, prises, interrupteurs, projecteurs et ampoules LED." },
  { slug: "peinture-droguerie", name: "Peinture & Droguerie", icon: "roller", desc: "Peintures, rouleaux, pinceaux, silicones et produits d'entretien." },
  { slug: "materiaux-construction", name: "Matériaux de construction", icon: "brick", desc: "Ciment colle Deutsch Color, joints, enduits et produits pour le bâtiment." },
  { slug: "abrasifs-disques", name: "Abrasifs & Disques", icon: "disc", desc: "Disques à tronçonner, à meuler, rouleaux abrasifs Abrapro et papier de verre." },
  { slug: "jardinage", name: "Jardinage", icon: "leaf", desc: "Tuyaux d'arrosage, outils de jardin, sécateurs et accessoires." },
  { slug: "securite-epi", name: "Sécurité & EPI", icon: "helmet", desc: "Gants, lunettes, casques, chaussures et protections de chantier." },
  { slug: "isolation-etancheite", name: "Isolation & Étanchéité", icon: "shield", desc: "Boudins bas de porte, joints, mousses PU et produits d'étanchéité." },
  { slug: "rangement-echelles", name: "Échelles & Rangement", icon: "ladder", desc: "Échelles, escabeaux, boîtes à outils et servantes d'atelier." }
];

window.BRANDS = ["Deutsch Color", "Makita", "Ingco", "Total", "Bosch", "Abrapro", "Stanley", "Tolsen", "Sika", "Astral", "Sopal", "Brico Dab"];

/* img : chemin d'une vraie photo (optionnel). Sinon une illustration est générée. */
window.PRODUCTS = [
  // --- Matériaux de construction
  { id: 101, name: "Ciment Colle Deutsch Color FM 1000 – Blanc 25 kg", cat: "materiaux-construction", brand: "Deutsch Color", price: 32.000, old: 36.000, img: "assets/img/promo-ciment-colle.jpg", tags: ["best", "promo"], rating: 5, reviews: 18,
    short: "Ciment colle blanc de qualité allemande pour carrelage et faïence, intérieur et extérieur.",
    feats: ["Qualité allemande garantie", "Adapté aux travaux de carrelage", "Forte adhérence", "Sac de 25 kg"],
    specs: { "Poids": "25 kg", "Couleur": "Blanc", "Usage": "Intérieur / extérieur", "Origine": "Allemagne" } },
  { id: 102, name: "Ciment Colle Deutsch Color FM 2200 – Flexible 25 kg", cat: "materiaux-construction", brand: "Deutsch Color", price: 38.500, img: "assets/img/promo-ciment-colle.jpg", tags: ["best", "new"], rating: 5, reviews: 11,
    short: "Mortier colle flexible haute performance pour grands formats et sols chauffants.",
    feats: ["Flexible (déformable)", "Grands formats", "Forte adhérence", "Sac de 25 kg"],
    specs: { "Poids": "25 kg", "Couleur": "Gris", "Classe": "C2TE", "Origine": "Allemagne" } },
  { id: 103, name: "Ciment Colle Deutsch Color FM 3000 – Haute performance 25 kg", cat: "materiaux-construction", brand: "Deutsch Color", price: 44.000, img: "assets/img/promo-ciment-colle.jpg", tags: ["new"], rating: 5, reviews: 7,
    short: "Colle carrelage haut de gamme pour piscine, façade et pierre naturelle.",
    feats: ["Idéal façade & piscine", "Très haute adhérence", "Temps ouvert allongé", "Sac de 25 kg"],
    specs: { "Poids": "25 kg", "Classe": "C2TE S1", "Usage": "Intérieur / extérieur", "Origine": "Allemagne" } },
  { id: 104, name: "Joint carrelage Deutsch Color – 5 kg (plusieurs coloris)", cat: "materiaux-construction", brand: "Deutsch Color", price: 18.900, tags: [], rating: 4, reviews: 5,
    short: "Mortier de jointoiement hydrofuge pour joints de 1 à 8 mm.",
    feats: ["Hydrofuge", "Anti-moisissures", "Couleurs durables"], specs: { "Poids": "5 kg", "Largeur de joint": "1 – 8 mm" } },
  { id: 105, name: "Enduit de lissage prêt à l'emploi 20 kg", cat: "materiaux-construction", brand: "Deutsch Color", price: 42.000, old: 47.000, tags: ["promo"], rating: 4, reviews: 9,
    short: "Enduit fin pour murs et plafonds, finition parfaitement lisse.", feats: ["Prêt à l'emploi", "Ponçage facile", "Intérieur"], specs: { "Poids": "20 kg" } },

  // --- Isolation
  { id: 201, name: "Boudin bas de porte double – Stop courants d'air", cat: "isolation-etancheite", brand: "Brico Dab", price: 14.900, old: 19.900, img: "assets/img/promo-boudin.jpg", tags: ["best", "promo", "new"], rating: 5, reviews: 32,
    short: "Vente flash ! Stop aux courants d'air, à la poussière et aux nuisibles. Installé en 30 secondes.",
    feats: ["Stop nuisibles", "Stop poussière", "Stop courants d'air", "Installation en 30 sec", "Ajustable à toutes les portes"],
    specs: { "Longueur": "95 cm (recoupable)", "Matière": "Mousse + tissu", "Coloris": "Marron", "Fabricant": "Brico Dab Zarzis" } },
  { id: 202, name: "Mousse polyuréthane expansive 750 ml", cat: "isolation-etancheite", brand: "Sika", price: 17.500, tags: [], rating: 4, reviews: 6,
    short: "Mousse PU pour calfeutrer, isoler et fixer les huisseries.", feats: ["Isolation thermique & phonique", "Expansion rapide"], specs: { "Volume": "750 ml" } },
  { id: 203, name: "Mastic silicone sanitaire blanc 280 ml", cat: "isolation-etancheite", brand: "Sika", price: 9.800, tags: ["best"], rating: 5, reviews: 21,
    short: "Silicone anti-moisissure pour salle de bain et cuisine.", feats: ["Anti-moisissure", "Élastique", "Blanc brillant"], specs: { "Volume": "280 ml" } },
  { id: 204, name: "Joint mousse adhésif pour fenêtre 6 m", cat: "isolation-etancheite", brand: "Brico Dab", price: 6.500, tags: [], rating: 4, reviews: 4,
    short: "Joint d'isolation auto-adhésif pour portes et fenêtres.", feats: ["Auto-adhésif", "Coupe facile"], specs: { "Longueur": "6 m" } },

  // --- Électroportatif
  { id: 301, name: "Perceuse à percussion Makita HP1630 – 710 W", cat: "outillage-electroportatif", brand: "Makita", price: 289.000, old: 319.000, tags: ["best", "promo"], rating: 5, reviews: 14,
    short: "Perceuse à percussion robuste pour béton, bois et métal.", feats: ["710 W", "Mandrin 13 mm", "Variateur de vitesse", "Inversion du sens de rotation"],
    specs: { "Puissance": "710 W", "Mandrin": "13 mm", "Poids": "1,9 kg", "Garantie": "1 an" } },
  { id: 302, name: "Meuleuse d'angle Makita GA5030 – 125 mm 720 W", cat: "outillage-electroportatif", brand: "Makita", price: 249.000, tags: ["best"], rating: 5, reviews: 19,
    short: "Meuleuse compacte et puissante pour meulage et tronçonnage.", feats: ["720 W", "Disque 125 mm", "Poignée latérale"], specs: { "Puissance": "720 W", "Disque": "125 mm", "Garantie": "1 an" } },
  { id: 303, name: "Visseuse perceuse sans fil Ingco 20 V + 2 batteries", cat: "outillage-electroportatif", brand: "Ingco", price: 219.000, old: 259.000, tags: ["promo", "new"], rating: 4, reviews: 12,
    short: "Kit visseuse sans fil 20 V livrée avec 2 batteries, chargeur et coffret.", feats: ["20 V Lithium-ion", "2 batteries 2,0 Ah", "Couple 45 Nm", "Coffret de transport"], specs: { "Tension": "20 V", "Batteries": "2 × 2,0 Ah", "Garantie": "1 an" } },
  { id: 304, name: "Scie sauteuse Ingco 650 W", cat: "outillage-electroportatif", brand: "Ingco", price: 129.000, tags: [], rating: 4, reviews: 5,
    short: "Scie sauteuse pour coupes droites et courbes dans le bois et le métal.", feats: ["650 W", "Mouvement pendulaire", "Coupe inclinée 45°"], specs: { "Puissance": "650 W" } },
  { id: 305, name: "Marteau perforateur SDS+ Total 800 W", cat: "outillage-electroportatif", brand: "Total", price: 239.000, old: 269.000, tags: ["promo"], rating: 4, reviews: 8,
    short: "Perforateur-burineur 3 fonctions pour gros travaux.", feats: ["800 W", "SDS-Plus", "3 fonctions", "Coffret + forets"], specs: { "Puissance": "800 W", "Énergie de frappe": "2,8 J" } },
  { id: 306, name: "Pistolet à colle chaude Ingco 100 W", cat: "outillage-electroportatif", brand: "Ingco", price: 34.000, tags: ["new"], rating: 4, reviews: 3,
    short: "Pistolet à colle pour bricolage et loisirs créatifs.", feats: ["100 W", "Bâtons 11 mm"], specs: { "Puissance": "100 W" } },
  { id: 307, name: "Ponceuse orbitale Bosch PEX 220 A", cat: "outillage-electroportatif", brand: "Bosch", price: 279.000, tags: [], rating: 5, reviews: 6,
    short: "Ponceuse excentrique avec système d'aspiration intégré.", feats: ["220 W", "Plateau 125 mm", "Aspiration intégrée"], specs: { "Puissance": "220 W" } },

  // --- Outillage à main
  { id: 401, name: "Coffret d'outils Ingco 142 pièces", cat: "outillage-a-main", brand: "Ingco", price: 169.000, old: 199.000, tags: ["best", "promo"], rating: 5, reviews: 16,
    short: "Coffret complet : douilles, clés, tournevis, pinces et embouts.", feats: ["142 pièces", "Acier chrome-vanadium", "Mallette rigide"], specs: { "Nombre de pièces": "142" } },
  { id: 402, name: "Marteau de coffreur Stanley 600 g", cat: "outillage-a-main", brand: "Stanley", price: 29.500, tags: [], rating: 5, reviews: 7,
    short: "Marteau robuste avec manche antivibration.", feats: ["Tête 600 g", "Manche fibre"], specs: { "Poids": "600 g" } },
  { id: 403, name: "Jeu de tournevis Total 6 pièces", cat: "outillage-a-main", brand: "Total", price: 19.900, tags: ["best"], rating: 4, reviews: 13,
    short: "Tournevis plats et cruciformes avec pointe aimantée.", feats: ["6 pièces", "Pointe aimantée", "Poignée bi-matière"], specs: {} },
  { id: 404, name: "Mètre ruban Stanley 5 m", cat: "outillage-a-main", brand: "Stanley", price: 16.500, tags: [], rating: 5, reviews: 22,
    short: "Mètre ruban avec boîtier antichoc et blocage.", feats: ["5 m × 19 mm", "Boîtier antichoc"], specs: { "Longueur": "5 m" } },
  { id: 405, name: "Pince universelle Tolsen 200 mm", cat: "outillage-a-main", brand: "Tolsen", price: 15.800, tags: ["new"], rating: 4, reviews: 4,
    short: "Pince universelle isolée pour électriciens.", feats: ["200 mm", "Isolée"], specs: {} },
  { id: 406, name: "Niveau à bulle aluminium Ingco 60 cm", cat: "outillage-a-main", brand: "Ingco", price: 22.000, tags: [], rating: 4, reviews: 6,
    short: "Niveau 3 fioles en aluminium pour maçonnerie.", feats: ["60 cm", "3 fioles"], specs: {} },
  { id: 407, name: "Taloche crantée inox 280 mm", cat: "outillage-a-main", brand: "Brico Dab", price: 12.500, tags: [], rating: 4, reviews: 8,
    short: "Spatule crantée pour application du ciment colle.", feats: ["Inox", "Dents 8 × 8 mm"], specs: {} },

  // --- Quincaillerie
  { id: 501, name: "Boîte de vis à bois agglo 500 pcs", cat: "quincaillerie", brand: "Brico Dab", price: 18.000, tags: ["best"], rating: 4, reviews: 10,
    short: "Assortiment de vis tête fraisée cruciforme, tailles variées.", feats: ["500 pièces", "Acier zingué"], specs: {} },
  { id: 502, name: "Chevilles nylon Ø 8 mm – sachet de 100", cat: "quincaillerie", brand: "Brico Dab", price: 6.000, tags: [], rating: 4, reviews: 6,
    short: "Chevilles universelles pour béton et brique.", feats: ["Ø 8 mm", "100 pièces"], specs: {} },
  { id: 503, name: "Cylindre de serrure 70 mm + 5 clés", cat: "quincaillerie", brand: "Tolsen", price: 27.000, tags: ["new"], rating: 4, reviews: 3,
    short: "Cylindre laiton sécurisé pour porte d'entrée.", feats: ["70 mm", "5 clés"], specs: {} },
  { id: 504, name: "Cadenas laiton 50 mm", cat: "quincaillerie", brand: "Total", price: 14.500, tags: [], rating: 4, reviews: 5,
    short: "Cadenas robuste anse acier trempé.", feats: ["50 mm", "3 clés"], specs: {} },
  { id: 505, name: "Charnière inox 100 mm – lot de 2", cat: "quincaillerie", brand: "Brico Dab", price: 8.500, tags: [], rating: 4, reviews: 2,
    short: "Charnières pour portes intérieures.", feats: ["Inox", "100 mm"], specs: {} },

  // --- Plomberie
  { id: 601, name: "Mitigeur lavabo chromé Sopal", cat: "plomberie-sanitaire", brand: "Sopal", price: 119.000, old: 135.000, tags: ["promo"], rating: 5, reviews: 9,
    short: "Mitigeur monocommande avec cartouche céramique.", feats: ["Cartouche céramique", "Chromé", "Flexibles inclus"], specs: {} },
  { id: 602, name: "Flexible de douche inox 1,5 m", cat: "plomberie-sanitaire", brand: "Sopal", price: 15.000, tags: [], rating: 4, reviews: 7,
    short: "Flexible anti-torsion universel.", feats: ["1,5 m", "Inox"], specs: {} },
  { id: 603, name: "Ruban téflon – lot de 10", cat: "plomberie-sanitaire", brand: "Brico Dab", price: 5.000, tags: ["best"], rating: 5, reviews: 14,
    short: "Ruban d'étanchéité PTFE pour raccords filetés.", feats: ["10 rouleaux"], specs: {} },
  { id: 604, name: "Robinet d'arrêt 1/2\" laiton", cat: "plomberie-sanitaire", brand: "Sopal", price: 12.000, tags: [], rating: 4, reviews: 4,
    short: "Vanne quart de tour en laiton.", feats: ["1/2 pouce", "Laiton"], specs: {} },

  // --- Électricité
  { id: 701, name: "Projecteur LED 50 W étanche IP65", cat: "electricite-eclairage", brand: "Ingco", price: 39.000, old: 45.000, tags: ["promo", "best"], rating: 5, reviews: 11,
    short: "Projecteur extérieur lumière blanche haute luminosité.", feats: ["50 W", "IP65", "6500 K"], specs: { "Puissance": "50 W", "Indice": "IP65" } },
  { id: 702, name: "Ampoule LED E27 12 W – lot de 4", cat: "electricite-eclairage", brand: "Brico Dab", price: 14.000, tags: [], rating: 4, reviews: 15,
    short: "Ampoules LED basse consommation.", feats: ["12 W = 100 W", "Lumière blanche"], specs: {} },
  { id: 703, name: "Rallonge multiprise 4 prises 3 m", cat: "electricite-eclairage", brand: "Total", price: 24.500, tags: ["new"], rating: 4, reviews: 6,
    short: "Multiprise avec interrupteur et protection enfant.", feats: ["4 prises", "3 m", "Interrupteur"], specs: {} },
  { id: 704, name: "Câble électrique 2,5 mm² – rouleau 100 m", cat: "electricite-eclairage", brand: "Brico Dab", price: 119.000, tags: [], rating: 4, reviews: 3,
    short: "Fil rigide cuivre pour installations domestiques.", feats: ["Cuivre", "100 m"], specs: {} },
  { id: 705, name: "Testeur de tension / multimètre digital Ingco", cat: "electricite-eclairage", brand: "Ingco", price: 36.000, tags: [], rating: 4, reviews: 5,
    short: "Multimètre numérique pour mesures AC/DC.", feats: ["Écran LCD", "Mesure AC/DC"], specs: {} },

  // --- Peinture
  { id: 801, name: "Peinture acrylique blanche mate 25 kg", cat: "peinture-droguerie", brand: "Astral", price: 89.000, old: 99.000, tags: ["promo", "best"], rating: 5, reviews: 12,
    short: "Peinture intérieure lessivable à fort pouvoir couvrant.", feats: ["Mate", "Lessivable", "Intérieur"], specs: { "Poids": "25 kg" } },
  { id: 802, name: "Rouleau peinture 23 cm + bac", cat: "peinture-droguerie", brand: "Brico Dab", price: 16.000, tags: [], rating: 4, reviews: 9,
    short: "Kit rouleau anti-goutte avec bac.", feats: ["23 cm", "Bac inclus"], specs: {} },
  { id: 803, name: "Lot de 3 pinceaux plats", cat: "peinture-droguerie", brand: "Tolsen", price: 9.500, tags: [], rating: 4, reviews: 5,
    short: "Pinceaux 25 / 50 / 75 mm.", feats: ["3 tailles"], specs: {} },
  { id: 804, name: "Ruban de masquage 48 mm × 50 m", cat: "peinture-droguerie", brand: "Brico Dab", price: 4.800, tags: ["new"], rating: 4, reviews: 3,
    short: "Adhésif de masquage pour peinture.", feats: ["48 mm", "50 m"], specs: {} },

  // --- Abrasifs
  { id: 901, name: "Rouleau abrasif Abrapro grain 120 – 50 m", cat: "abrasifs-disques", brand: "Abrapro", price: 49.000, tags: ["best"], rating: 5, reviews: 6,
    short: "Rouleau toile abrasive de qualité garantie pour ponçage.", feats: ["Grain 120", "50 m", "Toile souple"], specs: {} },
  { id: 902, name: "Disque à tronçonner métal 125 mm – lot de 10", cat: "abrasifs-disques", brand: "Makita", price: 22.000, old: 25.000, tags: ["promo"], rating: 5, reviews: 10,
    short: "Disques fins pour une coupe rapide du métal.", feats: ["125 × 1 mm", "10 pièces"], specs: {} },
  { id: 903, name: "Disque diamant carrelage 230 mm", cat: "abrasifs-disques", brand: "Ingco", price: 29.000, tags: [], rating: 4, reviews: 7,
    short: "Disque diamant jante continue pour carrelage et céramique.", feats: ["230 mm", "Jante continue"], specs: {} },

  // --- Jardinage
  { id: 1001, name: "Tuyau d'arrosage 25 m + pistolet", cat: "jardinage", brand: "Total", price: 45.000, tags: ["new"], rating: 4, reviews: 5,
    short: "Kit arrosage avec raccords et pistolet multi-jets.", feats: ["25 m", "Pistolet 7 jets"], specs: {} },
  { id: 1002, name: "Sécateur de jardin Ingco", cat: "jardinage", brand: "Ingco", price: 18.000, tags: [], rating: 4, reviews: 4,
    short: "Sécateur à lames acier pour taille des branches.", feats: ["Lame acier SK5"], specs: {} },
  { id: 1003, name: "Brouette de chantier 90 L", cat: "jardinage", brand: "Brico Dab", price: 159.000, old: 175.000, tags: ["promo"], rating: 4, reviews: 3,
    short: "Brouette robuste roue gonflable.", feats: ["90 L", "Roue gonflable"], specs: {} },

  // --- Sécurité
  { id: 1101, name: "Gants de travail enduits – lot de 12 paires", cat: "securite-epi", brand: "Ingco", price: 24.000, tags: ["best"], rating: 5, reviews: 12,
    short: "Gants de manutention avec paume enduite antidérapante.", feats: ["12 paires", "Taille 10"], specs: {} },
  { id: 1102, name: "Lunettes de protection anti-rayures", cat: "securite-epi", brand: "Total", price: 7.500, tags: [], rating: 4, reviews: 6,
    short: "Lunettes de sécurité polycarbonate.", feats: ["Anti-rayures", "Anti-UV"], specs: {} },
  { id: 1103, name: "Casque de chantier jaune", cat: "securite-epi", brand: "Brico Dab", price: 12.000, tags: [], rating: 4, reviews: 4,
    short: "Casque de protection ventilé réglable.", feats: ["Ventilé", "Réglable"], specs: {} },

  // --- Échelles & rangement
  { id: 1201, name: "Escabeau aluminium 5 marches", cat: "rangement-echelles", brand: "Brico Dab", price: 139.000, old: 155.000, tags: ["promo"], rating: 5, reviews: 7,
    short: "Escabeau léger et stable avec plateau porte-outils.", feats: ["5 marches", "Aluminium", "Charge 150 kg"], specs: {} },
  { id: 1202, name: "Boîte à outils Tolsen 19\"", cat: "rangement-echelles", brand: "Tolsen", price: 35.000, tags: ["new"], rating: 4, reviews: 4,
    short: "Caisse à outils avec plateau amovible.", feats: ["19 pouces", "Plateau amovible"], specs: {} }
];

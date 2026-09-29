export const money = (n) =>
  Number(n).toFixed(3).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DT";

export const ref = (id) => "BD-" + String(id).padStart(5, "0");

export const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

export const norm = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const GOUVERNORATS = [
  "Médenine", "Tataouine", "Gabès", "Kébili", "Tozeur", "Gafsa", "Sfax", "Sidi Bouzid",
  "Kasserine", "Mahdia", "Monastir", "Sousse", "Kairouan", "Siliana", "Le Kef", "Jendouba",
  "Béja", "Bizerte", "Nabeul", "Zaghouan", "Ben Arous", "Tunis", "Ariana", "Manouba"
];

export const STORE = {
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

export const ORDER_STATUS = {
  en_attente: { label: "En attente", badge: "badge-out" },
  confirmee: { label: "Confirmée", badge: "badge-new" },
  livree: { label: "Livrée", badge: "" },
  annulee: { label: "Annulée", badge: "badge-sale" }
};

// Une image vient soit du dossier public du site ("assets/img/x.jpg"), soit
// d'un envoi depuis l'admin, stocké comme URL absolue de l'API
// ("https://mon-api.onrender.com/uploads/x.jpg"). On ne préfixe que la
// première forme.
export function resolveImg(src) {
  if (!src) return null;
  return /^https?:\/\//i.test(src) ? src : "/" + src.replace(/^\/+/, "");
}

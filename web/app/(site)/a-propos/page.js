import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { STORE } from "@/lib/format";

export const metadata = { title: "À propos | Brico Dab Zarzis" };

const FAQ = [
  { q: "Comment passer commande ?", a: "Ajoutez vos produits au panier, cliquez sur « Passer la commande », remplissez vos coordonnées puis confirmez. Votre commande nous est transmise par WhatsApp et nous vous rappelons pour la confirmer." },
  { q: "Quels sont les délais et frais de livraison ?", a: `Nous livrons partout en Tunisie en 24 à 72h. La livraison coûte ${STORE.shippingFee} DT et devient gratuite dès ${STORE.freeShippingFrom} DT d'achat.` },
  { q: "Comment payer ?", a: "Le paiement se fait en espèces à la livraison, ou directement au magasin si vous choisissez le retrait." },
  { q: "Puis-je retirer ma commande au magasin ?", a: "Oui, choisissez « Retrait au magasin » lors de la commande. C'est gratuit." },
  { q: "Puis-je échanger un produit ?", a: "Oui, sous 7 jours, si le produit n'a pas été utilisé et se trouve dans son emballage d'origine." }
];

export default function AboutPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "À propos" }]} />
      <div className="page-banner"><div><h1>À propos de <span>Brico Dab</span></h1><p>{STORE.slogan} — <span className="ar">{STORE.sloganAr}</span></p></div></div>
      <div className="info-grid">
        <div className="box">
          <h3>Votre quincaillerie à Zarzis</h3>
          <p>Brico Dab est une quincaillerie et un magasin de bricolage situé à Zarzis. Nous proposons un large choix de produits pour les professionnels du bâtiment comme pour les particuliers : outillage électroportatif et à main, quincaillerie, matériaux de construction, peinture, plomberie, électricité, jardinage et équipements de sécurité.</p>
          <p>Nous travaillons avec des marques reconnues comme <b>Deutsch Color</b>, <b>Makita</b>, <b>Ingco</b>, <b>Total</b> ou <b>Abrapro</b>, et fabriquons nos propres produits comme le <b>boudin bas de porte Brico Dab</b>.</p>
          <p>Avec notre boutique en ligne, commandez depuis chez vous et faites-vous livrer partout en Tunisie, avec paiement à la livraison.</p>
          <Link className="btn btn-yellow" href="/boutique">Découvrir la boutique</Link>
        </div>
        <img src="/assets/img/magasin.jpg" alt="Magasin Brico Dab" style={{ borderRadius: 10, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <section className="section faq">
        <div className="sec-head"><h2>Questions fréquentes</h2></div>
        {FAQ.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </section>
    </div>
  );
}

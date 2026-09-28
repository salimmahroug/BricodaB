"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductGrid from "@/components/ProductGrid";
import { STORE, money } from "@/lib/format";
import { useStore } from "@/components/StoreContext";

const SLIDES = [
  { cls: "", kicker: "Qualité allemande", title: <>Ciment colle <span>Deutsch Color</span></>, text: "FM 1000 · FM 2200 · FM 3000 — la qualité allemande, enfin à Zarzis ! Idéal pour le carrelage et le bâtiment.", img: "/assets/img/promo-ciment-colle.jpg", link: "/categorie/materiaux-construction", cta: "Découvrir" },
  { cls: "s-yellow", kicker: "Vente flash", title: <>Boudin <span>bas de porte</span></>, text: "Stop aux courants d'air, à la poussière et aux nuisibles. Installé en 30 secondes !", img: "/assets/img/promo-boudin.jpg", link: "/produit/201", cta: "J'en profite" },
  { cls: "", kicker: "Outillage pro", title: <>Makita · Ingco · <span>Total</span></>, text: "Perceuses, meuleuses, visseuses et coffrets : l'outillage professionnel au meilleur prix.", ic: "drill", link: "/categorie/outillage-electroportatif", cta: "Voir l'outillage" }
];

export default function HomePage() {
  const { products, categories, catalogReady } = useStore();
  const [slideI, setSlideI] = useState(0);
  const [tab, setTab] = useState("promo");

  useEffect(() => {
    const t = setInterval(() => setSlideI((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  if (!catalogReady) return <div className="container"><p style={{ padding: "60px 0", textAlign: "center", color: "#71747c" }}>Chargement…</p></div>;

  const cats = categories.map((c) => ({ ...c, n: products.filter((p) => p.cat === c.slug).length }));
  const byTag = (t) => products.filter((p) => p.tags?.includes(t));
  const tabbed = { promo: byTag("promo"), best: byTag("best"), new: byTag("new") }[tab].slice(0, 10);

  return (
    <div className="container">
      <section className="hero">
        <aside className="hero-side-cats">
          {cats.slice(0, 10).map((c) => (
            <Link key={c.slug} href={`/categorie/${c.slug}`}><span className="ci"><Icon name={c.icon} /></span>{c.name}</Link>
          ))}
          <Link href="/boutique"><span className="ci"><Icon name="grid" /></span><b>Toutes les catégories</b></Link>
        </aside>

        <div className="slider">
          {SLIDES.map((s, i) => (
            <div key={i} className={`slide ${s.cls} ${i === slideI ? "active" : ""}`}>
              <div className="s-text">
                <span className="s-kicker">{s.kicker}</span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <Link className={`btn ${s.cls ? "btn-dark" : "btn-yellow"}`} href={s.link}>{s.cta} <Icon name="right" /></Link>
              </div>
              {s.img ? <div className="s-img"><img src={s.img} alt="" /></div> : <div className="s-big-ic"><Icon name={s.ic} /></div>}
            </div>
          ))}
          <button className="slider-arrow prev" onClick={() => setSlideI((i) => (i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Précédent"><Icon name="left" /></button>
          <button className="slider-arrow next" onClick={() => setSlideI((i) => (i + 1) % SLIDES.length)} aria-label="Suivant"><Icon name="right" /></button>
          <div className="slider-dots">
            {SLIDES.map((_, i) => <button key={i} className={i === slideI ? "active" : ""} onClick={() => setSlideI(i)} aria-label={`Diapo ${i + 1}`} />)}
          </div>
        </div>

        <div className="hero-banners">
          <Link className="mini-banner" href="/produit/201">
            <img src="/assets/img/promo-boudin.jpg" alt="Boudin bas de porte" />
            <div className="mb-label"><strong>Boudin bas de porte</strong><span>Vente flash · -25%</span></div>
          </Link>
          <Link className="mini-banner" href="/categorie/materiaux-construction">
            <img src="/assets/img/promo-ciment-colle.jpg" alt="Ciment colle Deutsch Color" />
            <div className="mb-label"><strong>Ciment Colle Deutsch Color</strong><span>À partir de {money(32)}</span></div>
          </Link>
        </div>
      </section>

      <Reassure />

      <section className="section">
        <div className="sec-head"><h2>Nos catégories</h2><Link className="more" href="/boutique">Tout voir →</Link></div>
        <div className="cat-grid">
          {cats.map((c) => (
            <Link key={c.slug} className="cat-tile" href={`/categorie/${c.slug}`}>
              <div className="ct-ic"><Icon name={c.icon} /></div>
              <strong>{c.name}</strong>
              <span>{c.n} produit{c.n > 1 ? "s" : ""}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sec-head">
          <h2>Nos produits</h2>
          <div className="tabs">
            <button className={tab === "promo" ? "active" : ""} onClick={() => setTab("promo")}>Promotions</button>
            <button className={tab === "best" ? "active" : ""} onClick={() => setTab("best")}>Meilleures ventes</button>
            <button className={tab === "new" ? "active" : ""} onClick={() => setTab("new")}>Nouveautés</button>
          </div>
        </div>
        <ProductGrid products={tabbed} />
      </section>

      <section className="section promo-row">
        <Link className="promo-banner yellow" href="/categorie/materiaux-construction">
          <div className="pb-text">
            <h3>La qualité allemande <span>à Zarzis !</span></h3>
            <p className="ar">الجودة الألمانية توّا في جرجيس</p>
            <p>Ciment colle Deutsch Color FM 1000, FM 2200 et FM 3000.</p>
            <span className="btn btn-dark btn-sm pb-cta">Commander</span>
          </div>
          <img src="/assets/img/promo-ciment-colle.jpg" alt="Deutsch Color" loading="lazy" />
        </Link>
        <Link className="promo-banner" href="/produit/201">
          <div className="pb-text">
            <h3>Vente <span>flash</span></h3>
            <p>Boudin bas de porte : stop nuisibles, poussière et courants d&apos;air.</p>
            <div className="p-price"><span className="price" style={{ color: "#f5c518" }}>{money(14.9)}</span><span className="old-price">{money(19.9)}</span></div>
            <span className="btn btn-yellow btn-sm pb-cta">J&apos;en profite</span>
          </div>
          <img src="/assets/img/promo-boudin.jpg" alt="Boudin bas de porte" loading="lazy" />
        </Link>
      </section>

      {["outillage-electroportatif", "materiaux-construction", "outillage-a-main"].map((slug) => {
        const c = categories.find((x) => x.slug === slug);
        if (!c) return null;
        return (
          <section className="section" key={slug}>
            <div className="sec-head"><h2>{c.name}</h2><Link className="more" href={`/categorie/${slug}`}>Voir tout →</Link></div>
            <ProductGrid products={products.filter((p) => p.cat === slug).slice(0, 5)} />
          </section>
        );
      })}

      <section className="section">
        <div className="sec-head"><h2>Nos marques</h2></div>
        <div className="cat-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
          {[...new Set(products.map((p) => p.brand).filter(Boolean))].slice(0, 6).map((b) => (
            <Link key={b} className="brand" href={`/boutique?marque=${encodeURIComponent(b)}`} style={{ height: 70 }}>{b.toUpperCase()}</Link>
          ))}
        </div>
      </section>

      <section className="section"><StoreBlock /></section>
    </div>
  );
}

function Reassure() {
  return (
    <section className="reassure">
      <div><span className="ic"><Icon name="truck" /></span><div><strong>Livraison rapide</strong><span>Partout en Tunisie en 24 – 72h</span></div></div>
      <div><span className="ic"><Icon name="cash" /></span><div><strong>Paiement à la livraison</strong><span>Payez en espèces à la réception</span></div></div>
      <div><span className="ic"><Icon name="headset" /></span><div><strong>Service client</strong><span>Conseils au {STORE.phone}</span></div></div>
      <div><span className="ic"><Icon name="shield" /></span><div><strong>Qualité garantie</strong><span>Produits et marques de confiance</span></div></div>
    </section>
  );
}

function StoreBlock() {
  return (
    <div className="store">
      <img src="/assets/img/magasin.jpg" alt="Magasin Brico Dab à Zarzis" loading="lazy" />
      <div className="st-text">
        <h2>Visitez notre magasin <span>à Zarzis</span></h2>
        <div className="st-ar ar">{STORE.sloganAr}</div>
        <ul>
          <li><Icon name="pin" /><span>{STORE.address}</span></li>
          <li><Icon name="phone" /><span>{STORE.phone}</span></li>
          <li><Icon name="clock" /><span>{STORE.hours}</span></li>
          <li><Icon name="box" /><span>Quincaillerie, outillage, matériaux de construction, peinture, plomberie, électricité…</span></li>
        </ul>
        <div className="st-btns">
          <a className="btn btn-yellow" href={`tel:+${STORE.phoneIntl}`}><Icon name="phone" /> Appeler</a>
          <a className="btn btn-wa" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${STORE.phoneIntl}`}>WhatsApp</a>
          <Link className="btn btn-outline" style={{ borderColor: "#fff", color: "#fff" }} href="/contact">Itinéraire</Link>
        </div>
      </div>
    </div>
  );
}

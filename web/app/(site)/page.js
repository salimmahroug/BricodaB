"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductGrid from "@/components/ProductGrid";
import { STORE, resolveImg } from "@/lib/format";
import { apiFetch } from "@/lib/api";
import { useStore } from "@/components/StoreContext";

export default function HomePage() {
  const { products, categories, catalogReady } = useStore();
  const [banners, setBanners] = useState(null);
  const [slideI, setSlideI] = useState(0);
  const [tab, setTab] = useState("promo");

  useEffect(() => { apiFetch("/api/banners").then((r) => setBanners(r.ok ? r.data.banners : [])); }, []);

  const slides = (banners || []).filter((b) => b.zone === "slider");
  const minis = (banners || []).filter((b) => b.zone === "mini");
  const promos = (banners || []).filter((b) => b.zone === "promo");

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setSlideI((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!catalogReady || banners === null) return <div className="container"><p style={{ padding: "60px 0", textAlign: "center", color: "#71747c" }}>Chargement…</p></div>;

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

        {slides.length ? (
          <div className="slider">
            {slides.map((s, i) => (
              <div key={s.id} className={`slide ${s.style === "yellow" ? "s-yellow" : ""} ${i === slideI ? "active" : ""}`}>
                <div className="s-text">
                  {s.kicker ? <span className="s-kicker">{s.kicker}</span> : null}
                  <h2>{s.title} {s.highlight ? <span>{s.highlight}</span> : null}</h2>
                  <p>{s.body}</p>
                  {s.link ? <Link className={`btn ${s.style === "yellow" ? "btn-dark" : "btn-yellow"}`} href={s.link}>{s.cta || "Découvrir"} <Icon name="right" /></Link> : null}
                </div>
                {s.image ? <div className="s-img"><img src={resolveImg(s.image)} alt="" /></div> : <div className="s-big-ic"><Icon name="box" /></div>}
              </div>
            ))}
            <button className="slider-arrow prev" onClick={() => setSlideI((i) => (i - 1 + slides.length) % slides.length)} aria-label="Précédent"><Icon name="left" /></button>
            <button className="slider-arrow next" onClick={() => setSlideI((i) => (i + 1) % slides.length)} aria-label="Suivant"><Icon name="right" /></button>
            <div className="slider-dots">
              {slides.map((_, i) => <button key={i} className={i === slideI ? "active" : ""} onClick={() => setSlideI(i)} aria-label={`Diapo ${i + 1}`} />)}
            </div>
          </div>
        ) : null}

        {minis.length ? (
          <div className="hero-banners">
            {minis.map((m) => (
              <Link key={m.id} className="mini-banner" href={m.link || "#"}>
                {m.image ? <img src={resolveImg(m.image)} alt={m.title || ""} /> : null}
                <div className="mb-label"><strong>{m.title}</strong><span>{m.subtitle}</span></div>
              </Link>
            ))}
          </div>
        ) : null}
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

      {promos.length ? (
        <section className="section promo-row">
          {promos.map((p) => (
            <Link key={p.id} className={`promo-banner ${p.style === "yellow" ? "yellow" : ""}`} href={p.link || "#"}>
              <div className="pb-text">
                <h3>{p.title} {p.highlight ? <span>{p.highlight}</span> : null}</h3>
                {p.ar_text ? <p className="ar">{p.ar_text}</p> : null}
                <p>{p.body}</p>
                {p.cta ? <span className={`btn btn-sm pb-cta ${p.style === "yellow" ? "btn-dark" : "btn-yellow"}`}>{p.cta}</span> : null}
              </div>
              {p.image ? <img src={resolveImg(p.image)} alt="" loading="lazy" /> : null}
            </Link>
          ))}
        </section>
      ) : null}

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

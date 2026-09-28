"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Breadcrumb from "@/components/Breadcrumb";
import ProductVisual from "@/components/ProductVisual";
import ProductGrid from "@/components/ProductGrid";
import Stars from "@/components/Stars";
import { money, discount, ref, STORE } from "@/lib/format";
import { useStore } from "@/components/StoreContext";

const WA = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" /></svg>;

export default function ProductPage({ params }) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  const router = useRouter();
  const { products, categories, catalogReady, addToCart, toggleWish, wish, toast } = useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");

  if (!catalogReady) return <div className="container"><p style={{ padding: "60px 0", textAlign: "center", color: "#71747c" }}>Chargement…</p></div>;

  const p = products.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="container">
        <div className="empty" style={{ margin: "40px 0 48px" }}>
          <Icon name="search" /><h2>Produit introuvable</h2>
          <a className="btn btn-yellow" href="/boutique">Retour à la boutique</a>
        </div>
      </div>
    );
  }
  const cat = categories.find((c) => c.slug === p.cat);
  const d = discount(p);
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 5);
  const specs = { "Référence": ref(p.id), "Marque": p.brand, "Catégorie": cat?.name, ...(p.specs || {}) };

  function onAdd() { addToCart(p.id, qty); toast(`« ${p.name} » ajouté au panier`); }
  function onBuy() { addToCart(p.id, qty); router.push("/commande"); }

  return (
    <div className="container">
      <Breadcrumb items={[{ label: cat?.name, href: cat ? `/categorie/${cat.slug}` : undefined }, { label: p.name }]} />
      <section className="product">
        <div className="gallery">
          <div className="g-main">
            <ProductVisual product={p} />
            <div className="badges">
              {d ? <span className="badge badge-sale">-{d}%</span> : null}
              {p.tags?.includes("new") ? <span className="badge badge-new">Nouveau</span> : null}
            </div>
          </div>
        </div>
        <div className="pd">
          <span className="pd-brand">{p.brand}</span>
          <h1>{p.name}</h1>
          <div><Stars rating={p.rating} reviews={p.reviews} /> <span className="ref">· Réf. {ref(p.id)}</span></div>
          <div className="p-price">
            <span className="price">{money(p.price)}</span>
            {p.old ? <><span className="old-price">{money(p.old)}</span><span className="save">Économisez {money(p.old - p.price)}</span></> : null}
          </div>
          <p className="short">{p.short}</p>
          {p.feats?.length ? <ul className="feats">{p.feats.map((f, i) => <li key={i}>{f}</li>)}</ul> : null}
          <p>{p.stock === 0 ? <span className="stock-no">● Rupture de stock</span> : <span className="stock-ok">● En stock — disponible au magasin de Zarzis</span>}</p>

          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Moins">−</button>
              <input type="number" min="1" max="99" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))} aria-label="Quantité" />
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Plus">+</button>
            </div>
            <button className="btn btn-yellow" onClick={onAdd} disabled={p.stock === 0}><Icon name="cart" /> Ajouter au panier</button>
            <button className="btn btn-outline" onClick={() => { toggleWish(p.id); toast(wish.includes(p.id) ? "Retiré des favoris" : "Ajouté aux favoris"); }} aria-label="Favoris"><Icon name="heart" /></button>
          </div>
          <div className="buy-row">
            <button className="btn btn-dark" onClick={onBuy} disabled={p.stock === 0}>Acheter maintenant</button>
            <a className="btn btn-wa" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${STORE.phoneIntl}?text=${encodeURIComponent(`Bonjour Brico Dab, je suis intéressé(e) par : ${p.name} (Réf. ${ref(p.id)}) à ${money(p.price)}.`)}`}>
              {WA} Commander sur WhatsApp
            </a>
          </div>
          <div className="pd-assure">
            <div><Icon name="truck" /><span>Livraison 24 – 72h partout en Tunisie</span></div>
            <div><Icon name="cash" /><span>Paiement à la livraison</span></div>
            <div><Icon name="refresh" /><span>Échange sous 7 jours</span></div>
          </div>
        </div>
      </section>

      <section className="pd-tabs">
        <div className="tabs">
          <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>Description</button>
          <button className={tab === "specs" ? "active" : ""} onClick={() => setTab("specs")}>Caractéristiques</button>
          <button className={tab === "liv" ? "active" : ""} onClick={() => setTab("liv")}>Livraison &amp; retours</button>
        </div>
        {tab === "desc" && (
          <div className="tab-body">
            <p>{p.short}</p>
            {p.feats?.length ? <ul>{p.feats.map((f, i) => <li key={i}>{f}</li>)}</ul> : null}
            <p>Disponible chez <b>Brico Dab Zarzis</b> — {STORE.slogan}</p>
          </div>
        )}
        {tab === "specs" && (
          <div className="tab-body">
            <table className="spec-table"><tbody>
              {Object.entries(specs).filter(([, v]) => v).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
            </tbody></table>
          </div>
        )}
        {tab === "liv" && (
          <div className="tab-body">
            <p>Livraison partout en Tunisie en 24 à 72h. Livraison gratuite dès {money(STORE.freeShippingFrom)} d&apos;achat, sinon {money(STORE.shippingFee)}. Retrait gratuit au magasin de Zarzis. Paiement en espèces à la livraison. Échange possible sous 7 jours (produit non utilisé, dans son emballage d&apos;origine).</p>
          </div>
        )}
      </section>

      {related.length ? (
        <section className="section">
          <div className="sec-head"><h2>Produits similaires</h2></div>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}

"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import ProductVisual from "./ProductVisual";
import { STORE, money, norm } from "@/lib/format";
import { useStore } from "./StoreContext";

export default function Header({ onBurger, onCart }) {
  const router = useRouter();
  const pathname = usePathname();
  const { products, categories, cartCount, wish, currentUser, cartTotal } = useStore();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setSuggestOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const results = q.trim().length >= 2
    ? products.filter((p) => (!cat || p.cat === cat) && norm(`${p.name} ${p.brand}`).includes(norm(q))).slice(0, 6)
    : [];

  function submitSearch(e) {
    e.preventDefault();
    setSuggestOpen(false);
    const query = q.trim();
    if (!query && cat) router.push(`/categorie/${cat}`);
    else if (query) router.push(`/recherche?q=${encodeURIComponent(query)}`);
  }

  const NAV_LINKS = [
    { href: "/", label: "Accueil" },
    { href: "/boutique", label: "Boutique" },
    { href: "/categorie/outillage-electroportatif", label: "Outillage" },
    { href: "/categorie/quincaillerie", label: "Quincaillerie" },
    { href: "/categorie/materiaux-construction", label: "Construction" },
    { href: "/nouveautes", label: "Nouveautés" },
    { href: "/promotions", label: "🔥 Promotions", hot: true },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="tb-left">
            <span className="tb-promo">🚚 Livraison partout en Tunisie · Paiement à la livraison</span>
            <a href={`tel:+${STORE.phoneIntl}`}><Icon name="phone" /> {STORE.phone}</a>
            <span><Icon name="clock" /> {STORE.hours}</span>
          </div>
          <div className="tb-right">
            <Link href="/a-propos">À propos</Link>
            <Link href="/contact">Contact</Link>
            <a href={STORE.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <span className="ar">كل ما يلزمك للبناء</span>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <button className="burger" id="burger" aria-label="Menu" onClick={onBurger}><Icon name="menu" /></button>
          <Link className="logo" href="/" aria-label="Brico Dab — accueil"><Logo /></Link>

          <form className="search" role="search" autoComplete="off" onSubmit={submitSearch} ref={boxRef}>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Catégorie">
              <option value="">Toutes catégories</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <input
              type="search" placeholder="Rechercher un produit, une marque…" aria-label="Rechercher"
              value={q} onChange={(e) => { setQ(e.target.value); setSuggestOpen(true); }} onFocus={() => setSuggestOpen(true)}
            />
            <button type="submit" aria-label="Rechercher"><Icon name="search" /></button>
            {suggestOpen && q.trim().length >= 2 && (
              <div className="suggest">
                {results.length ? results.map((p) => (
                  <Link key={p.id} href={`/produit/${p.id}`} onClick={() => setSuggestOpen(false)}>
                    <span className="thumb"><ProductVisual product={p} /></span>
                    <span><span className="s-name">{p.name}</span><br /><span className="s-price">{money(p.price)}</span></span>
                  </Link>
                )) : <a style={{ color: "#71747c" }}>Aucun résultat pour « {q} »</a>}
                {results.length ? (
                  <Link href={`/recherche?q=${encodeURIComponent(q)}`} onClick={() => setSuggestOpen(false)} style={{ justifyContent: "center", fontWeight: 600 }}>
                    Voir tous les résultats
                  </Link>
                ) : null}
              </div>
            )}
          </form>

          <div className="h-actions">
            <a className="h-call" href={`tel:+${STORE.phoneIntl}`}>
              <span className="ic"><Icon name="phone" /></span>
              <span><small>Besoin d&apos;aide ?</small><strong>{STORE.phone}</strong></span>
            </a>
            <Link className="h-icon" href={currentUser ? "/compte" : "/connexion"} aria-label="Mon compte">
              <Icon name="user" /><span className="lbl">{currentUser ? currentUser.name.split(" ")[0] : "Connexion"}</span>
            </Link>
            <Link className="h-icon" href="/favoris" aria-label="Favoris">
              <Icon name="heart" /><span className="count">{wish.length}</span><span className="lbl">Favoris</span>
            </Link>
            <a className="h-icon" href="/panier" aria-label="Panier" onClick={(e) => { e.preventDefault(); onCart?.(); }}>
              <Icon name="cart" /><span className="count">{cartCount}</span><span className="lbl">{money(cartTotal)}</span>
            </a>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <CategoryMenu categories={categories} />
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={[pathname === l.href ? "active" : "", l.hot ? "hot" : ""].join(" ").trim()}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="nav-right">Livraison gratuite dès <strong>{STORE.freeShippingFrom} DT</strong></div>
        </div>
      </nav>
    </>
  );
}

function CategoryMenu({ categories }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  return (
    <div className="cat-wrap" ref={ref}>
      <button className="cat-toggle" onClick={() => setOpen((o) => !o)}>
        <Icon name="menu" /> Toutes les catégories
      </button>
      <div className={`cat-menu ${open ? "" : "hidden"}`}>
        {categories.map((c) => (
          <Link key={c.slug} href={`/categorie/${c.slug}`} onClick={() => setOpen(false)}>
            <span className="ci"><Icon name={c.icon} /></span>{c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

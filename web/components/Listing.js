"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "./Icon";
import Breadcrumb from "./Breadcrumb";
import ProductGrid from "./ProductGrid";
import { discount, norm } from "@/lib/format";
import { useStore } from "./StoreContext";

const SORTERS = {
  "prix-asc": (a, b) => a.price - b.price,
  "prix-desc": (a, b) => b.price - a.price,
  "nom": (a, b) => a.name.localeCompare(b.name, "fr"),
  "remise": (a, b) => discount(b) - discount(a)
};

const PRESETS = {
  promo: (p) => !!p.old,
  new: (p) => p.tags?.includes("new")
};

export default function Listing({ catSlug, title, preset: presetKey, query: queryProp, useUrlQuery }) {
  const preset = presetKey ? PRESETS[presetKey] : null;
  const { products, categories, catalogReady } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = useUrlQuery ? params.get("q") || "" : queryProp;

  const cat = catSlug ? categories.find((c) => c.slug === catSlug) : null;
  const selBrands = (params.get("marque") || "").split(",").filter(Boolean);
  const min = parseFloat(params.get("min")) || 0;
  const max = parseFloat(params.get("max")) || Infinity;
  const sort = params.get("tri") || "pertinence";

  const [minInput, setMinInput] = useState(params.get("min") || "");
  const [maxInput, setMaxInput] = useState(params.get("max") || "");

  const setParam = (k, v) => {
    const p = new URLSearchParams(params.toString());
    if (v == null || v === "") p.delete(k); else p.set(k, v);
    router.push("?" + p.toString());
  };

  const base = useMemo(() => {
    let list = products;
    if (cat) list = list.filter((p) => p.cat === cat.slug);
    if (preset) list = list.filter(preset);
    if (query) {
      const words = norm(query).split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const c = categories.find((x) => x.slug === p.cat);
        const h = norm(`${p.name} ${p.brand} ${c ? c.name : ""} ${p.short || ""}`);
        return words.every((w) => h.includes(w));
      });
    }
    return list;
  }, [products, categories, cat, preset, query]);

  const brandsHere = [...new Set(base.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));

  let list = base.filter((p) => (!selBrands.length || selBrands.includes(p.brand)) && p.price >= min && p.price <= max);
  if (SORTERS[sort]) list = [...list].sort(SORTERS[sort]);

  if (!catalogReady) return <div className="container"><p style={{ padding: "60px 0", textAlign: "center", color: "#71747c" }}>Chargement…</p></div>;

  const heading = cat ? cat.name : title;

  return (
    <div className="container">
      <Breadcrumb items={[cat ? { label: "Boutique", href: "/boutique" } : null, { label: heading }]} />
      <div className="page-banner"><div>
        <h1>{heading}</h1>
        <p>{cat ? cat.description : query ? `Résultats pour « ${query} »` : "Toute la quincaillerie, l'outillage et les matériaux de construction chez Brico Dab Zarzis."}</p>
      </div></div>

      <div className="listing">
        <aside className={`filters ${filtersOpen ? "open" : ""}`}>
          <div className="f-block f-cats">
            <h4>Catégories</h4>
            <Link href="/boutique" className={!cat && !query && !preset ? "active" : ""}><span>Tous les produits</span><em>{products.length}</em></Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/categorie/${c.slug}`} className={cat?.slug === c.slug ? "active" : ""}>
                <span>{c.name}</span><em>{products.filter((p) => p.cat === c.slug).length}</em>
              </Link>
            ))}
          </div>
          <div className="f-block">
            <h4>Marques</h4>
            {brandsHere.map((b) => (
              <label key={b}>
                <input
                  type="checkbox" checked={selBrands.includes(b)}
                  onChange={(e) => {
                    const next = e.target.checked ? [...selBrands, b] : selBrands.filter((x) => x !== b);
                    setParam("marque", next.join(","));
                  }}
                /> {b} <em>{base.filter((p) => p.brand === b).length}</em>
              </label>
            ))}
          </div>
          <div className="f-block">
            <h4>Prix (DT)</h4>
            <div className="price-range">
              <input type="number" min="0" placeholder="Min" value={minInput} onChange={(e) => setMinInput(e.target.value)} />
              <span>–</span>
              <input type="number" min="0" placeholder="Max" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} />
            </div>
            <button className="btn btn-dark btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => { setParam("min", minInput); setParam("max", maxInput); }}>Filtrer</button>
            {selBrands.length || min || isFinite(max) ? (
              <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 8 }} onClick={() => { setMinInput(""); setMaxInput(""); router.push(cat ? `/categorie/${cat.slug}` : "/boutique"); }}>
                Réinitialiser
              </button>
            ) : null}
          </div>
        </aside>

        <div>
          <div className="toolbar">
            <button className="btn btn-outline btn-sm filters-toggle" onClick={() => setFiltersOpen(true)}><Icon name="filter" /> Filtres</button>
            <span className="tb-count">{list.length} produit{list.length > 1 ? "s" : ""}</span>
            <label style={{ fontSize: 14 }}>
              Trier par :{" "}
              <select value={sort} onChange={(e) => setParam("tri", e.target.value === "pertinence" ? null : e.target.value)}>
                <option value="pertinence">Pertinence</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="nom">Nom (A → Z)</option>
                <option value="remise">Meilleures remises</option>
              </select>
            </label>
          </div>
          <ProductGrid products={list} cols />
        </div>
      </div>
      {filtersOpen ? <div className="overlay show" onClick={() => setFiltersOpen(false)} /> : null}
    </div>
  );
}

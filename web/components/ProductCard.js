"use client";
import Link from "next/link";
import Icon from "./Icon";
import ProductVisual from "./ProductVisual";
import Stars from "./Stars";
import { money, discount } from "@/lib/format";
import { useStore } from "./StoreContext";

export default function ProductCard({ product: p }) {
  const { addToCart, toggleWish, wish, toast } = useStore();
  const d = discount(p);
  const out = p.stock === 0;
  const onAdd = (e) => {
    e.preventDefault();
    addToCart(p.id);
    toast(`« ${p.name} » ajouté au panier`);
  };
  const onWish = (e) => {
    e.preventDefault();
    const on = wish.includes(p.id);
    toggleWish(p.id);
    toast(on ? "Retiré des favoris" : "Ajouté aux favoris");
  };
  return (
    <article className="p-card">
      <Link className="p-img" href={`/produit/${p.id}`}>
        <ProductVisual product={p} />
        <div className="badges">
          {d ? <span className="badge badge-sale">-{d}%</span> : null}
          {p.tags?.includes("new") ? <span className="badge badge-new">Nouveau</span> : null}
          {out ? <span className="badge badge-out">Rupture</span> : null}
        </div>
      </Link>
      <div className="p-quick">
        <button onClick={onWish} className={wish.includes(p.id) ? "on" : ""} aria-label="Favoris"><Icon name="heart" /></button>
        <Link href={`/produit/${p.id}`} aria-label="Voir le produit"><Icon name="eye" /></Link>
      </div>
      <div className="p-body">
        <span className="p-brand">{p.brand}</span>
        <Link className="p-name" href={`/produit/${p.id}`} title={p.name}>{p.name}</Link>
        <Stars rating={p.rating} reviews={p.reviews} />
        <div className="p-price">
          <span className="price">{money(p.price)}</span>
          {p.old ? <span className="old-price">{money(p.old)}</span> : null}
        </div>
        <button className="btn btn-yellow btn-sm btn-block add" onClick={onAdd} disabled={out}>
          <Icon name="cart" /> Ajouter au panier
        </button>
      </div>
    </article>
  );
}

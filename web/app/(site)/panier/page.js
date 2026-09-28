"use client";
import Link from "next/link";
import Icon from "@/components/Icon";
import Breadcrumb from "@/components/Breadcrumb";
import ProductVisual from "@/components/ProductVisual";
import CartSummary from "@/components/CartSummary";
import { money } from "@/lib/format";
import { useStore } from "@/components/StoreContext";

export default function CartPage() {
  const { cartItems, cartTotal, setQty, clearCart, catalogReady, cartHydrated } = useStore();

  if (!catalogReady || !cartHydrated) return <div className="container"><p style={{ padding: "60px 0", textAlign: "center", color: "#71747c" }}>Chargement…</p></div>;

  if (!cartItems.length) {
    return (
      <div className="container">
        <Breadcrumb items={[{ label: "Panier" }]} />
        <div className="empty" style={{ marginBottom: 48 }}>
          <Icon name="cart" /><h3>Votre panier est vide</h3>
          <p>Découvrez nos produits et profitez de nos promotions.</p>
          <Link className="btn btn-yellow" href="/boutique">Continuer mes achats</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Panier" }]} />
      <h1 className="page-title">Mon panier</h1>
      <div className="cart-layout">
        <div className="box">
          {cartItems.map((l) => (
            <div className="cart-line" key={l.id}>
              <Link className="thumb" href={`/produit/${l.p.id}`}><ProductVisual product={l.p} /></Link>
              <div>
                <Link className="cl-name" href={`/produit/${l.p.id}`}>{l.p.name}</Link>
                <div className="cl-unit">{money(l.p.price)} / unité</div>
              </div>
              <div className="qty">
                <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Moins">−</button>
                <input type="number" min="1" max="99" value={l.qty} onChange={(e) => setQty(l.id, parseInt(e.target.value) || 0)} aria-label="Quantité" />
                <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Plus">+</button>
              </div>
              <div className="cl-total">{money(l.p.price * l.qty)}</div>
              <button className="rm" onClick={() => setQty(l.id, 0)} aria-label="Retirer"><Icon name="trash" /></button>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-outline btn-sm" href="/boutique"><Icon name="left" /> Continuer mes achats</Link>
            <button className="btn btn-outline btn-sm" onClick={clearCart}><Icon name="trash" /> Vider le panier</button>
          </div>
        </div>
        <CartSummary total={cartTotal} cta={<Link className="btn btn-yellow btn-block" href="/commande">Passer la commande <Icon name="right" /></Link>} />
      </div>
    </div>
  );
}

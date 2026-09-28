"use client";
import Link from "next/link";
import Icon from "./Icon";
import ProductVisual from "./ProductVisual";
import { money, STORE } from "@/lib/format";
import { useStore } from "./StoreContext";

export function MobileMenu({ open, onClose }) {
  const { categories, currentUser, logout, toast } = useStore();
  return (
    <>
      <aside className={`drawer left ${open ? "open" : ""}`} aria-label="Menu">
        <div className="drawer-head"><h3>Menu</h3><button onClick={onClose} aria-label="Fermer"><Icon name="x" /></button></div>
        <div className="drawer-body mob-nav">
          <h5>Navigation</h5>
          <Link href="/" onClick={onClose}>Accueil</Link>
          <Link href="/boutique" onClick={onClose}>Boutique</Link>
          <Link href="/promotions" onClick={onClose}>🔥 Promotions</Link>
          <Link href="/nouveautes" onClick={onClose}>Nouveautés</Link>
          <Link href="/favoris" onClick={onClose}>Mes favoris</Link>
          <Link href="/panier" onClick={onClose}>Mon panier</Link>
          <h5>Mon compte</h5>
          {currentUser ? (
            <>
              <Link href="/compte" onClick={onClose}>Mon compte ({currentUser.name.split(" ")[0]})</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); toast("Vous êtes déconnecté(e)"); onClose(); }}>Se déconnecter</a>
            </>
          ) : (
            <>
              <Link href="/connexion" onClick={onClose}>Se connecter</Link>
              <Link href="/inscription" onClick={onClose}>Créer un compte</Link>
            </>
          )}
          <h5>Catégories</h5>
          {categories.map((c) => (
            <Link key={c.slug} href={`/categorie/${c.slug}`} onClick={onClose}><span className="ci"><Icon name={c.icon} /></span>{c.name}</Link>
          ))}
          <h5>Brico Dab</h5>
          <Link href="/a-propos" onClick={onClose}>À propos</Link>
          <Link href="/contact" onClick={onClose}>Contact</Link>
          <a href={`tel:+${STORE.phoneIntl}`}><span className="ci"><Icon name="phone" /></span>{STORE.phone}</a>
        </div>
      </aside>
    </>
  );
}

export function CartDrawer({ open, onClose }) {
  const { cartItems, cartTotal, setQty } = useStore();
  return (
    <aside className={`drawer right ${open ? "open" : ""}`} aria-label="Panier">
      <div className="drawer-head"><h3>Mon panier ({cartItems.reduce((s, l) => s + l.qty, 0)})</h3><button onClick={onClose} aria-label="Fermer"><Icon name="x" /></button></div>
      <div className="drawer-body">
        {cartItems.length ? cartItems.map((l) => (
          <div className="mini-line" key={l.id}>
            <Link href={`/produit/${l.p.id}`} className="thumb" onClick={onClose}><ProductVisual product={l.p} /></Link>
            <div>
              <Link href={`/produit/${l.p.id}`} className="ml-name" onClick={onClose}>{l.p.name}</Link>
              <div className="ml-meta">{l.qty} × <b>{money(l.p.price)}</b></div>
            </div>
            <button className="rm" onClick={() => setQty(l.id, 0)} aria-label="Retirer"><Icon name="trash" /></button>
          </div>
        )) : (
          <div className="empty" style={{ marginTop: 20 }}><Icon name="cart" /><p>Votre panier est vide.</p></div>
        )}
      </div>
      {cartItems.length ? (
        <div className="drawer-foot">
          <div className="sum-row total" style={{ margin: 0, border: 0, paddingTop: 0 }}><span>Sous-total</span><span>{money(cartTotal)}</span></div>
          <Link className="btn btn-outline btn-block" href="/panier" onClick={onClose}>Voir le panier</Link>
          <Link className="btn btn-yellow btn-block" href="/commande" onClick={onClose}>Commander</Link>
        </div>
      ) : null}
    </aside>
  );
}

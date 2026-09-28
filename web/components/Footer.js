"use client";
import Link from "next/link";
import { useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import { STORE } from "@/lib/format";
import { useStore } from "./StoreContext";

const FB = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8z" /></svg>;
const IG = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
const WA = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" /></svg>;

export default function Footer() {
  const { categories } = useStore();
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="newsletter">
        <div className="container">
          <div>
            <h3>Restez informé de nos promos</h3>
            <p>Recevez nos ventes flash et nouveautés en avant-première.</p>
          </div>
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); e.target.reset(); setSent(true); setTimeout(() => setSent(false), 2500); }}>
            <input type="email" placeholder="Votre adresse e-mail" required aria-label="E-mail" />
            <button type="submit">{sent ? "Merci !" : "S'inscrire"}</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div>
            <Link className="f-logo" href="/" aria-label="Brico Dab"><Logo dark /></Link>
            <p>Votre quincaillerie à Zarzis : outillage, matériaux de construction, peinture, plomberie, électricité et bien plus. <b style={{ color: "#f5c518" }}>Tout pour vos projets !</b></p>
            <div className="socials">
              <a href={STORE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">{FB}</a>
              <a href="#" aria-label="Instagram">{IG}</a>
              <a href={`https://wa.me/${STORE.phoneIntl}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">{WA}</a>
            </div>
          </div>
          <div>
            <h4>Catégories</h4>
            <ul>{categories.slice(0, 7).map((c) => <li key={c.slug}><Link href={`/categorie/${c.slug}`}>{c.name}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Informations</h4>
            <ul>
              <li><Link href="/a-propos">À propos de nous</Link></li>
              <li><Link href="/a-propos">Livraison &amp; retours</Link></li>
              <li><Link href="/a-propos">Questions fréquentes</Link></li>
              <li><Link href="/promotions">Promotions</Link></li>
              <li><Link href="/nouveautes">Nouveautés</Link></li>
              <li><Link href="/contact">Contactez-nous</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="f-contact">
              <li><Icon name="pin" /><span>{STORE.address}</span></li>
              <li><Icon name="phone" /><a href={`tel:+${STORE.phoneIntl}`}>{STORE.phone}</a></li>
              <li><Icon name="mail" /><a href={`mailto:${STORE.email}`}>{STORE.email}</a></li>
              <li><Icon name="clock" /><span>{STORE.hours}</span></li>
            </ul>
          </div>
        </div>
        <div className="f-bottom">
          <div className="container">
            <span>© {new Date().getFullYear()} Brico Dab Zarzis — Tous droits réservés.</span>
            <div className="pay-icons"><span>💵 Paiement à la livraison</span></div>
          </div>
        </div>
      </footer>
    </>
  );
}

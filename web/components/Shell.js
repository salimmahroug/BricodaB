"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { MobileMenu, CartDrawer } from "./Drawers";
import Icon from "./Icon";
import { STORE } from "@/lib/format";
import { useStore } from "./StoreContext";

const WA = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" /></svg>;

export default function Shell({ children }) {
  const { toastMsg } = useStore();
  const [mobOpen, setMobOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawers = () => { setMobOpen(false); setCartOpen(false); };

  return (
    <>
      <Header onBurger={() => setMobOpen(true)} onCart={() => setCartOpen(true)} />
      <main id="app">{children}</main>
      <Footer />

      <MobileMenu open={mobOpen} onClose={closeDrawers} />
      <CartDrawer open={cartOpen} onClose={closeDrawers} />
      <div className={`overlay ${mobOpen || cartOpen ? "show" : ""}`} onClick={closeDrawers} />

      <div className={`toast ${toastMsg ? "show" : ""}`} role="status" aria-live="polite">
        <Icon name="check" />{toastMsg ? <span>{toastMsg}</span> : null}
      </div>
      <a className="wa-float" href={`https://wa.me/${STORE.phoneIntl}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">{WA}</a>
      <button className={`to-top ${showTop ? "show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Haut de page">
        <Icon name="up" />
      </button>
    </>
  );
}

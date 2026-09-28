"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

const StoreCtx = createContext(null);

function readLocal(key, fallback) {
  try {
    const v = localStorage.getItem("bricodab_" + key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}
function writeLocal(key, value) {
  try { localStorage.setItem("bricodab_" + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [cart, setCart] = useState([]); // [{id, qty}]
  const [wish, setWish] = useState([]); // [id]
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);
  const [cartHydrated, setCartHydrated] = useState(false);

  // Hydratation depuis le navigateur (après le premier rendu, pour éviter tout écart SSR/client).
  // Le guard des deux effets ci-dessous utilise l'état `cartHydrated` (pas une ref) : une ref
  // devient vraie *avant* que le re-rendu avec le panier restauré n'ait lieu, donc l'effet
  // d'écriture s'exécutait une première fois avec l'ancien `cart` ([]) et écrasait la valeur
  // tout juste lue dans localStorage. En dépendant de l'état, l'effet ne s'exécute (guard
  // ouvert) que dans le même rendu que la valeur restaurée.
  useEffect(() => {
    setCart(readLocal("cart", []));
    setWish(readLocal("wish", []));
    setCartHydrated(true);
  }, []);
  useEffect(() => { if (cartHydrated) writeLocal("cart", cart); }, [cart, cartHydrated]);
  useEffect(() => { if (cartHydrated) writeLocal("wish", wish); }, [wish, cartHydrated]);

  const loadCatalog = useCallback(async () => {
    const [c, p] = await Promise.all([apiFetch("/api/categories"), apiFetch("/api/products")]);
    if (c.ok && c.data) setCategories(c.data.categories);
    if (p.ok && p.data) setProducts(p.data.products);
    setCatalogReady(true);
  }, []);
  const loadUser = useCallback(async () => {
    const r = await apiFetch("/api/auth/me");
    setCurrentUser(r.ok && r.data ? r.data.user : null);
    setUserReady(true);
  }, []);
  useEffect(() => { loadCatalog(); loadUser(); }, [loadCatalog, loadUser]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const addToCart = useCallback((id, qty = 1) => {
    id = Number(id);
    setCart((c) => {
      const line = c.find((l) => l.id === id);
      return line ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...c, { id, qty }];
    });
  }, []);
  const setQty = useCallback((id, qty) => {
    id = Number(id);
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l))));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWish = useCallback((id) => {
    id = Number(id);
    setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (r.ok) setCurrentUser(r.data.user);
    return r;
  }, []);
  const register = useCallback(async (body) => {
    const r = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
    if (r.ok) setCurrentUser(r.data.user);
    return r;
  }, []);
  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
  }, []);

  const prodBy = useCallback((id) => products.find((p) => p.id === Number(id)), [products]);
  const catBy = useCallback((slug) => categories.find((c) => c.slug === slug), [categories]);
  const cartItems = cart.map((l) => ({ ...l, p: prodBy(l.id) })).filter((l) => l.p);
  const cartTotal = cartItems.reduce((s, l) => s + l.p.price * l.qty, 0);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const value = {
    products, categories, catalogReady, prodBy, catBy,
    currentUser, userReady, login, register, logout, loadUser,
    cart, cartItems, cartTotal, cartCount, cartHydrated, addToCart, setQty, clearCart,
    wish, toggleWish,
    toast, toastMsg
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore doit être utilisé sous <StoreProvider>");
  return ctx;
}

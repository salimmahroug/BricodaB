"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const Ctx = createContext(null);

export function AdminProvider({ children }) {
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastErr, setToastErr] = useState(false);

  const checkAuth = useCallback(async () => {
    const r = await apiFetch("/api/auth/me");
    setMe(r.ok && r.data?.user?.role === "admin" ? r.data.user : null);
    setReady(true);
  }, []);
  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    const r = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!r.ok) return { ok: false, error: r.offline ? "Impossible de contacter le serveur." : r.data?.error || "Connexion impossible." };
    if (r.data.user.role !== "admin") {
      await apiFetch("/api/auth/logout", { method: "POST" });
      return { ok: false, error: "Ce compte n'est pas administrateur." };
    }
    setMe(r.data.user);
    return { ok: true };
  }, []);
  const logout = useCallback(async () => { await apiFetch("/api/auth/logout", { method: "POST" }); setMe(null); }, []);

  let toastTimer;
  const toast = useCallback((msg, err) => {
    setToastMsg(msg); setToastErr(!!err);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToastMsg(null), 2800);
  }, []);

  return <Ctx.Provider value={{ me, ready, login, logout, toast, toastMsg, toastErr }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin doit être utilisé sous <AdminProvider>");
  return ctx;
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { money, ORDER_STATUS } from "@/lib/format";
import { apiFetch } from "@/lib/api";
import { useStore } from "@/components/StoreContext";

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, userReady, logout, toast } = useStore();
  const [orders, setOrders] = useState(null);

  useEffect(() => { if (userReady && !currentUser) router.replace("/connexion"); }, [userReady, currentUser, router]);
  useEffect(() => {
    if (!currentUser) return;
    apiFetch("/api/auth/orders").then((r) => setOrders(r.ok ? r.data.orders : []));
  }, [currentUser]);

  if (!userReady || !currentUser) return null;

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Mon compte" }]} />
      <h1 className="page-title">Mon compte</h1>
      <div className="info-grid">
        <div className="box">
          <h3>Bonjour {currentUser.name}</h3>
          <p style={{ color: "var(--grey)" }}>{currentUser.email}{currentUser.phone ? ` · ${currentUser.phone}` : ""}</p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={async () => { await logout(); toast("Vous êtes déconnecté(e)"); router.push("/"); }}>
            Se déconnecter
          </button>
          {currentUser.role === "admin" ? (
            <p style={{ marginTop: 16 }}><a className="btn btn-dark btn-sm" href="/admin" target="_blank" rel="noopener noreferrer">Ouvrir le tableau de bord admin</a></p>
          ) : null}
        </div>
        <div className="box">
          <h3>Mes commandes</h3>
          {orders === null ? <p style={{ color: "var(--muted)" }}>Chargement…</p> : orders.length === 0 ? (
            <>
              <p style={{ color: "var(--muted)" }}>Vous n&apos;avez pas encore passé de commande.</p>
              <Link className="btn btn-yellow btn-sm" href="/boutique">Découvrir la boutique</Link>
            </>
          ) : orders.map((o) => {
            const st = ORDER_STATUS[o.status] || { label: "—", badge: "" };
            return (
              <div key={o.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <b>{o.order_number}</b>
                  <span className={`badge ${st.badge}`} style={{ position: "static" }}>{st.label}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0" }}>
                  {new Date(o.created_at).toLocaleDateString("fr-FR")} · {o.items.length} article{o.items.length > 1 ? "s" : ""}
                </div>
                <div style={{ fontWeight: 700 }}>{money(o.total)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

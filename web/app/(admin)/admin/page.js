"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { money, ORDER_STATUS } from "@/lib/format";

const fmtDate = (s) => new Date(s).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    apiFetch("/api/admin/stats").then((r) => (r.ok ? setStats(r.data) : setErr(r.data?.error || "Erreur serveur.")));
  }, []);

  if (err) return <div className="panel"><div className="panel-body" style={{ padding: 20 }}><p className="login-error" style={{ margin: 0 }}>{err}</p></div></div>;
  if (!stats) return <p className="muted">Chargement…</p>;

  return (
    <>
      <div className="stat-cards">
        <div className="stat-card accent"><div className="n">{stats.orderCount}</div><div className="l">Commandes totales</div></div>
        <div className="stat-card"><div className="n">{money(stats.revenue)}</div><div className="l">Chiffre d&apos;affaires</div></div>
        <div className="stat-card"><div className="n">{stats.productCount}</div><div className="l">Produits au catalogue</div></div>
        <div className="stat-card"><div className="n">{stats.customerCount}</div><div className="l">Clients inscrits</div></div>
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><h3>Dernières commandes</h3><Link className="btn btn-sm" href="/admin/commandes">Tout voir</Link></div>
          <div className="panel-body">
            <table><thead><tr><th>N°</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead>
              <tbody>
                {stats.recentOrders.length ? stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.order_number}</td><td>{o.client_name}</td><td className="mono">{money(o.total)}</td>
                    <td><span className={`badge st-${o.status}`}>{ORDER_STATUS[o.status]?.label}</span></td>
                    <td>{fmtDate(o.created_at)}</td>
                  </tr>
                )) : <tr className="empty-row"><td colSpan={5}>Aucune commande pour le moment.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Stock faible</h3></div>
          <div className="panel-body">
            <table><thead><tr><th>Produit</th><th>Stock</th></tr></thead>
              <tbody>
                {stats.lowStock.length ? stats.lowStock.map((p) => (
                  <tr key={p.id}><td>{p.name}</td><td className="stock-low">{p.stock}</td></tr>
                )) : <tr className="empty-row"><td colSpan={2}>Aucun produit en stock faible.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

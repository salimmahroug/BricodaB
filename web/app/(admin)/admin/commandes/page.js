"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { money, ORDER_STATUS } from "@/lib/format";
import { useAdmin } from "@/components/admin/AdminContext";

const fmtDate = (s) => new Date(s).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function OrdersPage() {
  const { toast } = useAdmin();
  const [orders, setOrders] = useState(null);

  const load = () => apiFetch("/api/orders").then((r) => setOrders(r.ok ? r.data.orders : []));
  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    const r = await apiFetch("/api/orders/" + id, { method: "PATCH", body: JSON.stringify({ status }) });
    if (!r.ok) { toast(r.data?.error || "Erreur", true); load(); return; }
    toast("Statut mis à jour.");
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  if (orders === null) return <p className="muted">Chargement…</p>;

  return (
    <div className="panel">
      <div className="panel-head"><h3>{orders.length} commande(s)</h3></div>
      <div className="panel-body" style={{ overflow: "auto" }}>
        <table>
          <thead><tr><th>N°</th><th>Client</th><th>Téléphone</th><th>Articles</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {orders.length ? orders.map((o) => (
              <tr key={o.id}>
                <td>{o.order_number}</td><td>{o.client_name}</td><td>{o.client_phone}</td>
                <td>{o.items.length}</td><td className="mono">{money(o.total)}</td>
                <td>
                  <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                    {Object.entries(ORDER_STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                  </select>
                </td>
                <td>{fmtDate(o.created_at)}</td>
              </tr>
            )) : <tr className="empty-row"><td colSpan={7}>Aucune commande.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

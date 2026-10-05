"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Breadcrumb from "@/components/Breadcrumb";
import CartSummary from "@/components/CartSummary";
import { money, GOUVERNORATS, STORE, ref } from "@/lib/format";
import { readLocal, writeLocal } from "@/lib/localStore";
import { apiFetch } from "@/lib/api";
import { useStore } from "@/components/StoreContext";

const WA = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" /></svg>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartHasQuoteItems, clearCart, currentUser, catalogReady, cartHydrated } = useStore();
  const [form, setForm] = useState({ nom: "", tel: "", gouv: "Médenine", ville: "", adresse: "", livr: "livraison", note: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { num, total, tel, nom, wa }

  useEffect(() => {
    const saved = readLocal("client", {});
    setForm((f) => ({
      ...f,
      nom: saved.nom || currentUser?.name || "",
      tel: saved.tel || currentUser?.phone || "",
      gouv: saved.gouv || "Médenine",
      ville: saved.ville || "",
      adresse: saved.adresse || ""
    }));
  }, [currentUser]);

  if (catalogReady && cartHydrated && !cartItems.length && !result) {
    if (typeof window !== "undefined") router.replace("/panier");
    return null;
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (form.nom.trim().length < 3) errs.nom = true;
    if (!/^[0-9 +]{8,15}$/.test(form.tel.trim())) errs.tel = true;
    if (!form.ville.trim()) errs.ville = true;
    if (form.livr !== "magasin" && form.adresse.trim().length < 5) errs.adresse = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    writeLocal("client", { nom: form.nom, tel: form.tel, gouv: form.gouv, ville: form.ville, adresse: form.adresse });
    setSubmitting(true);
    const shipping = form.livr === "magasin" ? 0 : (cartTotal === 0 || cartTotal >= STORE.freeShippingFrom ? 0 : STORE.shippingFee);

    const apiRes = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items: cartItems.map((l) => ({ id: l.p.id, name: l.p.name, qty: l.qty, price: l.p.price })),
        shipping, client_name: form.nom, client_phone: form.tel,
        gouvernorat: form.gouv, ville: form.ville, adresse: form.adresse, mode: form.livr, note: form.note
      })
    });
    setSubmitting(false);

    const num = (apiRes.ok && apiRes.data?.order?.order_number) || "BD" + Date.now().toString().slice(-8);
    const total = cartTotal + shipping;
    const title = cartHasQuoteItems
      ? `🛒 *Commande / demande de devis ${num}* — Brico Dab Zarzis`
      : `🛒 *Nouvelle commande ${num}* — Brico Dab Zarzis`;
    const lines = [
      title, "",
      ...cartItems.map((l) => l.p.hidePrice
        ? `• ${l.qty} × ${l.p.name} (${ref(l.p.id)}) — prix sur demande`
        : `• ${l.qty} × ${l.p.name} (${ref(l.p.id)}) = ${money(l.p.price * l.qty)}`), "",
      `Sous-total : ${money(cartTotal)}${cartHasQuoteItems ? " (hors articles sur devis)" : ""}`,
      `Livraison : ${shipping ? money(shipping) : "Gratuite"}`,
      `*Total${cartHasQuoteItems ? " partiel" : ""} : ${money(total)}*`,
      cartHasQuoteItems ? "Merci de me confirmer le prix des articles sur demande." : "", "",
      `👤 ${form.nom}`, `📞 ${form.tel}`,
      `📍 ${form.livr === "magasin" ? "Retrait au magasin" : `${form.adresse}, ${form.ville}, ${form.gouv}`}`,
      form.note ? `📝 ${form.note}` : "",
      "💵 Paiement à la livraison"
    ].filter(Boolean);
    const wa = `https://wa.me/${STORE.phoneIntl}?text=${encodeURIComponent(lines.join("\n"))}`;

    clearCart();
    setResult({ num, total, tel: form.tel, nom: form.nom, wa, hasQuoteItems: cartHasQuoteItems });
    window.open(wa, "_blank", "noopener");
    window.scrollTo(0, 0);
  }

  if (result) {
    return (
      <div className="container">
        <div className="box success" style={{ margin: "30px auto 48px", maxWidth: 640 }}>
          <div className="ok"><Icon name="check" /></div>
          <h1 className="page-title" style={{ marginBottom: 8 }}>Merci {result.nom.split(" ")[0]} !</h1>
          <p>
            Votre commande <b>{result.num}</b>{result.hasQuoteItems ? "" : <> d&apos;un montant de <b>{money(result.total)}</b></>} a bien été enregistrée.
          </p>
          {result.hasQuoteItems ? (
            <p>Elle inclut des articles à <b>prix sur demande</b> : notre équipe vous confirmera leur prix lors de l&apos;envoi du devis.</p>
          ) : null}
          <p>Pour la confirmer rapidement, envoyez-la à notre équipe sur WhatsApp. Nous vous appellerons au <b>{result.tel}</b>.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
            <a className="btn btn-wa" href={result.wa} target="_blank" rel="noopener noreferrer">{WA} Envoyer sur WhatsApp</a>
            <a className="btn btn-outline" href="/">Retour à l&apos;accueil</a>
          </div>
        </div>
      </div>
    );
  }
  if (!catalogReady) return null;

  const f = (key, label, type = "text", full = false) => (
    <div className={`field ${full ? "full" : ""} ${errors[key] ? "invalid" : ""}`}>
      <label>{label}</label>
      <input type={type} value={form[key]} onChange={set(key)} />
      <span className="err">Champ obligatoire</span>
    </div>
  );

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]} />
      <h1 className="page-title">Finaliser ma commande</h1>
      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="box">
          <h3>Informations de livraison</h3>
          <div className="form-grid">
            {f("nom", "Nom et prénom *")}
            {f("tel", "Téléphone *", "tel")}
            <div className="field">
              <label>Gouvernorat *</label>
              <select value={form.gouv} onChange={set("gouv")}>{GOUVERNORATS.map((g) => <option key={g}>{g}</option>)}</select>
            </div>
            {f("ville", "Ville *")}
            {f("adresse", "Adresse complète *", "text", true)}
            <div className="field full">
              <label>Mode de réception</label>
              <select value={form.livr} onChange={set("livr")}>
                <option value="livraison">Livraison à domicile</option>
                <option value="magasin">Retrait au magasin Brico Dab Zarzis (gratuit)</option>
              </select>
            </div>
            <div className="field full">
              <label>Remarque (optionnel)</label>
              <textarea rows="3" value={form.note} onChange={set("note")} placeholder="Précisions sur la commande, horaires de livraison…" />
            </div>
          </div>
          <h3 style={{ marginTop: 22 }}>Paiement</h3>
          <div className="pay-opt"><Icon name="cash" /><span><b>Paiement à la livraison</b> — vous payez en espèces à la réception de votre commande.</span></div>
          <h3 style={{ marginTop: 22 }}>Votre commande</h3>
          {cartItems.map((l) => (
            <div className="sum-row" key={l.id}>
              <span>{l.qty} × {l.p.name}</span>
              <b>{l.p.hidePrice ? "Sur demande" : money(l.p.price * l.qty)}</b>
            </div>
          ))}
        </div>
        <CartSummary
          total={cartTotal}
          hasQuoteItems={cartHasQuoteItems}
          cta={
            <>
              <button type="submit" className="btn btn-yellow btn-block" disabled={submitting}>
                <Icon name="check" /> {submitting ? "Envoi…" : cartHasQuoteItems ? "Envoyer ma demande de devis" : "Confirmer la commande"}
              </button>
              <p style={{ fontSize: 12, color: "#71747c", margin: "10px 0 0" }}>
                {cartHasQuoteItems
                  ? "Votre demande sera envoyée à Brico Dab via WhatsApp, qui vous confirmera le prix et la commande."
                  : "Votre commande sera envoyée à Brico Dab via WhatsApp pour confirmation."}
              </p>
            </>
          }
        />
      </form>
    </div>
  );
}

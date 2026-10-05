import Icon from "./Icon";
import { money, STORE } from "@/lib/format";
import { useStore } from "./StoreContext";

export default function CartSummary({ total, cta, hasQuoteItems }) {
  const { cartCount } = useStore();
  const shipping = total === 0 || total >= STORE.freeShippingFrom ? 0 : STORE.shippingFee;
  const left = STORE.freeShippingFrom - total;

  return (
    <aside className="box">
      <h3>Récapitulatif</h3>
      {left > 0 ? (
        <div className="free-ship">
          Plus que <b>{money(left)}</b> pour la livraison gratuite !
          <div className="bar"><i style={{ width: `${Math.min(100, (total / STORE.freeShippingFrom) * 100)}%` }} /></div>
        </div>
      ) : (
        <div className="free-ship">🎉 Vous bénéficiez de la <b>livraison gratuite</b> !</div>
      )}
      <div className="sum-row"><span>Sous-total ({cartCount} article{cartCount > 1 ? "s" : ""})</span><b>{money(total)}</b></div>
      <div className="sum-row"><span>Livraison</span><b>{shipping ? money(shipping) : "Gratuite"}</b></div>
      <div className="sum-row total"><span>Total TTC</span><span>{money(total + shipping)}{hasQuoteItems ? " +" : ""}</span></div>
      {hasQuoteItems ? (
        <p style={{ fontSize: 12.5, color: "#71747c", margin: "6px 0 0" }}>
          Certains articles sont à <b>prix sur demande</b> : ils ne sont pas comptés dans ce total, notre équipe vous confirmera leur prix lors du devis.
        </p>
      ) : null}
      <div style={{ marginTop: 14 }}>{cta}</div>
      <div className="pay-opt" style={{ marginTop: 14 }}><Icon name="cash" /><span>Paiement <b>à la livraison</b> en espèces</span></div>
    </aside>
  );
}

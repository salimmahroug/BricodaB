import Link from "next/link";
import Icon from "./Icon";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, cols }) {
  if (!products.length) {
    return (
      <div className="empty">
        <Icon name="search" />
        <p>Aucun produit trouvé.</p>
        <Link className="btn btn-yellow" href="/boutique">Voir tous les produits</Link>
      </div>
    );
  }
  return (
    <div className={`p-grid ${cols ? "cols-4" : ""}`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

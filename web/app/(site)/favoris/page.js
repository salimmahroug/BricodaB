"use client";
import Link from "next/link";
import Icon from "@/components/Icon";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import { useStore } from "@/components/StoreContext";

export default function WishlistPage() {
  const { wish, products, catalogReady } = useStore();
  if (!catalogReady) return null;
  const list = wish.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Mes favoris" }]} />
      <h1 className="page-title">Mes favoris</h1>
      {list.length ? <ProductGrid products={list} /> : (
        <div className="empty">
          <Icon name="heart" /><p>Vous n&apos;avez pas encore de favoris.</p>
          <Link className="btn btn-yellow" href="/boutique">Découvrir nos produits</Link>
        </div>
      )}
      <div style={{ height: 48 }} />
    </div>
  );
}

"use client";
import { useStore } from "./StoreContext";
import Icon from "./Icon";

const TINTS = ["#fff6d1", "#f1f1f3", "#fdf0c4", "#ececef"];

export default function ProductVisual({ product }) {
  if (product.img) {
    return <img src={"/" + product.img.replace(/^\/+/, "")} alt={product.name} loading="lazy" />;
  }
  return <GeneratedVisual product={product} />;
}

function GeneratedVisual({ product }) {
  const { catBy } = useStore();
  const cat = catBy(product.cat);
  const bg = TINTS[product.id % TINTS.length];
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={product.name}>
      <rect width="300" height="300" fill={bg} />
      <circle cx="150" cy="138" r="92" fill="#fff" />
      <path d="M0 300 L0 250 Q150 215 300 250 L300 300z" fill="#f5c518" opacity=".9" />
      <foreignObject x="90" y="78" width="120" height="120">
        <div style={{ width: 120, height: 120, display: "grid", placeItems: "center" }}>
          <Icon name={cat ? cat.icon : "box"} className="pv-cat-icon" />
        </div>
      </foreignObject>
      <text x="150" y="283" textAnchor="middle" fontFamily="Montserrat, Poppins, sans-serif" fontWeight="800" fontSize="20" fill="#151515" letterSpacing="1">
        {(product.brand || "").toUpperCase()}
      </text>
    </svg>
  );
}

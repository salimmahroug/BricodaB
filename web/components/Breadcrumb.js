import Link from "next/link";

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      <Link href="/">Accueil</Link>
      {items.filter(Boolean).map((it, i) => (
        <span key={i}>
          <span>/</span>
          {it.href ? <Link href={it.href}>{it.label}</Link> : <b>{it.label}</b>}
        </span>
      ))}
    </nav>
  );
}

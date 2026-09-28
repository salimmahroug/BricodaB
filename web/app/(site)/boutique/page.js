import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata = { title: "Boutique | Brico Dab Zarzis" };

export default function BoutiquePage() {
  return (
    <Suspense>
      <Listing title="Tous les produits" />
    </Suspense>
  );
}

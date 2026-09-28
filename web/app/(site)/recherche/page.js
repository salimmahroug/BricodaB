import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata = { title: "Recherche | Brico Dab Zarzis" };

export default function RecherchePage() {
  return (
    <Suspense>
      <Listing title="Recherche" useUrlQuery />
    </Suspense>
  );
}

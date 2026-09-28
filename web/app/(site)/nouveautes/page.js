import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata = { title: "Nouveautés | Brico Dab Zarzis" };

export default function NouveautesPage() {
  return (
    <Suspense>
      <Listing title="Nouveautés" preset="new" />
    </Suspense>
  );
}

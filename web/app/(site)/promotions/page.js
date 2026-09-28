import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata = { title: "Promotions | Brico Dab Zarzis" };

export default function PromotionsPage() {
  return (
    <Suspense>
      <Listing title="Promotions" preset="promo" />
    </Suspense>
  );
}

import { Suspense } from "react";
import Listing from "@/components/Listing";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  return (
    <Suspense>
      <Listing catSlug={slug} />
    </Suspense>
  );
}

import { PRODUCTS } from "@/lib/products";
import { CatalogClient } from "@/components/CatalogClient";

export default function HomePage() {
  return <CatalogClient products={PRODUCTS} />;
}

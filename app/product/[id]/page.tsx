import { notFound } from "next/navigation";
import { getProductById, PRODUCTS } from "@/lib/products";
import { ProductDetailClient } from "@/components/ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}

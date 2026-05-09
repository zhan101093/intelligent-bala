"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import { Toast, useToast } from "./ui/Toast";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { ProductGallery } from "./ProductGallery";

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const { isInCart, getQty, addItem, updateQty } = useCart();
  const { toast, show, dismiss } = useToast();
  const inCart = isInCart(product.id);
  const qty = getQty(product.id);

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.cat === product.cat
  ).slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Навигация">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-semibold"
        >
          <ArrowLeft size={15} />
          Каталогқа оралу
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <ProductGallery
          images={product.images}
          emoji={product.emoji}
          name={product.nameKz}
          hit={product.hit}
          isNew={product.isNew}
        />

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-text-light font-semibold uppercase tracking-wider mb-1">
              {product.cat === "book" ? "Кітаптар" : product.cat === "game" ? "Ойындар" : "Плакаттар"}
            </p>
            <h1 className="font-display font-black text-2xl md:text-3xl text-text-base leading-tight mb-2">
              {product.nameKz}
            </h1>
            <p className="text-sm text-text-muted font-medium">{product.nameRu}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex" aria-label={`Рейтинг: ${product.rating}`}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-text-muted">{product.rating}</span>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">{product.descKz}</p>
          <p className="text-sm text-text-light">📦 Жасы: {product.age}</p>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-display font-black text-3xl text-primary">
              {product.price.toLocaleString("ru-RU")}
            </span>
            <span className="text-base text-text-muted font-semibold">тг</span>
          </div>

          {/* Cart actions */}
          {inCart ? (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                aria-label="Азайту"
                onClick={() => updateQty(product.id, qty - 1)}
              >
                <Minus size={16} />
              </Button>
              <span className="font-display font-black text-xl text-primary min-w-[2rem] text-center">
                {qty}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Қосу"
                onClick={() => updateQty(product.id, qty + 1)}
              >
                <Plus size={16} />
              </Button>
              <Link href="/cart">
                <Button variant="primary" size="lg">
                  Себетке өту →
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
              onClick={() => {
                addItem(product);
                show(`"${product.nameKz}" себетке қосылды ✓`);
              }}
            >
              <ShoppingCart size={18} />
              Себетке қосу
            </Button>
          )}

          {/* Shipping info */}
          <div className="bg-primary-pale rounded-xl p-4 text-sm text-text-muted space-y-1 border border-border">
            <p>🚚 Алматы бойынша жеткізу: 1-2 күн</p>
            <p>📦 Қазақстан бойынша: 3-7 күн</p>
            <p>💬 Тапсырыс: WhatsApp арқылы</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-title">
          <h2 id="related-title" className="font-display font-black text-xl text-text-base mb-4">
            Ұқсас тауарлар
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => show(`"${p.nameKz}" себетке қосылды ✓`)}
              />
            ))}
          </div>
        </section>
      )}

      <Toast message={toast.message} visible={toast.visible} onDismiss={dismiss} />
    </div>
  );
}

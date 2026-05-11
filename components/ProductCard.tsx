"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { ProductReviews } from "./ProductReviews";

interface ProductCardProps {
  product: Product;
  onAdd?: () => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { isInCart, getQty, addItem, updateQty } = useCart();
  const inCart = isInCart(product.id);
  const qty = getQty(product.id);

  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (product.images.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIdx((i) => (i + 1) % product.images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [product.images.length]);

  function handleAdd() {
    addItem(product);
    onAdd?.();
  }

  return (
    <article className="bg-white border-[1.5px] border-border rounded-2xl overflow-hidden hover:border-primary-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative h-44 bg-primary-light flex items-center justify-center text-5xl overflow-hidden">
          {product.hit && (
            <span className="absolute top-2.5 left-0 z-10 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-r-full tracking-wide">
              ХИТ
            </span>
          )}
          {product.isNew && !product.hit && (
            <Badge variant="new" className="absolute top-2.5 right-2.5 z-10">
              ЖАҢА
            </Badge>
          )}
          {product.images.length > 0 ? (
            <Image
              src={product.images[slideIdx]}
              alt={product.nameKz}
              fill
              className="object-contain p-2 transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, 25vw"
              loading="lazy"
            />
          ) : (
            <span role="img" aria-label={product.nameKz}>
              {product.emoji}
            </span>
          )}
          {product.images.length > 1 && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === slideIdx ? "bg-primary" : "bg-white/70"}`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1 gap-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-display font-bold text-sm text-text-base leading-snug hover:text-primary transition-colors">
            {product.nameKz}
          </h3>
        </Link>
        <p className="text-xs text-text-light leading-snug line-clamp-2">
          {product.descKz}
        </p>

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display font-black text-lg text-primary">
              {product.price.toLocaleString("ru-RU")}
            </span>
            <span className="text-xs text-text-muted font-semibold">тг</span>
          </div>
          <p className="text-[11px] text-text-light">Жасы: {product.age}</p>

          {inCart ? (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                aria-label="Азайту"
                onClick={() => updateQty(product.id, qty - 1)}
              >
                <Minus size={14} />
              </Button>
              <span className="font-display font-black text-base text-primary min-w-[1.5rem] text-center">
                {qty}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Қосу"
                onClick={() => updateQty(product.id, qty + 1)}
              >
                <Plus size={14} />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="w-full rounded-xl"
              onClick={handleAdd}
            >
              <ShoppingCart size={13} />
              Себетке қосу
            </Button>
          )}

          <Link
            href={`/product/${product.id}`}
            className="text-[11px] text-text-light hover:text-primary transition-colors text-center font-medium"
          >
            Толығырақ →
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews productId={product.id} />
    </article>
  );
}

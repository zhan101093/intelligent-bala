"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "./ui/Button";

export function CartPageClient() {
  const { items, totalPrice, totalQty, updateQty, removeItem, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h1 className="font-display font-black text-2xl text-text-base mb-2">
          Себет бос
        </h1>
        <p className="text-text-muted mb-6">Каталогтан тауар таңдаңыз</p>
        <Link href="/">
          <Button variant="primary" size="lg">
            <ShoppingBag size={18} />
            Каталогқа өту
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-black text-2xl md:text-3xl text-text-base mb-6">
        Себет <span className="text-text-light font-semibold text-lg">({totalQty} тауар)</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white border-[1.5px] border-border rounded-2xl p-4 flex items-center gap-4"
            >
              {/* Emoji thumbnail */}
              <Link
                href={`/product/${item.id}`}
                className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center text-2xl shrink-0"
                aria-label={item.nameKz}
              >
                {item.emoji}
              </Link>

              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`}>
                  <h2 className="font-display font-bold text-sm text-text-base leading-snug hover:text-primary transition-colors line-clamp-2">
                    {item.nameKz}
                  </h2>
                </Link>
                <p className="text-xs text-text-light mt-0.5">{item.price.toLocaleString("ru-RU")} тг/дана</p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-7 h-7 rounded-full border-[1.5px] border-border flex items-center justify-center text-primary hover:bg-primary-light transition-colors"
                  aria-label="Азайту"
                >
                  <Minus size={12} />
                </button>
                <span className="font-display font-black text-base text-primary min-w-[1.5rem] text-center">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-7 h-7 rounded-full border-[1.5px] border-border flex items-center justify-center text-primary hover:bg-primary-light transition-colors"
                  aria-label="Қосу"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Line total */}
              <div className="text-right shrink-0 min-w-[80px]">
                <p className="font-display font-black text-base text-primary">
                  {(item.price * item.qty).toLocaleString("ru-RU")} тг
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-text-light hover:text-red-500 transition-colors ml-1"
                aria-label={`${item.nameKz} өшіру`}
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>

        {/* Summary */}
        <aside className="md:col-span-1">
          <div className="bg-primary-pale border border-border rounded-2xl p-5 sticky top-20">
            <h2 className="font-display font-black text-lg text-text-base mb-4">Жиынтық</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-text-muted">
                  <span className="truncate flex-1 mr-2">
                    {item.nameKz} × {item.qty}
                  </span>
                  <span className="font-semibold shrink-0">
                    {(item.price * item.qty).toLocaleString("ru-RU")} тг
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-border pt-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-muted">Жиыны:</span>
                <span className="font-display font-black text-2xl text-primary">
                  {totalPrice.toLocaleString("ru-RU")} тг
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button variant="primary" size="lg" className="w-full">
                Тапсырыс беру →
              </Button>
            </Link>

            <Link href="/" className="block text-center text-sm text-text-muted hover:text-primary transition-colors mt-3 font-semibold">
              ← Сатып алуды жалғастыру
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartFAB() {
  const { totalQty, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 bg-primary text-white rounded-2xl px-5 py-3 shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-200"
      aria-label={`Себет, ${totalQty} тауар`}
    >
      <span className="text-[10px] font-black tracking-widest uppercase opacity-90">
        Сатып алу
      </span>
      <div className="flex items-center gap-2">
        <ShoppingCart size={22} />
        {hydrated && totalQty > 0 && (
          <span className="bg-white text-primary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
            {totalQty}
          </span>
        )}
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

function IgIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

const IG_URL =
  "https://www.instagram.com/intelligent_bala?igsh=NW9wank2cXNxbTFj";

export function Header() {
  const { totalQty } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border h-16 flex items-center px-4 md:px-6">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.jpg"
            alt="Intelligent Bala"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
          <span className="font-display text-xl font-black text-primary tracking-tight">
            Intelligent <span className="text-text-base">Bala</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary border-[1.5px] border-border-strong rounded-full px-3 py-1.5 hover:bg-primary-light transition-colors"
            aria-label="Instagram профилі"
          >
            <IgIcon size={14} />
            <span>Instagram</span>
          </a>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-primary text-white text-sm font-bold rounded-full px-4 py-2 hover:bg-primary-dark transition-colors"
            aria-label={`Себет, ${totalQty} тауар`}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Себет</span>
            <span className="bg-white text-primary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
              {totalQty}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

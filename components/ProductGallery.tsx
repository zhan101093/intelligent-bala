"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  emoji: string;
  name: string;
  hit?: boolean;
  isNew?: boolean;
}

export function ProductGallery({ images, emoji, name, hit, isNew }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-primary-light rounded-2xl flex items-center justify-center min-h-64 md:min-h-96 relative">
        {hit && (
          <span className="absolute top-4 left-0 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-r-full tracking-wide">
            ХИТ
          </span>
        )}
        {isNew && (
          <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            ЖАҢА
          </span>
        )}
        <span className="text-[100px] md:text-[130px]" role="img" aria-label={name}>
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative bg-primary-light rounded-2xl overflow-hidden aspect-square md:aspect-[4/3]">
        {hit && (
          <span className="absolute top-4 left-0 z-10 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-r-full tracking-wide">
            ХИТ
          </span>
        )}
        {isNew && (
          <span className="absolute top-4 right-4 z-10 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            ЖАҢА
          </span>
        )}
        <Image
          src={images[active]}
          alt={`${name} — сурет ${active + 1}`}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={active === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Сурет ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                active === i
                  ? "border-primary shadow-md"
                  : "border-border hover:border-primary-soft"
              )}
            >
              <Image
                src={src}
                alt={`${name} — thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

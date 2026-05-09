"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Category, SortOption } from "@/types";
import { MIN_PRICE, MAX_PRICE } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Toast, useToast } from "./ui/Toast";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/useDebounce";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function IgIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "Барлығы" },
  { value: "book", label: "📚 Кітаптар" },
  { value: "game", label: "🎮 Ойындар" },
  { value: "poster", label: "🗺️ Плакаттар" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Әдепкі" },
  { value: "price-asc", label: "Баға: арзаннан" },
  { value: "price-desc", label: "Баға: қымбаттан" },
  { value: "rating", label: "Рейтинг бойынша" },
];

const PAGE_SIZE = 8;

interface CatalogClientProps {
  products: Product[];
}

export function CatalogClient({ products }: CatalogClientProps) {
  const [rawSearch, setRawSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [priceMinStr, setPriceMinStr] = useState(String(MIN_PRICE));
  const [priceMaxStr, setPriceMaxStr] = useState(String(MAX_PRICE));
  const [minRating, setMinRating] = useState(0);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyHit, setOnlyHit] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { toast, show, dismiss } = useToast();

  const search = useDebounce(rawSearch, 300);

  const priceMin = priceMinStr === "" ? 0 : (Number(priceMinStr) || 0);
  const priceMax = priceMaxStr === "" ? MAX_PRICE : (Number(priceMaxStr) || MAX_PRICE);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "all" && p.cat !== category) return false;
      if (onlyHit && !p.hit) return false;
      if (onlyNew && !p.isNew) return false;
      if (p.price < priceMin || p.price > priceMax) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.nameKz.toLowerCase().includes(q) &&
          !p.nameRu.toLowerCase().includes(q) &&
          !p.descKz.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, category, search, sort, priceMin, priceMax, minRating, onlyNew, onlyHit]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = useCallback(() => {
    setCategory("all");
    setSort("default");
    setPriceMinStr(String(MIN_PRICE));
    setPriceMaxStr(String(MAX_PRICE));
    setMinRating(0);
    setOnlyNew(false);
    setOnlyHit(false);
    setRawSearch("");
    setPage(1);
  }, []);

  const hasActiveFilters =
    category !== "all" ||
    sort !== "default" ||
    priceMin !== MIN_PRICE ||
    priceMax !== MAX_PRICE ||
    minRating > 0 ||
    onlyNew ||
    onlyHit ||
    rawSearch !== "";

  function changePage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-light via-primary-pale to-white py-10 px-4 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(155,47,174,0.12),transparent_70%)]" />
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6 relative">
          <div>
            <h1 className="font-display font-black text-primary text-2xl md:text-4xl leading-tight mb-3">
              Балаларға қазақша орта жасайық!
            </h1>
            <p className="text-text-muted text-sm md:text-base max-w-md leading-relaxed">
              Дамытушы ойыншақтар мен оқу құралдары — сапасы дәлелденген бестселлерлер.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-muted">
              <a href="tel:+77711535152" className="flex items-center gap-1 text-primary hover:opacity-75 transition-opacity font-semibold">
                📞 +7 771 153 51 52
              </a>
              <span className="flex items-center gap-1">📍 Алматы қ.</span>
            </div>
          </div>
          <div className="hidden sm:block shrink-0">
            <div className="bg-primary text-white rounded-2xl px-6 py-4 text-center min-w-[120px]">
              <span className="font-display font-black text-3xl block">20+</span>
              <span className="text-xs opacity-85">тауар түрі</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Search + filter toggle */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
            <Input
              type="search"
              placeholder="Тауар іздеу..."
              value={rawSearch}
              onChange={(e) => { setRawSearch(e.target.value); setPage(1); }}
              className="pl-9"
              aria-label="Тауар іздеу"
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "outline"}
            size="md"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Фильтр</span>
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="md" onClick={resetFilters} aria-label="Фильтрді тазалау">
              <X size={15} />
            </Button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-4" role="group" aria-label="Санат фильтрі">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => { setCategory(c.value); setPage(1); }}
              className={cn(
                "px-4 py-1.5 rounded-full border-[1.5px] text-sm font-bold transition-all",
                category === c.value
                  ? "bg-primary-light text-primary border-primary-soft"
                  : "bg-white text-text-muted border-border hover:border-primary-soft hover:text-primary"
              )}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => { setOnlyHit((v) => !v); setPage(1); }}
            className={cn(
              "px-4 py-1.5 rounded-full border-[1.5px] text-sm font-bold transition-all",
              onlyHit
                ? "bg-primary-light text-primary border-primary-soft"
                : "bg-white text-text-muted border-border hover:border-primary-soft hover:text-primary"
            )}
          >
            ⭐ Хит тауарлар
          </button>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div
            id="filter-panel"
            className="bg-primary-pale border border-border rounded-2xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Sort */}
            <div>
              <label className="text-xs font-bold text-text-muted block mb-1.5">Сұрыптау</label>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
                className="w-full border-[1.5px] border-border rounded-xl px-3 py-2 text-sm bg-white text-text-base outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Price min */}
            <div>
              <label className="text-xs font-bold text-text-muted block mb-1.5">
                Баға: мин (тг)
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder={String(MIN_PRICE)}
                value={priceMinStr}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setPriceMinStr(v);
                  setPage(1);
                }}
              />
            </div>

            {/* Price max */}
            <div>
              <label className="text-xs font-bold text-text-muted block mb-1.5">
                Баға: макс (тг)
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder={String(MAX_PRICE)}
                value={priceMaxStr}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setPriceMaxStr(v);
                  setPage(1);
                }}
              />
            </div>

            {/* Rating + new */}
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-xs font-bold text-text-muted block mb-1.5">
                  Рейтинг (мин)
                </label>
                <select
                  value={minRating}
                  onChange={(e) => { setMinRating(Number(e.target.value)); setPage(1); }}
                  className="w-full border-[1.5px] border-border rounded-xl px-3 py-2 text-sm bg-white text-text-base outline-none focus:border-primary"
                >
                  <option value={0}>Барлығы</option>
                  <option value={4}>4★ және жоғары</option>
                  <option value={4.5}>4.5★ және жоғары</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-text-muted">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => { setOnlyNew(e.target.checked); setPage(1); }}
                  className="accent-primary w-4 h-4"
                />
                Тек жаңалар
              </label>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-lg text-text-base">
            Тауар каталогы
          </h2>
          <span className="text-sm text-text-light">{filtered.length} тауар</span>
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-16 text-text-light">
            <span className="text-5xl block mb-3">🔍</span>
            <p className="text-base font-semibold">Тауар табылмады</p>
            <button onClick={resetFilters} className="text-primary text-sm font-bold mt-2 hover:underline">
              Фильтрді тазалау
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {paginated.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => show(`"${p.nameKz}" себетке қосылды ✓`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2" aria-label="Беттер">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              aria-label="Алдыңғы бет"
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => changePage(n)}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "w-9 h-9 rounded-full text-sm font-bold transition-all",
                  n === page
                    ? "bg-primary text-white"
                    : "bg-white text-text-muted border border-border hover:border-primary-soft"
                )}
              >
                {n}
              </button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              aria-label="Келесі бет"
            >
              <ChevronRight size={16} />
            </Button>
          </nav>
        )}

        {/* Contact block */}
        <div className="mt-10 bg-primary rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-white text-lg mb-1">
              Байланыс / Оптом тапсырыс
            </h3>
            <p className="text-white/80 text-sm">
              +7 771 153 51 52 · Алматы қ. · @intelligent_bala
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://wa.me/77711535152"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
            <a
              href="https://www.instagram.com/intelligent_bala?igsh=NW9wank2cXNxbTFj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/15 text-white font-bold text-sm px-5 py-2.5 rounded-full border border-white/40 hover:bg-white/25 transition-all"
            >
              <IgIcon size={16} /> Instagram
            </a>
          </div>
        </div>
      </section>

      <Toast message={toast.message} visible={toast.visible} onDismiss={dismiss} />
    </>
  );
}

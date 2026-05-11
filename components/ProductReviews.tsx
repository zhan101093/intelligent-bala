"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

interface Props {
  productId: number;
}

export function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`reviews_${productId}`);
      if (stored) setReviews(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, [productId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const review: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      rating,
      date: new Date().toLocaleDateString("ru-RU"),
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    try { localStorage.setItem(`reviews_${productId}`, JSON.stringify(updated)); } catch {}
    setName("");
    setText("");
    setRating(5);
    setShowForm(false);
  }

  if (!hydrated) return null;

  return (
    <div className="border-t border-border mt-2 pt-2.5 px-3.5 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-text-muted">
          Пікірлер{reviews.length > 0 ? ` (${reviews.length})` : ""}
        </span>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs text-primary font-semibold hover:opacity-75 transition-opacity"
        >
          {showForm ? "Жабу" : "+ Пікір жазу"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-3 flex flex-col gap-1.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Атыңыз"
            required
            className="border border-border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary bg-white"
          />
          <div className="flex gap-0.5" aria-label="Рейтинг">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                aria-label={`${s} жұлдыз`}
              >
                <Star
                  size={14}
                  className={(hovered || rating) >= s ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Пікіріңіз..."
            rows={2}
            required
            className="border border-border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary resize-none bg-white"
          />
          <button
            type="submit"
            className="bg-primary text-white text-xs font-bold rounded-lg py-1.5 hover:opacity-90 transition-opacity"
          >
            Жіберу ✓
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-[11px] text-text-light">Әзірше пікір жоқ — бірінші болыңыз!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-bold text-text-base">{r.name}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      className={r.rating >= s ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-text-light ml-auto">{r.date}</span>
              </div>
              <p className="text-[11px] text-text-muted leading-snug">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

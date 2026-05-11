"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const PHONE = "77711535152";

function buildWhatsAppMessage(
  items: ReturnType<typeof useCart>["items"],
  form: { name: string; phone: string; city: string; zip: string; note: string }
): string {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  let msg = "🛒 Жаңа тапсырыс — Intelligent Bala\n";
  msg += "━━━━━━━━━━━━━━━━━━\n";
  msg += "Тауарлар:\n";
  items.forEach((item, idx) => {
    const sub = item.price * item.qty;
    msg += `${idx + 1}. ${item.nameKz} × ${item.qty}\n`;
    msg += `   ${item.price.toLocaleString("ru-RU")} × ${item.qty} = ${sub.toLocaleString("ru-RU")} тг\n`;
  });
  msg += "━━━━━━━━━━━━━━━━━━\n";
  msg += `Жиыны: *${total.toLocaleString("ru-RU")} тг*\n`;
  msg += "━━━━━━━━━━━━━━━━━━\n";
  msg += `Аты: ${form.name}\n`;
  msg += `Тел: ${form.phone}\n`;
  if (form.city) msg += `Қала: ${form.city}\n`;
  if (form.zip) msg += `Пошта индексі: ${form.zip}\n`;
  if (form.note) msg += `Ескертпе: ${form.note}\n`;
  return msg;
}

export function CheckoutClient() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", city: "", zip: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Атыңызды енгізіңіз";
    if (!form.phone.trim()) e.phone = "Телефон нөміріңізді енгізіңіз";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const msg = buildWhatsAppMessage(items, form);
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
    setSubmitted(true);
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl block mb-4">🛒</span>
        <h1 className="font-display font-black text-2xl text-text-base mb-2">Себет бос</h1>
        <Link href="/">
          <Button variant="primary" size="lg" className="mt-2">Каталогқа өту</Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">✅</span>
        <h1 className="font-display font-black text-2xl text-primary mb-2">
          Тапсырысыңыз WhatsApp-қа жіберілді!
        </h1>
        <p className="text-text-muted mb-6">Жақын арада сізбен хабарласамыз.</p>
        <Link href="/">
          <Button variant="primary" size="lg">Каталогқа оралу</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-black text-2xl md:text-3xl text-text-base mb-6">
        Тапсырыс беру
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <h2 className="font-display font-bold text-lg text-text-base">Байланыс ақпараты</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-bold text-text-muted mb-1.5">
              Атыңыз <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Асель Ахметова"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={errors.name ? "border-red-400" : ""}
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-text-muted mb-1.5">
              Телефон <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 700 000 0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={errors.phone ? "border-red-400" : ""}
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-bold text-text-muted mb-1.5">
              Қала / Мекенжай
            </label>
            <Input
              id="city"
              type="text"
              placeholder="Алматы, Абай к-сі 10"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-bold text-text-muted mb-1.5">
              Пошта индексі
            </label>
            <Input
              id="zip"
              type="text"
              inputMode="numeric"
              placeholder="050000"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "") })}
            />
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-bold text-text-muted mb-1.5">
              Ескертпе
            </label>
            <textarea
              id="note"
              rows={3}
              placeholder="Кез-келген ескертпе..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full px-4 py-2.5 border-[1.5px] border-border rounded-xl text-sm bg-white text-text-base placeholder:text-text-light outline-none transition-colors focus:border-primary resize-y min-h-[80px]"
            />
          </div>

          {/* Payment info note */}
          {/*
            PAYMENT INTEGRATION POINT:
            To add Stripe, FreedomPay, Halyk, or ЮKassa — replace or augment this
            section. Create an API route at /api/checkout/route.ts that:
            1. Receives the order payload (items, customer info)
            2. Creates a payment intent with the provider SDK
            3. Returns a redirect URL or client secret
            4. Add a webhook handler at /api/webhook/[provider]/route.ts
               to confirm payment and update order status.
            Order type: { items: CartItem[], customer: CheckoutForm, total: number }
          */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            💡 Тапсырыс WhatsApp арқылы расталады. Төлем — жеткізу кезінде немесе алдын ала аударым.
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            📱 WhatsApp арқылы тапсырыс беру
          </Button>
        </form>

        {/* Order summary */}
        <aside>
          <div className="bg-primary-pale border border-border rounded-2xl p-5">
            <h2 className="font-display font-bold text-lg text-text-base mb-4">Тапсырыс мазмұны</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-base truncate">{item.nameKz}</p>
                    <p className="text-xs text-text-light">{item.qty} дана × {item.price.toLocaleString("ru-RU")} тг</p>
                  </div>
                  <span className="font-display font-bold text-sm text-primary shrink-0">
                    {(item.price * item.qty).toLocaleString("ru-RU")} тг
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-muted">Жиыны:</span>
                <span className="font-display font-black text-2xl text-primary">
                  {totalPrice.toLocaleString("ru-RU")} тг
                </span>
              </div>
            </div>
          </div>

          <Link href="/cart" className="block text-center text-sm text-text-muted hover:text-primary transition-colors mt-3 font-semibold">
            ← Себетке оралу
          </Link>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import type { Order, ProductStat, RevenueSummary } from "@/types";

interface Props {
  orders: Order[];
  weeklyStats: ProductStat[];
  monthlyStats: ProductStat[];
  summary: RevenueSummary;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SummaryCard({
  label,
  orders,
  revenue,
}: {
  label: string;
  orders: number;
  revenue: number;
}) {
  return (
    <div className="bg-primary-pale border border-border rounded-2xl p-5 flex flex-col gap-1">
      <p className="text-xs font-bold text-text-muted uppercase tracking-wide">{label}</p>
      <p className="font-display font-black text-3xl text-primary">{fmt(revenue)} тг</p>
      <p className="text-sm text-text-muted">{orders} тапсырыс</p>
    </div>
  );
}

function StatsTable({ title, stats }: { title: string; stats: ProductStat[] }) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-primary-light">
        <h2 className="font-display font-bold text-base text-text-base">{title}</h2>
      </div>
      {stats.length === 0 ? (
        <p className="text-sm text-text-muted px-5 py-4">Деректер жоқ</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs">
              <th className="text-left px-5 py-2">#</th>
              <th className="text-left px-5 py-2">Тауар</th>
              <th className="text-right px-5 py-2">Дана</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.productId} className="border-b border-border last:border-0 hover:bg-primary-light/50">
                <td className="px-5 py-2.5 text-text-muted font-bold">{i + 1}</td>
                <td className="px-5 py-2.5 font-semibold text-text-base">{s.nameKz}</td>
                <td className="px-5 py-2.5 text-right font-display font-black text-primary">{s.totalQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function AdminDashboard({ orders, weeklyStats, monthlyStats, summary }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#FDFCFF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-border h-14 flex items-center px-4 md:px-6">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <span className="font-display font-black text-lg text-primary">Intelligent Bala</span>
            <span className="text-text-muted text-sm font-semibold ml-1">— Админ</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-text-muted hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Шығу
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <SummaryCard
            label="7 күн ішінде"
            orders={summary.weeklyOrderCount}
            revenue={summary.weeklyTotal}
          />
          <SummaryCard
            label="30 күн ішінде"
            orders={summary.monthlyOrderCount}
            revenue={summary.monthlyTotal}
          />
        </div>

        {/* Stats tables */}
        <div className="grid md:grid-cols-2 gap-4">
          <StatsTable title="Апталық топ тауарлар (7 күн)" stats={weeklyStats} />
          <StatsTable title="Айлық топ тауарлар (30 күн)" stats={monthlyStats} />
        </div>

        {/* Orders table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-primary-light flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-text-base">
              Барлық тапсырыстар ({orders.length})
            </h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-text-muted px-5 py-8 text-center">Тапсырыстар жоқ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-border text-text-muted text-xs bg-primary-light/40">
                    <th className="text-left px-4 py-2">#</th>
                    <th className="text-left px-4 py-2">Күн / Уақыт</th>
                    <th className="text-left px-4 py-2">Аты</th>
                    <th className="text-left px-4 py-2">Телефон</th>
                    <th className="text-left px-4 py-2">Қала</th>
                    <th className="text-left px-4 py-2">Тауарлар</th>
                    <th className="text-right px-4 py-2">Сомасы</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-primary-light/30 align-top">
                      <td className="px-4 py-3 text-text-muted font-bold">{order.id}</td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 font-semibold text-text-base">{order.name}</td>
                      <td className="px-4 py-3 text-text-muted">{order.phone}</td>
                      <td className="px-4 py-3 text-text-muted">{order.city ?? "—"}</td>
                      <td className="px-4 py-3 text-text-base max-w-[220px]">
                        {order.items.map((i) => (
                          <span key={i.productId} className="block text-xs leading-5">
                            {i.nameKz} × {i.qty}
                          </span>
                        ))}
                        {order.note && (
                          <span className="block text-xs text-text-muted mt-0.5 italic">
                            {order.note}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-display font-black text-primary whitespace-nowrap">
                        {fmt(order.total)} тг
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

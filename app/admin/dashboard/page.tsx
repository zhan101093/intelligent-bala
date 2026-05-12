import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/session";
import {
  getOrders,
  getWeeklyProductStats,
  getMonthlyProductStats,
  getRevenueSummary,
} from "@/lib/orders";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await verifyAdminSession();
  if (!session) redirect("/admin");

  const [orders, weeklyStats, monthlyStats, summary] = await Promise.all([
    getOrders(),
    getWeeklyProductStats(),
    getMonthlyProductStats(),
    getRevenueSummary(),
  ]);

  return (
    <AdminDashboard
      orders={orders}
      weeklyStats={weeklyStats}
      monthlyStats={monthlyStats}
      summary={summary}
    />
  );
}

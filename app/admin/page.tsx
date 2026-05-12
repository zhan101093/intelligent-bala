import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/session";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await verifyAdminSession();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border border-border">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🔐</span>
          <h1 className="font-display font-black text-2xl text-text-base">Админ панель</h1>
          <p className="text-sm text-text-muted mt-1">Intelligent Bala</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}

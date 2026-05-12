"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Қате пайда болды");
      }
    } catch {
      setError("Байланыс қатесі");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="username" className="block text-sm font-bold text-text-muted mb-1.5">
          Логин
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-text-muted mb-1.5">
          Пароль
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? "Кіруде..." : "Кіру"}
      </Button>
    </form>
  );
}

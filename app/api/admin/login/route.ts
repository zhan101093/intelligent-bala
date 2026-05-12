import { timingSafeEqual } from "crypto";
import { createAdminSession } from "@/lib/session";

function safeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a.padEnd(64));
  const bb = Buffer.from(b.padEnd(64));
  return timingSafeEqual(ba.subarray(0, 64), bb.subarray(0, 64)) && a === b;
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUsername = safeCompare(
      username ?? "",
      process.env.ADMIN_USERNAME ?? ""
    );
    const validPassword = safeCompare(
      password ?? "",
      process.env.ADMIN_PASSWORD ?? ""
    );

    if (!validUsername || !validPassword) {
      await new Promise((r) => setTimeout(r, 500));
      return Response.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    await createAdminSession();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "internal error" }, { status: 500 });
  }
}

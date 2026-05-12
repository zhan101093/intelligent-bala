import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encrypt(payload: object) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createAdminSession() {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt({ isAdmin: true, expires });
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return await decrypt(token);
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

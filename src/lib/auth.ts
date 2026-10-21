import crypto from "node:crypto";
import { cookies } from "next/headers";

export const NAMA_COOKIE = "4point_admin";

export function passwordAdmin(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "4point-admin";
}

function rahasia(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    `4point-${passwordAdmin()}-session`
  );
}

/** Token sesi = HMAC dari password admin, sehingga hanya bisa dibuat oleh yang tahu password. */
export function buatToken(): string {
  return crypto
    .createHmac("sha256", rahasia())
    .update(`admin:${passwordAdmin()}`)
    .digest("hex");
}

export function tokenValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const benar = buatToken();
  const a = Buffer.from(token);
  const b = Buffer.from(benar);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function cekPassword(input: string): boolean {
  const benar = passwordAdmin();
  const a = Buffer.from(input ?? "");
  const b = Buffer.from(benar);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function sudahLogin(): Promise<boolean> {
  const jar = await cookies();
  return tokenValid(jar.get(NAMA_COOKIE)?.value);
}

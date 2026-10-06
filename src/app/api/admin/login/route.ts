import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NAMA_COOKIE, buatToken, cekPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAKS_PERCOBAAN = 8;
const DURASI_KUNCI = 5 * 60 * 1000;
const percobaan = new Map<string, { jumlah: number; sampai: number }>();

function ipPemanggil(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "lokal"
  );
}

export async function POST(request: Request) {
  const ip = ipPemanggil(request);
  const sekarang = Date.now();
  const catatan = percobaan.get(ip);

  if (catatan && catatan.jumlah >= MAKS_PERCOBAAN && sekarang < catatan.sampai) {
    const sisa = Math.ceil((catatan.sampai - sekarang) / 1000);
    return NextResponse.json(
      { ok: false, error: `Terlalu banyak percobaan. Coba lagi dalam ${sisa} detik.` },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = String((body as { password?: unknown })?.password ?? "");
  } catch {
    password = "";
  }

  if (!cekPassword(password)) {
    const aktif = catatan && sekarang < catatan.sampai ? catatan.jumlah + 1 : 1;
    percobaan.set(ip, { jumlah: aktif, sampai: sekarang + DURASI_KUNCI });
    return NextResponse.json(
      { ok: false, error: "Password admin salah." },
      { status: 401 }
    );
  }

  percobaan.delete(ip);
  const jar = await cookies();
  jar.set(NAMA_COOKIE, buatToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true });
}

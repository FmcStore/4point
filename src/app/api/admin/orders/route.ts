import { NextResponse } from "next/server";
import { sudahLogin } from "@/lib/auth";
import { daftarPesanan, statistik } from "@/lib/pesanan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await sudahLogin())) {
    return NextResponse.json({ ok: false, error: "Belum login." }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "semua";
  const cari = url.searchParams.get("cari") ?? "";

  try {
    const daftar = daftarPesanan({ status, cari, limit: 300 });
    return NextResponse.json({ ok: true, daftar, statistik: statistik() });
  } catch (err) {
    console.error("[GET /api/admin/orders]", err);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat pesanan." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  ValidasiError,
  buatPesanan,
  validasiInput,
} from "@/lib/pesanan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validasiInput(body);
    const pesanan = buatPesanan(input);

    return NextResponse.json({
      ok: true,
      kode: pesanan.kode,
      total: pesanan.total,
    });
  } catch (err) {
    if (err instanceof ValidasiError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    console.error("[POST /api/orders]", err);
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan pada server. Coba lagi." },
      { status: 500 }
    );
  }
}

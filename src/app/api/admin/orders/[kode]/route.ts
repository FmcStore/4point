import { NextResponse } from "next/server";
import { sudahLogin } from "@/lib/auth";
import { ubahStatus } from "@/lib/pesanan";
import { STATUS, type StatusId } from "@/data/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  konteks: { params: Promise<{ kode: string }> }
) {
  if (!(await sudahLogin())) {
    return NextResponse.json({ ok: false, error: "Belum login." }, { status: 401 });
  }

  const { kode } = await konteks.params;

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const status = String(body.status ?? "");
  if (!STATUS.some((s) => s.id === status)) {
    return NextResponse.json(
      { ok: false, error: "Status tidak valid." },
      { status: 400 }
    );
  }

  const detailAkses =
    typeof body.detailAkses === "string"
      ? body.detailAkses.slice(0, 2000)
      : undefined;

  const hasil = ubahStatus(decodeURIComponent(kode), status as StatusId, detailAkses);
  if (!hasil) {
    return NextResponse.json(
      { ok: false, error: "Pesanan tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, pesanan: hasil });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NAMA_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const jar = await cookies();
  jar.delete(NAMA_COOKIE);
  return NextResponse.json({ ok: true });
}

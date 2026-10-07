"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DURASI,
  type Paket,
  hargaDurasi,
  hargaNormal,
  hargaPerBulanEfektif,
} from "@/data/produk";
import { rupiah } from "@/lib/format";
import { useKeranjang } from "./cart-provider";
import { btnSekunder, btnUtama, btnHijau } from "@/lib/ui";

export function PanelPesan({ paket }: { paket: Paket }) {
  const [durasiBulan, setDurasi] = useState(1);
  const [qty, setQty] = useState(1);
  const [pesan, setPesan] = useState("");
  const { tambah } = useKeranjang();
  const router = useRouter();

  const total = hargaDurasi(paket.harga, durasiBulan) * qty;
  const normal = hargaNormal(paket.harga, durasiBulan) * qty;
  const hemat = normal - total;
  const hijau = paket.kategori === "minecraft";

  function tambahKeKeranjang(): boolean {
    tambah(paket.id, durasiBulan, qty);
    setPesan(
      `${qty}x ${paket.nama} (${durasiBulan} bulan) berhasil ditambahkan ke keranjang.`
    );
    return true;
  }

  function beliSekarang() {
    tambah(paket.id, durasiBulan, qty);
    router.push("/checkout");
  }

  return (
    <div className="rounded-2xl kaca kaca-berat p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Harga per bulan
          </p>
          <p className="text-3xl font-extrabold text-white">
            {rupiah(paket.harga)}
          </p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Ready
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">Pilih Durasi</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {DURASI.map((d) => {
            const aktif = durasiBulan === d.bulan;
            return (
              <button
                key={d.bulan}
                type="button"
                onClick={() => setDurasi(d.bulan)}
                className={`rounded-xl border px-3.5 py-3 text-left transition ${
                  aktif
                    ? "border-brand-400/60 bg-brand-500/10 ring-1 ring-brand-400/40"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">
                    {d.label}
                  </span>
                  {d.diskon > 0 && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      -{d.diskon}%
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {rupiah(hargaDurasi(paket.harga, d.bulan))} •{" "}
                  {rupiah(hargaPerBulanEfektif(paket.harga, d.bulan))}/bln
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">Jumlah</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-white/10 bg-ink-900/80">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-11 w-11 place-items-center text-lg font-bold text-slate-300 transition hover:text-white"
              aria-label="Kurangi"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-bold text-white">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(20, q + 1))}
              className="grid h-11 w-11 place-items-center text-lg font-bold text-slate-300 transition hover:text-white"
              aria-label="Tambah"
            >
              +
            </button>
          </div>
          <span className="text-xs text-slate-500">maksimal 20 per pesanan</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-ink-900/60 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Subtotal</span>
          <span className="text-slate-300">{rupiah(normal)}</span>
        </div>
        {hemat > 0 && (
          <div className="mt-1.5 flex items-center justify-between text-sm">
            <span className="text-slate-400">Diskon durasi</span>
            <span className="text-emerald-300">-{rupiah(hemat)}</span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="text-xl font-extrabold text-white">
            {rupiah(total)}
          </span>
        </div>
        <p className="mt-1 text-right text-xs text-slate-500">
          untuk {durasiBulan} bulan • {qty} server
        </p>
      </div>

      {pesan && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3.5 text-sm text-emerald-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          <span>
            {pesan}{" "}
            <button
              type="button"
              onClick={() => router.push("/keranjang")}
              className="font-semibold underline underline-offset-2"
            >
              Lihat keranjang
            </button>
          </span>
        </div>
      )}

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <button type="button" onClick={tambahKeKeranjang} className={btnSekunder}>
          Tambah ke Keranjang
        </button>
        <button
          type="button"
          onClick={beliSekarang}
          className={hijau ? btnHijau : btnUtama}
        >
          Pesan Sekarang
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Pembayaran manual via QRIS. Panel aktif setelah pembayaran dikonfirmasi.
      </p>
    </div>
  );
}

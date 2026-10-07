"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useKeranjang } from "@/components/cart-provider";
import { DURASI, cariPaket, hargaDurasi, hargaNormal } from "@/data/produk";
import { rupiah } from "@/lib/format";
import { btnSekunder, btnUtama, input } from "@/lib/ui";

export default function HalamanKeranjang() {
  const { items, siap, ubahQty, ubahDurasi, hapus, kosongkan } = useKeranjang();

  const baris = useMemo(
    () =>
      items
        .map((it) => {
          const paket = cariPaket(it.paketId);
          if (!paket) return null;
          const normal = hargaNormal(paket.harga, it.durasiBulan) * it.qty;
          const subtotal = hargaDurasi(paket.harga, it.durasiBulan) * it.qty;
          return { it, paket, normal, subtotal };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    [items]
  );

  const totalNormal = baris.reduce((n, b) => n + b.normal, 0);
  const total = baris.reduce((n, b) => n + b.subtotal, 0);
  const hemat = totalNormal - total;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Keranjang
      </h1>
      <p className="mt-2 text-slate-400">
        Periksa paket dan durasi sebelum melanjutkan ke pembayaran.
      </p>

      {!siap ? (
        <div className="mt-10 h-40 animate-pulse rounded-2xl kaca" />
      ) : baris.length === 0 ? (
        <div className="mt-10 rounded-2xl kaca p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-slate-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h2.2l2.3 12.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L21 7H5" />
            </svg>
          </div>
          <h2 className="mt-5 text-xl font-bold text-white">
            Keranjang masih kosong
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Pilih paket Panel Pterodactyl atau Panel Minecraft yang kamu
            butuhkan, lalu tambahkan ke keranjang.
          </p>
          <Link href="/layanan" className={`${btnUtama} mt-6`}>
            Lihat Semua Paket
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-4">
            {baris.map(({ it, paket, subtotal, normal }) => (
              <div
                key={it.id}
                className="rounded-2xl kaca p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/layanan/${paket.slug}`}
                      className="text-base font-bold text-white transition hover:text-brand-300"
                    >
                      {paket.nama}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">
                      RAM {paket.ram} GB · CPU {paket.cpu}% · Disk {paket.disk} GB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => hapus(it.id)}
                    className="rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/20"
                  >
                    Hapus
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Durasi
                      </label>
                      <select
                        value={it.durasiBulan}
                        onChange={(e) =>
                          ubahDurasi(it.id, Number(e.target.value))
                        }
                        className={input}
                      >
                        {DURASI.map((d) => (
                          <option key={d.bulan} value={d.bulan}>
                            {d.label}
                            {d.diskon > 0 ? ` (−${d.diskon}%)` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Jumlah
                      </label>
                      <div className="flex items-center rounded-xl border border-white/10 bg-ink-900/80">
                        <button
                          type="button"
                          onClick={() => ubahQty(it.id, it.qty - 1)}
                          className="grid h-12 w-12 place-items-center text-lg font-bold text-slate-300 transition hover:text-white"
                          aria-label="Kurangi"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center text-sm font-bold text-white">
                          {it.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => ubahQty(it.id, it.qty + 1)}
                          className="grid h-12 w-12 place-items-center text-lg font-bold text-slate-300 transition hover:text-white"
                          aria-label="Tambah"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {normal > subtotal && (
                      <p className="text-xs text-slate-500 line-through">
                        {rupiah(normal)}
                      </p>
                    )}
                    <p className="text-lg font-extrabold text-white">
                      {rupiah(subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <Link href="/layanan" className={btnSekunder}>
                Tambah paket lain
              </Link>
              <button
                type="button"
                onClick={kosongkan}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-slate-400 transition hover:text-rose-300"
              >
                Kosongkan keranjang
              </button>
            </div>
          </div>

          <aside className="rounded-2xl kaca kaca-berat p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-white">Ringkasan</h2>

            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200">{rupiah(totalNormal)}</span>
              </div>
              {hemat > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Diskon durasi</span>
                  <span className="text-emerald-300">-{rupiah(hemat)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="font-semibold text-white">Total bayar</span>
                <span className="text-xl font-extrabold text-white">
                  {rupiah(total)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className={`${btnUtama} mt-6 w-full`}>
              Lanjut ke Checkout
            </Link>

            <p className="mt-4 text-center text-xs text-slate-500">
              Pembayaran manual via QRIS. Panel diproses setelah pembayaran
              dikonfirmasi.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

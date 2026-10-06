"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useKeranjang } from "@/components/cart-provider";
import { cariPaket, hargaDurasi } from "@/data/produk";
import { rupiah } from "@/lib/format";
import { btnUtama, input, labelInput } from "@/lib/ui";
import { site, waLink } from "@/data/site";

export default function HalamanCheckout() {
  const router = useRouter();
  const { items, siap, kosongkan } = useKeranjang();

  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [lokasiServer, setLokasiServer] = useState("");
  const [catatan, setCatatan] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");

  const baris = useMemo(
    () =>
      items
        .map((it) => {
          const paket = cariPaket(it.paketId);
          if (!paket) return null;
          return {
            it,
            paket,
            subtotal: hargaDurasi(paket.harga, it.durasiBulan) * it.qty,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    [items]
  );

  const total = baris.reduce((n, b) => n + b.subtotal, 0);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (nama.trim().length < 3) {
      setError("Nama minimal 3 karakter.");
      return;
    }
    if (whatsapp.replace(/[^0-9]/g, "").length < 9) {
      setError("Nomor WhatsApp tidak valid.");
      return;
    }
    if (baris.length === 0) {
      setError("Keranjang masih kosong.");
      return;
    }

    setMemuat(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          whatsapp,
          email,
          lokasiServer,
          catatan,
          items: items.map((it) => ({
            paketId: it.paketId,
            durasiBulan: it.durasiBulan,
            qty: it.qty,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Gagal membuat pesanan. Coba lagi.");
        setMemuat(false);
        return;
      }

      kosongkan();
      router.push(`/pesanan/${data.kode}`);
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi kamu.");
      setMemuat(false);
    }
  }

  if (!siap) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    );
  }

  if (baris.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white">Keranjang kosong</h1>
        <p className="mt-3 text-slate-400">
          Tambahkan paket terlebih dahulu sebelum melakukan checkout.
        </p>
        <Link href="/layanan" className={`${btnUtama} mt-6`}>
          Lihat Semua Paket
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-slate-400">
        Isi data di bawah dengan benar. Detail panel akan dikirim ke WhatsApp
        kamu setelah pembayaran dikonfirmasi.
      </p>

      <form
        onSubmit={kirim}
        className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-bold text-white">Data Pemesan</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelInput} htmlFor="nama">
                Nama / Nama Server <span className="text-rose-400">*</span>
              </label>
              <input
                id="nama"
                className={input}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi / ServerBuddy"
                maxLength={60}
                required
              />
            </div>

            <div>
              <label className={labelInput} htmlFor="wa">
                Nomor WhatsApp <span className="text-rose-400">*</span>
              </label>
              <input
                id="wa"
                className={input}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                inputMode="tel"
                required
              />
            </div>

            <div>
              <label className={labelInput} htmlFor="email">
                Email <span className="text-slate-500">(opsional)</span>
              </label>
              <input
                id="email"
                type="email"
                className={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelInput} htmlFor="lokasi">
                Lokasi / Region Server{" "}
                <span className="text-slate-500">(opsional)</span>
              </label>
              <input
                id="lokasi"
                className={input}
                value={lokasiServer}
                onChange={(e) => setLokasiServer(e.target.value)}
                placeholder="Contoh: Jakarta, Singapore"
                maxLength={80}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelInput} htmlFor="catatan">
                Catatan <span className="text-slate-500">(opsional)</span>
              </label>
              <textarea
                id="catatan"
                className={`${input} min-h-24 resize-y`}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: pakai egg Paper versi 1.21, butuh port tambahan, dll."
                maxLength={500}
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-sky-400/25 bg-sky-400/[0.07] p-4 text-sm text-sky-200">
            <b>Pembayaran manual.</b> Setelah pesanan dibuat, kamu akan menerima
            QRIS dan kode pesanan. Lakukan pembayaran lalu konfirmasi ke CS
            melalui WhatsApp.
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-white">Ringkasan Pesanan</h2>

          <ul className="mt-5 space-y-3">
            {baris.map(({ it, paket, subtotal }) => (
              <li key={it.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {paket.nama}
                  </p>
                  <p className="text-xs text-slate-400">
                    {it.durasiBulan} bulan × {it.qty}
                  </p>
                </div>
                <span className="text-sm text-slate-200">
                  {rupiah(subtotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-extrabold text-white">
              {rupiah(total)}
            </span>
          </div>

          <button type="submit" disabled={memuat} className={`${btnUtama} mt-6 w-full`}>
            {memuat ? "Memproses..." : "Buat Pesanan & Bayar QRIS"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Butuh bantuan?{" "}
            <a
              href={waLink(`Halo ${site.nama}, saya butuh bantuan saat checkout.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
            >
              Chat CS
            </a>
          </p>
        </aside>
      </form>
    </div>
  );
}

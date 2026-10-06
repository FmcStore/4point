import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PAKET,
  cariPaket,
  cariKategori,
  paketKategori,
} from "@/data/produk";
import { rupiah } from "@/lib/format";
import { badge, kartu } from "@/lib/ui";
import { PanelPesan } from "@/components/panel-pesan";

export function generateStaticParams() {
  return PAKET.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paket = cariPaket(slug);
  if (!paket) return { title: "Paket tidak ditemukan" };
  return {
    title: `${paket.nama} — ${rupiah(paket.harga)}/bulan`,
    description: `${paket.nama} 3Point: RAM ${paket.ram} GB, CPU ${paket.cpu}%, disk ${paket.disk} GB. Harga ${rupiah(paket.harga)} per bulan.`,
  };
}

export default async function HalamanDetailPaket({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paket = cariPaket(slug);
  if (!paket) notFound();

  const kategori = cariKategori(paket.kategori);
  const saudara = paketKategori(paket.kategori);
  const hijau = paket.kategori === "minecraft";

  const spesifikasi = [
    { label: "RAM", nilai: `${paket.ram} GB` },
    { label: "CPU", nilai: `${paket.cpu}%` },
    { label: "Penyimpanan", nilai: `${paket.disk} GB SSD` },
    { label: "Backup", nilai: "Harian otomatis" },
    { label: "Proteksi", nilai: "Anti-DDoS" },
    { label: "Koneksi", nilai: "Fiber 1 Gbps" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-sky-300">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/layanan" className="transition hover:text-sky-300">
          Layanan
        </Link>
        <span>/</span>
        <Link
          href={`/layanan?kategori=${paket.kategori}`}
          className="transition hover:text-sky-300"
        >
          {kategori?.singkat}
        </Link>
        <span>/</span>
        <span className="text-slate-300">{paket.nama}</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
              hijau
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-sky-400/30 bg-sky-400/10 text-sky-300"
            }`}
          >
            {kategori?.nama}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {paket.nama}
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-400">
            {kategori?.deskripsi}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
              {rupiah(paket.harga)}
              <span className="text-xs font-medium text-slate-400">/bulan</span>
            </span>
            <span className={badge}>Aktivasi &lt; 5 menit</span>
            <span className={badge}>Garansi 3 hari</span>
          </div>

          <div className={`${kartu} mt-8 grid gap-4 p-6 sm:grid-cols-3`}>
            {spesifikasi.map((s) => (
              <div key={s.label}>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  {s.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{s.nilai}</p>
              </div>
            ))}
          </div>

          <div className={`${kartu} mt-6 p-6`}>
            <h2 className="font-bold text-white">Yang kamu dapatkan</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(kategori?.fitur ?? []).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                </span>
                Kapasitas RAM {paket.ram} GB
              </li>
            </ul>
          </div>

          <div className={`${kartu} mt-6 p-6`}>
            <h2 className="font-bold text-white">
              Ganti kapasitas {kategori?.singkat}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Klik untuk berpindah paket dengan kategori yang sama.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {saudara.map((p) => {
                const aktif = p.id === paket.id;
                return (
                  <Link
                    key={p.id}
                    href={`/layanan/${p.slug}`}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                      aktif
                        ? "border-sky-400/60 bg-sky-500/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {p.ram} GB
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <PanelPesan paket={paket} />

          <div className={`${kartu} mt-5 p-5 text-sm text-slate-400`}>
            <h3 className="font-semibold text-white">Cara pembayaran</h3>
            <ol className="mt-3 space-y-2">
              <li>1. Buat pesanan dan isi data kamu.</li>
              <li>2. Scan QRIS pada halaman pesanan.</li>
              <li>3. Konfirmasi ke CS melalui WhatsApp.</li>
              <li>4. Panel aktif dan siap dipakai.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

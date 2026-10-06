import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { KATEGORI, paketKategori } from "@/data/produk";
import { PlanCard } from "@/components/plan-card";
import { badge, judulSeksi, subSeksi } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Semua Layanan",
  description:
    "Daftar lengkap paket Panel Pterodactyl dan Panel Minecraft 3Point beserta harganya.",
};

type Filter = "semua" | "panel" | "minecraft";

const TAB: Array<{ id: Filter; label: string }> = [
  { id: "semua", label: "Semua" },
  { id: "panel", label: "Panel Biasa" },
  { id: "minecraft", label: "Khusus Minecraft" },
];

export default async function HalamanLayanan({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const sp = await searchParams;
  const filter: Filter =
    sp.kategori === "panel" || sp.kategori === "minecraft"
      ? sp.kategori
      : "semua";

  const daftar =
    filter === "semua"
      ? [...paketKategori("panel"), ...paketKategori("minecraft")]
      : paketKategori(filter);

  const kategoriAktif = KATEGORI.find((k) => k.id === filter);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className={badge}>Katalog Paket</span>
        <h1 className={`${judulSeksi} mt-4`}>Pilih Paket Sesuai Kebutuhan</h1>
        <p className={`${subSeksi} mx-auto text-center`}>
          Panel Pterodactyl mulai Rp1.000/GB dan server Minecraft mulai
          Rp13.000. Semua harga per bulan.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {TAB.map((t) => {
          const aktif = filter === t.id;
          return (
            <Link
              key={t.id}
              href={t.id === "semua" ? "/layanan" : `/layanan?kategori=${t.id}`}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                aktif
                  ? "border-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-sky-500/25"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {kategoriAktif && (
        <div className="mx-auto mt-8 flex max-w-3xl items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Image
            src={kategoriAktif.gambar}
            alt={kategoriAktif.nama}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover"
          />
          <p className="text-sm text-slate-400">{kategoriAktif.deskripsi}</p>
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {daftar.map((p) => (
          <PlanCard key={p.id} paket={p} />
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <h2 className="text-lg font-bold text-white">Butuh paket custom?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Kami bisa menyesuaikan kapasitas RAM, CPU, disk, dan durasi sesuai
          kebutuhanmu. Hubungi CS untuk penawaran khusus.
        </p>
        <Link
          href="/#harga"
          className="mt-4 inline-flex text-sm font-semibold text-sky-300 underline-offset-4 hover:underline"
        >
          Lihat daftar harga lengkap
        </Link>
      </div>
    </div>
  );
}

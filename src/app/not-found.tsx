import Link from "next/link";
import { btnSekunder, btnUtama } from "@/lib/ui";

export default function HalamanTidakDitemukan() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-7xl font-black text-transparent">
        404
      </span>
      <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-md text-slate-400">
        Halaman yang kamu cari sudah dipindahkan atau tidak pernah ada. Coba
        kembali ke beranda atau lihat daftar layanan kami.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={btnUtama}>
          Kembali ke Beranda
        </Link>
        <Link href="/layanan" className={btnSekunder}>
          Lihat Layanan
        </Link>
      </div>
    </div>
  );
}

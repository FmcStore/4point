import Image from "next/image";
import Link from "next/link";
import { type Paket, cariKategori } from "@/data/produk";
import { rupiah } from "@/lib/format";
import { kartu, kartuHover } from "@/lib/ui";

const AKSEN: Record<string, { teks: string; bg: string; border: string; grad: string }> = {
  panel: {
    teks: "text-sky-300",
    bg: "bg-sky-400/10",
    border: "border-sky-400/30",
    grad: "from-sky-500 to-blue-600",
  },
  minecraft: {
    teks: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    grad: "from-emerald-500 to-teal-600",
  },
};

export function PlanCard({ paket }: { paket: Paket }) {
  const kategori = cariKategori(paket.kategori);
  const aksen = AKSEN[paket.kategori] ?? AKSEN.panel;

  return (
    <div
      className={`${kartu} ${kartuHover} relative flex flex-col overflow-hidden p-5`}
    >
      {paket.populer && (
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[11px] font-bold text-amber-950">
          TERLARIS
        </span>
      )}

      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {kategori ? (
            <Image
              src={kategori.gambar}
              alt={kategori.nama}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className={`grid h-full w-full place-items-center bg-gradient-to-br ${aksen.grad} text-white`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="3" width="19" height="7" rx="2" />
                <rect x="2.5" y="14" width="19" height="7" rx="2" />
                <path d="M6.5 6.5h.01M6.5 17.5h.01" />
              </svg>
            </span>
          )}
        </span>
        <span className={`rounded-full border ${aksen.border} ${aksen.bg} px-2.5 py-1 text-[11px] font-semibold ${aksen.teks}`}>
          {kategori?.singkat ?? paket.kategori}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-white">{paket.nama}</h3>
      {paket.unggulan && (
        <p className="mt-0.5 text-xs font-medium text-amber-300">{paket.unggulan}</p>
      )}

      <div className="mt-3 flex items-end gap-1.5">
        <span className="text-2xl font-extrabold tracking-tight text-white">
          {rupiah(paket.harga)}
        </span>
        <span className="pb-1 text-xs text-slate-400">/bulan</span>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        <li className="flex items-center gap-2">
          <Ikon /> RAM <b className="font-semibold text-white">{paket.ram} GB</b>
        </li>
        <li className="flex items-center gap-2">
          <Ikon /> CPU <b className="font-semibold text-white">{paket.cpu}%</b>
        </li>
        <li className="flex items-center gap-2">
          <Ikon /> Disk <b className="font-semibold text-white">{paket.disk} GB</b>
        </li>
      </ul>

      <Link
        href={`/layanan/${paket.slug}`}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${aksen.grad} px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110`}
      >
        Pesan Sekarang
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}

function Ikon() {
  return (
    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-400">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12.5l5 5L20 6.5" />
      </svg>
    </span>
  );
}

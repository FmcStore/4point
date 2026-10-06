"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btnUtama, input, labelInput } from "@/lib/ui";
import { site, waLink } from "@/data/site";

export default function HalamanLacakPesanan() {
  const router = useRouter();
  const [kode, setKode] = useState("");

  function cari(e: React.FormEvent) {
    e.preventDefault();
    const bersih = kode.trim().toUpperCase();
    if (!bersih) return;
    router.push(`/pesanan/${encodeURIComponent(bersih)}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          Lacak Pesanan
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Cek Status Pesanan
        </h1>
        <p className="mt-3 text-slate-400">
          Masukkan kode pesanan yang kamu terima setelah checkout, contoh:{" "}
          <span className="font-mono text-slate-300">3P-A1B2C3</span>
        </p>
      </div>

      <form
        onSubmit={cari}
        className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <label className={labelInput} htmlFor="kode">
          Kode Pesanan
        </label>
        <input
          id="kode"
          className={`${input} font-mono uppercase tracking-wider`}
          value={kode}
          onChange={(e) => setKode(e.target.value.toUpperCase())}
          placeholder="3P-XXXXXX"
          autoComplete="off"
        />
        <button type="submit" className={`${btnUtama} mt-5 w-full`}>
          Cari Pesanan
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
        <p className="font-semibold text-white">Kode pesanan hilang?</p>
        <p className="mt-1.5">
          Kirimkan nama dan nomor WhatsApp yang kamu gunakan saat memesan, lalu
          CS akan membantu mencarikan kode pesananmu.
        </p>
        <a
          href={waLink(`Halo ${site.nama}, saya lupa kode pesanan saya.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          Hubungi CS
        </a>
      </div>
    </div>
  );
}

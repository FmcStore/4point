import Link from "next/link";
import type { Metadata } from "next";
import { ambilPesanan } from "@/lib/pesanan";
import { infoStatus } from "@/data/status";
import { rupiah, tanggalWaktu } from "@/lib/format";
import { normalisasiWa, site, waLink } from "@/data/site";
import { Qris } from "@/components/qris";
import { TombolSalin } from "@/components/tombol-salin";
import { btnSekunder, kartu } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Pesanan",
  robots: { index: false },
};

const TAHAP = [
  { id: "menunggu_pembayaran", label: "Pesanan dibuat" },
  { id: "diproses", label: "Pembayaran diverifikasi" },
  { id: "aktif", label: "Panel aktif" },
  { id: "selesai", label: "Selesai" },
];

function urutanStatus(status: string): number {
  const i = TAHAP.findIndex((t) => t.id === status);
  return i < 0 ? 0 : i;
}

export default async function HalamanDetailPesanan({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const pesanan = ambilPesanan(decodeURIComponent(kode));

  if (!pesanan) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-slate-400">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.2-3.2" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-white">
          Pesanan tidak ditemukan
        </h1>
        <p className="mt-2 text-slate-400">
          Kode <span className="font-mono text-slate-300">{kode}</span> tidak
          terdaftar. Periksa kembali kode pesanan kamu.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/pesanan" className={btnSekunder}>
            Coba kode lain
          </Link>
          <a
            href={waLink(`Halo ${site.nama}, saya ingin menanyakan pesanan saya.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={btnSekunder}
          >
            Hubungi CS
          </a>
        </div>
      </div>
    );
  }

  const status = infoStatus(pesanan.status);
  const tahapSekarang = urutanStatus(pesanan.status);
  const dibatalkan = pesanan.status === "batal";

  const daftarItem = pesanan.items
    .map((it) => `${it.nama} (${it.durasi_bulan} bulan) x${it.qty}`)
    .join(", ");

  const pesanWa = [
    `Halo ${site.nama}, saya sudah melakukan pembayaran.`,
    "",
    `Kode Pesanan: ${pesanan.kode}`,
    `Nama: ${pesanan.nama}`,
    `Total: ${rupiah(pesanan.total)}`,
    `Paket: ${daftarItem}`,
    "",
    "Mohon dibantu untuk segera diproses ya. Terima kasih.",
  ].join("\n");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/layanan"
        className="text-xs text-slate-500 transition hover:text-sky-300"
      >
        ← Kembali ke daftar layanan
      </Link>

      <div className={`${kartu} mt-5 flex flex-wrap items-start justify-between gap-5 p-6`}>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Kode Pesanan
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-2xl font-bold tracking-wider text-white">
              {pesanan.kode}
            </span>
            <TombolSalin teks={pesanan.kode} label="Salin kode" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Dibuat {tanggalWaktu(pesanan.created_at)} WIB
          </p>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${status.kelas}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <p className="mt-2 text-xs text-slate-500">
            Total {rupiah(pesanan.total)}
          </p>
        </div>
      </div>

      <div className={`${kartu} mt-5 p-6`}>
        <p className="text-sm text-slate-300">{status.keterangan}</p>

        {!dibatalkan && (
          <ol className="mt-6 grid gap-4 sm:grid-cols-4">
            {TAHAP.map((t, i) => {
              const sudah = i <= tahapSekarang;
              return (
                <li key={t.id} className="relative">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        sudah
                          ? "bg-gradient-to-br from-sky-500 to-violet-600 text-white"
                          : "border border-white/15 bg-white/5 text-slate-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        sudah ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {t.label}
                    </span>
                  </div>
                  {i < TAHAP.length - 1 && (
                    <span
                      className={`mt-3 hidden h-1 rounded-full sm:block ${
                        i < tahapSekarang
                          ? "bg-gradient-to-r from-sky-500 to-violet-600"
                          : "bg-white/10"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="space-y-5">
          <div className={`${kartu} p-6`}>
            <h2 className="text-lg font-bold text-white">Rincian Paket</h2>
            <div className="mt-4 space-y-3">
              {pesanan.items.map((it) => (
                <div
                  key={it.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 bg-ink-900/50 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{it.nama}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      RAM {it.ram} GB · {it.durasi_bulan} bulan × {it.qty} ·{" "}
                      {rupiah(it.harga_bulanan)}/bulan
                    </p>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {rupiah(it.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-semibold text-white">Total</span>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-extrabold text-white">
                  {rupiah(pesanan.total)}
                </span>
                <TombolSalin teks={String(pesanan.total)} label="Salin" />
              </div>
            </div>
          </div>

          <div className={`${kartu} p-6`}>
            <h2 className="text-lg font-bold text-white">Data Pemesan</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Nama
                </dt>
                <dd className="mt-1 text-sm text-slate-200">{pesanan.nama}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  WhatsApp
                </dt>
                <dd className="mt-1 text-sm text-slate-200">
                  {pesanan.whatsapp}
                </dd>
              </div>
              {pesanan.email && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-slate-200">{pesanan.email}</dd>
                </div>
              )}
              {pesanan.lokasi_server && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Lokasi Server
                  </dt>
                  <dd className="mt-1 text-sm text-slate-200">
                    {pesanan.lokasi_server}
                  </dd>
                </div>
              )}
              {pesanan.catatan && (
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Catatan
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-200">
                    {pesanan.catatan}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {pesanan.detail_akses && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.07] p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Detail Akses Panel
              </h2>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-emerald-400/20 bg-ink-950/60 p-4 font-mono text-sm text-emerald-100">
                {pesanan.detail_akses}
              </pre>
              <div className="mt-3">
                <TombolSalin teks={pesanan.detail_akses} label="Salin detail akses" />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {pesanan.status === "menunggu_pembayaran" ? (
            <Qris total={pesanan.total} />
          ) : (
            <div className={`${kartu} p-6`}>
              <h2 className="text-lg font-bold text-white">Pembayaran</h2>
              <p className="mt-2 text-sm text-slate-400">
                {dibatalkan
                  ? "Pesanan ini dibatalkan."
                  : `Pembayaran untuk pesanan ini sudah tercatat. Status saat ini: ${status.label}.`}
              </p>
            </div>
          )}

          <div className={`${kartu} p-6`}>
            <h2 className="text-lg font-bold text-white">Konfirmasi ke CS</h2>
            <p className="mt-2 text-sm text-slate-400">
              Setelah membayar, kirim konfirmasi melalui WhatsApp dengan
              menyertakan kode pesanan agar panel segera diproses.
            </p>
            <a
              href={waLink(pesanWa)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
              </svg>
              Konfirmasi via WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-slate-500">
              CS: {site.whatsappTampil} ({normalisasiWa(site.whatsapp)})
            </p>
          </div>

          <div className={`${kartu} p-6 text-sm text-slate-400`}>
            <h3 className="font-semibold text-white">Simpan halaman ini</h3>
            <p className="mt-1.5">
              Kamu bisa membuka kembali status pesanan kapan saja di menu{" "}
              <Link
                href="/pesanan"
                className="font-semibold text-sky-300 underline-offset-2 hover:underline"
              >
                Lacak Pesanan
              </Link>{" "}
              menggunakan kode {pesanan.kode}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

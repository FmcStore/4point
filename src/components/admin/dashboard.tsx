"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PesananLengkap } from "@/lib/pesanan";
import { STATUS, infoStatus, type StatusId } from "@/data/status";
import { rupiah, tanggalWaktu } from "@/lib/format";
import { normalisasiWa, site, waLink } from "@/data/site";
import { btnSekunder, btnUtama, kartu } from "@/lib/ui";

interface Statistik {
  total: number;
  perStatus: Record<string, number>;
  omzet: number;
}

const FILTER: Array<{ id: string; label: string }> = [
  { id: "semua", label: "Semua" },
  ...STATUS.map((s) => ({ id: s.id, label: s.label })),
];

export function Dashboard() {
  const router = useRouter();
  const [daftar, setDaftar] = useState<PesananLengkap[]>([]);
  const [statistik, setStatistik] = useState<Statistik>({
    total: 0,
    perStatus: {},
    omzet: 0,
  });
  const [filter, setFilter] = useState("semua");
  const [cari, setCari] = useState("");
  const [cariTertunda, setCariTertunda] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");
  const [terpilih, setTerpilih] = useState<PesananLengkap | null>(null);
  const [statusBaru, setStatusBaru] = useState<StatusId>("menunggu_pembayaran");
  const [detailAkses, setDetailAkses] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);
  const [notif, setNotif] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setCariTertunda(cari), 350);
    return () => clearTimeout(t);
  }, [cari]);

  const [versi, setVersi] = useState(0);

  useEffect(() => {
    let masihAktif = true;

    async function ambilData() {
      try {
        const q = new URLSearchParams();
        q.set("status", filter);
        if (cariTertunda.trim()) q.set("cari", cariTertunda.trim());
        const res = await fetch(`/api/admin/orders?${q.toString()}`, {
          cache: "no-store",
        });
        if (!masihAktif) return;

        if (res.status === 401) {
          router.refresh();
          return;
        }

        const data = await res.json();
        if (!masihAktif) return;

        if (!data?.ok) {
          setError(data?.error || "Gagal memuat data.");
        } else {
          setDaftar(data.daftar ?? []);
          setStatistik(data.statistik ?? { total: 0, perStatus: {}, omzet: 0 });
          setError("");
        }
      } catch {
        if (masihAktif) setError("Tidak dapat menghubungi server.");
      } finally {
        if (masihAktif) setMemuat(false);
      }
    }

    ambilData();

    return () => {
      masihAktif = false;
    };
  }, [filter, cariTertunda, versi, router]);

  function muatUlang() {
    setMemuat(true);
    setVersi((v) => v + 1);
  }

  function bukaDetail(p: PesananLengkap) {
    setTerpilih(p);
    setStatusBaru(p.status);
    setDetailAkses(p.detail_akses ?? "");
    setNotif("");
  }

  async function simpan() {
    if (!terpilih) return;
    setMenyimpan(true);
    setNotif("");
    try {
      const res = await fetch(
        `/api/admin/orders/${encodeURIComponent(terpilih.kode)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusBaru, detailAkses }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setNotif(data?.error || "Gagal menyimpan.");
      } else {
        setTerpilih(data.pesanan);
        setStatusBaru(data.pesanan.status);
        setDetailAkses(data.pesanan.detail_akses ?? "");
        setNotif("Perubahan berhasil disimpan.");
        muatUlang();
      }
    } catch {
      setNotif("Tidak dapat menghubungi server.");
    } finally {
      setMenyimpan(false);
    }
  }

  async function keluar() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const kartuStat = useMemo(
    () => [
      { label: "Total Pesanan", nilai: statistik.total, warna: "text-white" },
      {
        label: "Menunggu Bayar",
        nilai: statistik.perStatus["menunggu_pembayaran"] ?? 0,
        warna: "text-amber-300",
      },
      {
        label: "Diproses",
        nilai: statistik.perStatus["diproses"] ?? 0,
        warna: "text-sky-300",
      },
      {
        label: "Aktif",
        nilai: statistik.perStatus["aktif"] ?? 0,
        warna: "text-emerald-300",
      },
      {
        label: "Omzet (terverifikasi)",
        nilai: rupiah(statistik.omzet),
        warna: "text-violet-300",
      },
    ],
    [statistik]
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola pesanan, verifikasi pembayaran, dan kirim detail panel ke
            pelanggan.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={muatUlang} className={btnSekunder}>
            Muat ulang
          </button>
          <button
            type="button"
            onClick={keluar}
            className="inline-flex items-center justify-center rounded-xl border border-rose-400/25 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/20"
          >
            Keluar
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kartuStat.map((s) => (
          <div key={s.label} className={`${kartu} p-5`}>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {s.label}
            </p>
            <p className={`mt-2 text-2xl font-extrabold ${s.warna}`}>{s.nilai}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTER.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                setMemuat(true);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                filter === f.id
                  ? "border-transparent bg-gradient-to-r from-sky-500 to-violet-600 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari kode / nama / WhatsApp..."
          className="ml-auto w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 sm:w-72"
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className={`${kartu} mt-5 overflow-hidden`}>
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:grid">
          <span>Kode</span>
          <span>Tanggal</span>
          <span>Nama</span>
          <span>Paket</span>
          <span>Total</span>
          <span>Status</span>
        </div>

        {memuat ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : daftar.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Belum ada pesanan pada filter ini.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {daftar.map((p) => {
              const st = infoStatus(p.status);
              return (
                <li key={p.kode}>
                  <button
                    type="button"
                    onClick={() => bukaDetail(p)}
                    className="grid w-full grid-cols-1 gap-2 px-5 py-4 text-left transition hover:bg-white/[0.03] lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-4"
                  >
                    <span className="font-mono text-sm font-semibold text-white">
                      {p.kode}
                    </span>
                    <span className="text-xs text-slate-400">
                      {tanggalWaktu(p.created_at)}
                    </span>
                    <span className="text-sm text-slate-200">{p.nama}</span>
                    <span className="truncate text-xs text-slate-400">
                      {p.items.map((i) => i.nama).join(", ")}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {rupiah(p.total)}
                    </span>
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${st.kelas}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {terpilih && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setTerpilih(null)}
          />
          <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-ink-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Detail Pesanan
                </p>
                <p className="font-mono text-xl font-bold text-white">
                  {terpilih.kode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTerpilih(null)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                aria-label="Tutup"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-slate-500">Nama</dt>
                  <dd className="text-slate-200">{terpilih.nama}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">WhatsApp</dt>
                  <dd className="text-slate-200">{terpilih.whatsapp}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Email</dt>
                  <dd className="text-slate-200">{terpilih.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Lokasi</dt>
                  <dd className="text-slate-200">
                    {terpilih.lokasi_server || "-"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-500">Tanggal</dt>
                  <dd className="text-slate-200">
                    {tanggalWaktu(terpilih.created_at)}
                  </dd>
                </div>
                {terpilih.catatan && (
                  <div className="col-span-2">
                    <dt className="text-xs text-slate-500">Catatan</dt>
                    <dd className="whitespace-pre-wrap text-slate-200">
                      {terpilih.catatan}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Item
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                {terpilih.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="text-slate-300">
                      {i.nama} · {i.durasi_bulan}bln × {i.qty}
                    </span>
                    <span className="font-semibold text-white">
                      {rupiah(i.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm">
                <span className="font-semibold text-white">Total</span>
                <span className="font-extrabold text-white">
                  {rupiah(terpilih.total)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Status Pesanan
              </label>
              <select
                value={statusBaru}
                onChange={(e) => setStatusBaru(e.target.value as StatusId)}
                className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60"
              >
                {STATUS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Detail Akses Panel (dikirim ke pelanggan)
              </label>
              <textarea
                value={detailAkses}
                onChange={(e) => setDetailAkses(e.target.value)}
                rows={5}
                placeholder={"Contoh:\nLink Panel: https://panel.3point.id\nEmail: budi@mail.com\nPassword: xxxxx\nServer ID: a1b2c3"}
                className="w-full resize-y rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-400/60"
              />
            </div>

            {notif && (
              <div className="mt-4 rounded-xl border border-sky-400/30 bg-sky-400/10 p-3.5 text-sm text-sky-200">
                {notif}
              </div>
            )}

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={simpan}
                disabled={menyimpan}
                className={btnUtama}
              >
                {menyimpan ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <a
                href={waLink(
                  `Halo ${terpilih.nama}, terima kasih sudah memesan di ${site.nama}.\n\nKode Pesanan: ${terpilih.kode}\nTotal: ${rupiah(terpilih.total)}\n\n${
                    detailAkses || "Pesanan kamu sedang kami proses ya."
                  }`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
              >
                Chat Pelanggan
              </a>
            </div>

            <a
              href={`https://wa.me/${normalisasiWa(terpilih.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-center text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
            >
              Buka chat WhatsApp pelanggan ({terpilih.whatsapp})
            </a>

            <button
              type="button"
              onClick={() => {
                setTerpilih(null);
                setNotif("");
              }}
              className="mt-4 text-xs text-slate-500 hover:text-slate-300"
            >
              Tutup panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

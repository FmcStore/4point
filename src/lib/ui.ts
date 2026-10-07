/**
 * Kumpulan kelas Tailwind yang dipakai berulang.
 *
 * Tema: AMOLED (hitam murni) + liquid glass.
 * Dua tingkat permukaan kaca, sengaja dibedakan demi performa:
 *   - `kartu`      -> `.kaca`       : tepi + highlight, TANPA blur.
 *   - `kacaBerat`  -> `.kaca-berat` : ditambah `backdrop-filter`.
 *     Hanya untuk elemen besar (header, sidebar lengket, kartu hero,
 *     panel login) karena blur relatif mahal di perangkat low-end.
 * Definisinya ada di `src/app/globals.css`.
 */

/** Permukaan kaca ringan: kartu, daftar, tabel, panel kecil. */
export const kartu = "kaca";

/** Efek interaktif untuk kartu (angkat + tepi menyala). */
export const kartuHover = "kaca-hover";

/** Permukaan kaca dengan blur: pakai hemat, hanya elemen besar. */
export const kacaBerat = "kaca kaca-berat";

export const btnUtama =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-gradient-to-b from-brand-400 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/50 transition duration-300 hover:from-brand-300 hover:to-brand-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const btnSekunder =
  "kaca inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:border-white/25 hover:shadow-[0_22px_50px_-28px_rgba(47,123,255,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Hijau dipertahankan khusus untuk WhatsApp.
 * Ini satu-satunya warna di luar ramp biru, karena tombol WhatsApp
 * perlu langsung dikenali sebagai WhatsApp (bukan dekorasi).
 */
export const btnHijau =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-950 transition duration-300 hover:from-emerald-300 hover:to-emerald-500 active:scale-[0.98]";

export const labelInput = "mb-1.5 block text-sm font-medium text-slate-300";

export const input =
  "w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition duration-300 focus:border-brand-400/60 focus:bg-ink-800 focus:ring-2 focus:ring-brand-500/20";

export const badge =
  "kaca inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-slate-300";

export const judulSeksi =
  "text-3xl font-bold tracking-tight text-white sm:text-4xl";

export const subSeksi = "mt-3 max-w-2xl text-slate-400";

export const pil = "rounded-full px-4 py-2 text-sm font-medium transition border";

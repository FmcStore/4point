/**
 * ============================================================
 *  DAFTAR PRODUK & HARGA 4POINT
 *  Semua harga di sini dalam Rupiah per BULAN.
 * ============================================================
 */

export type KategoriId = "panel" | "minecraft";

export interface Kategori {
  id: KategoriId;
  nama: string;
  singkat: string;
  deskripsi: string;
  warna: string; // kelas tailwind untuk aksen
  gambar: string; // URL ikon/ilustrasi kategori
  fitur: string[];
}

export interface Paket {
  id: string;
  slug: string;
  kategori: KategoriId;
  nama: string;
  ram: number; // GB
  cpu: number; // dalam persen (100 = 1 core)
  disk: number; // GB
  harga: number; // Rp / bulan
  populer?: boolean;
  unggulan?: string;
}

export const KATEGORI: Kategori[] = [
  {
    id: "panel",
    nama: "Panel Pterodactyl",
    singkat: "Panel Biasa",
    deskripsi:
      "Panel Pterodactyl serbaguna untuk bot WhatsApp/Telegram, Node.js, Python, website, dan kebutuhan hosting lainnya.",
    warna: "sky",
    gambar: "https://cdn.aoxi.my.id/file/zK2WlPkP.png",
    fitur: [
      "Full akses Panel Pterodactyl",
      "Bebas install bot, Node.js, Python, Java",
      "Proteksi Anti-DDoS",
      "1x alokasi port server",
      "Backup otomatis harian",
      "Support ticket 24/7",
    ],
  },
  {
    id: "minecraft",
    nama: "Panel Minecraft",
    singkat: "Khusus Minecraft",
    deskripsi:
      "Panel Pterodactyl yang dioptimalkan khusus untuk server Minecraft Java & Bedrock dengan resource lebih besar.",
    warna: "emerald",
    gambar: "https://cdn.aoxi.my.id/file/tXn4ngIK.jpg",
    fitur: [
      "Khusus server Minecraft Java & Bedrock",
      "Bebas pasang plugin, mod, & datapack",
      "RAM penuh & CPU dedicated",
      "Anti-DDoS layer 3 - 7",
      "Backup otomatis harian",
      "Bantuan setup server gratis",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  PANEL PTERODACTYL BIASA : 1GB = Rp1.000 ... 9GB = Rp9.000         */
/* ------------------------------------------------------------------ */
const paketPanel: Paket[] = Array.from({ length: 9 }, (_, i) => {
  const ram = i + 1;
  return {
    id: `panel-${ram}gb`,
    slug: `panel-${ram}gb`,
    kategori: "panel" as KategoriId,
    nama: `Panel ${ram}GB`,
    ram,
    cpu: ram * 100,
    disk: ram * 5,
    harga: ram * 1000,
    populer: ram === 2,
  };
});

/* ------------------------------------------------------------------ */
/*  PANEL KHUSUS MINECRAFT : mulai dari Rp13.000                      */
/*  (harga bisa Anda ubah bebas pada daftar di bawah)                 */
/* ------------------------------------------------------------------ */
const daftarMc: Array<[number, number]> = [
  [2, 13000],
  [3, 18000],
  [4, 23000],
  [5, 28000],
  [6, 33000],
  [8, 43000],
  [10, 53000],
  [12, 63000],
  [16, 83000],
];

const paketMinecraft: Paket[] = daftarMc.map(([ram, harga]) => ({
  id: `mc-${ram}gb`,
  slug: `mc-${ram}gb`,
  kategori: "minecraft" as KategoriId,
  nama: `Minecraft ${ram}GB`,
  ram,
  cpu: ram * 100,
  disk: ram * 10,
  harga,
  populer: ram === 4,
  unggulan: ram === 2 ? "Paket termurah" : undefined,
}));

export const PAKET: Paket[] = [...paketPanel, ...paketMinecraft];

/* ------------------------------------------------------------------ */
/*  DURASI BERLANGGANAN & DISKON                                      */
/* ------------------------------------------------------------------ */
export interface Durasi {
  bulan: number;
  diskon: number; // persen
  label: string;
  badge?: string;
}

export const DURASI: Durasi[] = [
  { bulan: 1, diskon: 0, label: "1 Bulan" },
  { bulan: 3, diskon: 5, label: "3 Bulan", badge: "Hemat 5%" },
  { bulan: 6, diskon: 10, label: "6 Bulan", badge: "Hemat 10%" },
  { bulan: 12, diskon: 15, label: "12 Bulan", badge: "Hemat 15%" },
];

/* ------------------------------------------------------------------ */
/*  HELPER                                                            */
/* ------------------------------------------------------------------ */

export function cariPaket(id: string): Paket | undefined {
  return PAKET.find((p) => p.id === id || p.slug === id);
}

export function paketKategori(kategori: KategoriId): Paket[] {
  return PAKET.filter((p) => p.kategori === kategori);
}

export function cariKategori(id: string): Kategori | undefined {
  return KATEGORI.find((k) => k.id === id);
}

export function durasiValid(bulan: number): boolean {
  return DURASI.some((d) => d.bulan === bulan);
}

/** Harga total (sebelum diskon) untuk n bulan. */
export function hargaNormal(hargaBulanan: number, bulan: number): number {
  return hargaBulanan * bulan;
}

/** Harga akhir setelah diskon durasi. */
export function hargaDurasi(hargaBulanan: number, bulan: number): number {
  const d = DURASI.find((x) => x.bulan === bulan) ?? DURASI[0];
  return Math.round(hargaBulanan * d.bulan * (1 - d.diskon / 100));
}

/** Jumlah potongan harga. */
export function hematDurasi(hargaBulanan: number, bulan: number): number {
  return hargaNormal(hargaBulanan, bulan) - hargaDurasi(hargaBulanan, bulan);
}

/** Harga per bulan efektif setelah diskon. */
export function hargaPerBulanEfektif(hargaBulanan: number, bulan: number): number {
  return Math.round(hargaDurasi(hargaBulanan, bulan) / bulan);
}

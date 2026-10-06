/**
 * ============================================================
 *  KONFIGURASI UTAMA WEBSITE 3POINT
 *  Ubah nilai di bawah ini sesuai data Anda.
 * ============================================================
 */
export const site = {
  nama: "3Point",
  namaPanjang: "3Point Hosting",
  tagline: "Hosting Panel Pterodactyl Termurah & Tercepat",
  deskripsi:
    "3Point menyediakan Panel Pterodactyl untuk bot, website, dan server Minecraft. Harga mulai Rp1.000/GB, aktivasi cepat, dan CS online 24 jam.",

  /** Gambar hero / banner utama */
  heroImage: "https://cdn.aoxi.my.id/file/USxJ2f3f.jpg",

  // ==========================================================
  //  GANTI dengan nomor WhatsApp Anda (format internasional,
  //  tanpa tanda + dan tanpa spasi). Contoh: 6281234567890
  // ==========================================================
  whatsapp: "6281234567890",
  whatsappTampil: "+62 812-3456-7890",

  email: "support@3point.id",
  jamOperasional: "CS online 24/7",

  /**
   * PEMBAYARAN MANUAL - QRIS
   * Isi SALAH SATU saja:
   *  1) payload : string QRIS merchant Anda (dari hasil scan/dynamic QRIS).
   *               Jika diisi, QR code akan dibuat otomatis oleh website.
   *  2) gambar  : taruh file gambar QRIS di folder `public`
   *               lalu tulis path-nya, contoh: "/qris.png"
   * Jika keduanya kosong, halaman checkout akan menampilkan panduan
   * "minta QR ke CS via WhatsApp".
   */
  qris: {
    payload: "",
    gambar: "",
    merchant: "3POINT HOSTING",
    nmid: "",
  },

  sosial: {
    telegram: "",
    instagram: "",
    tiktok: "",
  },
} as const;

/** Membuat link WhatsApp (wa.me) beserta pesan otomatis. */
export function waLink(pesan?: string): string {
  const nomor = site.whatsapp.replace(/[^0-9]/g, "");
  return pesan
    ? `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`
    : `https://wa.me/${nomor}`;
}

/** Normalisasi nomor HP Indonesia (08xx / 8xx / +62xx) -> 628xx */
export function normalisasiWa(input: string): string {
  let n = (input || "").replace(/[^0-9]/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  else if (n.startsWith("620")) n = "62" + n.slice(3);
  return n;
}

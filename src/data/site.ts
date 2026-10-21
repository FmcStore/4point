/**
 * ============================================================
 *  KONFIGURASI UTAMA WEBSITE 4POINT
 *  Ubah nilai di bawah ini sesuai data Anda.
 * ============================================================
 */
export const site = {
  nama: "4Point",
  namaPanjang: "4Point Hosting",
  tagline: "Hosting Panel Pterodactyl Termurah & Tercepat",
  deskripsi:
    "4Point menyediakan Panel Pterodactyl untuk bot, website, dan server Minecraft. Harga mulai Rp1.000/GB, aktivasi cepat, dan CS online 24 jam.",

  /** Gambar hero / banner utama */
  heroImage: "https://cdn.aoxi.my.id/file/USxJ2f3f.jpg",

  // ==========================================================
  //  GANTI dengan nomor WhatsApp Anda (format internasional,
  //  tanpa tanda + dan tanpa spasi). Contoh: 6281234567890
  // ==========================================================
  whatsapp: "6282130693625",
  whatsappTampil: "+62 821-3069-3625",

  email: "support@4point.id",
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
    payload:
      "00020101021126570011ID.DANA.WWW011893600915303404385802090340438580303UMI51440014ID.CO.QRIS.WWW0215ID10265701036830303UMI5204481453033605802ID5909Wahyushop6015Kota Pematang S61052113763043904",
    gambar: "https://cdn.aoxi.my.id/file/R97yeZMu.jpg",
    merchant: "Wahyushop",
    nmid: "ID1026570103683",
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

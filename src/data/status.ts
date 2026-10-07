export type StatusId =
  | "menunggu_pembayaran"
  | "diproses"
  | "aktif"
  | "selesai"
  | "batal";

export interface StatusInfo {
  id: StatusId;
  label: string;
  keterangan: string;
  /** kelas tailwind: teks, background, border */
  kelas: string;
  dot: string;
}

export const STATUS: StatusInfo[] = [
  {
    id: "menunggu_pembayaran",
    label: "Menunggu Pembayaran",
    keterangan:
      "Pesanan sudah dibuat. Silakan lakukan pembayaran QRIS lalu konfirmasi ke CS via WhatsApp.",
    kelas: "text-amber-300 bg-amber-400/10 border-amber-400/30",
    dot: "bg-amber-400",
  },
  {
    id: "diproses",
    label: "Diproses",
    keterangan:
      "Pembayaran sudah dikonfirmasi. Panel Anda sedang disiapkan oleh tim 3Point.",
    kelas: "text-brand-300 bg-brand-400/10 border-brand-400/30",
    dot: "bg-brand-400",
  },
  {
    id: "aktif",
    label: "Aktif",
    keterangan:
      "Panel sudah aktif dan siap digunakan. Detail akses bisa dilihat di bawah.",
    kelas: "text-emerald-300 bg-emerald-400/10 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  {
    id: "selesai",
    label: "Selesai",
    keterangan: "Pesanan telah selesai dan masa aktif panel sudah berakhir.",
    kelas: "text-slate-300 bg-slate-400/10 border-slate-400/30",
    dot: "bg-slate-400",
  },
  {
    id: "batal",
    label: "Dibatalkan",
    keterangan:
      "Pesanan dibatalkan. Hubungi CS jika Anda merasa ini sebuah kesalahan.",
    kelas: "text-rose-300 bg-rose-400/10 border-rose-400/30",
    dot: "bg-rose-400",
  },
];

export function infoStatus(id: string): StatusInfo {
  return STATUS.find((s) => s.id === id) ?? STATUS[0];
}

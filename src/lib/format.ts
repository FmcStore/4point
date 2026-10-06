export function rupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString("id-ID")}`;
}

/** Format singkat untuk kartu harga, contoh: 1.000 -> "1rb" */
export function rupiahSingkat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}rb`;
  return `${n}`;
}

const ZONA = "Asia/Jakarta";

export function tanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  });
}

export function tanggalWaktu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONA,
  });
}

export function kodeAcak(prefix = "3P", panjang = 6): string {
  const alfabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa karakter ambigu
  let s = "";
  const bytes = new Uint8Array(panjang);
  globalThis.crypto.getRandomValues(bytes);
  for (let i = 0; i < panjang; i++) s += alfabet[bytes[i] % alfabet.length];
  return `${prefix}-${s}`;
}

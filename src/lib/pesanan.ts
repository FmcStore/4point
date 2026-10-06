import { getDb } from "./db";
import {
  cariPaket,
  durasiValid,
  hargaDurasi,
  DURASI,
  type Paket,
} from "@/data/produk";
import { kodeAcak } from "./format";
import type { StatusId } from "@/data/status";

export interface ItemPesanan {
  id: number;
  kode: string;
  paket_id: string;
  nama: string;
  kategori: string;
  ram: number;
  durasi_bulan: number;
  harga_bulanan: number;
  subtotal: number;
  qty: number;
}

export interface Pesanan {
  kode: string;
  nama: string;
  whatsapp: string;
  email: string;
  total: number;
  status: StatusId;
  metode_bayar: string;
  lokasi_server: string;
  catatan: string;
  detail_akses: string;
  created_at: string;
  updated_at: string;
}

export interface PesananLengkap extends Pesanan {
  items: ItemPesanan[];
}

export interface InputItem {
  paketId: string;
  durasiBulan: number;
  qty: number;
}

export interface InputPesanan {
  nama: string;
  whatsapp: string;
  email?: string;
  lokasiServer?: string;
  catatan?: string;
  items: InputItem[];
}

export class ValidasiError extends Error {}

const BATAS_ITEM = 10;
const BATAS_QTY = 20;

export function validasiInput(body: unknown): InputPesanan {
  if (typeof body !== "object" || body === null) {
    throw new ValidasiError("Data pesanan tidak valid.");
  }
  const b = body as Record<string, unknown>;

  const nama = String(b.nama ?? "").trim();
  if (nama.length < 3) throw new ValidasiError("Nama minimal 3 karakter.");
  if (nama.length > 60) throw new ValidasiError("Nama maksimal 60 karakter.");

  const whatsapp = String(b.whatsapp ?? "").replace(/[^0-9]/g, "");
  if (whatsapp.length < 9 || whatsapp.length > 15) {
    throw new ValidasiError("Nomor WhatsApp tidak valid (9-15 digit angka).");
  }

  const email = String(b.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidasiError("Format email tidak valid.");
  }

  const daftarItem = Array.isArray(b.items) ? b.items : [];
  if (daftarItem.length === 0) throw new ValidasiError("Keranjang masih kosong.");
  if (daftarItem.length > BATAS_ITEM) {
    throw new ValidasiError(`Maksimal ${BATAS_ITEM} item dalam satu pesanan.`);
  }

  const items: InputItem[] = daftarItem.map((raw) => {
    const it = (raw ?? {}) as Record<string, unknown>;
    const paketId = String(it.paketId ?? "").trim();
    const paket = cariPaket(paketId);
    if (!paket) throw new ValidasiError(`Paket "${paketId}" tidak ditemukan.`);

    const durasiBulan = Number(it.durasiBulan ?? 1);
    if (!durasiValid(durasiBulan)) {
      throw new ValidasiError("Durasi langganan tidak valid.");
    }

    const qty = Number(it.qty ?? 1);
    if (!Number.isInteger(qty) || qty < 1 || qty > BATAS_QTY) {
      throw new ValidasiError(`Jumlah item harus 1 - ${BATAS_QTY}.`);
    }

    return { paketId: paket.id, durasiBulan, qty };
  });

  return {
    nama,
    whatsapp,
    email,
    lokasiServer: String(b.lokasiServer ?? "").trim().slice(0, 80),
    catatan: String(b.catatan ?? "").trim().slice(0, 500),
    items,
  };
}

/** Hitung total di sisi server (tidak percaya harga dari client). */
export function hitungTotal(items: InputItem[]): number {
  return items.reduce((total, it) => {
    const paket = cariPaket(it.paketId) as Paket;
    return total + hargaDurasi(paket.harga, it.durasiBulan) * it.qty;
  }, 0);
}

export function buatPesanan(input: InputPesanan): PesananLengkap {
  const db = getDb();
  const total = hitungTotal(input.items);
  const now = new Date().toISOString();

  let kode = "";
  for (let i = 0; i < 8; i++) {
    kode = kodeAcak("3P", 6);
    const ada = db.prepare("SELECT 1 FROM pesanan WHERE kode = ?").get(kode);
    if (!ada) break;
    kode = "";
  }
  if (!kode) throw new Error("Gagal membuat kode pesanan, silakan coba lagi.");

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(
      `INSERT INTO pesanan
        (kode, nama, whatsapp, email, total, status, metode_bayar, lokasi_server, catatan, detail_akses, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'menunggu_pembayaran', 'qris', ?, ?, '', ?, ?)`
    ).run(
      kode,
      input.nama,
      input.whatsapp,
      input.email ?? "",
      total,
      input.lokasiServer ?? "",
      input.catatan ?? "",
      now,
      now
    );

    const stmt = db.prepare(
      `INSERT INTO item_pesanan
        (kode, paket_id, nama, kategori, ram, durasi_bulan, harga_bulanan, subtotal, qty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const it of input.items) {
      const paket = cariPaket(it.paketId) as Paket;
      const subtotal = hargaDurasi(paket.harga, it.durasiBulan) * it.qty;
      stmt.run(
        kode,
        paket.id,
        paket.nama,
        paket.kategori,
        paket.ram,
        it.durasiBulan,
        paket.harga,
        subtotal,
        it.qty
      );
    }

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  return ambilPesanan(kode) as PesananLengkap;
}

export function ambilPesanan(kode: string): PesananLengkap | null {
  const db = getDb();
  const kodeBersih = (kode || "").trim().toUpperCase();
  const row = db
    .prepare("SELECT * FROM pesanan WHERE kode = ?")
    .get(kodeBersih) as Pesanan | undefined;
  if (!row) return null;

  const items = db
    .prepare("SELECT * FROM item_pesanan WHERE kode = ? ORDER BY id ASC")
    .all(kodeBersih) as unknown as ItemPesanan[];

  return { ...row, items };
}

export function daftarPesanan(opsi?: {
  status?: string;
  cari?: string;
  limit?: number;
}): PesananLengkap[] {
  const db = getDb();
  const syarat: string[] = [];
  const nilai: Array<string | number> = [];

  const status = opsi?.status?.trim();
  if (status && status !== "semua") {
    syarat.push("status = ?");
    nilai.push(status);
  }

  const cari = opsi?.cari?.trim();
  if (cari) {
    syarat.push("(kode LIKE ? OR nama LIKE ? OR whatsapp LIKE ?)");
    const q = `%${cari}%`;
    nilai.push(q, q, q);
  }

  const limit = Math.min(Math.max(opsi?.limit ?? 200, 1), 500);
  const where = syarat.length ? `WHERE ${syarat.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT * FROM pesanan ${where} ORDER BY datetime(created_at) DESC LIMIT ?`
    )
    .all(...nilai, limit) as unknown as Pesanan[];

  const stmtItems = db.prepare(
    "SELECT * FROM item_pesanan WHERE kode = ? ORDER BY id ASC"
  );

  return rows.map((r) => ({
    ...r,
    items: stmtItems.all(r.kode) as unknown as ItemPesanan[],
  }));
}

export function ubahStatus(
  kode: string,
  status: StatusId,
  detailAkses?: string
): PesananLengkap | null {
  const db = getDb();
  const kodeBersih = (kode || "").trim().toUpperCase();
  const ada = db.prepare("SELECT 1 FROM pesanan WHERE kode = ?").get(kodeBersih);
  if (!ada) return null;

  const now = new Date().toISOString();
  if (typeof detailAkses === "string") {
    db.prepare(
      "UPDATE pesanan SET status = ?, detail_akses = ?, updated_at = ? WHERE kode = ?"
    ).run(status, detailAkses, now, kodeBersih);
  } else {
    db.prepare(
      "UPDATE pesanan SET status = ?, updated_at = ? WHERE kode = ?"
    ).run(status, now, kodeBersih);
  }

  return ambilPesanan(kodeBersih);
}

export function statistik() {
  const db = getDb();
  const total = (
    db.prepare("SELECT COUNT(*) AS n FROM pesanan").get() as { n: number }
  ).n;
  const baris = db
    .prepare("SELECT status, COUNT(*) AS n FROM pesanan GROUP BY status")
    .all() as unknown as Array<{ status: string; n: number }>;

  const perStatus: Record<string, number> = {};
  for (const b of baris) perStatus[b.status] = b.n;

  const omzet = (
    db
      .prepare(
        "SELECT COALESCE(SUM(total), 0) AS n FROM pesanan WHERE status IN ('diproses','aktif','selesai')"
      )
      .get() as { n: number }
  ).n;

  return { total, perStatus, omzet };
}

export { DURASI };

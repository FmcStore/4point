import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * Database memakai modul bawaan Node.js (`node:sqlite`), jadi tidak perlu
 * install server database terpisah. File database tersimpan di ./data/4point.db
 */
const globalForDb = globalThis as unknown as { __empatPointDb?: DatabaseSync };

function lokasiDatabase(): string {
  const dariEnv = process.env.DB_PATH?.trim();
  if (dariEnv) {
    return path.isAbsolute(dariEnv)
      ? dariEnv
      : path.resolve(/* turbopackIgnore: true */ process.cwd(), dariEnv);
  }
  return path.join(process.cwd(), "data", "4point.db");
}

function migrasi(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pesanan (
      kode          TEXT PRIMARY KEY,
      nama          TEXT NOT NULL,
      whatsapp      TEXT NOT NULL,
      email         TEXT NOT NULL DEFAULT '',
      total         INTEGER NOT NULL,
      status        TEXT NOT NULL DEFAULT 'menunggu_pembayaran',
      metode_bayar  TEXT NOT NULL DEFAULT 'qris',
      lokasi_server TEXT NOT NULL DEFAULT '',
      catatan       TEXT NOT NULL DEFAULT '',
      detail_akses  TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL,
      updated_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS item_pesanan (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      kode          TEXT NOT NULL,
      paket_id      TEXT NOT NULL,
      nama          TEXT NOT NULL,
      kategori      TEXT NOT NULL,
      ram           INTEGER NOT NULL,
      durasi_bulan  INTEGER NOT NULL,
      harga_bulanan INTEGER NOT NULL,
      subtotal      INTEGER NOT NULL,
      qty           INTEGER NOT NULL,
      FOREIGN KEY (kode) REFERENCES pesanan(kode) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_pesanan_status  ON pesanan(status);
    CREATE INDEX IF NOT EXISTS idx_pesanan_created ON pesanan(created_at);
    CREATE INDEX IF NOT EXISTS idx_item_kode       ON item_pesanan(kode);
  `);
}

function buka(): DatabaseSync {
  const lokasi = lokasiDatabase();
  fs.mkdirSync(path.dirname(lokasi), { recursive: true });
  const db = new DatabaseSync(lokasi);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  migrasi(db);
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__empatPointDb) {
    globalForDb.__empatPointDb = buka();
  }
  return globalForDb.__empatPointDb;
}

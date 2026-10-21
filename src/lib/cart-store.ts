/**
 * Store keranjang belanja.
 *
 * Dipakai bersama `useSyncExternalStore` supaya pembacaan localStorage
 * (data dari luar React) tidak menimbulkan masalah hidrasi dan tidak
 * memerlukan setState di dalam useEffect.
 */

export interface ItemKeranjang {
  id: string;
  paketId: string;
  durasiBulan: number;
  qty: number;
}

export interface SnapshotKeranjang {
  items: ItemKeranjang[];
  siap: boolean;
}

const KUNCI = "4point-keranjang-v1";
const MAKS_QTY = 20;

/** Nilai awal yang stabil (dipakai sisi server & saat hidrasi). */
const AWAL: SnapshotKeranjang = { items: [], siap: false };

let snap: SnapshotKeranjang = AWAL;
let sudahDimuat = false;
const pendengar = new Set<() => void>();

function emit(): void {
  for (const p of pendengar) p();
}

function idBaru(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function batasQty(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(MAKS_QTY, Math.floor(n)));
}

function muatDariPenyimpanan(): ItemKeranjang[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const mentah = localStorage.getItem(KUNCI);
    if (!mentah) return [];
    const data: unknown = JSON.parse(mentah);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (x): x is Record<string, unknown> =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as Record<string, unknown>).paketId === "string" &&
          typeof (x as Record<string, unknown>).durasiBulan === "number" &&
          typeof (x as Record<string, unknown>).qty === "number"
      )
      .map((x) => ({
        id:
          typeof x.id === "string"
            ? x.id
            : `${x.paketId as string}-${x.durasiBulan as number}`,
        paketId: x.paketId as string,
        durasiBulan: Number(x.durasiBulan),
        qty: batasQty(Number(x.qty)),
      }));
  } catch {
    return [];
  }
}

function simpan(items: ItemKeranjang[]): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(KUNCI, JSON.stringify(items));
    }
  } catch {
    /* penyimpanan tidak tersedia - abaikan */
  }
}

function terapkan(items: ItemKeranjang[]): void {
  snap = { items, siap: true };
  simpan(items);
  emit();
}

/* ------------------------- API untuk React ------------------------- */

export function subscribe(pendengarBaru: () => void): () => void {
  pendengar.add(pendengarBaru);
  return () => {
    pendengar.delete(pendengarBaru);
  };
}

export function getSnapshot(): SnapshotKeranjang {
  return snap;
}

export function getServerSnapshot(): SnapshotKeranjang {
  return AWAL;
}

/** Dipanggil sekali setelah komponen terpasang di browser. */
export function inisialisasi(): void {
  if (sudahDimuat) return;
  sudahDimuat = true;
  snap = { items: muatDariPenyimpanan(), siap: true };
  emit();
}

/* --------------------------- Mutasi --------------------------- */

export function tambah(
  paketId: string,
  durasiBulan: number,
  qty: number = 1
): void {
  const lama = snap.items;
  const idx = lama.findIndex(
    (x) => x.paketId === paketId && x.durasiBulan === durasiBulan
  );

  if (idx >= 0) {
    const baru = lama.slice();
    baru[idx] = { ...baru[idx], qty: batasQty(baru[idx].qty + qty) };
    terapkan(baru);
    return;
  }

  terapkan([
    ...lama,
    { id: idBaru(), paketId, durasiBulan, qty: batasQty(qty) },
  ]);
}

export function ubahQty(id: string, qty: number): void {
  terapkan(
    snap.items.map((x) => (x.id === id ? { ...x, qty: batasQty(qty) } : x))
  );
}

export function ubahDurasi(id: string, durasiBulan: number): void {
  terapkan(
    snap.items.map((x) => (x.id === id ? { ...x, durasiBulan } : x))
  );
}

export function hapus(id: string): void {
  terapkan(snap.items.filter((x) => x.id !== id));
}

export function kosongkan(): void {
  terapkan([]);
}

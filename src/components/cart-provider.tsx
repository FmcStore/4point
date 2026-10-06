"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import * as store from "@/lib/cart-store";
import type { ItemKeranjang } from "@/lib/cart-store";

export type { ItemKeranjang };

interface KonteksKeranjang {
  items: ItemKeranjang[];
  siap: boolean;
  jumlah: number;
  tambah: (paketId: string, durasiBulan: number, qty?: number) => void;
  ubahQty: (id: string, qty: number) => void;
  ubahDurasi: (id: string, durasiBulan: number) => void;
  hapus: (id: string) => void;
  kosongkan: () => void;
  jumlahPaket: (paketId: string) => number;
}

/** Memuat keranjang dari localStorage satu kali setelah aplikasi terpasang. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.inisialisasi();
  }, []);

  return <>{children}</>;
}

export function useKeranjang(): KonteksKeranjang {
  const snap = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const jumlah = useMemo(
    () => snap.items.reduce((n, x) => n + x.qty, 0),
    [snap.items]
  );

  const jumlahPaket = useCallback(
    (paketId: string) =>
      snap.items
        .filter((x) => x.paketId === paketId)
        .reduce((n, x) => n + x.qty, 0),
    [snap.items]
  );

  return {
    items: snap.items,
    siap: snap.siap,
    jumlah,
    tambah: store.tambah,
    ubahQty: store.ubahQty,
    ubahDurasi: store.ubahDurasi,
    hapus: store.hapus,
    kosongkan: store.kosongkan,
    jumlahPaket,
  };
}

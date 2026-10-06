"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useKeranjang } from "./cart-provider";
import { site, waLink } from "@/data/site";

const NAV = [
  { ke: "/", label: "Beranda" },
  { ke: "/layanan", label: "Layanan" },
  { ke: "/#harga", label: "Harga" },
  { ke: "/#alur", label: "Cara Order" },
  { ke: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const { jumlah, siap } = useKeranjang();
  const [bukaMenu, setBukaMenu] = useState(false);
  const [menempel, setMenempel] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setMenempel(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        menempel
          ? "border-white/10 bg-ink-950/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-violet-600 text-base font-black text-white shadow-lg shadow-sky-500/30">
            3
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            {site.nama}
            <span className="text-sky-400">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const aktif =
              n.ke === "/"
                ? pathname === "/"
                : pathname.startsWith(n.ke.split("#")[0]) && n.ke !== "/";
            return (
              <Link
                key={n.ke}
                href={n.ke}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  aktif
                    ? "bg-white/[0.07] text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/pesanan"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 sm:inline-flex"
          >
            Lacak Pesanan
          </Link>

          <Link
            href="/keranjang"
            aria-label="Keranjang"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h2.2l2.3 12.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L21 7H5" />
            </svg>
            {siap && jumlah > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 px-1 text-[11px] font-bold text-white">
                {jumlah}
              </span>
            )}
          </Link>

          <a
            href={waLink(`Halo ${site.nama}, saya mau tanya-tanya soal panel Pterodactyl.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 md:inline-flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.25.7-1.44 1.33-1.98 1.38-.54.05-1.05.24-3.52-.73-2.97-1.17-4.85-4.22-5-4.42-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.45.27-.29.58-.37.78-.37.2 0 .39.01.56.02.18.01.42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.32.02.52-.09.2-.14.32-.28.49-.14.17-.3.38-.42.51-.14.14-.28.29-.12.57.17.29.73 1.21 1.57 1.96 1.08.96 1.99 1.26 2.27 1.4.29.15.45.12.62-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.64-.14.27.09 1.7.8 1.99.95.29.14.48.22.55.34.07.13.07.75-.18 1.45Z" />
            </svg>
            Chat CS
          </a>

          <button
            type="button"
            onClick={() => setBukaMenu((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {bukaMenu ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {bukaMenu && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV.map((n) => (
              <Link
                key={n.ke}
                href={n.ke}
                onClick={() => setBukaMenu(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/pesanan"
              onClick={() => setBukaMenu(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Lacak Pesanan
            </Link>
            <a
              href={waLink(`Halo ${site.nama}, saya mau tanya soal panel.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-emerald-950"
            >
              Chat CS via WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

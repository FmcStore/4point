import Link from "next/link";
import { site, waLink } from "@/data/site";
import { KATEGORI } from "@/data/produk";

export function SiteFooter() {
  const tahun = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10 bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-600 text-base font-black text-white">
              3
            </span>
            <span className="text-lg font-bold text-white">
              {site.nama}
              <span className="text-brand-400">.</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {site.deskripsi}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Pembayaran QRIS
            </span>
            <span className="rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-300">
              Panel Pterodactyl
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Navigasi
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link className="transition hover:text-brand-300" href="/">Beranda</Link></li>
            <li><Link className="transition hover:text-brand-300" href="/layanan">Semua Layanan</Link></li>
            <li><Link className="transition hover:text-brand-300" href="/#harga">Daftar Harga</Link></li>
            <li><Link className="transition hover:text-brand-300" href="/#faq">FAQ</Link></li>
            <li><Link className="transition hover:text-brand-300" href="/pesanan">Lacak Pesanan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Layanan
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {KATEGORI.map((k) => (
              <li key={k.id}>
                <Link
                  className="transition hover:text-brand-300"
                  href={`/layanan?kategori=${k.id}`}
                >
                  {k.nama}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition hover:text-brand-300" href="/layanan?kategori=panel">
                Panel Bot & Website
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand-300" href="/layanan?kategori=minecraft">
                Server Minecraft
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Bantuan
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li>
              <a
                className="transition hover:text-emerald-300"
                href={waLink(`Halo ${site.nama}, saya butuh bantuan.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: {site.whatsappTampil}
              </a>
            </li>
            <li>
              <a className="transition hover:text-brand-300" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>{site.jamOperasional}</li>
            <li>
              <Link className="transition hover:text-brand-300" href="/admin">
                Login Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            © {tahun} {site.namaPanjang}. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-xs text-slate-500">
            Pembayaran manual via QRIS — konfirmasi otomatis segera hadir.
          </p>
        </div>
      </div>
    </footer>
  );
}

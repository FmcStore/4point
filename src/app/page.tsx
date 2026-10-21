import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/data/site";
import { KATEGORI, PAKET, paketKategori, type Paket } from "@/data/produk";
import { rupiah } from "@/lib/format";
import {
  badge,
  btnHijau,
  btnSekunder,
  btnUtama,
  kartu,
  judulSeksi,
  subSeksi,
} from "@/lib/ui";
import { PlanCard } from "@/components/plan-card";

const TRUST = [
  { label: "Mulai dari", nilai: "Rp1.000" },
  { label: "Aktivasi", nilai: "< 5 Menit" },
  { label: "Proteksi", nilai: "Anti-DDoS" },
  { label: "Support", nilai: "24/7" },
];

const UNGGULAN = [
  {
    judul: "Hardware Cepat",
    isi: "Storage NVMe dan CPU performa tinggi supaya server dan bot berjalan mulus tanpa lag.",
    ikon: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  },
  {
    judul: "Anti-DDoS",
    isi: "Perlindungan Anti-DDoS untuk menjaga server kamu tetap online saat diserang.",
    ikon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  },
  {
    judul: "Full Akses Panel",
    isi: "Akses penuh Panel Pterodactyl: console, file manager, database, dan startup command.",
    ikon: "M3 5h18v14H3z M3 9h18",
  },
  {
    judul: "Backup Harian",
    isi: "Backup otomatis harian supaya data server kamu tetap aman setiap saat.",
    ikon: "M12 3v12 M7 10l5 5 5-5 M4 21h16",
  },
  {
    judul: "Aktivasi Instan",
    isi: "Panel langsung disiapkan setelah pembayaran dikonfirmasi, tanpa menunggu lama.",
    ikon: "M12 6v6l4 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  },
  {
    judul: "CS Responsif",
    isi: "Tim support siap membantu lewat WhatsApp, dari setup sampai kendala teknis.",
    ikon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
];

const ALUR = [
  {
    judul: "Pilih Paket & Durasi",
    isi: "Tentukan kategori panel, kapasitas RAM, dan lama berlangganan yang kamu butuhkan.",
  },
  {
    judul: "Isi Data Pesanan",
    isi: "Masukkan nama dan nomor WhatsApp aktif agar panel bisa dikirim ke kamu.",
  },
  {
    judul: "Bayar via QRIS",
    isi: "Scan QRIS pada halaman pesanan menggunakan aplikasi e-wallet atau m-banking.",
  },
  {
    judul: "Panel Aktif",
    isi: "Konfirmasi pembayaran ke CS, lalu detail panel dikirim dan pesanan berstatus aktif.",
  },
];

const FAQ = [
  {
    t: "Apa itu Panel Pterodactyl?",
    j: "Panel Pterodactyl adalah panel kontrol berbasis web untuk menjalankan server game, bot, website, atau aplikasi lain. Lewat panel ini kamu bisa menyalakan/mematikan server, melihat console, mengelola file, dan mengatur resource.",
  },
  {
    t: "Berapa lama proses aktivasi setelah bayar?",
    j: "Setelah pembayaran kamu dikonfirmasi oleh CS, panel biasanya aktif dalam 5-30 menit. Pada jam sibuk maksimal 1x24 jam.",
  },
  {
    t: "Apa bedanya Panel Biasa dan Panel Minecraft?",
    j: "Panel Biasa cocok untuk bot WhatsApp/Telegram, Node.js, Python, dan website dengan harga per GB yang sangat murah. Panel Minecraft dioptimalkan untuk server Minecraft Java & Bedrock dengan alokasi RAM penuh, CPU dedicated, serta bebas plugin dan mod.",
  },
  {
    t: "Apakah server Minecraft mendukung Java dan Bedrock?",
    j: "Ya. Panel Minecraft 4Point mendukung Java Edition maupun Bedrock Edition, termasuk Paper, Spigot, Fabric, Forge, dan PocketMine.",
  },
  {
    t: "Bagaimana cara pembayarannya?",
    j: "Saat ini pembayaran dilakukan manual melalui QRIS. Setelah membuat pesanan, kamu akan mendapat QRIS dan kode pesanan, lalu cukup konfirmasi ke CS via WhatsApp. Payment gateway otomatis akan segera tersedia.",
  },
  {
    t: "Apakah bisa upgrade kapasitas RAM?",
    j: "Bisa. Kamu hanya perlu membayar selisih harga. Hubungi CS dengan menyertakan kode pesanan kamu untuk proses upgrade.",
  },
  {
    t: "Apakah ada garansi?",
    j: "Ya, kami memberikan garansi 3 hari sejak panel aktif. Jika panel tidak dapat digunakan karena kesalahan dari pihak kami, akan kami perbaiki atau ganti.",
  },
  {
    t: "Apakah boleh dipakai untuk bot atau website?",
    j: "Boleh. Panel Biasa 4Point dirancang untuk kebutuhan bot WhatsApp/Telegram, Node.js, Python, dan website statis maupun dinamis.",
  },
];

function GridHarga({
  judul,
  paket,
  aksen,
}: {
  judul: string;
  paket: ReturnType<typeof paketKategori>;
  aksen: "sky" | "emerald";
}) {
  const warna =
    aksen === "sky"
      ? "border-brand-400/30 bg-brand-400/[0.07] text-brand-300"
      : "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-300";

  return (
    <div className={`${kartu} p-6`} id={aksen === "sky" ? "panel-biasa" : "panel-minecraft"}>
      <h3 className="text-lg font-bold text-white">{judul}</h3>
      <p className="mt-1 text-sm text-slate-400">
        Harga per bulan. Diskon hingga 15% untuk pembayaran 12 bulan.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {paket.map((p) => (
          <Link
            key={p.id}
            href={`/layanan/${p.slug}`}
            className={`group rounded-xl border ${warna} px-3.5 py-3 transition hover:brightness-125`}
          >
            <div className="text-sm font-bold text-white">{p.ram} GB</div>
            <div className="mt-0.5 text-xs font-semibold">
              {rupiah(p.harga)}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 group-hover:text-slate-300">
              {p.cpu}% CPU · {p.disk} GB disk
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Beranda() {
  const populer = [
    "panel-1gb",
    "panel-2gb",
    "panel-4gb",
    "mc-2gb",
    "mc-4gb",
    "mc-6gb",  ]
    .map((id) => PAKET.find((p) => p.id === id))
    .filter((p): p is Paket => Boolean(p));

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="kisi pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div className="animasi-naik">
            <span className={badge}>
              <span className="animasi-denyut h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Panel Pterodactyl • Pembayaran QRIS
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hosting Panel{" "}
              <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-brand-600 bg-clip-text text-transparent">
                Pterodactyl
              </span>{" "}
              Termurah
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {site.nama} menyediakan panel Pterodactyl untuk bot, website, dan
              server Minecraft. Mulai{" "}
              <b className="text-white">Rp1.000/GB</b> untuk panel biasa, dan
              server Minecraft mulai{" "}
              <b className="text-white">Rp13.000</b>.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/layanan" className={btnUtama}>
                Lihat Semua Paket
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link href="/#harga" className={btnSekunder}>
                Daftar Harga
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TRUST.map((t) => (
                <div key={t.label}>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    {t.label}
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-white">{t.nilai}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animasi-naik">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-brand-500/20 via-brand-500/5 to-brand-500/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl kaca p-2 shadow-2xl shadow-black/50">
              <Image
                src={site.heroImage}
                alt={`${site.nama} - hosting panel Pterodactyl`}
                width={1200}
                height={800}
                priority
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>

            <div className="animasi-melayang absolute -bottom-5 -left-4 hidden rounded-2xl kaca kaca-berat p-4 sm:block">
              <p className="text-xs text-slate-400">Panel Pterodactyl</p>
              <p className="mt-0.5 text-lg font-bold text-white">
                Rp1.000<span className="text-xs font-medium text-slate-400">/GB/bulan</span>
              </p>
            </div>

            <div className="absolute -right-3 -top-4 hidden rounded-2xl kaca kaca-berat border-emerald-400/30 px-4 py-3 sm:block">
              <p className="text-xs font-medium text-emerald-300">Server MC mulai</p>
              <p className="text-lg font-bold text-white">Rp13.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LAYANAN ============ */}
      <section id="layanan" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className={badge}>Layanan Kami</span>
          <h2 className={`${judulSeksi} mt-4`}>Dua Jenis Panel, Satu Kualitas</h2>
          <p className={`${subSeksi} mx-auto text-center`}>
            Pilih sesuai kebutuhanmu — panel serbaguna dengan harga per GB, atau
            panel yang dioptimalkan khusus untuk server Minecraft.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {KATEGORI.map((k) => {
            const daftar = paketKategori(k.id);
            const termurah = daftar.reduce((a, b) => (a.harga < b.harga ? a : b));
            const sky = k.id === "panel";
            return (
              <div
                key={k.id}
                className={`${kartu} group relative overflow-hidden p-7 transition hover:border-white/20`}
              >
                <div
                  className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
                    sky ? "bg-brand-500/15" : "bg-emerald-500/15"
                  }`}
                />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-white/5 ${
                        sky ? "border-brand-400/30" : "border-emerald-400/30"
                      }`}
                    >
                      <Image
                        src={k.gambar}
                        alt={k.nama}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                        sky
                          ? "border-brand-400/30 bg-brand-400/10 text-brand-300"
                          : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      }`}
                    >
                      {k.singkat}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-white">{k.nama}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {k.deskripsi}
                  </p>

                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {k.fitur.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-400">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12.5l5 5L20 6.5" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Mulai dari</p>
                      <p className="text-2xl font-extrabold text-white">
                        {rupiah(termurah.harga)}
                        <span className="text-xs font-medium text-slate-400">/bulan</span>
                      </p>
                    </div>
                    <Link
                      href={`/layanan?kategori=${k.id}`}
                      className={sky ? btnUtama : btnHijau}
                    >
                      Pesan {k.singkat}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ PAKET POPULER ============ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className={badge}>Paket Terlaris</span>
            <h2 className={`${judulSeksi} mt-4`}>Paling Sering Dipesan</h2>
            <p className={subSeksi}>
              Pilihan favorit pelanggan 4Point dengan harga terbaik.
            </p>
          </div>
          <Link href="/layanan" className={btnSekunder}>
            Semua Paket
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {populer.map((p) => (
            <PlanCard key={p.id} paket={p} />
          ))}
        </div>
      </section>

      {/* ============ DAFTAR HARGA ============ */}
      <section id="harga" className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className={badge}>Daftar Harga</span>
          <h2 className={`${judulSeksi} mt-4`}>Harga Jelas, Tanpa Biaya Tersembunyi</h2>
          <p className={`${subSeksi} mx-auto text-center`}>
            Semua harga di bawah adalah harga per bulan. Klik salah satu paket
            untuk melihat detail dan memesan.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GridHarga
            judul="Panel Pterodactyl (Biasa)"
            paket={paketKategori("panel")}
            aksen="sky"
          />
          <GridHarga
            judul="Panel Khusus Minecraft"
            paket={paketKategori("minecraft")}
            aksen="emerald"
          />
        </div>

        <div className={`${kartu} mt-6 flex flex-wrap items-center gap-3 p-5 text-sm text-slate-400`}>
          <span className="rounded-lg bg-amber-400/10 px-3 py-1.5 font-medium text-amber-300">
            Info
          </span>
          Server Minecraft mulai dari Rp13.000. Butuh kapasitas lain atau paket
          custom?{" "}
          <a
            className="font-semibold text-brand-300 underline-offset-4 hover:underline"
            href={waLink("Halo 4Point, saya mau tanya paket custom.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hubungi CS
          </a>
          .
        </div>
      </section>

      {/* ============ KEUNGGULAN ============ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className={badge}>Keunggulan</span>
          <h2 className={`${judulSeksi} mt-4`}>Kenapa Memilih {site.nama}?</h2>
          <p className={`${subSeksi} mx-auto text-center`}>
            Kami fokus pada hal yang paling penting: performa, keamanan, dan
            kemudahan untuk pelanggan.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {UNGGULAN.map((u) => (
            <div key={u.judul} className={`${kartu} p-6 transition hover:border-white/20`}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/12 text-brand-300 ring-1 ring-inset ring-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={u.ikon} />
                </svg>
              </span>
              <h3 className="mt-4 font-semibold text-white">{u.judul}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{u.isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ALUR ============ */}
      <section id="alur" className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className={badge}>Cara Order</span>
          <h2 className={`${judulSeksi} mt-4`}>Pesan Panel dalam 4 Langkah</h2>
          <p className={`${subSeksi} mx-auto text-center`}>
            Prosesnya cepat dan sederhana. Tidak perlu registrasi akun.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ALUR.map((a, i) => (
            <div key={a.judul} className={`${kartu} relative p-6`}>
              <span className="absolute right-5 top-5 text-4xl font-black text-white/[0.07]">
                {i + 1}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-white">{a.judul}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{a.isi}</p>
            </div>
          ))}
        </div>

        <div className={`${kartu} mt-6 grid gap-6 p-7 lg:grid-cols-2 lg:items-center`}>
          <div>
            <h3 className="text-xl font-bold text-white">Metode Pembayaran</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Untuk saat ini pembayaran dilakukan secara <b className="text-white">manual
              via QRIS</b>. Setelah membuat pesanan, kamu akan mendapatkan QRIS dan
              kode pesanan. Bayar sesuai nominal, lalu konfirmasi ke CS melalui
              WhatsApp agar panel segera diproses.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Payment gateway otomatis sedang disiapkan dan akan segera hadir.
            </p>
            <a
              href={waLink("Halo 4Point, saya sudah melakukan pembayaran QRIS.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnHijau} mt-5`}
            >
              Konfirmasi Pembayaran
            </a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Pembayaran diterima
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {["QRIS", "Semua E-Wallet", "M-Banking"].map((m) => (
                <span
                  key={m}
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200"
                >
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              QRIS dapat dibayar dari GoPay, OVO, DANA, ShopeePay, LinkAja, serta
              m-banking yang mendukung QRIS.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="mx-auto w-full max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className={badge}>FAQ</span>
          <h2 className={`${judulSeksi} mt-4`}>Pertanyaan yang Sering Diajukan</h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.t}
              className={`${kartu} group px-5 py-4 transition hover:border-white/20`}
            >
              <summary className="flex items-center justify-between gap-4 text-sm font-semibold text-white">
                {f.t}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-slate-300 transition group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.j}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl kaca kaca-berat bg-gradient-to-br from-brand-600/20 via-transparent to-brand-700/20 p-8 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 kisi opacity-60" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Siap membuat server kamu?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Pilih paket, bayar via QRIS, dan panel kamu langsung kami siapkan.
              Mulai dari Rp1.000 saja.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/layanan" className={btnUtama}>
                Mulai Pesan Sekarang
              </Link>
              <a
                href={waLink("Halo 4Point, saya mau tanya dulu sebelum pesan.")}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSekunder}
              >
                Tanya CS Dulu
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

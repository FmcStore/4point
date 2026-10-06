# 3Point — Website Jualan Hosting Panel Pterodactyl

Website toko hosting **3Point** untuk menjual **Panel Pterodactyl** dan **Panel
Khusus Minecraft**, lengkap dengan keranjang, checkout, pesanan tersimpan di
database, halaman lacak pesanan, dan dashboard admin.

Pembayaran masih **manual via QRIS**: pelanggan membuat pesanan, membayar
QRIS, lalu konfirmasi ke CS melalui WhatsApp. Payment gateway otomatis bisa
ditambahkan kemudian.

---

## ✨ Fitur

**Sisi pelanggan**

- Beranda dengan hero, layanan, daftar harga, keunggulan, alur pemesanan, dan FAQ
- Katalog paket dengan filter kategori (Panel Biasa / Khusus Minecraft)
- Halaman detail paket: pilih RAM, durasi (diskon 5–15%), dan jumlah
- Keranjang belanja (tersimpan di browser, tidak hilang saat halaman ditutup)
- Checkout tanpa perlu daftar akun
- Halaman pesanan: status, rincian, QRIS, dan tombol konfirmasi WhatsApp
- Halaman **Lacak Pesanan** berdasarkan kode pesanan
- Tombol WhatsApp mengapung di semua halaman

**Sisi admin** (`/admin`)

- Login dengan password
- Statistik: total pesanan, menunggu bayar, diproses, aktif, dan omzet
- Filter status + pencarian (kode / nama / nomor WhatsApp)
- Ubah status pesanan dan isi **Detail Akses Panel** yang otomatis tampil ke pelanggan
- Tombol chat WhatsApp langsung ke pelanggan

**Teknis**

- Next.js (App Router) + TypeScript + Tailwind CSS
- Database SQLite memakai modul bawaan Node.js (`node:sqlite`) — tidak perlu
  instal server database terpisah
- **Harga selalu dihitung ulang di sisi server**, jadi tidak bisa diubah dari browser

---

## 🚀 Menjalankan

Butuh **Node.js 24 atau lebih baru**.

```bash
npm install
cp .env.example .env.local   # lalu sesuaikan isinya
npm run dev                  # http://localhost:3000
```

Untuk mode produksi:

```bash
npm run build
npm run start
```

Perintah lain: `npm run lint` untuk memeriksa kode.

---

## ⚙️ Konfigurasi (paling penting)

### 1. Nomor WhatsApp

Buka `src/data/site.ts` dan ubah:

```ts
whatsapp: "6281234567890",        // format 62..., tanpa + dan spasi
whatsappTampil: "+62 812-3456-7890",
email: "support@3point.id",
```

Nomor ini dipakai untuk semua tombol CS dan tombol konfirmasi pembayaran.

### 2. QRIS

Masih di `src/data/site.ts`, bagian `qris`. Isi **salah satu** saja:

```ts
qris: {
  payload: "00020101021226...",  // string QRIS merchant -> QR dibuat otomatis
  gambar: "/qris.png",           // atau gambar QRIS di folder public/
  merchant: "3POINT HOSTING",
  nmid: "ID1234567890123",
}
```

- Kalau `payload` diisi, website membuat gambar QRIS sendiri.
- Kalau hanya punya file gambar, taruh di folder `public` lalu isi `gambar` dengan `/nama-file.png`.
- Kalau keduanya kosong, halaman checkout menampilkan panduan "minta QR ke CS".
- Nominal tetap dibayar sesuai total pesanan (QRIS statis).

### 3. Harga & paket

Semua harga ada di `src/data/produk.ts` (Rupiah **per bulan**):

- **Panel Pterodactyl (biasa):** 1GB = Rp1.000 sampai 9GB = Rp9.000 (otomatis `RAM × 1000`)
- **Panel Minecraft:** daftar harga ada di variabel `daftarMc`, mulai dari Rp13.000

Diskon durasi 3/6/12 bulan diatur di variabel `DURASI`.
Spesifikasi CPU (persen) dan disk (GB) juga bisa diubah di file yang sama.

### 4. Password admin

Salin `.env.example` menjadi `.env.local` lalu ubah:

```env
ADMIN_PASSWORD=password-rahasia-anda
ADMIN_SESSION_SECRET=teks-acak-panjang-bebas
DB_PATH=./data/3point.db
```

> Password bawaan adalah `3point-admin`. **Wajib diganti** sebelum online.

Admin login juga dibatasi 8 percobaan gagal per 5 menit.

---

## 🧾 Alur pesanan manual

1. Pelanggan memilih paket → menambah ke keranjang → checkout.
2. Pesanan tersimpan dengan kode acak, contoh `3P-A1B2C3`, status **Menunggu Pembayaran**.
3. Pelanggan membayar QRIS lalu menekan **Konfirmasi via WhatsApp** (pesan sudah otomatis berisi kode pesanan dan total).
4. Admin membuka `/admin`, memverifikasi pembayaran, mengubah status menjadi **Diproses**.
5. Admin mengisi **Detail Akses Panel** dan mengubah status menjadi **Aktif**.
6. Pelanggan melihat detail akses di halaman pesanannya.

Status yang tersedia: `Menunggu Pembayaran → Diproses → Aktif → Selesai`, plus `Dibatalkan`.

---

## 📁 Struktur folder

```
src/
├─ app/
│  ├─ page.tsx                 Beranda
│  ├─ layanan/                 Katalog + detail paket ([slug])
│  ├─ keranjang/               Keranjang
│  ├─ checkout/                Checkout
│  ├─ pesanan/                 Lacak pesanan + detail ([kode])
│  ├─ admin/                   Dashboard admin
│  └─ api/                     Endpoint pesanan & admin
├─ components/                 Komponen UI (header, footer, kartu, QRIS, dll)
├─ data/
│  ├─ site.ts                  ⚙️ Nomor WA, QRIS, email, gambar hero
│  ├─ produk.ts                ⚙️ Paket & harga
│  └─ status.ts                Daftar status pesanan
└─ lib/
   ├─ db.ts                    Koneksi SQLite (node:sqlite)
   ├─ pesanan.ts               Buat / ambil / ubah pesanan
   ├─ cart-store.ts            State keranjang di browser
   ├─ auth.ts                  Sesi login admin
   └─ format.ts                Format Rupiah & tanggal
```

Database tersimpan di `data/3point.db` (folder ini diabaikan git).
Menghapus folder `data/` akan mengosongkan seluruh pesanan.

---

## 🌐 Deploy

Cocok untuk **VPS / server sendiri** (misalnya Ubuntu + Nginx + PM2):

```bash
npm ci
npm run build
npm run start        # jalan di port 3000
```

> **Penting:** karena database berupa file SQLite, website ini butuh hosting
> dengan **penyimpanan permanen** (VPS, Docker, Railway, dsb). Platform
> serverless seperti Vercel **tidak cocok** karena file database akan hilang
> setiap kali instance dijalankan ulang. Untuk ke sana, pindahkan penyimpanan
> ke database terkelola (misalnya PostgreSQL).

---

## 📝 Catatan

- Belum ada akun pelanggan; pesanan dilacak memakai kode pesanan. Registrasi
  akun dan payment gateway otomatis bisa ditambahkan berikutnya.
- Ganti gambar hero di `src/data/site.ts` (`heroImage`).
- Tampilan menggunakan tema gelap.

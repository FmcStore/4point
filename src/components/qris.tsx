import QRCode from "qrcode";
import { site } from "@/data/site";
import { rupiah } from "@/lib/format";

/**
 * Menampilkan QRIS pembayaran.
 * - Jika `site.qris.payload` diisi, QR dibuat otomatis.
 * - Jika `site.qris.gambar` diisi, gambar tersebut yang ditampilkan.
 * - Jika keduanya kosong, tampil panduan meminta QR ke CS.
 */
export async function Qris({ total }: { total: number }) {
  const { payload, gambar, merchant, nmid } = site.qris;

  let dataUrl = "";
  if (payload) {
    try {
      dataUrl = await QRCode.toDataURL(payload, {
        margin: 1,
        width: 520,
        errorCorrectionLevel: "M",
        color: { dark: "#04060d", light: "#ffffff" },
      });
    } catch {
      dataUrl = "";
    }
  }

  const sumber = dataUrl || gambar || "";

  return (
    <div className="rounded-2xl kaca kaca-berat p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Pembayaran QRIS</h2>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
          Manual
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/45 p-4 text-center">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Nominal yang harus dibayar
        </p>
        <p className="mt-1 text-2xl font-extrabold text-white">
          {rupiah(total)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Bayar tepat sesuai nominal agar pesanan mudah diverifikasi.
        </p>
      </div>

      {sumber ? (
        <div className="mt-5">
          <div className="mx-auto w-full max-w-[260px] rounded-2xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sumber}
              alt="QRIS pembayaran 3Point"
              className="h-auto w-full"
            />
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            Scan menggunakan aplikasi e-wallet atau m-banking yang mendukung
            QRIS.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-brand-400/25 bg-brand-400/[0.07] p-4 text-sm text-brand-100">
          <p className="font-semibold">QRIS belum dipasang di website ini.</p>
          <p className="mt-1.5 text-brand-200/90">
            Silakan minta QRIS kepada CS melalui WhatsApp, lalu kirimkan kode
            pesanan agar pembayaran dapat diverifikasi.
          </p>
        </div>
      )}

      {(merchant || nmid) && (
        <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-xs text-slate-400">
          {merchant && (
            <p>
              Merchant:{" "}
              <span className="font-semibold text-slate-200">{merchant}</span>
            </p>
          )}
          {nmid && (
            <p>
              NMID: <span className="font-semibold text-slate-200">{nmid}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

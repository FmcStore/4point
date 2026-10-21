import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TombolWhatsAppMengapung } from "@/components/tombol-wa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.nama} — ${site.tagline}`,
    template: `%s | ${site.nama}`,
  },
  description: site.deskripsi,
  keywords: [
    "panel pterodactyl",
    "hosting murah",
    "panel minecraft",
    "server minecraft murah",
    "4point",
    "panel bot whatsapp",
    "hosting panel indonesia",
  ],
  openGraph: {
    title: `${site.nama} — ${site.tagline}`,
    description: site.deskripsi,
    images: [site.heroImage],
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ink-950 text-slate-200 antialiased">
        {/* “Lampu” redup di belakang kaca. Tanpa ini, backdrop-filter pada
            latar hitam total tidak menghasilkan efek kaca apa pun. */}
        <div className="orb-latar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <TombolWhatsAppMengapung />
        </CartProvider>
      </body>
    </html>
  );
}

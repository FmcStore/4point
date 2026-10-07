import { site, waLink } from "@/data/site";

export function TombolWhatsAppMengapung() {
  return (
    <a
      href={waLink(`Halo ${site.nama}, saya mau bertanya.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-emerald-300/30 bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-3.5 font-semibold text-emerald-950 shadow-2xl shadow-emerald-950/60 transition duration-300 hover:from-emerald-300 hover:to-emerald-500"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.25.7-1.44 1.33-1.98 1.38-.54.05-1.05.24-3.52-.73-2.97-1.17-4.85-4.22-5-4.42-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.45.27-.29.58-.37.78-.37.2 0 .39.01.56.02.18.01.42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.32.02.52-.09.2-.14.32-.28.49-.14.17-.3.38-.42.51-.14.14-.28.29-.12.57.17.29.73 1.21 1.57 1.96 1.08.96 1.99 1.26 2.27 1.4.29.15.45.12.62-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.64-.14.27.09 1.7.8 1.99.95.29.14.48.22.55.34.07.13.07.75-.18 1.45Z" />
      </svg>
      <span className="hidden text-sm sm:inline">Chat CS</span>
    </a>
  );
}

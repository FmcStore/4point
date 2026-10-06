"use client";

import { useState } from "react";

export function TombolSalin({
  teks,
  label = "Salin",
}: {
  teks: string;
  label?: string;
}) {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(teks);
    } catch {
      /* bila clipboard tidak tersedia, tetap tampilkan umpan balik */
    }
    setTersalin(true);
    setTimeout(() => setTersalin(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={salin}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
    >
      {tersalin ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          Tersalin
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

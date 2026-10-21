"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btnUtama, input, labelInput } from "@/lib/ui";

export function FormLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [memuat, setMemuat] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMemuat(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Login gagal.");
        setMemuat(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server.");
      setMemuat(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-24 sm:px-6">
      <div className="rounded-2xl kaca kaca-berat p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-600 text-lg font-black text-white">
            3
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-xs text-slate-400">
              Masuk untuk mengelola pesanan 4Point
            </p>
          </div>
        </div>

        <form onSubmit={kirim} className="mt-7">
          <label className={labelInput} htmlFor="password">
            Password Admin
          </label>
          <input
            id="password"
            type="password"
            className={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3.5 text-sm text-rose-200">
              {error}
            </div>
          )}

          <button type="submit" disabled={memuat} className={`${btnUtama} mt-6 w-full`}>
            {memuat ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Password default: <span className="font-mono">4point-admin</span> —
          ubah melalui variabel lingkungan <span className="font-mono">ADMIN_PASSWORD</span>.
        </p>
      </div>
    </div>
  );
}

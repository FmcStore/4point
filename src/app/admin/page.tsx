import type { Metadata } from "next";
import { sudahLogin } from "@/lib/auth";
import { FormLogin } from "@/components/admin/form-login";
import { Dashboard } from "@/components/admin/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  robots: { index: false, follow: false },
};

export default async function HalamanAdmin() {
  const masuk = await sudahLogin();
  return masuk ? <Dashboard /> : <FormLogin />;
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HM Labs — Portal",
  robots: "noindex, nofollow",
};

// Pfade, die ohne Login erreichbar sein müssen
const PUBLIC_PREFIXES = ["/login", "/auth", "/password"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  // x-pathname wird vom Middleware gesetzt (Original-Pfad vor dem /portal-Rewrite)
  const pathname = headersList.get("x-pathname") ?? "";

  if (!isPublicPath(pathname)) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login");
    }
  }

  return <>{children}</>;
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPendingApprovals } from "@/lib/os/queries";
import OsShell from "./_components/OsShell";

export const metadata = { title: "HM Agent OS" };

const PUBLIC_PATHS = ["/login", "/auth/callback"];

export default async function OsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/login");

  const pending = await getPendingApprovals().catch(() => []);

  return <OsShell pendingApprovals={pending.length}>{children}</OsShell>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import TerminalDock from "./TerminalDock";

const NAV = [
  { href: "/", label: "Overview", icon: "⬡" },
  { href: "/chat", label: "Chat", icon: "❯" },
  { href: "/brain", label: "Brain", icon: "◈" },
  { href: "/routines", label: "Routines", icon: "↻" },
  { href: "/projects", label: "Projects", icon: "▢" },
  { href: "/agents", label: "Skills & Agents", icon: "◇" },
  { href: "/runs", label: "Runs", icon: "▶" },
  { href: "/approvals", label: "Approvals", icon: "✓" },
  { href: "/integrations", label: "Integrations", icon: "⬡" },
  { href: "/audit", label: "Audit Log", icon: "≡" },
];

export default function OsShell({
  children,
  pendingApprovals = 0,
}: {
  children: React.ReactNode;
  pendingApprovals?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-bg text-text-primary font-body">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <span className="font-display font-bold text-base text-primary tracking-tight">
            HM Agent OS
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(({ href, label, icon }) => {
            const fullHref = `/os${href}`;
            const active =
              href === "/"
                ? pathname === "/" || pathname === "/os" || pathname === "/os/"
                : pathname.startsWith(`/os${href}`);
            return (
              <Link
                key={href}
                href={fullHref}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-muted hover:text-text-primary hover:bg-border/50"
                }`}
              >
                <span className="text-xs opacity-60">{icon}</span>
                <span>{label}</span>
                {label === "Approvals" && pendingApprovals > 0 && (
                  <span className="ml-auto bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {pendingApprovals}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={signOut}
            className="w-full text-left text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main — pb leaves room for the persistent terminal dock bar */}
      <main className="flex-1 overflow-auto pb-10">{children}</main>

      {/* Persistent terminal: mounted once here so it survives tab navigation. */}
      <TerminalDock />
    </div>
  );
}

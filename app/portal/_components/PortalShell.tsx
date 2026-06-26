"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  {
    href: "/portal/leads",
    label: "Leads",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 12v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/portal/projects",
    label: "Projekte",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    href: "/portal/clients",
    label: "Kunden",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M11 14v-1.33A2.67 2.67 0 0 0 8.33 10H3.67A2.67 2.67 0 0 0 1 12.67V14M6 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM15 14v-1.33a2.67 2.67 0 0 0-2-2.58M11 2.08a2.5 2.5 0 0 1 0 4.84" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-xs text-white">H</span>
            </div>
            <span className="font-display font-bold text-text-primary">
              HM <span className="text-primary">AI</span>
            </span>
          </Link>
          <span className="ml-2 font-mono text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
            Portal
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-text-dim hover:text-text-primary hover:bg-bg"
                }`}
              >
                <span className={active ? "text-primary" : "text-text-muted"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={signOut}
            disabled={signingOut}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-text-dim hover:bg-bg transition-colors w-full"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 12H2.33A1.33 1.33 0 0 1 1 10.67V3.33A1.33 1.33 0 0 1 2.33 2H5M9.33 10l3.34-3-3.34-3M12.67 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {signingOut ? "..." : "Abmelden"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

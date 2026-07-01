"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/auth/getRole";

const MESSAGES_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14 10.667A1.333 1.333 0 0 1 12.667 12H4L1.333 14.667V3.333A1.333 1.333 0 0 1 2.667 2h10A1.333 1.333 0 0 1 14 3.333v7.334z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SETTINGS_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6.5 2h3l.5 1.5 1.3.75 1.5-.5L14.25 5.5l-.5 1.5.75 1.3-.5 1.5H12.5l-.75 1.3.5 1.5-1.45 1.25-1.5-.5-1.3.75L7.5 14h-1l-.5-1.5-1.3-.75-1.5.5L1.75 10.5l.5-1.5-.75-1.3.5-1.5H3.5l.75-1.3-.5-1.5L5.2 2.2l1.5.5L7.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const ADMIN_NAV = [
  {
    href: "/portal/leads",
    label: "Leads",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 12v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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
  {
    href: "/portal/messages",
    label: "Nachrichten",
    icon: MESSAGES_ICON,
  },
];

const ADMIN_TOOLS = [
  {
    href: "/portal/automations",
    label: "Automationen",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8h3l2-5 3 10 2-5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/portal/admins",
    label: "Admins",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5 6.5 5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/portal/api-keys",
    label: "API-Keys",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8.5 6.5L14 1M14 1h-2M14 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CLIENT_NAV = [
  {
    href: "/portal/projects",
    label: "Meine Projekte",
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
    href: "/portal/messages",
    label: "Nachrichten",
    icon: MESSAGES_ICON,
  },
];

interface NavItemType {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface PortalShellProps {
  children: React.ReactNode;
  role: UserRole;
  unreadMessages?: number;
}

export default function PortalShell({ children, role, unreadMessages = 0 }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const isAdmin = role === "admin";

  const nav: NavItemType[] = (isAdmin ? ADMIN_NAV : CLIENT_NAV).map((item) =>
    item.href === "/portal/messages"
      ? { ...item, badge: unreadMessages > 0 ? unreadMessages : undefined }
      : item
  );

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login"); // Subdomain: /login → middleware rewrites to /portal/login
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col h-screen">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <picture>
              <source srcSet="/hm-labs-logo-v3.webp" type="image/webp" />
              <img src="/hm-labs-logo-v3.png" alt="HM Labs" width={28} height={28} className="rounded-lg" />
            </picture>
            <span className="font-display font-bold text-text-primary">
              HM <span className="text-primary">Labs</span>
            </span>
          </Link>
          <span className="ml-2 font-mono text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">
            Portal
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <NavItem key={item.href} item={item} active={active} />
            );
          })}

          {/* Admin-Tools Section */}
          {isAdmin && (
            <div className="pt-4 mt-2 border-t border-border/50">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider px-3 mb-2">
                Admin
              </p>
              {ADMIN_TOOLS.map((item) => {
                const active = pathname.startsWith(item.href);
                return <NavItem key={item.href} item={item} active={active} />;
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          {!isAdmin && (
            <div className="px-3 py-1.5 mb-0.5">
              <span className="font-mono text-[10px] text-text-muted">Kunden-Portal</span>
            </div>
          )}
          <Link
            href="/portal/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              pathname.startsWith("/portal/settings")
                ? "bg-primary/10 text-primary"
                : "text-text-dim hover:text-text-primary hover:bg-bg"
            }`}
          >
            <span className={pathname.startsWith("/portal/settings") ? "text-primary" : "text-text-muted"}>
              {SETTINGS_ICON}
            </span>
            Einstellungen
          </Link>
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
      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
    </div>
  );
}

function NavItem({ item, active }: { item: NavItemType; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-text-dim hover:text-text-primary hover:bg-bg"
      }`}
    >
      <span className={active ? "text-primary" : "text-text-muted"}>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="bg-accent text-white font-mono text-[10px] rounded-full px-1.5 min-w-[18px] text-center leading-5">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Conversation {
  clientId: string;
  clientName: string;
  companyName: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export default function ConversationList({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="px-4 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-text-primary">Nachrichten</h2>
        <p className="font-mono text-[11px] text-text-muted mt-0.5">{conversations.length} Unterhaltungen</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 && (
          <p className="text-text-muted text-sm px-4 py-6">Noch keine Nachrichten</p>
        )}
        {conversations.map((conv) => {
          const href = `/portal/messages/${conv.clientId}`;
          const active = pathname === href;
          return (
            <Link
              key={conv.clientId}
              href={href}
              className={`block px-4 py-3.5 border-b border-border/50 transition-colors ${
                active ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-bg"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={`text-sm font-medium truncate ${active ? "text-primary" : "text-text-primary"}`}>
                  {conv.companyName || conv.clientName}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 bg-accent text-white font-mono text-[10px] rounded-full px-1.5 min-w-[18px] text-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-text-muted text-xs truncate">{conv.lastMessage}</p>
              )}
              {conv.lastMessageAt && (
                <p className="font-mono text-[10px] text-text-dim mt-0.5">
                  {new Date(conv.lastMessageAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

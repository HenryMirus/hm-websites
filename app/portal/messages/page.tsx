import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import { markMessagesReadAction } from "./_actions";
import PortalShell from "../_components/PortalShell";
import ConversationList from "./_components/ConversationList";
import ChatThread from "./_components/ChatThread";

export const revalidate = 0;

export default async function MessagesPage() {
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  // ── Admin: Inbox-Übersicht ──────────────────────────────────────────────────
  if (role === "admin") {
    const { data: clients } = await supabase
      .from("clients")
      .select("id, name, company_name")
      .order("name");

    const { data: allMessages } = await supabase
      .from("messages")
      .select("client_id, content, created_at, sender_role, is_read")
      .order("created_at", { ascending: false });

    const conversations = (clients ?? []).map((c) => {
      const msgs = (allMessages ?? []).filter((m) => m.client_id === c.id);
      const last = msgs[0];
      const unread = msgs.filter((m) => m.sender_role === "client" && !m.is_read).length;
      return {
        clientId: c.id,
        clientName: c.name,
        companyName: c.company_name,
        lastMessage: last?.content ?? null,
        lastMessageAt: last?.created_at ?? null,
        unreadCount: unread,
      };
    }).sort((a, b) => {
      if (!a.lastMessageAt && !b.lastMessageAt) return 0;
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    return (
      <PortalShell role="admin" unreadMessages={unreadMessages}>
        <div className="flex h-full">
          <ConversationList conversations={conversations} />
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
            <div className="text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto mb-3 opacity-30">
                <path d="M20 4C11.163 4 4 10.268 4 18c0 3.768 1.607 7.19 4.23 9.72L6 36l8.5-3.5A17.8 17.8 0 0 0 20 33c8.837 0 16-6.268 16-15S28.837 4 20 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Unterhaltung auswählen</p>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  // ── Client: Direkter Chat ──────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clientRecord } = await supabase
    .from("clients")
    .select("id, name")
    .eq("auth_user_id", user?.id ?? "")
    .single();

  if (!clientRecord) {
    return (
      <PortalShell role="client" unreadMessages={unreadMessages}>
        <div className="p-8 text-text-muted text-sm">Kein Kunden-Profil gefunden.</div>
      </PortalShell>
    );
  }

  // Nachrichten laden + als gelesen markieren
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("client_id", clientRecord.id)
    .order("created_at", { ascending: true });

  await markMessagesReadAction(clientRecord.id);

  return (
    <PortalShell role="client" unreadMessages={0}>
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="font-display font-semibold text-text-primary">Nachrichten</h1>
          <p className="text-text-muted text-sm">Unterhaltung mit HM Labs</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatThread
            initialMessages={messages ?? []}
            clientId={clientRecord.id}
            currentUserRole="client"
            clientName={clientRecord.name}
          />
        </div>
      </div>
    </PortalShell>
  );
}

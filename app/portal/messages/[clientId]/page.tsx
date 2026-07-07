import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import { markMessagesReadAction } from "../_actions";
import PortalShell from "../../_components/PortalShell";
import ConversationList from "../_components/ConversationList";
import ChatThread from "../_components/ChatThread";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function AdminChatPage({ params }: { params: Promise<{ clientId: string }> }) {
  await requireAdmin();
  const { clientId } = await params;

  const [supabase, unreadAfterRead] = await Promise.all([
    createClient(),
    (async () => {
      await markMessagesReadAction(clientId);
      return getUnreadMessageCount();
    })(),
  ]);

  const [{ data: client }, { data: clients }, { data: allMessages }, { data: messages }] =
    await Promise.all([
      supabase.from("clients").select("id, name, company_name").eq("id", clientId).single(),
      supabase.from("clients").select("id, name, company_name").order("name"),
      supabase
        .from("messages")
        .select("client_id, content, created_at, sender_role, is_read")
        .order("created_at", { ascending: false }),
      supabase
        .from("messages")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true }),
    ]);

  if (!client) notFound();

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
      unreadCount: c.id === clientId ? 0 : unread,
    };
  }).sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });

  return (
    <PortalShell role="admin" unreadMessages={unreadAfterRead}>
      <div className="flex h-full">
        <ConversationList conversations={conversations} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-border shrink-0">
            <h2 className="font-display font-semibold text-text-primary">
              {client.company_name || client.name}
            </h2>
            <p className="text-text-muted text-sm">{client.name}</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatThread
              initialMessages={messages ?? []}
              clientId={clientId}
              currentUserRole="admin"
              clientName={client.company_name || client.name}
            />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

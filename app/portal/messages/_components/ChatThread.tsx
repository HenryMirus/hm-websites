"use client";

import { useEffect, useRef, useState } from "react";
import { sendMessageAction } from "../_actions";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  sender_role: string;
  client_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ChatThreadProps {
  initialMessages: Message[];
  clientId: string;
  currentUserRole: "admin" | "client";
  clientName: string;
}

export default function ChatThread({
  initialMessages,
  clientId,
  currentUserRole,
  clientName,
}: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Realtime-Abo
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${clientId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Optimistic message ersetzen (gleiche content + role innerhalb 10s)
            const optimistic = prev.find(
              (m) =>
                m.id.startsWith("opt-") &&
                m.content === (payload.new as Message).content &&
                m.sender_role === (payload.new as Message).sender_role
            );
            if (optimistic) {
              return prev.map((m) =>
                m.id === optimistic.id ? (payload.new as Message) : m
              );
            }
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  // Auto-Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = textareaRef.current?.value.trim();
    if (!content || pending) return;

    // Optimistic insert
    const optimisticId = `opt-${Date.now()}`;
    const optimisticMsg: Message = {
      id: optimisticId,
      sender_id: "",
      sender_role: currentUserRole,
      client_id: clientId,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    if (textareaRef.current) textareaRef.current.value = "";
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.set("content", content);
    formData.set("client_id", clientId);

    const result = await sendMessageAction({}, formData);
    setPending(false);

    if (result.error) {
      setError(result.error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      if (textareaRef.current) textareaRef.current.value = content;
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Nachrichten-Liste */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-text-muted text-sm py-12">
            Noch keine Nachrichten. Starte die Unterhaltung.
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_role === currentUserRole;
          const isOptimistic = msg.id.startsWith("opt-");
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-opacity ${
                  isOptimistic ? "opacity-60" : "opacity-100"
                } ${
                  isOwn
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-surface border border-border text-text-primary rounded-tl-sm"
                }`}
              >
                {!isOwn && (
                  <p className="font-mono text-[10px] mb-1 opacity-60">
                    {msg.sender_role === "admin" ? "HM Labs" : clientName}
                  </p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className={`font-mono text-[10px] mt-1 ${isOwn ? "text-white/60" : "text-text-muted"}`}>
                  {new Date(msg.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                  {" · "}
                  {new Date(msg.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Eingabe-Bereich */}
      <div className="border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              name="content"
              placeholder="Nachricht schreiben..."
              rows={2}
              disabled={pending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={pending}
              className="shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-xl px-4 py-3 transition-colors"
            >
              {pending ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 2L2 7l4 2 2 5 6-12z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <p className="text-accent text-xs mt-2">{error}</p>
          )}
          <p className="text-text-muted text-xs mt-1.5">Enter zum Senden · Shift+Enter für neue Zeile</p>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { sendMessageAction } from "../_actions";

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const boundSend = sendMessageAction.bind(null);
  const [state, formAction] = useFormState(boundSend, {});

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
            // Doppelte verhindern (optimistic insert)
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

  // Formular nach Senden zurücksetzen
  useEffect(() => {
    if (!state?.error) {
      formRef.current?.reset();
    }
  }, [state]);

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
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isOwn
                  ? "bg-primary text-white rounded-tr-sm"
                  : "bg-surface border border-border text-text-primary rounded-tl-sm"
              }`}>
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
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="client_id" value={clientId} />
          <div className="flex items-end gap-3">
            <textarea
              name="content"
              placeholder="Nachricht schreiben..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none"
            />
            <SendButton />
          </div>
          {state?.error && (
            <p className="text-accent text-xs mt-2">{state.error}</p>
          )}
          <p className="text-text-muted text-xs mt-1.5">Enter zum Senden · Shift+Enter für neue Zeile</p>
        </form>
      </div>
    </div>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
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
  );
}

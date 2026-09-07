"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { sendMessageAction } from "../_actions";
import { createClient } from "@/lib/supabase/client";
import { FileIcon } from "../../_components/FileList";
import { MAX_FILE_SIZE, formatBytes, type PortalFileWithUrl } from "@/lib/portal/fileTypes";

interface Message {
  id: string;
  sender_id: string;
  sender_role: string;
  client_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface PendingUpload {
  key: string;
  name: string;
  size: number;
  progress: number;
  error?: string;
  file?: PortalFileWithUrl;
}

interface ChatThreadProps {
  initialMessages: Message[];
  /** messageId → Anhänge, serverseitig mit signierten URLs geladen */
  initialAttachments: Record<string, PortalFileWithUrl[]>;
  clientId: string;
  currentUserRole: "admin" | "client";
  clientName: string;
}

/** Die Eingabe darf höchstens die Hälfte des Chatfensters einnehmen. */
const INPUT_MAX_RATIO = 0.5;
const INPUT_MIN_HEIGHT = 46; // gleiche Höhe wie Büroklammer- und Senden-Button

export default function ChatThread({
  initialMessages,
  initialAttachments,
  clientId,
  currentUserRole,
  clientName,
}: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [attachments, setAttachments] =
    useState<Record<string, PortalFileWithUrl[]>>(initialAttachments);
  const [uploads, setUploads] = useState<PendingUpload[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const readyAttachments = uploads.filter((u) => u.file).map((u) => u.file!);

  // ── Anhänge nachladen, wenn eine Nachricht über Realtime hereinkommt ──────
  const loadAttachments = useCallback(async (messageId: string) => {
    try {
      const res = await fetch(`/api/portal/files?message_ids=${messageId}`);
      if (!res.ok) return;
      const { files } = (await res.json()) as { files: PortalFileWithUrl[] };
      if (files.length > 0) setAttachments((prev) => ({ ...prev, [messageId]: files }));
    } catch {
      // Anhänge sind nicht kritisch — die Nachricht selbst steht schon da
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${clientId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) => {
            const optimistic = prev.find(
              (m) =>
                m.id.startsWith("opt-") &&
                m.content === incoming.content &&
                m.sender_role === incoming.sender_role
            );
            if (optimistic) return prev.map((m) => (m.id === optimistic.id ? incoming : m));
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
          void loadAttachments(incoming.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, loadAttachments]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Eingabefeld: wächst mit dem Text, gedeckelt bei 50 % der Chathöhe ─────
  const resizeInput = useCallback(() => {
    const el = textareaRef.current;
    const shell = shellRef.current;
    if (!el || !shell) return;
    const max = Math.max(INPUT_MIN_HEIGHT, shell.clientHeight * INPUT_MAX_RATIO);
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${Math.max(next, INPUT_MIN_HEIGHT)}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, []);

  useLayoutEffect(resizeInput, [draft, uploads.length, resizeInput]);

  useEffect(() => {
    const onResize = () => resizeInput();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resizeInput]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadFiles = useCallback(
    async (fileList: FileList | null) => {
      const files = Array.from(fileList ?? []);
      if (files.length === 0) return;
      setError(null);

      await Promise.all(
        files.map(async (file) => {
          const key = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
          setUploads((prev) => [...prev, { key, name: file.name, size: file.size, progress: 0 }]);

          if (file.size > MAX_FILE_SIZE) {
            setUploads((prev) =>
              prev.map((u) => (u.key === key ? { ...u, error: "Datei zu groß (max. 50 MB)." } : u))
            );
            return;
          }

          const body = new FormData();
          body.append("file", file);
          body.append("scope", "chat");
          body.append("client_id", clientId);
          body.append(
            "category",
            file.type.startsWith("image/") ? "images" : file.type.startsWith("video/") ? "videos" : "other"
          );

          try {
            const uploaded = await new Promise<PortalFileWithUrl>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open("POST", "/api/portal/files");
              xhr.withCredentials = true;
              xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                  const progress = Math.round((e.loaded / e.total) * 100);
                  setUploads((prev) => prev.map((u) => (u.key === key ? { ...u, progress } : u)));
                }
              });
              xhr.addEventListener("load", () => {
                try {
                  const payload = JSON.parse(xhr.responseText);
                  if (xhr.status >= 200 && xhr.status < 300) resolve(payload.file);
                  else reject(new Error(payload.error ?? `Fehler ${xhr.status}`));
                } catch {
                  reject(new Error(`Upload fehlgeschlagen (${xhr.status})`));
                }
              });
              xhr.addEventListener("error", () => reject(new Error("Netzwerkfehler beim Upload.")));
              xhr.send(body);
            });
            setUploads((prev) =>
              prev.map((u) => (u.key === key ? { ...u, progress: 100, file: uploaded } : u))
            );
          } catch (e) {
            setUploads((prev) =>
              prev.map((u) =>
                u.key === key ? { ...u, error: e instanceof Error ? e.message : "Upload fehlgeschlagen." } : u
              )
            );
          }
        })
      );
    },
    [clientId]
  );

  async function removeUpload(key: string) {
    const upload = uploads.find((u) => u.key === key);
    setUploads((prev) => prev.filter((u) => u.key !== key));
    if (upload?.file) {
      // Noch nicht abgeschickt: die Datei soll nicht als Waise liegen bleiben
      await fetch(`/api/portal/files/${upload.file.id}`, { method: "DELETE" }).catch(() => {});
    }
  }

  // ── Senden ────────────────────────────────────────────────────────────────
  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    const content = draft.trim();
    const attachmentIds = readyAttachments.map((f) => f.id);
    if ((!content && attachmentIds.length === 0) || pending) return;
    if (uploads.some((u) => !u.file && !u.error)) return; // noch Uploads unterwegs

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
    setAttachments((prev) => ({ ...prev, [optimisticId]: readyAttachments }));
    setDraft("");
    setUploads([]);
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.set("content", content);
    formData.set("client_id", clientId);
    attachmentIds.forEach((id) => formData.append("attachment_ids", id));

    const result = await sendMessageAction({}, formData);
    setPending(false);

    if (result.error) {
      setError(result.error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setDraft(content);
      setUploads(readyAttachments.map((f) => ({ key: f.id, name: f.file_name, size: f.size_bytes ?? 0, progress: 100, file: f })));
    } else if (result.messageId) {
      const sentId = result.messageId;
      setMessages((prev) => prev.map((m) => (m.id === optimisticId ? { ...m, id: sentId } : m)));
      setAttachments((prev) => {
        const { [optimisticId]: moved, ...rest } = prev;
        return moved ? { ...rest, [sentId]: moved } : rest;
      });
    }
  }

  const uploadsInFlight = uploads.some((u) => !u.file && !u.error);
  const canSend = (draft.trim().length > 0 || readyAttachments.length > 0) && !pending && !uploadsInFlight;

  return (
    <div
      ref={shellRef}
      className="relative flex flex-col h-full"
      onDragEnter={(e) => {
        e.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        void uploadFiles(e.dataTransfer.files);
      }}
    >
      {dragging && (
        <div className="absolute inset-3 z-20 rounded-2xl border-2 border-dashed border-primary bg-primary/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <p className="text-primary text-sm font-medium">Dateien hier loslassen</p>
        </div>
      )}

      {/* Nachrichten-Liste */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-text-muted text-sm py-12">
            Noch keine Nachrichten. Starte die Unterhaltung.
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_role === currentUserRole;
          const isOptimistic = msg.id.startsWith("opt-");
          const files = attachments[msg.id] ?? [];
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-opacity ${
                  isOptimistic ? "opacity-60" : "opacity-100"
                } ${
                  isOwn
                    ? "bg-primary-dark text-white rounded-tr-sm"
                    : "bg-surface border border-border text-text-primary rounded-tl-sm"
                }`}
              >
                {!isOwn && (
                  <p className="font-mono text-[11px] mb-1 opacity-90">
                    {msg.sender_role === "admin" ? "HM Labs" : clientName}
                  </p>
                )}
                {msg.content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
                {files.length > 0 && (
                  <div className={`space-y-1.5 ${msg.content ? "mt-2" : ""}`}>
                    {files.map((file) =>
                      file.mime_type?.startsWith("image/") && file.signedUrl ? (
                        <a key={file.id} href={file.signedUrl} target="_blank" rel="noopener noreferrer" className="block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file.signedUrl}
                            alt={file.file_name}
                            className="rounded-lg max-h-56 w-auto border border-white/10"
                          />
                          <span className={`font-mono text-[11px] ${isOwn ? "text-white/85" : "text-text-muted"}`}>
                            {file.file_name} · {formatBytes(file.size_bytes)}
                          </span>
                        </a>
                      ) : (
                        <a
                          key={file.id}
                          href={file.signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-2 border transition-colors ${
                            isOwn
                              ? "bg-white/10 border-white/20 hover:bg-white/15"
                              : "bg-bg border-border hover:border-primary/40"
                          }`}
                        >
                          <FileIcon mime={file.mime_type} />
                          <span className="min-w-0">
                            <span className="block text-xs truncate">{file.file_name}</span>
                            <span className={`block font-mono text-[11px] ${isOwn ? "text-white/85" : "text-text-muted"}`}>
                              {formatBytes(file.size_bytes)}
                            </span>
                          </span>
                        </a>
                      )
                    )}
                  </div>
                )}
                <p className={`font-mono text-[11px] mt-1 ${isOwn ? "text-white/85" : "text-text-muted"}`}>
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
      <div className="shrink-0 border-t border-border px-6 py-4">
        {uploads.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2.5">
            {uploads.map((u) => (
              <div
                key={u.key}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${
                  u.error ? "border-accent/30 bg-accent/10" : "border-border bg-surface"
                }`}
              >
                <span className="text-xs text-text-dim max-w-[160px] truncate">{u.name}</span>
                <span className="font-mono text-[11px] text-text-muted">
                  {u.error ? u.error : u.file ? formatBytes(u.size) : `${u.progress}%`}
                </span>
                <button
                  type="button"
                  onClick={() => void removeUpload(u.key)}
                  className="text-text-muted hover:text-accent transition-colors"
                  title="Entfernen"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 h-[46px] w-[46px] flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
              title="Datei anhängen"
              aria-label="Datei anhängen"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10.5 5.5 5.9 10.1a1.6 1.6 0 0 0 2.3 2.3l5-5a3 3 0 0 0-4.3-4.3l-5 5a4.5 4.5 0 0 0 6.4 6.4l4.2-4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="sr-only"
              onChange={(e) => {
                void uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <textarea
              ref={textareaRef}
              name="content"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nachricht schreiben oder Datei hierher ziehen..."
              rows={1}
              disabled={pending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
              className="flex-1 min-h-[46px] bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="shrink-0 h-[46px] bg-primary-dark hover:bg-primary-dark/90 disabled:opacity-50 text-white rounded-xl px-4 transition-colors"
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
          {error && <p className="text-accent text-xs mt-2">{error}</p>}
          <p className="text-text-muted text-xs mt-1.5">
            Enter zum Senden · Shift+Enter für neue Zeile · Dateien per Drag &amp; Drop oder Büroklammer
          </p>
        </form>
      </div>
    </div>
  );
}

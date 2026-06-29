"use client";

import { useState } from "react";
import { resendInviteAction } from "../_actions";

export default function ResendInviteButton({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleResend() {
    setStatus("loading");
    const result = await resendInviteAction(email);
    if (result.error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleResend}
      disabled={status === "loading" || status === "sent"}
      title={status === "sent" ? "Einladung gesendet!" : status === "error" ? "Fehler – erneut versuchen" : "Einladung erneut senden"}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
        status === "sent"
          ? "text-green-400 bg-green-500/10"
          : status === "error"
          ? "text-accent bg-accent/10"
          : "text-text-muted hover:text-primary hover:bg-primary/10"
      }`}
    >
      {status === "loading" ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="8 16" strokeLinecap="round" />
        </svg>
      ) : status === "sent" ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1.5 2.5l11 4.5-11 4.5V8l8-1-8-1V2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

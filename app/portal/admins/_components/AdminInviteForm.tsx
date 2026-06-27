"use client";

import { useFormState, useFormStatus } from "react-dom";
import { inviteAdminAction } from "../_actions";

export default function AdminInviteForm() {
  const [state, formAction] = useFormState(inviteAdminAction, {});

  if (state.success) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-green-500/10 border border-green-500/20 rounded-xl">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8l3.5 3.5 8.5-8.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-green-400 text-sm">Einladung gesendet!</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="name"
          type="text"
          placeholder="Name (optional)"
          className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="E-Mail *"
          className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
        />
      </div>
      {state.error && (
        <p className="text-accent text-sm">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
    >
      {pending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      Admin einladen
    </button>
  );
}

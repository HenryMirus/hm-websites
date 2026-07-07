"use client";

import { useFormState, useFormStatus } from "react-dom";
import { changeEmailAction } from "../_actions";
import { useRef, useEffect, useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
    >
      {pending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {pending ? "Senden..." : "Bestätigung senden"}
    </button>
  );
}

export default function EmailChangeForm({ currentEmail }: { currentEmail: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useFormState(changeEmailAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.success]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
      >
        E-Mail ändern
      </button>
    );
  }

  return (
    <form ref={formRef} action={action} className="mt-3 space-y-3">
      <div>
        <label className="block font-mono text-[11px] text-text-muted uppercase tracking-wider mb-1.5">
          Neue E-Mail-Adresse
        </label>
        <input
          type="email"
          name="email"
          placeholder={currentEmail}
          autoComplete="email"
          required
          className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      {state.error && (
        <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          {state.success}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => { setOpen(false); }}
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Abbrechen
        </button>
        <SubmitButton />
      </div>
    </form>
  );
}

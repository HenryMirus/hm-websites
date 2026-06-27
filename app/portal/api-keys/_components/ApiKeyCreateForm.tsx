"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createApiKeyAction } from "../_actions";

export default function ApiKeyCreateForm() {
  const [state, formAction] = useFormState(createApiKeyAction, {});

  if (state.newKey) {
    return (
      <div className="space-y-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-green-400 text-sm font-semibold mb-2">Key erstellt — nur einmal sichtbar!</p>
          <code className="font-mono text-xs text-text-primary break-all select-all">
            {state.newKey}
          </code>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(state.newKey!);
          }}
          className="text-sm text-primary hover:underline"
        >
          In Zwischenablage kopieren
        </button>
        <div>
          <p className="text-text-muted text-xs mb-2">Speichere ihn sicher — er kann nicht wiederhergestellt werden.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-text-muted hover:text-text-dim transition-colors"
          >
            Fertig
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex gap-3 items-end">
      <div className="flex-1">
        <label className="block text-sm text-text-dim mb-1.5">Name / Beschreibung</label>
        <input
          name="name"
          type="text"
          required
          placeholder="z.B. Automatisierungs-Skript #1"
          className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
        />
      </div>
      {state.error && <p className="text-accent text-sm">{state.error}</p>}
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
      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 shrink-0"
    >
      {pending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      Key erstellen
    </button>
  );
}

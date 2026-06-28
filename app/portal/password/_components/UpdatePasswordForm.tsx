"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updatePasswordAction } from "../_actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        "Passwort speichern"
      )}
    </button>
  );
}

export default function UpdatePasswordForm({ userEmail }: { userEmail: string }) {
  const [state, action] = useFormState(updatePasswordAction, null);

  return (
    <form action={action} className="space-y-4">
      <input
        type="text"
        name="email"
        autoComplete="username"
        value={userEmail}
        readOnly
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        type="password"
        name="password"
        placeholder="Neues Passwort (min. 8 Zeichen)"
        autoComplete="new-password"
        required
        minLength={8}
        autoFocus
        className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
      />
      <input
        type="password"
        name="confirm"
        placeholder="Passwort bestätigen"
        autoComplete="new-password"
        required
        minLength={8}
        className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
      />

      {state?.error && (
        <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <SubmitButton />

      <ul className="space-y-1 pt-1">
        {[
          "Mindestens 8 Zeichen",
          "Groß- und Kleinbuchstaben empfohlen",
          "Nach dem Speichern wirst Du auf allen Geräten abgemeldet",
        ].map((hint) => (
          <li key={hint} className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-1 h-1 rounded-full bg-text-muted/50 shrink-0" />
            {hint}
          </li>
        ))}
      </ul>
    </form>
  );
}

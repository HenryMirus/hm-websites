"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction } from "../_actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
    >
      {pending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {pending ? "Speichern..." : "Speichern"}
    </button>
  );
}

interface Props {
  name: string;
  companyName: string | null;
  phone: string | null;
}

export default function ProfileForm({ name, companyName, phone }: Props) {
  const [state, action] = useFormState(updateProfileAction, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block font-mono text-[11px] text-text-muted uppercase tracking-wider mb-1.5">
          Name *
        </label>
        <input
          type="text"
          name="name"
          defaultValue={name}
          required
          className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] text-text-muted uppercase tracking-wider mb-1.5">
          Firma
        </label>
        <input
          type="text"
          name="company_name"
          defaultValue={companyName ?? ""}
          className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] text-text-muted uppercase tracking-wider mb-1.5">
          Telefon
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={phone ?? ""}
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

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

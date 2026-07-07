"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createClientAction, updateClientAction } from "../_actions";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "prospect", label: "Interessent" },
  { value: "active", label: "Aktiv" },
  { value: "inactive", label: "Inaktiv" },
];

interface ClientFormProps {
  client?: {
    id: string;
    name: string;
    email: string;
    company_name: string | null;
    phone: string | null;
    status: string;
  };
}

export default function ClientForm({ client }: ClientFormProps) {
  const action = client
    ? updateClientAction.bind(null, client.id)
    : createClientAction;

  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <Field label="Name *" name="name" defaultValue={client?.name} placeholder="Max Mustermann" />
        <Field
          label="E-Mail *"
          name="email"
          type="email"
          defaultValue={client?.email}
          placeholder="max@firma.de"
          disabled={!!client}
        />
        <Field label="Firma" name="company_name" defaultValue={client?.company_name ?? ""} placeholder="Musterfirma GmbH" />
        <Field label="Telefon" name="phone" defaultValue={client?.phone ?? ""} placeholder="+49 123 456789" />

        <div>
          <label className="block text-sm text-text-dim mb-1.5">Status</label>
          <select
            name="status"
            defaultValue={client?.status ?? "prospect"}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary transition-colors"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {state.error && (
        <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      {!client && (
        <p className="text-text-muted text-xs">
          Nach dem Speichern bekommt der Kunde automatisch eine Einladungs-E-Mail zum Passwort festlegen.
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton label={client ? "Speichern" : "Anlegen & Einladen"} />
        <Link href="/portal/clients" className="text-sm text-text-muted hover:text-text-dim transition-colors">
          Abbrechen
        </Link>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", defaultValue, placeholder, disabled,
}: {
  label: string; name: string; type?: string; defaultValue?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-text-dim mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors disabled:opacity-50"
      />
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : null}
      {label}
    </button>
  );
}

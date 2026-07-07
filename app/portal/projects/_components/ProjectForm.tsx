"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createProjectAction, updateProjectAction, type ProjectFormState } from "../_actions";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "discovery", label: "Discovery" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "review", label: "Review" },
  { value: "live", label: "Live" },
  { value: "maintenance", label: "Wartung" },
  { value: "cancelled", label: "Abgebrochen" },
];

const TYPE_OPTIONS = [
  { value: "", label: "— kein Typ —" },
  { value: "website", label: "Website" },
  { value: "landing_page", label: "Landing Page" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "webapp", label: "Web-App" },
  { value: "maintenance", label: "Wartung" },
];

interface Client {
  id: string;
  name: string;
  company_name: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  status: string;
  type: string | null;
  budget: number | null;
  start_date: string | null;
  deadline: string | null;
  launch_date: string | null;
  vercel_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  tech_stack: string[] | null;
  notes: string | null;
}

interface ProjectFormProps {
  project?: Project;
  clients: Client[];
  defaultClientId?: string;
}

export default function ProjectForm({ project, clients, defaultClientId }: ProjectFormProps) {
  const action = project
    ? updateProjectAction.bind(null, project.id)
    : createProjectAction;

  const [state, formAction] = useFormState(action, {} as ProjectFormState);

  const techStackValue = project?.tech_stack
    ? (Array.isArray(project.tech_stack) ? project.tech_stack : Object.values(project.tech_stack)).join(", ")
    : "";

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-text-primary">Basis</h2>

        <Field label="Titel *" name="title" defaultValue={project?.title} placeholder="Projektname" />

        <div>
          <label className="block text-sm text-text-dim mb-1.5">Beschreibung</label>
          <textarea
            name="description"
            defaultValue={project?.description ?? ""}
            placeholder="Kurze Projektbeschreibung..."
            rows={3}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-dim mb-1.5">Kunde</label>
          <select
            name="client_id"
            defaultValue={project?.client_id ?? defaultClientId ?? ""}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary transition-colors"
          >
            <option value="">— kein Kunde —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name || c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-dim mb-1.5">Status</label>
            <select
              name="status"
              defaultValue={project?.status ?? "discovery"}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-dim mb-1.5">Typ</label>
            <select
              name="type"
              defaultValue={project?.type ?? ""}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary transition-colors"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-text-primary">Planung</h2>

        <Field label="Budget (€)" name="budget" type="number" defaultValue={project?.budget?.toString()} placeholder="5000" />

        <div className="grid grid-cols-3 gap-4">
          <Field label="Startdatum" name="start_date" type="date" defaultValue={project?.start_date?.split("T")[0]} />
          <Field label="Deadline" name="deadline" type="date" defaultValue={project?.deadline?.split("T")[0]} />
          <Field label="Launch" name="launch_date" type="date" defaultValue={project?.launch_date?.split("T")[0]} />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-text-primary">Links & Tech</h2>

        <Field label="Vercel URL" name="vercel_url" defaultValue={project?.vercel_url ?? ""} placeholder="https://..." />
        <Field label="GitHub URL" name="github_url" defaultValue={project?.github_url ?? ""} placeholder="https://github.com/..." />
        <Field label="Figma URL" name="figma_url" defaultValue={project?.figma_url ?? ""} placeholder="https://figma.com/..." />

        <div>
          <label className="block text-sm text-text-dim mb-1.5">Tech-Stack</label>
          <input
            type="text"
            name="tech_stack"
            defaultValue={techStackValue}
            placeholder="Next.js, Supabase, Tailwind CSS"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
          />
          <p className="text-text-muted text-xs mt-1">Kommagetrennt eingeben</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-text-primary">Notizen</h2>
        <textarea
          name="notes"
          defaultValue={project?.notes ?? ""}
          placeholder="Interne Notizen zum Projekt..."
          rows={4}
          className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {state?.error && (
        <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton label={project ? "Speichern" : "Projekt anlegen"} />
        <Link href="/portal/projects" className="text-sm text-text-muted hover:text-text-dim transition-colors">
          Abbrechen
        </Link>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", defaultValue, placeholder,
}: {
  label: string; name: string; type?: string; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-text-dim mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary transition-colors"
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

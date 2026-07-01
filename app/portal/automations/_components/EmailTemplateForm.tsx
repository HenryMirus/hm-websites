"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveEmailTemplateAction } from "../_actions";

const PLACEHOLDERS = [
  "{{client_name}}",
  "{{project_name}}",
  "{{milestone_name}}",
  "{{portal_url}}",
  "{{preview}}",
];

interface TemplateRow {
  key: string;
  name: string;
  subject: string;
  heading: string;
  preheader: string;
  body_html: string;
  cta_label: string;
  cta_href: string;
}

export default function EmailTemplateForm({ template }: { template: TemplateRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(template.name ?? "");
  const [subject, setSubject] = useState(template.subject ?? "");
  const [heading, setHeading] = useState(template.heading ?? "");
  const [preheader, setPreheader] = useState(template.preheader ?? "");
  const [bodyHtml, setBodyHtml] = useState(template.body_html ?? "");
  const [ctaLabel, setCtaLabel] = useState(template.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(template.cta_href ?? "");

  function submit() {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await saveEmailTemplateAction({
        key: template.key,
        name,
        subject,
        heading,
        preheader,
        body_html: bodyHtml,
        cta_label: ctaLabel,
        cta_href: ctaHref,
      });
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <div className="space-y-5">
      {/* Metadaten */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Metadaten</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Anzeigename</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Betreff</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="z.B. Ihr Projekt ist fertig, {{client_name}}!"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Preheader (Vorschautext im Posteingang)</label>
          <input
            value={preheader}
            onChange={(e) => setPreheader(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Inhalt */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Inhalt</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Überschrift (H1)</label>
          <input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Body (HTML)</label>
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={8}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm outline-none focus:border-primary font-mono leading-relaxed"
          />
          <p className="text-[11px] text-text-muted mt-1">
            HTML erlaubt. Platzhalter:{" "}
            {PLACEHOLDERS.map((p) => (
              <code
                key={p}
                className="font-mono bg-bg border border-border rounded px-1 py-0.5 text-primary cursor-pointer hover:bg-primary/10 transition-colors mr-1"
                onClick={() => setBodyHtml((b) => b + p)}
              >
                {p}
              </code>
            ))}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Call-to-Action</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Button-Text</label>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="z.B. Zum Portal"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-dim mb-1">Button-URL (Platzhalter erlaubt)</label>
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="{{portal_url}}/portal/projects"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      {error && (
        <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">{error}</p>
      )}
      {saved && (
        <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          Template gespeichert.
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {pending ? "Speichern…" : "Speichern"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/portal/automations/templates")}
          className="text-sm text-text-muted hover:text-text-dim transition-colors"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}

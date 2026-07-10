"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ANSWER_LABELS, SUB_QUESTION_TEXT } from "@/lib/wizard";

type LeadTier = "kalt" | "warm" | "heiss";

type AnswerEntry = { id: string; label: string };

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  lead_score: number | null;
  lead_tier: LeadTier | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

const STATUS_LABELS: Record<Lead["status"], { label: string; color: string }> = {
  new: { label: "Neu", color: "bg-primary/15 text-primary border-primary/20" },
  read: { label: "Gelesen", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  replied: { label: "Beantwortet", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  archived: { label: "Archiviert", color: "bg-border/60 text-text-muted border-border" },
};

const TIER_LABELS: Record<LeadTier, { label: string; color: string }> = {
  heiss: { label: "Heiß", color: "bg-accent/10 text-accent border-accent/25" },
  warm: { label: "Warm", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  kalt: { label: "Kalt", color: "bg-border/60 text-text-muted border-border" },
};

// Anzeigenamen für die Top-Level-Schlüssel in metadata.wizard_answers
const KEY_LABELS: Record<string, string> = {
  categories: "Interesse an",
  service: "Konkrete Leistung",
  branche: "Branche",
  existingWebsite: "Bestehende Website",
  problem: "Problem",
  companySize: "Unternehmensgröße",
  budget: "Budgetrahmen",
  urgency: "Dringlichkeit",
  decisionMaker: "Entscheidung",
};

function isAnswerEntry(v: unknown): v is AnswerEntry {
  return !!v && typeof v === "object" && "id" in v && "label" in v;
}

/** Rendert einen einzelnen wizard_answers-Wert, egal ob altes (String) oder neues ({id,label}) Format. */
function displayAnswer(value: unknown): string {
  if (isAnswerEntry(value)) return value.label;
  if (typeof value === "string") return ANSWER_LABELS[value]?.de ?? value;
  if (Array.isArray(value)) return value.map(displayAnswer).join(", ");
  return String(value);
}

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | Lead["status"]>("all");
  const [tierFilter, setTierFilter] = useState<"all" | LeadTier>("all");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const supabase = createClient();

  async function updateStatus(id: string, status: Lead["status"]) {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  }

  const filtered = useMemo(() => {
    let result = filter === "all" ? leads : leads.filter((l) => l.status === filter);
    if (tierFilter !== "all") result = result.filter((l) => l.lead_tier === tierFilter);
    result = [...result].sort((a, b) => {
      if (sortBy === "score") return (b.lead_score ?? -1) - (a.lead_score ?? -1);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return result;
  }, [leads, filter, tierFilter, sortBy]);

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    read: leads.filter((l) => l.status === "read").length,
    replied: leads.filter((l) => l.status === "replied").length,
    archived: leads.filter((l) => l.status === "archived").length,
  };

  const wizardAnswers = selected?.metadata?.wizard_answers as Record<string, unknown> | undefined;
  const subAnswers = wizardAnswers?.sub as Record<string, AnswerEntry> | undefined;
  const scoreBreakdown = selected?.metadata?.score_breakdown as { label: string; points: number }[] | undefined;

  return (
    <div className="flex h-screen">
      {/* List panel */}
      <div className="w-96 shrink-0 border-r border-border flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display font-bold text-lg text-text-primary">Leads</h1>
            <span className="font-mono text-xs text-text-muted bg-bg border border-border rounded-md px-2 py-0.5">
              {counts.new} neu
            </span>
          </div>
          {/* Status filter tabs */}
          <div className="flex gap-1 overflow-x-auto mb-2">
            {(["all", "new", "read", "replied", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 font-mono text-[11px] px-2.5 py-1.5 rounded-lg transition-colors border ${
                  filter === f
                    ? "bg-primary/10 text-primary border-primary/25"
                    : "text-text-muted border-border hover:text-text-dim hover:bg-bg"
                }`}
              >
                {f === "all" ? `Alle (${counts.all})` : `${STATUS_LABELS[f].label} (${counts[f]})`}
              </button>
            ))}
          </div>
          {/* Tier filter + sort */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(["all", "heiss", "warm", "kalt"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTierFilter(tf)}
                className={`shrink-0 font-mono text-[11px] px-2.5 py-1.5 rounded-lg transition-colors border ${
                  tierFilter === tf
                    ? "bg-primary/10 text-primary border-primary/25"
                    : "text-text-muted border-border hover:text-text-dim hover:bg-bg"
                }`}
              >
                {tf === "all" ? "Alle Tiers" : TIER_LABELS[tf].label}
              </button>
            ))}
            <button
              onClick={() => setSortBy((s) => (s === "date" ? "score" : "date"))}
              className="ml-auto shrink-0 font-mono text-[11px] px-2.5 py-1.5 rounded-lg transition-colors border border-border text-text-muted hover:text-text-dim hover:bg-bg"
            >
              Sortiert: {sortBy === "date" ? "Neueste" : "Score"}
            </button>
          </div>
        </div>

        {/* Lead list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-text-muted text-sm">Keine Einträge</div>
          ) : (
            filtered.map((lead) => (
              <button
                key={lead.id}
                onClick={() => {
                  setSelected(lead);
                  if (lead.status === "new") updateStatus(lead.id, "read");
                }}
                className={`w-full text-left px-5 py-4 hover:bg-bg/60 transition-colors ${
                  selected?.id === lead.id ? "bg-bg" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-sm text-text-primary truncate">{lead.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {lead.lead_tier && (
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${TIER_LABELS[lead.lead_tier].color}`}>
                        {lead.lead_score ?? "–"} · {TIER_LABELS[lead.lead_tier].label}
                      </span>
                    )}
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${STATUS_LABELS[lead.status].color}`}>
                      {STATUS_LABELS[lead.status].label}
                    </span>
                  </div>
                </div>
                <p className="text-text-muted text-xs truncate">{lead.email}</p>
                {lead.company && (
                  <p className="text-text-muted text-xs truncate">{lead.company}</p>
                )}
                <p className="text-text-dim text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {lead.subject || lead.message}
                </p>
                <p className="font-mono text-[10px] text-text-muted mt-1.5">
                  {new Date(lead.created_at).toLocaleDateString("de-DE", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Lead auswählen
          </div>
        ) : (
          <div className="p-8 max-w-2xl">
            {/* Actions */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {(["new", "read", "replied", "archived"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-lg border transition-colors ${
                    selected.status === s
                      ? STATUS_LABELS[s].color
                      : "border-border text-text-muted hover:text-text-dim hover:bg-bg"
                  }`}
                >
                  {STATUS_LABELS[s].label}
                </button>
              ))}
              <a
                href={`mailto:${selected.email}?subject=Re: Ihr Projekt bei HM Labs`}
                className="ml-auto inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Antworten
              </a>
            </div>

            {/* Lead-Score */}
            {selected.lead_tier && (
              <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider">Lead-Score</p>
                  <span className={`font-mono text-sm px-2.5 py-1 rounded-lg border ${TIER_LABELS[selected.lead_tier].color}`}>
                    {selected.lead_score} / 100 · {TIER_LABELS[selected.lead_tier].label}
                  </span>
                </div>
                {scoreBreakdown && scoreBreakdown.length > 0 && (
                  <div className="space-y-1.5">
                    {scoreBreakdown.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-text-dim">{f.label}</span>
                        <span className="font-mono text-text-muted">+{f.points}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact info */}
            <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-lg text-primary">
                    {selected.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-text-primary">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <p className="text-sm">
                      <a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a>
                    </p>
                  )}
                  {selected.company && (
                    <p className="text-text-muted text-sm">{selected.company}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-2">Nachricht</p>
                <p className="text-text-dim text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <p className="font-mono text-[11px] text-text-muted mt-4">
                Eingegangen:{" "}
                {new Date(selected.created_at).toLocaleDateString("de-DE", {
                  weekday: "long", day: "2-digit", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>

            {/* Wizard answers */}
            {!!wizardAnswers && (
              <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
                <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-4">
                  Wizard-Antworten
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(wizardAnswers)
                    .filter(([key]) => key !== "sub")
                    .map(([key, val]) => (
                      <div key={key} className="bg-bg border border-border rounded-xl p-3">
                        <p className="font-mono text-[10px] text-text-muted mb-1">
                          {KEY_LABELS[key] ?? key}
                        </p>
                        <p className="text-text-primary text-sm font-medium">{displayAnswer(val)}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sub-wizard answers */}
            {!!subAnswers && Object.keys(subAnswers).length > 0 && (
              <div className="bg-surface border border-border rounded-2xl p-6">
                <p className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-4">
                  Zusatzfragen (optionaler Unterwizard)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(subAnswers).map(([key, val]) => (
                    <div key={key} className="bg-bg border border-border rounded-xl p-3">
                      <p className="font-mono text-[10px] text-text-muted mb-1">
                        {SUB_QUESTION_TEXT[key]?.de ?? key}
                      </p>
                      <p className="text-text-primary text-sm font-medium">{displayAnswer(val)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

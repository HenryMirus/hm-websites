"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TRIGGERS, STEPS, triggerDef, stepDef, type FieldDef } from "@/lib/automations/registry";
import type { Automation, AutomationStep, StepType, TriggerType } from "@/lib/automations/types";
import { saveAutomationAction } from "../_actions";

type Cfg = Record<string, any>;

// ─── dotted-path Helfer (z.B. "filter.sender_role") ─────────────────────────
function getPath(obj: Cfg, path: string): any {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj: Cfg, path: string, value: any): Cfg {
  const keys = path.split(".");
  const next = structuredClone(obj ?? {});
  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = cur[keys[i]] ?? {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return next;
}
function defaultsFor(fields: FieldDef[]): Cfg {
  let cfg: Cfg = {};
  for (const f of fields) {
    if (f.default !== undefined) cfg = setPath(cfg, f.key, f.default);
  }
  return cfg;
}

interface Props {
  automation?: Automation;
  templates: { key: string; name: string }[];
}

export default function AutomationForm({ automation, templates }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(automation?.name ?? "");
  const [description, setDescription] = useState(automation?.description ?? "");
  const [enabled, setEnabled] = useState(automation?.enabled ?? true);
  const [triggerType, setTriggerType] = useState<TriggerType>(automation?.trigger?.type ?? "event");
  const [triggerCfg, setTriggerCfg] = useState<Cfg>(
    automation?.trigger?.config ?? defaultsFor(triggerDef("event")!.fields)
  );
  const [steps, setSteps] = useState<AutomationStep[]>(
    automation?.steps ?? [{ type: "send_email", config: defaultsFor(stepDef("send_email")!.fields) }]
  );

  const isSystem = automation?.is_system ?? false;

  function changeTriggerType(t: TriggerType) {
    setTriggerType(t);
    setTriggerCfg(defaultsFor(triggerDef(t)!.fields));
  }
  function addStep() {
    setSteps([...steps, { type: "send_email", config: defaultsFor(stepDef("send_email")!.fields) }]);
  }
  function removeStep(i: number) {
    setSteps(steps.filter((_, idx) => idx !== i));
  }
  function moveStep(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    setSteps(next);
  }
  function changeStepType(i: number, t: StepType) {
    const next = [...steps];
    next[i] = { type: t, config: defaultsFor(stepDef(t)!.fields) };
    setSteps(next);
  }
  function changeStepCfg(i: number, path: string, value: any) {
    const next = [...steps];
    next[i] = { ...next[i], config: setPath(next[i].config, path, value) };
    setSteps(next);
  }

  function submit() {
    setError(null);
    start(async () => {
      const res = await saveAutomationAction({
        id: automation?.id,
        name,
        description,
        enabled,
        trigger: { type: triggerType, config: triggerCfg },
        steps,
      });
      if (res.error) setError(res.error);
      else router.push("/portal/automations");
    });
  }

  const tDef = triggerDef(triggerType)!;

  return (
    <div className="space-y-5">
      {/* Stammdaten */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-text-dim mb-1.5">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Willkommens-Mail"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-text-dim mb-1.5">Beschreibung</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Wofür ist diese Automation?"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-text-dim cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-primary w-4 h-4" />
          Aktiv
        </label>
      </div>

      {/* Trigger */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Trigger</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TRIGGERS.map((t) => (
            <button
              key={t.type}
              type="button"
              disabled={isSystem}
              onClick={() => changeTriggerType(t.type)}
              className={`text-left p-3 rounded-xl border transition-colors disabled:opacity-50 ${
                triggerType === t.type ? "border-primary bg-primary/5" : "border-border hover:border-text-muted"
              }`}
            >
              <div className="text-lg">{t.icon}</div>
              <div className="text-sm font-medium text-text-primary mt-1">{t.label}</div>
              <div className="text-[11px] text-text-muted leading-tight mt-0.5">{t.description}</div>
            </button>
          ))}
        </div>
        <FieldGrid
          fields={tDef.fields}
          config={triggerCfg}
          onChange={(p, v) => setTriggerCfg(setPath(triggerCfg, p, v))}
          templates={templates}
        />
        {isSystem && (
          <p className="text-text-muted text-xs">Trigger-Typ einer System-Automation ist fixiert.</p>
        )}
      </div>

      {/* Schritte */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Schritte</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {steps.map((step, i) => {
          const sDef = stepDef(step.type)!;
          return (
            <div key={i} className="border border-border rounded-xl p-4 bg-bg/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs text-text-muted">{i + 1}.</span>
                <select
                  value={step.type}
                  onChange={(e) => changeStepType(i, e.target.value as StepType)}
                  className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary"
                >
                  {STEPS.map((s) => (
                    <option key={s.type} value={s.type}>{s.icon} {s.label}</option>
                  ))}
                </select>
                <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-1.5 text-text-muted hover:text-text-primary disabled:opacity-30" title="Hoch">▲</button>
                <button type="button" onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="p-1.5 text-text-muted hover:text-text-primary disabled:opacity-30" title="Runter">▼</button>
                <button type="button" onClick={() => removeStep(i)} className="p-1.5 text-text-muted hover:text-accent" title="Entfernen">✕</button>
              </div>
              <p className="text-[11px] text-text-muted mb-3">{sDef.description}</p>
              <FieldGrid
                fields={sDef.fields}
                config={step.config}
                onChange={(p, v) => changeStepCfg(i, p, v)}
                templates={templates}
              />
            </div>
          );
        })}

        <button
          type="button"
          onClick={addStep}
          className="w-full border border-dashed border-border rounded-xl py-3 text-sm text-text-dim hover:text-text-primary hover:border-text-muted transition-colors"
        >
          + Schritt hinzufügen
        </button>
      </div>

      {error && (
        <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {pending ? "Speichern…" : automation ? "Speichern" : "Anlegen"}
        </button>
        <button type="button" onClick={() => router.push("/portal/automations")} className="text-sm text-text-muted hover:text-text-dim transition-colors">
          Abbrechen
        </button>
      </div>
    </div>
  );
}

// ─── generischer Feld-Renderer aus der Registry ─────────────────────────────
function FieldGrid({
  fields,
  config,
  onChange,
  templates,
}: {
  fields: FieldDef[];
  config: Cfg;
  onChange: (path: string, value: any) => void;
  templates: { key: string; name: string }[];
}) {
  const visible = fields.filter((f) => {
    if (!f.showIf) return true;
    return getPath(config, f.showIf.key) === f.showIf.equals;
  });
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      {visible.map((f) => {
        const value = getPath(config, f.key);
        const options =
          f.key === "templateKey"
            ? templates.map((t) => ({ value: t.key, label: t.name }))
            : f.options ?? [];

        return (
          <div key={f.key}>
            <label className="block text-xs text-text-dim mb-1">{f.label}</label>
            {f.type === "select" ? (
              <select
                value={value ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary"
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                value={value ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary"
              />
            ) : f.type === "number" ? (
              <input
                type="number"
                value={value ?? 0}
                onChange={(e) => onChange(f.key, Number(e.target.value))}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-primary"
              />
            ) : f.type === "multiselect" ? (
              <div className="flex flex-wrap gap-1.5">
                {options.map((o) => {
                  const arr: string[] = Array.isArray(value) ? value : [];
                  const active = arr.includes(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() =>
                        onChange(f.key, active ? arr.filter((x) => x !== o.value) : [...arr, o.value])
                      }
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        active ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary font-mono"
              />
            )}
            {f.help && <p className="text-[11px] text-text-muted mt-1">{f.help}</p>}
          </div>
        );
      })}
    </div>
  );
}

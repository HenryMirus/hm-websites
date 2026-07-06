"use client";

import { useState } from "react";
import { createProject, useCockpitHealth } from "@/lib/os/cockpit";

const TYPES = ["website", "landing-page", "portal"];

export default function NewProjectButton() {
  const { status } = useCockpitHealth();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [type, setType] = useState("website");
  const [niche, setNiche] = useState("");
  const [lang, setLang] = useState("DE");
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!client.trim()) return;
    setBusy(true);
    try {
      await createProject({ client, type, niche, lang });
      setFlash("scaffolding in terminal — check the Chat tab");
      setOpen(false);
      setClient("");
      setNiche("");
      setTimeout(() => setFlash(null), 3500);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : "failed");
      setTimeout(() => setFlash(null), 4000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={status !== "online"}
        title={status !== "online" ? "start the OS server (npm run os:serve)" : "scaffold a new project"}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        New Project
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 z-20 bg-surface border border-border rounded-2xl p-4 shadow-xl">
          <h3 className="font-display font-semibold text-sm text-text-primary mb-3">
            Scaffold a project
          </h3>
          <label className="block mb-2">
            <span className="text-[11px] text-text-muted">Client name</span>
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Bakery Berlin"
              className="mt-1 w-full text-sm bg-bg border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-primary/40"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <label className="block">
              <span className="text-[11px] text-text-muted">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full text-sm bg-bg border border-border rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:border-primary/40"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] text-text-muted">Language</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="mt-1 w-full text-sm bg-bg border border-border rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:border-primary/40"
              >
                <option>DE</option>
                <option>EN</option>
              </select>
            </label>
          </div>
          <label className="block mb-3">
            <span className="text-[11px] text-text-muted">Niche</span>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="restaurant"
              className="mt-1 w-full text-sm bg-bg border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-primary/40"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={!client.trim() || busy}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              {busy ? "Running…" : "Scaffold"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="mt-2 text-text-dim text-[11px]">
            Runs{" "}
            <code className="font-mono">npm run new-project</code> in the terminal.
          </p>
        </div>
      )}

      {flash && (
        <p className="absolute right-0 mt-2 whitespace-nowrap font-mono text-[11px] text-green-400">
          {flash}
        </p>
      )}
    </div>
  );
}

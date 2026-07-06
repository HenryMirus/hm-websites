"use client";

import { useState } from "react";
import { execCommand, useCockpitHealth } from "@/lib/os/cockpit";

const SHORTCUTS: { label: string; cmd: string }[] = [
  { label: "Start Claude", cmd: "claude" },
  { label: "Query brain", cmd: 'npx tsx brain/retrieve/brain.ts "restaurant palette"' },
  { label: "Sync brain", cmd: "npm run sync" },
  { label: "List routines", cmd: "ls orchestrator/pipeline.*.json" },
  { label: "Git status", cmd: "git status" },
];

export default function ChatPage() {
  const { status, health } = useCockpitHealth();
  const [sent, setSent] = useState<string | null>(null);

  async function send(cmd: string) {
    try {
      await execCommand(cmd);
      setSent(cmd);
      setTimeout(() => setSent(null), 1500);
    } catch {
      /* offline — the dock shows the offline hint */
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Chat / Terminal
          </h1>
          <p className="text-text-muted text-sm mt-1">
            The terminal lives in the dock at the bottom — it stays alive across
            every tab, so a task you start here keeps running while you work
            elsewhere. Type in it directly, or use a shortcut below.
          </p>
        </div>
        <ConnBadge status={status} version={health?.registryVersion} />
      </div>

      {/* Shortcut buttons — click to run in the persistent terminal dock */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SHORTCUTS.map((s) => (
          <button
            key={s.label}
            onClick={() => send(s.cmd)}
            disabled={status !== "online"}
            title={s.cmd}
            className="font-mono text-[11px] px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-primary hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ▶ {s.label}
          </button>
        ))}
        {sent && (
          <span className="font-mono text-[11px] px-2 py-1.5 text-green-400">
            sent → terminal
          </span>
        )}
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          How the terminal persists
        </h3>
        <ul className="text-sm text-text-muted space-y-1.5 list-disc pl-5">
          <li>
            It&apos;s mounted once in the OS shell — switching tabs never resets
            it or kills a running task.
          </li>
          <li>
            On a full page reload it reconnects to the same shell session and
            replays the output (up to 256&nbsp;KB of scrollback).
          </li>
          <li>
            Action buttons across the OS (▶ QA, New Project, Run routine) run in
            this same terminal, so you always see what&apos;s happening.
          </li>
        </ul>
        <p className="mt-3 text-text-dim text-xs">
          Runs on your machine via the local companion server (agent-os{" "}
          <code className="font-mono bg-bg px-1 rounded">npm run os:serve</code>),
          bound to 127.0.0.1 — never exposed by the Vercel deploy.
        </p>
      </div>
    </div>
  );
}

function ConnBadge({
  status,
  version,
}: {
  status: "connecting" | "online" | "offline";
  version?: string;
}) {
  const cfg = {
    online: { dot: "bg-green-400", label: version ? `OS online · registry v${version}` : "OS online", color: "text-green-400" },
    connecting: { dot: "bg-yellow-400 animate-pulse", label: "connecting…", color: "text-yellow-400" },
    offline: { dot: "bg-accent", label: "OS server offline", color: "text-accent" },
  }[status];
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] px-2.5 py-1.5 rounded-lg border border-border bg-surface shrink-0">
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      <span className={cfg.color}>{cfg.label}</span>
    </span>
  );
}

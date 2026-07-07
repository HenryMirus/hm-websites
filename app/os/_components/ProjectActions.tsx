"use client";

import { useState } from "react";
import { runPipeline, useCockpitHealth } from "@/lib/os/cockpit";

const ACTIONS: { label: string; pipeline?: string; prompt: string }[] = [
  { label: "QA", pipeline: "pipeline.qa.json", prompt: "audit the built site against the QA + SEO checklists" },
  { label: "SEO", pipeline: "pipeline.qa.json", prompt: "run the SEO/GEO checklist against the site" },
  { label: "Dev", pipeline: "pipeline.delivery.json", prompt: "implement the next milestone tasks from _TODO.md" },
  { label: "Research", pipeline: "pipeline.research.json", prompt: "research the client's niche, competitors and local SEO" },
];

export default function ProjectActions({
  defaultTarget,
}: {
  defaultTarget: string;
}) {
  const { status } = useCockpitHealth();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(defaultTarget);
  const [flash, setFlash] = useState<string | null>(null);

  async function run(pipeline: string | undefined, prompt: string, label: string) {
    try {
      await runPipeline(prompt, target, pipeline);
      setFlash(`${label} → running in terminal`);
      setTimeout(() => setFlash(null), 2000);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : "failed");
      setTimeout(() => setFlash(null), 3000);
    }
  }

  return (
    <div className="mt-4 pt-3 border-t border-border">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider mr-1">
          run:
        </span>
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => (open ? run(a.pipeline, a.prompt, a.label) : setOpen(true))}
            disabled={status !== "online"}
            title={
              status !== "online"
                ? "start the OS server (npm run os:serve)"
                : open
                  ? `run ${a.label} against ${target}`
                  : "set target first"
            }
            className="font-mono text-[10px] bg-primary/10 text-primary rounded px-2 py-1 hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ▶ {a.label}
          </button>
        ))}
        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-auto font-mono text-[10px] text-text-muted hover:text-primary transition-colors"
        >
          {open ? "hide target" : "set target"}
        </button>
      </div>

      {open && (
        <div className="mt-2">
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="~/Code/Clients/<Client>/website"
            className="w-full font-mono text-[11px] bg-bg border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-primary/40"
          />
        </div>
      )}

      {flash && (
        <p className="mt-2 font-mono text-[11px] text-green-400">{flash}</p>
      )}
      {status !== "online" && (
        <p className="mt-2 font-mono text-[11px] text-text-dim">
          OS server offline — start it in agent-os:{" "}
          <code>npm run os:serve</code>
        </p>
      )}
    </div>
  );
}

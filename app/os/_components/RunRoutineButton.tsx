"use client";

import { useState } from "react";
import { execCommand, useCockpitHealth } from "@/lib/os/cockpit";

/**
 * Prefills the routine's run command at the terminal prompt (without pressing
 * Enter) so the operator can fill in the --target path and review before running.
 */
export default function RunRoutineButton({ file }: { file: string }) {
  const { status } = useCockpitHealth();
  const [flash, setFlash] = useState<string | null>(null);

  async function prefill() {
    const command = `npm run os -- build "" --target  --pipeline orchestrator/${file}`;
    try {
      await execCommand(command, false); // no autorun — user completes the path
      setFlash("prefilled in terminal → Chat tab");
      setTimeout(() => setFlash(null), 2500);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : "failed");
      setTimeout(() => setFlash(null), 3000);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
      <button
        onClick={prefill}
        disabled={status !== "online"}
        title={status !== "online" ? "start the OS server (npm run os:serve)" : "prefill run command in the terminal"}
        className="font-mono text-[11px] px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ▶ Run in terminal
      </button>
      <code className="font-mono text-[11px] text-text-dim break-all">
        orchestrator/{file}
      </code>
      {flash && (
        <span className="ml-auto font-mono text-[11px] text-green-400 shrink-0">
          {flash}
        </span>
      )}
    </div>
  );
}

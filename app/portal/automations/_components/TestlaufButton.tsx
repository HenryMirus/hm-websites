"use client";

import { useState, useTransition } from "react";
import { runAutomationTestAction } from "../_actions";

export default function TestlaufButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ status?: string; error?: string } | null>(null);

  function run() {
    setResult(null);
    start(async () => {
      const res = await runAutomationTestAction(id);
      setResult(res);
    });
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
      >
        {pending ? "Läuft…" : "Testlauf starten"}
      </button>
      {result && (
        <span
          className={`text-sm px-3 py-1.5 rounded-lg border ${
            result.error
              ? "text-accent border-accent/30 bg-accent/10"
              : "text-green-400 border-green-500/30 bg-green-500/10"
          }`}
        >
          {result.error ?? `Status: ${result.status}`}
        </span>
      )}
    </div>
  );
}

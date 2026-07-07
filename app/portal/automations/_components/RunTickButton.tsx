"use client";

import { useState, useTransition } from "react";
import { runCronTickAction } from "../_actions";

export default function RunTickButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function run() {
    setMsg(null);
    start(async () => {
      const res = await runCronTickAction();
      setMsg(`${res.ran}/${res.evaluated} fällige Automation(en) ausgeführt.`);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="text-sm text-text-dim hover:text-text-primary border border-border rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
        title="Zeitbasierte Automationen jetzt prüfen & fällige ausführen"
      >
        {pending ? "Prüfe…" : "Tick ausführen"}
      </button>
      {msg && (
        <p className="absolute top-full mt-1 right-0 text-xs text-text-muted whitespace-nowrap bg-surface border border-border rounded-lg px-2 py-1">
          {msg}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { deleteAutomationAction } from "../_actions";

export default function DeleteAutomationButton({
  id,
  name,
  isSystem,
}: {
  id: string;
  name: string;
  isSystem: boolean;
}) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  if (isSystem) {
    return (
      <span
        className="p-2 text-text-muted/40 cursor-not-allowed"
        title="System-Automation — nur deaktivierbar"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 4h11M6 4V2.5h4V4M12.5 4l-.5 9a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1l-.5-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  function handleDelete() {
    if (!confirm(`"${name}" wirklich löschen?`)) return;
    start(async () => {
      const res = await deleteAutomationAction(id);
      if (res?.error) setErr(res.error);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-bg transition-colors disabled:opacity-50"
      title={err ?? "Löschen"}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 4h11M6 4V2.5h4V4M12.5 4l-.5 9a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1l-.5-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

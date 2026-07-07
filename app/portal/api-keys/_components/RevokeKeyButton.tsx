"use client";

import { revokeApiKeyAction } from "../_actions";
import { useState } from "react";

export default function RevokeKeyButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    if (!confirm(`Key "${name}" widerrufen? Er kann nicht reaktiviert werden.`)) return;
    setLoading(true);
    await revokeApiKeyAction(id);
  }

  return (
    <button
      onClick={handleRevoke}
      disabled={loading}
      className="shrink-0 text-xs font-mono text-text-muted hover:text-accent border border-border hover:border-accent/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Widerrufen"}
    </button>
  );
}

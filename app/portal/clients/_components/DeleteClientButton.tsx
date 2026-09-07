"use client";

import { deleteClientAction } from "../_actions";
import { useState } from "react";

export default function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`"${name}" wirklich löschen?`)) return;
    setLoading(true);
    setError(null);
    const result = await deleteClientAction(id);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      alert(`Löschen fehlgeschlagen: ${result.error}`);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleDelete}
        disabled={loading}
        title={error ?? "Löschen"}
        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
          error ? "text-accent bg-accent/10" : "text-text-muted hover:text-accent hover:bg-accent/10"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

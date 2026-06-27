"use client";

import { deleteClientAction } from "../_actions";
import { useState } from "react";

export default function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${name}" wirklich löschen?`)) return;
    setLoading(true);
    await deleteClientAction(id);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
      title="Löschen"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

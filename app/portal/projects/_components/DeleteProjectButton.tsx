"use client";

import { deleteProjectAction } from "../_actions";
import { useState } from "react";

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Projekt "${title}" wirklich löschen? Diese Aktion ist nicht rückgängig zu machen.`)) return;
    setLoading(true);
    await deleteProjectAction(id);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-accent hover:bg-accent/10 border border-accent/20 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
      ) : (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      Löschen
    </button>
  );
}

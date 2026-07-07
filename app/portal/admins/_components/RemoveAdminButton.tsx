"use client";

import { removeAdminAction } from "../_actions";
import { useState } from "react";

export default function RemoveAdminButton({ userId, email }: { userId: string; email: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRemove() {
    if (!confirm(`${email} wirklich als Admin entfernen?`)) return;
    setLoading(true);
    const result = await removeAdminAction(userId);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div>
      {error && <p className="text-accent text-xs mb-1">{error}</p>}
      <button
        onClick={handleRemove}
        disabled={loading}
        className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
        title="Entfernen"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 8.5h7l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

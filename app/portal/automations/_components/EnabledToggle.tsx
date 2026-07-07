"use client";

import { useState, useTransition } from "react";
import { toggleAutomationAction } from "../_actions";

export default function EnabledToggle({ id, enabled }: { id: string; enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next);
    start(() => toggleAutomationAction(id, next));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      role="switch"
      aria-checked={on}
      title={on ? "Aktiv" : "Inaktiv"}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
        on ? "bg-primary" : "bg-border"
      } disabled:opacity-60`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          on ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

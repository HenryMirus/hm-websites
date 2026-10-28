"use client";

import { MotionConfig } from "framer-motion";

/**
 * Lässt alle framer-motion-Animationen der Systemeinstellung "Bewegung
 * reduzieren" folgen (Transformationen entfallen, Einblendungen bleiben kurz).
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

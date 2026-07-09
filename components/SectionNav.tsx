"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "portfolio", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function SectionNav() {
  const [active, setActive] = useState("home");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 items-end">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center gap-2.5 group"
          aria-label={label}
        >
          {/* Tooltip label */}
          <AnimatePresence>
            {hovered === id && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[10px] text-text-muted bg-surface border border-border rounded-md px-2 py-1 whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Dot */}
          <motion.span
            animate={{
              width: active === id ? 8 : 5,
              height: active === id ? 8 : 5,
              backgroundColor: active === id ? "#4F7FFF" : hovered === id ? "#5A5A7A" : "#1E1E2E",
            }}
            transition={{ duration: 0.2 }}
            className="rounded-full border border-border shrink-0"
            style={{ display: "block" }}
          />
        </a>
      ))}
    </nav>
  );
}

"use client";

import { motion } from "framer-motion";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function WordReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
}: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={`inline ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ marginRight: "0.28em" }}>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration,
              delay: delay + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

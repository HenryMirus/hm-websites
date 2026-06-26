"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number; // seconds before typing starts
  speed?: number; // ms per character (default: 60 = relaxed)
  startWhen?: boolean; // external trigger; undefined = auto IntersectionObserver
  showCursor?: boolean;
  persistCursor?: boolean; // keep cursor blinking after done
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  className = "",
  delay = 0,
  speed = 60,
  startWhen,
  showCursor = true,
  persistCursor = false,
  onComplete,
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(false);

  // Native IntersectionObserver — more reliable than framer-motion useInView
  useEffect(() => {
    if (startWhen !== undefined || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // External trigger via startWhen prop
  useEffect(() => {
    if (startWhen === true) setActive(true);
  }, [startWhen]);

  // Typing animation — runs once when active becomes true
  useEffect(() => {
    if (!active) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let idx = 0;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(intervalId);
          setDone(true);
          onComplete?.();
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const cursorVisible = showCursor && active && (!done || persistCursor);

  return (
    <span ref={ref} className="inline">
      {/* Full text always in DOM for SEO crawlers and screen readers */}
      <span className="sr-only">{text}</span>
      {/* Visual animated text hidden from assistive tech to avoid duplication */}
      <span aria-hidden="true" className={`inline ${className}`}>
        {displayed}
        {cursorVisible && <span className="typewriter-cursor" />}
      </span>
    </span>
  );
}

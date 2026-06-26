"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";

interface NavigationProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  onOpenWizard: () => void;
}

export default function Navigation({ lang, setLang, onOpenWizard }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#services", label: getText(t.nav.services, lang) },
    { href: "#process", label: getText(t.nav.process, lang) },
    { href: "#portfolio", label: getText(t.nav.portfolio, lang) },
    { href: "#about", label: getText(t.nav.about, lang) },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img
            src="/hm-labs-logo-v3.png"
            alt="HM Labs"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-display font-bold text-text-primary text-lg tracking-tight">
            HM <span className="text-primary">Labs</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-dim hover:text-text-primary transition-colors duration-200 text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            className="font-mono text-xs text-text-dim hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1.5 hover:border-primary/30"
          >
            {lang === "de" ? "EN" : "DE"}
          </button>

          <button
            onClick={onOpenWizard}
            className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors duration-200 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md shadow-primary/20"
          >
            {getText(t.nav.cta, lang)}
          </button>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex flex-col gap-1.5 items-center justify-center"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-text-dim transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-px bg-text-dim transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-px bg-text-dim transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-dim hover:text-text-primary transition-colors text-sm font-medium py-1"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onOpenWizard(); }}
                className="inline-flex items-center justify-center bg-primary text-white text-sm font-semibold px-4 py-3 rounded-xl mt-1"
              >
                {getText(t.nav.cta, lang)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

"use client";

import { useMotionValue, useSpring, useMotionTemplate, motion } from "framer-motion";
import { t, getText, Lang } from "@/lib/translations";

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  const year = new Date().getFullYear();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });
  const glow = useMotionTemplate`radial-gradient(500px circle at ${springX}px ${springY}px, rgba(79,127,255,0.06), transparent 55%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const links = [
    { href: "#services", label: getText(t.nav.services, lang) },
    { href: "#process", label: getText(t.nav.process, lang) },
    { href: "#portfolio", label: getText(t.nav.portfolio, lang) },
    { href: "#about", label: getText(t.nav.about, lang) },
    { href: "#contact", label: getText(t.nav.contact, lang) },
  ];

  return (
    <footer
      className="border-t border-border bg-bg relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glow }} />

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="grid md:grid-cols-3 gap-8 items-start mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/hm-labs-logo-v3.png" alt="HM Labs" width={28} height={28} className="rounded-md" />
              <span className="font-display font-bold text-text-primary">
                HM <span className="text-primary">Labs</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-[200px]">
              {getText(t.footer.tagline, lang)}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2.5">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-text-muted text-sm hover:text-text-dim transition-colors w-fit">
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2.5">
            <a href={`mailto:${t.contact.info.email}`} className="text-text-muted text-sm hover:text-primary transition-colors w-fit">
              {t.contact.info.email}
            </a>
            <span className="text-text-muted text-sm">{getText(t.contact.info.location, lang)}</span>
            <span className="text-text-muted text-sm">{getText(t.contact.info.response, lang)}</span>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-text-muted">
            © {year} HM Labs · {getText(t.footer.copy, lang)}
          </span>
          <span className="font-mono text-xs text-text-muted/50">
            Built with Next.js · Powered by AI
          </span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { t, getText, Lang } from "@/lib/translations";
import Marquee from "./Marquee";

interface TrustBarProps {
  lang: Lang;
}

export default function TrustBar({ lang }: TrustBarProps) {
  const industries = t.trust.industries.map((i) => getText(i, lang));

  return (
    <div className="border-y border-border bg-surface/30 py-5">
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <p className="text-center font-mono text-xs text-text-muted tracking-widest uppercase">
          {getText(t.trust.label, lang)}
        </p>
      </div>
      <Marquee items={industries} speed={30} />
    </div>
  );
}

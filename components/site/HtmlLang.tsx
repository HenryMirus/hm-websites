"use client";

import { useEffect } from "react";

/** Hält <html lang> für Screenreader/Suchmaschinen synchron (EN-Routen). */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/consent";

export default function CookieBanner() {
  const { consent, saveConsent } = useConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [localAnalytics, setLocalAnalytics] = useState(false);
  const [localMarketing, setLocalMarketing] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!consent.decided) {
      setShowBanner(true);
    }
    setLocalAnalytics(consent.analytics);
    setLocalMarketing(consent.marketing);
  }, [hydrated, consent.decided, consent.analytics, consent.marketing]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const save = (a: boolean, m: boolean) => {
    saveConsent(a, m);
    setShowBanner(false);
    setShowPopup(false);
  };

  const openSettings = () => {
    setLocalAnalytics(consent.analytics);
    setLocalMarketing(consent.marketing);
    setShowBanner(false);
    setShowPopup(true);
  };

  if (!hydrated) return null;

  const iconVisible = !showBanner && !footerVisible;

  return (
    <>
      {/* ── Initial consent banner ── */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[9997] border-t border-[#1E1E2E] bg-[#111118]/98 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="mt-0.5 shrink-0">
                <CookieIcon className="w-5 h-5 text-[#4F7FFF]" />
              </div>
              <div>
                <p className="text-[#EEEEFF] text-sm font-medium">Diese Website verwendet Cookies</p>
                <p className="text-[#5A5A7A] text-xs leading-relaxed mt-0.5">
                  Wir nutzen Cookies, um dir die beste Erfahrung zu bieten. Notwendige Cookies sind immer aktiv.{" "}
                  <Link href="/datenschutz" className="underline hover:text-[#4F7FFF] transition-colors">
                    Datenschutzerklärung
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => save(false, false)}
                className="px-4 py-2 rounded-lg border border-[#1E1E2E] text-[#5A5A7A] text-sm hover:border-[#4F7FFF] hover:text-[#EEEEFF] transition-all"
              >
                Nur Notwendige
              </button>
              <button
                onClick={openSettings}
                className="px-4 py-2 rounded-lg border border-[#1E1E2E] text-[#5A5A7A] text-sm hover:border-[#4F7FFF] hover:text-[#EEEEFF] transition-all"
              >
                Einstellungen
              </button>
              <button
                onClick={() => save(true, true)}
                className="px-4 py-2 rounded-lg bg-[#4F7FFF] text-white text-sm font-medium hover:bg-[#4F7FFF]/90 transition-colors"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed cookie icon ── */}
      <div
        className={`fixed bottom-6 left-6 z-[9998] transition-all duration-300 ${
          iconVisible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
        }`}
      >
        {/* Settings popup */}
        {showPopup && (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setShowPopup(false)} />
            <div className="absolute bottom-14 left-0 w-80 rounded-xl border border-[#1E1E2E] bg-[#111118] shadow-2xl shadow-black/60 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-[#1E1E2E]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CookieIcon className="w-4 h-4 text-[#4F7FFF]" />
                    <h3 className="text-[#EEEEFF] text-sm font-semibold">Cookie-Einstellungen</h3>
                  </div>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[#5A5A7A] hover:text-[#EEEEFF] hover:bg-[#1E1E2E] transition-all text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-[#5A5A7A] text-xs mt-1 leading-relaxed">
                  DSGVO-konform · Deine Auswahl wird lokal gespeichert
                </p>
              </div>

              {/* Toggles */}
              <div className="p-4 space-y-4">
                <ToggleRow
                  label="Notwendige Cookies"
                  description="Session, Sicherheit, Grundfunktionen"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
                <div className="w-full h-px bg-[#1E1E2E]" />
                <ToggleRow
                  label="Analyse-Cookies"
                  description="Seitenaufrufe & Nutzungsverhalten (anonym)"
                  checked={localAnalytics}
                  onChange={setLocalAnalytics}
                />
                <div className="w-full h-px bg-[#1E1E2E]" />
                <ToggleRow
                  label="Marketing-Cookies"
                  description="Personalisierte Inhalte & Werbung"
                  checked={localMarketing}
                  onChange={setLocalMarketing}
                />
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => save(localAnalytics, localMarketing)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[#1E1E2E] text-[#5A5A7A] text-xs hover:border-[#4F7FFF] hover:text-[#EEEEFF] transition-all"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={() => save(true, true)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#4F7FFF] text-white text-xs font-medium hover:bg-[#4F7FFF]/90 transition-colors"
                >
                  Alle akzeptieren
                </button>
              </div>

              <div className="pb-3 text-center">
                <Link
                  href="/datenschutz"
                  className="text-[#5A5A7A] text-[10px] hover:text-[#4F7FFF] transition-colors underline"
                  onClick={() => setShowPopup(false)}
                >
                  Datenschutzerklärung ansehen
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Icon button */}
        <button
          onClick={() => setShowPopup((p) => !p)}
          title="Cookie-Einstellungen"
          aria-label="Cookie-Einstellungen öffnen"
          className="w-11 h-11 rounded-full bg-[#111118] border border-[#4F7FFF]/40 flex items-center justify-center shadow-lg shadow-[#4F7FFF]/10 hover:border-[#4F7FFF] hover:scale-110 hover:shadow-[#4F7FFF]/25 transition-all group"
        >
          <CookieIcon className="w-5 h-5 text-[#4F7FFF]/70 group-hover:text-[#4F7FFF] transition-colors" />
        </button>
      </div>
    </>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[#EEEEFF] text-xs font-medium">{label}</p>
        <p className="text-[#5A5A7A] text-[11px] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-10 h-5 rounded-full relative transition-colors shrink-0 mt-0.5 ${
          checked ? "bg-[#4F7FFF]" : "bg-[#1E1E2E]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200 ${
            checked ? "left-[22px]" : "left-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

function CookieIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
      <circle cx="14" cy="8" r="1" fill="currentColor" />
      <circle cx="15.5" cy="14" r="1.5" fill="currentColor" />
      <circle cx="9.5" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

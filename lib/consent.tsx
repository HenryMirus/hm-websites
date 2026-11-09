"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
};

// Versioniert: Kommt ein Dienst hinzu, deckt eine alte Einwilligung ihn nicht ab.
// Neuer Schlüssel heißt, dass der Banner allen Besuchern erneut erscheint.
const STORAGE_KEY = "hm-cookie-consent-v3";

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decided: false,
};

type ConsentContextValue = {
  consent: ConsentState;
  saveConsent: (analytics: boolean, marketing: boolean) => void;
};

const ConsentContext = createContext<ConsentContextValue>({
  consent: defaultConsent,
  saveConsent: () => {},
});

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed: ConsentState = JSON.parse(stored);
      setConsent(parsed);
    } catch {
      // malformed storage — leave default
    }
  }, []);

  const saveConsent = useCallback((analytics: boolean, marketing: boolean) => {
    const updated: ConsentState = {
      necessary: true,
      analytics,
      marketing,
      decided: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setConsent(updated);

    // Widerruf: geladene Skripte laufen sonst bis zum nächsten Seitenwechsel
    // weiter. Nur ein Neuladen beendet sie.
    if ((consent.analytics && !analytics) || (consent.marketing && !marketing)) {
      window.location.reload();
    }
  }, [consent.analytics, consent.marketing]);

  return (
    <ConsentContext.Provider value={{ consent, saveConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Hält die Portal-Seiten aktuell, ohne dass jemand neu laden muss.
 *
 * Ereignisgesteuert statt getaktet: Supabase Realtime meldet Änderungen an den
 * Tabellen, die das Portal anzeigt (neue Nachricht, neuer Lead, neues Projekt,
 * Task-Status …), darauf holt `router.refresh()` die Server-Daten neu. React
 * gleicht nur die geänderten Stellen ab — kein Flackern, kein Scroll-Sprung,
 * lokaler State (z. B. der Chat-Entwurf) bleibt stehen.
 *
 * Drei Sparmaßnahmen, damit nichts unnötig läuft:
 *  - Mehrere Änderungen kurz hintereinander lösen einen einzigen Refresh aus.
 *  - Im Hintergrund-Tab wird nicht aktualisiert, sondern nur vorgemerkt und
 *    beim Zurückkehren nachgeholt.
 *  - Der zeitgesteuerte Fallback greift nur, wenn Realtime gerade nicht
 *    verbunden ist. Steht die Verbindung, ist er aus.
 */

const DEBOUNCE_MS = 400;
/** Nur aktiv, solange Realtime nicht verbunden ist. */
const FALLBACK_POLL_MS = 60_000;

export default function RealtimeRefresh({ tables }: { tables: string[] }) {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Im Hintergrund-Tab eingegangene Änderung, die noch nachzuholen ist. */
  const pendingRef = useRef(false);

  const refreshNow = useCallback(() => {
    pendingRef.current = false;
    router.refresh();
  }, [router]);

  const scheduleRefresh = useCallback(() => {
    if (typeof document !== "undefined" && document.hidden) {
      pendingRef.current = true;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(refreshNow, DEBOUNCE_MS);
  }, [refreshNow]);

  const stopFallbackPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startFallbackPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      if (!document.hidden) refreshNow();
    }, FALLBACK_POLL_MS);
  }, [refreshNow]);

  // ── Realtime-Abo ──────────────────────────────────────────────────────────
  // `tables` wird als String verglichen, damit ein neues Array mit gleichem
  // Inhalt nicht jedes Mal ein neues Abo aufbaut.
  const tableKey = tables.join(",");

  useEffect(() => {
    const watched = tableKey.split(",").filter(Boolean);
    if (watched.length === 0) return;

    const supabase = createClient();
    let channel = supabase.channel("portal-refresh");
    let hadError = false;

    for (const table of watched) {
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        scheduleRefresh
      );
    }

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        stopFallbackPolling();
        // Nach einem Abriss können Ereignisse verpasst worden sein.
        if (hadError) {
          hadError = false;
          scheduleRefresh();
        }
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        hadError = true;
        startFallbackPolling();
      }
    });

    return () => {
      supabase.removeChannel(channel);
      stopFallbackPolling();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [tableKey, scheduleRefresh, startFallbackPolling, stopFallbackPolling]);

  // ── Rückkehr in den Tab: Vorgemerktes nachholen ───────────────────────────
  useEffect(() => {
    function onVisible() {
      if (!document.hidden && pendingRef.current) refreshNow();
    }
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [refreshNow]);

  return null;
}

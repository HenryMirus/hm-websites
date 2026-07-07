"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import "@xterm/xterm/css/xterm.css";
import { OS_SERVER_WS } from "@/lib/os/cockpit";

const SESSION_KEY = "os_terminal_session";
const COLLAPSED_KEY = "os_terminal_collapsed";

/**
 * Persistent terminal dock. Rendered once in the OS layout (OsShell), so it is
 * NOT unmounted when you switch tabs — the WebSocket stays open and any running
 * task keeps going, visible on every tab. On a full reload it reconnects to the
 * same server-side PTY session (by id in localStorage) and replays the buffer.
 */
export default function TerminalDock() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<"connecting" | "open" | "closed">("connecting");
  const [expanded, setExpanded] = useState(false);

  // Restore collapsed preference; auto-expand when landing on the Chat tab.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(COLLAPSED_KEY) : null;
    if (saved === "false") setExpanded(true);
  }, []);
  useEffect(() => {
    if (pathname === "/os/chat") setExpanded(true);
  }, [pathname]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(COLLAPSED_KEY, String(!expanded));
  }, [expanded]);

  const refit = useCallback(() => {
    try {
      fitRef.current?.fit();
      const t = termRef.current;
      const ws = wsRef.current;
      if (t && ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ t: "resize", cols: t.cols, rows: t.rows }));
      }
    } catch {}
  }, []);

  // Mount xterm + connect ONCE. This component never unmounts during tab nav.
  useEffect(() => {
    let disposed = false;

    (async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      if (disposed || !containerRef.current) return;

      const term = new Terminal({
        fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Code", monospace',
        fontSize: 13,
        theme: { background: "#0e0e11", foreground: "#e4e4e7", cursor: "#ff6a3d", selectionBackground: "#33333a" },
        cursorBlink: true,
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      termRef.current = term;
      fitRef.current = fit;
      try { fit.fit(); } catch {}

      term.onData((d) => {
        if (wsRef.current?.readyState === WebSocket.OPEN)
          wsRef.current.send(JSON.stringify({ t: "in", d }));
      });

      connect();
    })();

    function connect() {
      const saved = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
      const url = saved ? `${OS_SERVER_WS}?session=${saved}` : OS_SERVER_WS;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      setState("connecting");

      ws.onopen = () => {
        if (!disposed) {
          setState("open");
          refit();
        }
      };
      ws.onclose = () => {
        if (disposed) return;
        setState("closed");
        // Auto-retry so the dock re-links when the server comes back / after sleep.
        setTimeout(() => !disposed && connect(), 2500);
      };
      ws.onerror = () => ws.close();
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data) as { t: string; d?: string; id?: number; reattached?: boolean };
          if (msg.t === "ready") {
            if (msg.id != null && typeof window !== "undefined")
              localStorage.setItem(SESSION_KEY, String(msg.id));
            if (msg.reattached) termRef.current?.clear(); // fresh redraw before replay
            if (msg.d) termRef.current?.write(msg.d);
          } else if ((msg.t === "out") && msg.d) {
            termRef.current?.write(msg.d);
          } else if (msg.t === "exit") {
            termRef.current?.write("\r\n\x1b[33m[session ended]\x1b[0m\r\n");
            if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
          }
        } catch {}
      };
    }

    return () => {
      disposed = true;
      // NOTE: we intentionally do NOT kill the PTY here — the server keeps the
      // session alive so a reload/reconnect resumes it. Just drop the socket.
      wsRef.current?.close();
      termRef.current?.dispose();
    };
  }, [refit]);

  // Refit whenever the dock is expanded or the window resizes.
  useEffect(() => {
    if (expanded) setTimeout(refit, 50);
  }, [expanded, refit]);
  useEffect(() => {
    const onResize = () => refit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [refit]);

  return (
    <div className="fixed bottom-0 left-56 right-0 z-40">
      {/* Dock header bar (always visible) */}
      <div className="flex items-center gap-2 px-4 h-9 border-t border-border bg-surface">
        <span className="font-mono text-[11px] text-text-muted">agent-os terminal</span>
        <span
          className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
            state === "open"
              ? "bg-green-500/15 text-green-400"
              : state === "connecting"
                ? "bg-yellow-500/15 text-yellow-400"
                : "bg-accent/15 text-accent"
          }`}
        >
          {state === "open" ? "● running" : state === "connecting" ? "connecting" : "offline"}
        </span>
        {state === "closed" && (
          <span className="font-mono text-[10px] text-text-dim">
            start it: <code className="text-text-muted">npm run os:serve</code>
          </span>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="ml-auto font-mono text-[11px] text-text-muted hover:text-primary transition-colors"
        >
          {expanded ? "▾ collapse" : "▴ terminal"}
        </button>
      </div>

      {/* Terminal body — kept mounted always; height animates on expand/collapse */}
      <div
        className="bg-[#0e0e11] border-t border-border overflow-hidden transition-[height] duration-150"
        style={{ height: expanded ? "min(62vh, 560px)" : 0 }}
      >
        <div ref={containerRef} className="h-full w-full p-2" />
      </div>
    </div>
  );
}

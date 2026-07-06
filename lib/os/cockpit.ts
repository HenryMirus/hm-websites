"use client";

/**
 * Client-side bridge to the local OS companion server (agent-os `npm run os:serve`).
 * Only reachable when the portal runs locally (`next dev`) — see next.config CSP.
 * Everything here is best-effort: if the server is down, calls reject and the UI
 * shows a "start the OS server" state instead of breaking.
 */

import { useEffect, useState, useCallback } from "react";

export const OS_SERVER_URL =
  process.env.NEXT_PUBLIC_OS_SERVER_URL ?? "http://127.0.0.1:4517";

export const OS_SERVER_WS =
  OS_SERVER_URL.replace(/^http/, "ws") + "/ws/terminal";

export type CockpitStatus = "connecting" | "online" | "offline";

export interface HealthInfo {
  ok: boolean;
  cwd: string;
  sessions: number;
  registryVersion: string;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${OS_SERVER_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Poll the companion server's health so the GUI can show connection state. */
export function useCockpitHealth(intervalMs = 5000) {
  const [status, setStatus] = useState<CockpitStatus>("connecting");
  const [health, setHealth] = useState<HealthInfo | null>(null);

  const check = useCallback(async () => {
    try {
      const h = await req<HealthInfo>("/api/health");
      setHealth(h);
      setStatus("online");
    } catch {
      setHealth(null);
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [check, intervalMs]);

  return { status, health, refresh: check };
}

// --- action helpers ------------------------------------------------------

/** autorun=false prefills the command at the terminal prompt without pressing Enter. */
export function execCommand(command: string, autorun = true) {
  return req<{ ok: boolean; sessionId: number }>("/api/exec", {
    method: "POST",
    body: JSON.stringify({ command, autorun }),
  });
}

export function runPipeline(prompt: string, target: string, pipeline?: string) {
  return req<{ ok: boolean; command: string }>("/api/run", {
    method: "POST",
    body: JSON.stringify({ prompt, target, pipeline }),
  });
}

export function createProject(input: {
  client: string;
  type?: string;
  niche?: string;
  lang?: string;
}) {
  return req<{ ok: boolean; command: string }>("/api/new-project", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// --- graph + notes -------------------------------------------------------

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  path: string;
  confidence?: number;
  neighbors: number;
}
export interface GraphLink {
  source: string;
  target: string;
}
export interface VaultGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function fetchGraph() {
  return req<VaultGraphData>("/api/graph");
}

export function fetchNote(path: string) {
  return req<{ path: string; content: string }>(
    `/api/note?path=${encodeURIComponent(path)}`
  );
}

export function saveNote(path: string, content: string) {
  return req<{ ok: boolean }>("/api/note", {
    method: "PUT",
    body: JSON.stringify({ path, content }),
  });
}

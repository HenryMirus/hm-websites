/**
 * Filesystem reader for the agent-os repo (registry + pipeline definitions).
 *
 * The agent-os repo is a sibling of this portal repo in local development
 * (~/Code/Websites/agent-os). The OS dashboard's Skills & Agents and Routines
 * tabs read it directly. Path is overridable via AGENT_OS_PATH; every reader
 * degrades gracefully to an empty result when the repo isn't present (e.g. a
 * production deploy where the sibling repo isn't checked out), so the tabs show
 * an honest empty state instead of crashing.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

export interface RegistryAgent {
  id: string;
  definition: string;
  description: string;
  skills: string[];
  mcps: string[];
  autonomy: "auto" | "propose-then-confirm" | "manual";
  writes: boolean;
}

export interface RegistrySkill {
  id: string;
  path: string;
  description: string;
}

export interface Registry {
  version: string;
  updated?: string;
  agents: RegistryAgent[];
  skills: RegistrySkill[];
  autonomyLevels: Record<string, string>;
}

export interface RoutineDef {
  file: string;
  name: string;
  comment?: string;
  maxIterations: number;
  passThreshold: number;
  phases: { name: string; parallel: boolean; agents: { name: string; registry_id: string; role: string }[] }[];
}

/** Resolve the agent-os repo root. Env override wins; else sibling of cwd. */
export function agentOsRoot(): string {
  if (process.env.AGENT_OS_PATH) return process.env.AGENT_OS_PATH;
  return path.resolve(process.cwd(), "..", "agent-os");
}

export function readRegistry(): Registry | null {
  try {
    const file = path.join(agentOsRoot(), "registry", "registry.json");
    if (!existsSync(file)) return null;
    return JSON.parse(readFileSync(file, "utf-8")) as Registry;
  } catch {
    return null;
  }
}

export function readRoutines(): RoutineDef[] {
  try {
    const dir = path.join(agentOsRoot(), "orchestrator");
    if (!existsSync(dir)) return [];
    const files = readdirSync(dir).filter(
      (f) => f.startsWith("pipeline.") && f.endsWith(".json")
    );
    const routines: RoutineDef[] = [];
    for (const f of files) {
      try {
        const def = JSON.parse(readFileSync(path.join(dir, f), "utf-8")) as {
          _comment?: string;
          name?: string;
          max_iterations?: number;
          pass_threshold?: number;
          phases?: RoutineDef["phases"];
        };
        routines.push({
          file: f,
          name: def.name ?? f.replace(/^pipeline\.|\.json$/g, ""),
          comment: def._comment,
          maxIterations: def.max_iterations ?? 1,
          passThreshold: def.pass_threshold ?? 0.9,
          phases: def.phases ?? [],
        });
      } catch {
        /* skip malformed pipeline file */
      }
    }
    return routines.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

import type { HealthCheck } from "./types";

async function ping(
  name: string,
  url: string,
  init?: RequestInit
): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    return {
      name,
      status: res.ok ? "ok" : "error",
      latency_ms: Date.now() - start,
      detail: res.ok ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      name,
      status: "error",
      latency_ms: Date.now() - start,
      detail: err instanceof Error ? err.message : "unreachable",
    };
  }
}

export async function getHealthChecks(): Promise<HealthCheck[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const githubToken = process.env.GITHUB_TOKEN;
  const vercelToken = process.env.VERCEL_TOKEN;

  const checks = await Promise.all([
    supabaseUrl
      ? ping("Supabase", `${supabaseUrl}/rest/v1/`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
          },
        })
      : Promise.resolve<HealthCheck>({
          name: "Supabase",
          status: "unconfigured",
          latency_ms: null,
          detail: "NEXT_PUBLIC_SUPABASE_URL not set",
        }),

    githubToken
      ? ping("GitHub API", "https://api.github.com/rate_limit", {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
      : Promise.resolve<HealthCheck>({
          name: "GitHub API",
          status: "unconfigured",
          latency_ms: null,
          detail: "GITHUB_TOKEN not set",
        }),

    vercelToken
      ? ping("Vercel API", "https://api.vercel.com/v2/user", {
          headers: { Authorization: `Bearer ${vercelToken}` },
        })
      : Promise.resolve<HealthCheck>({
          name: "Vercel API",
          status: "unconfigured",
          latency_ms: null,
          detail: "VERCEL_TOKEN not set",
        }),
  ]);

  return checks;
}

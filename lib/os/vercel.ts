import type { VercelProject } from "./types";

const VERCEL_API = "https://api.vercel.com";

function headers() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function getVercelProjects(): Promise<VercelProject[]> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return [];

  const res = await fetch(`${VERCEL_API}/v9/projects?limit=20`, {
    headers: headers(),
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { projects?: unknown[] };
  const projects = (data.projects ?? []) as Array<Record<string, unknown>>;

  return projects.map((p) => ({
    id: p.id as string,
    name: p.name as string,
    framework: (p.framework as string) ?? null,
    link: (p.link as VercelProject["link"]) ?? null,
    latestDeployments: (
      (p.latestDeployments as Array<Record<string, unknown>>) ?? []
    ).map((d) => ({
      state: d.state as string,
      url: (d.url as string) ?? null,
      createdAt: d.createdAt as number,
      target: (d.target as string) ?? null,
    })),
  }));
}

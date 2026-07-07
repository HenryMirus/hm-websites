import type { GitHubRepo } from "./types";

const GITHUB_API = "https://api.github.com";

function headers() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const res = await fetch(`${GITHUB_API}/user/repos?sort=pushed&per_page=30`, {
    headers: headers(),
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<Record<string, unknown>>;

  return data.map((r) => ({
    name: r.name as string,
    full_name: r.full_name as string,
    private: r.private as boolean,
    default_branch: r.default_branch as string,
    pushed_at: (r.pushed_at as string) ?? null,
    open_issues_count: (r.open_issues_count as number) ?? 0,
    html_url: r.html_url as string,
  }));
}

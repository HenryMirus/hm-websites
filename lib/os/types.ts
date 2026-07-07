export interface PipelineRun {
  id: string;
  id_text: string;
  pipeline: string;
  target: string;
  prompt: string;
  status: "running" | "passed" | "failed" | "cancelled";
  iterations: number | null;
  final_score: number | null;
  critical_findings: string[] | null;
  total_cost_usd: number | null;
  run_dir: string | null;
  created_at: string;
  finished_at: string | null;
}

export interface PipelineStep {
  id: string;
  run_id_text: string;
  iteration: number;
  phase: string;
  agent: string;
  status: "running" | "passed" | "failed";
  score: number | null;
  summary: string | null;
  approval: "n/a" | "pending" | "approved" | "rejected" | "mixed";
  cost_usd: number | null;
  output: Record<string, unknown>;
  created_at: string;
}

export interface PipelineApproval {
  id: string;
  run_id_text: string;
  iteration: number;
  phase: string;
  agent: string;
  tool_name: string;
  tool_input: Record<string, unknown>;
  description: string;
  status: "pending" | "approved" | "rejected" | "timed_out";
  decided_at: string | null;
  decided_by: string | null;
  created_at: string;
}

export interface UsageSnapshot {
  id: string;
  window_kind: "5h" | "weekly";
  used: number;
  limit_total: number | null;
  pct: number | null;
  captured_at: string;
}

export interface KnowledgeEntry {
  id: string;
  type: string;
  title: string;
  tags: string[];
  confidence: number;
  vault_path: string;
  last_reviewed_at: string;
  created_at: string;
}

export interface RunStats {
  total: number;
  passed: number;
  failed: number;
  running: number;
  cost_today: number;
  cost_7d: number;
  cost_all: number;
  pending_approvals: number;
}

export interface BrainStats {
  total: number;
  by_type: Record<string, number>;
  avg_confidence: number | null;
  needs_review: number;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  pushed_at: string | null;
  open_issues_count: number;
  html_url: string;
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  link: { type: string; repo?: string } | null;
  latestDeployments: Array<{
    state: string;
    url: string | null;
    createdAt: number;
    target: string | null;
  }>;
}

export type HealthStatus = "ok" | "error" | "unconfigured";

export interface HealthCheck {
  name: string;
  status: HealthStatus;
  latency_ms: number | null;
  detail: string | null;
}

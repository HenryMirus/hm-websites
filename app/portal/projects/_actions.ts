"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/getRole";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { dispatchEvent } from "@/lib/automations/engine";

export type ProjectFormState = { error?: string };

// ── Projekte ──────────────────────────────────────────────────────────────────

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Titel ist ein Pflichtfeld." };

  const client_id = (formData.get("client_id") as string) || null;
  const status = (formData.get("status") as string) || "discovery";
  const type = (formData.get("type") as string) || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const budget = formData.get("budget") ? Number(formData.get("budget")) : null;
  const start_date = (formData.get("start_date") as string) || null;
  const deadline = (formData.get("deadline") as string) || null;
  const launch_date = (formData.get("launch_date") as string) || null;
  const vercel_url = (formData.get("vercel_url") as string)?.trim() || null;
  const github_url = (formData.get("github_url") as string)?.trim() || null;
  const figma_url = (formData.get("figma_url") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const rawStack = (formData.get("tech_stack") as string)?.trim();
  const tech_stack = rawStack ? rawStack.split(",").map((s) => s.trim()).filter(Boolean) : null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .insert({ title, client_id, status, type, description, budget, start_date, deadline, launch_date, vercel_url, github_url, figma_url, notes, tech_stack })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/portal/projects");
  redirect(`/portal/projects/${data.id}/edit`);
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Titel ist ein Pflichtfeld." };

  const client_id = (formData.get("client_id") as string) || null;
  const status = (formData.get("status") as string) || "discovery";
  const type = (formData.get("type") as string) || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const budget = formData.get("budget") ? Number(formData.get("budget")) : null;
  const start_date = (formData.get("start_date") as string) || null;
  const deadline = (formData.get("deadline") as string) || null;
  const launch_date = (formData.get("launch_date") as string) || null;
  const vercel_url = (formData.get("vercel_url") as string)?.trim() || null;
  const github_url = (formData.get("github_url") as string)?.trim() || null;
  const figma_url = (formData.get("figma_url") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const rawStack = (formData.get("tech_stack") as string)?.trim();
  const tech_stack = rawStack ? rawStack.split(",").map((s) => s.trim()).filter(Boolean) : null;

  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update({ title, client_id, status, type, description, budget, start_date, deadline, launch_date, vercel_url, github_url, figma_url, notes, tech_stack })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/portal/projects/${id}`);
  revalidatePath(`/portal/projects/${id}/edit`);
  revalidatePath("/portal/projects");
  return {};
}

export async function deleteProjectAction(id: string): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("projects").delete().eq("id", id);
  revalidatePath("/portal/projects");
  redirect("/portal/projects");
}

// ── Meilensteine ──────────────────────────────────────────────────────────────

export async function createMilestoneAction(
  projectId: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Titel ist ein Pflichtfeld." };

  const due_date = (formData.get("due_date") as string) || null;
  const status = (formData.get("status") as string) || "pending";

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_milestones")
    .insert({ project_id: projectId, title, due_date, status });

  if (error) return { error: error.message };

  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
  return {};
}

export async function updateMilestoneStatusAction(
  id: string,
  projectId: string,
  status: string
): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("project_milestones").update({ status }).eq("id", id);

  // Automationen feuern (Fallback wenn keine Supabase-Webhooks konfiguriert)
  if (status === "completed" && !process.env.NOTIFY_VIA_WEBHOOK) {
    try {
      const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
      const { data: ms } = await admin
        .from("project_milestones")
        .select("title")
        .eq("id", id)
        .single();
      const { data: project } = await admin
        .from("projects")
        .select("id, title, status, clients(id, name, email)")
        .eq("id", projectId)
        .single();

      const client = (project as any)?.clients;
      if (ms && project && client?.id) {
        await dispatchEvent("milestone.completed", {}, {
          portalUrl: portalBase,
          client: { id: client.id, name: client.name ?? "Kunde", email: client.email },
          project: { id: (project as any).id, title: project.title, status: (project as any).status },
          milestone: { id, title: ms.title },
          vars: { project_url: `${portalBase}/projects/${projectId}` },
        });
      }
    } catch (e) {
      console.error("[Automation] milestone.completed:", e);
    }
  }

  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
}

export async function deleteMilestoneAction(id: string, projectId: string): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("project_milestones").delete().eq("id", id);
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
}

// ── Aufgaben (Tasks) ──────────────────────────────────────────────────────────

export async function createTaskAction(
  projectId: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Titel ist ein Pflichtfeld." };

  const description = (formData.get("description") as string)?.trim() || null;
  const priority = (formData.get("priority") as string) || "medium";
  const due_date = (formData.get("due_date") as string) || null;

  const admin = createAdminClient();
  const { error } = await admin
    .from("tasks")
    .insert({ project_id: projectId, title, description, priority, due_date });

  if (error) return { error: error.message };

  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
  return {};
}

export async function updateTaskStatusAction(
  id: string,
  projectId: string,
  status: string
): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("tasks").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
}

export async function deleteTaskAction(id: string, projectId: string): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("tasks").delete().eq("id", id);
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
}

// ── Entscheidungen ────────────────────────────────────────────────────────────

export async function createDecisionAction(
  projectId: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const decision = (formData.get("decision") as string)?.trim();
  if (!title || !decision) return { error: "Titel und Entscheidung sind Pflichtfelder." };

  const category = (formData.get("category") as string)?.trim() || "Allgemein";
  const rationale = (formData.get("rationale") as string)?.trim() || null;
  const decided_at = new Date().toISOString();

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_decisions")
    .insert({ project_id: projectId, title, decision, category, rationale, decided_at });

  if (error) return { error: error.message };

  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
  return {};
}

export async function deleteDecisionAction(id: string, projectId: string): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("project_decisions").delete().eq("id", id);
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export async function createFeedbackAction(
  projectId: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const summary = (formData.get("summary") as string)?.trim();
  if (!summary) return { error: "Zusammenfassung ist ein Pflichtfeld." };

  const round = Number(formData.get("round")) || 1;
  const source = (formData.get("source") as string)?.trim() || "Intern";
  const status = (formData.get("status") as string) || "open";
  const given_at = new Date().toISOString();

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_feedback")
    .insert({ project_id: projectId, summary, round, source, status, given_at });

  if (error) return { error: error.message };

  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
  return {};
}

export async function deleteFeedbackAction(id: string, projectId: string): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("project_feedback").delete().eq("id", id);
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}/edit`);
}

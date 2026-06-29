import { requireAdmin } from "@/lib/auth/getRole";
import { createClient } from "@/lib/supabase/server";
import PortalShell from "../../../_components/PortalShell";
import ProjectForm from "../../_components/ProjectForm";
import DeleteProjectButton from "../../_components/DeleteProjectButton";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  createMilestoneAction,
  updateMilestoneStatusAction,
  deleteMilestoneAction,
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
  createDecisionAction,
  deleteDecisionAction,
  createFeedbackAction,
  deleteFeedbackAction,
} from "../../_actions";
import MilestoneControls from "../_components/MilestoneControls";
import TasksSection from "../_components/TasksSection";
import DecisionControls from "../_components/DecisionControls";
import FeedbackControls from "../_components/FeedbackControls";

export const revalidate = 0;

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [supabase, unreadMessages] = await Promise.all([
    createClient(),
    getUnreadMessageCount(),
  ]);

  const [
    { data: project },
    { data: clients },
    { data: milestones },
    { data: tasks },
    { data: decisions },
    { data: feedback },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("clients").select("id, name, company_name").order("name"),
    supabase.from("project_milestones").select("*").eq("project_id", id).order("sort_order"),
    supabase.from("tasks").select("*").eq("project_id", id).order("sort_order"),
    supabase.from("project_decisions").select("*").eq("project_id", id).order("decided_at", { ascending: false }),
    supabase.from("project_feedback").select("*").eq("project_id", id).order("given_at", { ascending: false }),
  ]);

  if (!project) notFound();

  return (
    <PortalShell role="admin" unreadMessages={unreadMessages}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/portal/projects/${id}`}
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dim text-sm transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Zur Projektansicht
          </Link>
          <DeleteProjectButton id={id} title={project.title} />
        </div>

        <h1 className="font-display font-bold text-2xl text-text-primary mb-8">
          Projekt bearbeiten
        </h1>

        <div className="grid xl:grid-cols-2 gap-8 items-start">
          <div>
            <ProjectForm project={project} clients={clients ?? []} />
          </div>

          <div className="space-y-6">
            <TasksSection
              tasks={tasks ?? []}
              projectId={id}
              isAdmin={true}
              createTaskAction={createTaskAction}
              updateTaskStatusAction={updateTaskStatusAction}
              deleteTaskAction={deleteTaskAction}
            />

            <MilestoneControls
              milestones={milestones ?? []}
              projectId={id}
              createMilestoneAction={createMilestoneAction}
              updateMilestoneStatusAction={updateMilestoneStatusAction}
              deleteMilestoneAction={deleteMilestoneAction}
            />

            <DecisionControls
              decisions={decisions ?? []}
              projectId={id}
              createDecisionAction={createDecisionAction}
              deleteDecisionAction={deleteDecisionAction}
            />

            <FeedbackControls
              feedback={feedback ?? []}
              projectId={id}
              createFeedbackAction={createFeedbackAction}
              deleteFeedbackAction={deleteFeedbackAction}
            />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

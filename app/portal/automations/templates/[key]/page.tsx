import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getUserRole } from "@/lib/auth/getRole";
import { getUnreadMessageCount } from "@/lib/portal/getUnreadMessageCount";
import PortalShell from "@/app/portal/_components/PortalShell";
import EmailTemplateForm from "../../_components/EmailTemplateForm";

export const revalidate = 0;

export default async function EmailTemplateEditorPage({ params }: { params: { key: string } }) {
  await requireAdmin();
  const [supabase, role, unreadMessages] = await Promise.all([
    createClient(),
    getUserRole(),
    getUnreadMessageCount(),
  ]);

  const { data: template } = await supabase
    .from("email_templates")
    .select("*")
    .eq("key", params.key)
    .single();

  if (!template) notFound();

  return (
    <PortalShell role={role} unreadMessages={unreadMessages}>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <p className="text-text-muted text-sm mb-1">
            <a href="/portal/automations/templates" className="hover:text-text-primary transition-colors">
              ← E-Mail-Templates
            </a>
          </p>
          <h1 className="font-display text-2xl font-bold text-text-primary">{template.name}</h1>
          <p className="text-text-dim text-sm mt-1 font-mono">{template.key}</p>
        </div>
        <EmailTemplateForm template={template} />
      </div>
    </PortalShell>
  );
}

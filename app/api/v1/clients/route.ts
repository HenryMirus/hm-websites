import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api/verifyApiKey";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!(await verifyApiKey(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("clients")
    .select("id, name, email, company_name, phone, status, auth_user_id, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data });
}

export async function POST(request: NextRequest) {
  if (!(await verifyApiKey(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name as string)?.trim();
  const email = (body.email as string)?.trim().toLowerCase();
  const company_name = (body.company_name as string)?.trim() || null;
  const phone = (body.phone as string)?.trim() || null;
  const status = (body.status as string) || "prospect";

  if (!name || !email) {
    return NextResponse.json({ error: "name und email sind Pflichtfelder." }, { status: 422 });
  }

  const admin = createAdminClient();

  const { data: client, error: dbError } = await admin
    .from("clients")
    .insert({ name, email, company_name, phone, status })
    .select()
    .single();

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "E-Mail bereits vorhanden." }, { status: 409 });
    }
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Invite-Email senden (optional — body.send_invite: false überspringt es)
  if (body.send_invite !== false) {
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://clients.hm-labs.de";
    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${portalUrl}/auth/callback`,
      data: { name },
    });
    if (inviteError) {
      // Client wurde angelegt, Invite schlug fehl
      return NextResponse.json(
        { client, warning: `Client angelegt, Invite fehlgeschlagen: ${inviteError.message}` },
        { status: 201 }
      );
    }
  }

  return NextResponse.json({ client }, { status: 201 });
}

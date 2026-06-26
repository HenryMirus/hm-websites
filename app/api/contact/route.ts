import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message, subject, wizard_answers, source } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name und E-Mail sind erforderlich." }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      message: message?.trim() || "",
      subject: subject?.trim() || null,
      source_url: source || null,
      metadata: wizard_answers
        ? { wizard_answers, submitted_at: new Date().toISOString() }
        : {},
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Fehler beim Speichern." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}

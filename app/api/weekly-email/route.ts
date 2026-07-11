import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";

type EmailSession = {
  title: string | null;
  day_of_week: number | null;
  duration_minutes: number | null;
};

const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function renderEmail(sessions: EmailSession[]) {
  const list = sessions
    .map((session) => `<li><strong>${dayNames[session.day_of_week || 1]}</strong>: ${session.title} (${session.duration_minutes || 0} min)</li>`)
    .join("");
  return `<h1>Your TheraPlan week</h1><p>Here are your upcoming scheduled sessions.</p><ul>${list}</ul>`;
}

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("sessions").select("title,day_of_week,duration_minutes").eq("status", "scheduled").order("day_of_week", { ascending: true }).limit(5);
  if (error) return NextResponse.json({ error: "Could not prepare weekly email preview." }, { status: 500 });
  return NextResponse.json({ subject: "Your TheraPlan week", html: renderEmail((data || []) as EmailSession[]), sessions: data || [] });
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const body = await request.json().catch(() => ({}));
  if (body.approved !== true) {
    return NextResponse.json({ error: "Weekly email send requires explicit builder approval." }, { status: 403 });
  }
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured; preview is available via GET /api/weekly-email." }, { status: 503 });
  }

  const to = String(body.to || "").trim();
  if (!to) return NextResponse.json({ error: "Recipient email is required." }, { status: 400 });

  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("sessions").select("title,day_of_week,duration_minutes").eq("status", "scheduled").order("day_of_week", { ascending: true }).limit(5);
  if (error) return NextResponse.json({ error: "Could not load sessions for weekly email." }, { status: 500 });

  const payload = { from: "TheraPlan <onboarding@resend.dev>", to, subject: "Your TheraPlan week", html: renderEmail((data || []) as EmailSession[]) };
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return NextResponse.json({ error: "Resend rejected the email request.", details: result }, { status: 502 });

  await supabase.from("audit_logs").insert({ actor_type: "system", action: "send_weekly_email", object_type: "email", object_id: null, before_json: null, after_json: { to, resend_id: result.id, session_count: (data || []).length }, approved_by: String(body.approved_by || "builder") });
  return NextResponse.json({ ok: true, id: result.id });
}

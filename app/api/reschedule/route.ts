import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const { session_id, day_of_week } = await request.json();
    const supabase = getSupabaseServer();
    const { data: before } = await supabase.from("sessions").select("id,day_of_week").eq("id", session_id).single();
    const { error } = await supabase.from("sessions").update({ day_of_week: Number(day_of_week) }).eq("id", session_id);
    if (error) throw error;
    await supabase.from("audit_logs").insert({ actor_type: "user", action: "reschedule_session", object_type: "session", object_id: session_id, before_json: before, after_json: { day_of_week: Number(day_of_week) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not reschedule session." }, { status: 500 });
  }
}

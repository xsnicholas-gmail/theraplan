import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";
import { adjustFutureTargets } from "../../../lib/plan-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = String(body.session_id || "");
    const perceivedEffort = Number(body.perceived_effort);
    const feedback = String(body.feedback || "");
    const sets = Array.isArray(body.sets) ? body.sets : [];
    if (!sessionId || !sets.length || perceivedEffort < 1 || perceivedEffort > 5) {
      return NextResponse.json({ error: "Session, set logs, and effort rating are required." }, { status: 400 });
    }
    const supabase = getSupabaseServer();
    const { data: log, error: logError } = await supabase.from("session_logs").insert({ session_id: sessionId, completed_at: new Date().toISOString(), perceived_effort: perceivedEffort, feedback }).select("id").single();
    if (logError) throw logError;
    const rows = sets.map((set: any) => ({ session_log_id: log.id, session_exercise_id: String(set.session_exercise_id), set_number: Number(set.set_number), reps_completed: Number(set.reps_completed), weight_kg: set.weight_kg === "" || set.weight_kg == null ? null : Number(set.weight_kg) }));
    const { error: setError } = await supabase.from("set_logs").insert(rows);
    if (setError) throw setError;
    const { error: sessionError } = await supabase.from("sessions").update({ status: "done" }).eq("id", sessionId);
    if (sessionError) throw sessionError;
    await adjustFutureTargets(sessionId, perceivedEffort);
    return NextResponse.json({ ok: true, sessionLogId: log.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save this session. Please retry." }, { status: 500 });
  }
}

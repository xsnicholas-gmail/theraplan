import { getSupabaseServer } from "./supabase";

type IntakeInput = {
  age: number;
  primary_condition: string;
  pain_areas: string[];
  goals: string[];
  frequency_days_per_week: number;
  plan_duration_weeks: number;
  equipment_access: "home" | "gym" | "both";
  notes?: string;
};

const exerciseLibrary = [
  { name: "Cat-Cow Stretch", category: "Mobility", instructions: "Move between spinal flexion and extension on hands and knees with slow breathing.", cues: "Wrists under shoulders; keep it pain-free." },
  { name: "Glute Bridge", category: "Strength", instructions: "Lie on your back, drive hips up, squeeze glutes, lower with control.", cues: "Ribs down; avoid arching the lower back." },
  { name: "Dead Bug", category: "Control", instructions: "Lower opposite arm and leg while keeping your lower back gently pressed down.", cues: "Move slowly and stop if your back lifts." },
  { name: "Hip Flexor Stretch", category: "Mobility", instructions: "Half-kneel and shift hips forward gently, holding a tall torso.", cues: "Squeeze rear glute; no low-back pinch." },
  { name: "Banded Clamshell", category: "Control", instructions: "Side-lying knees bent; open top knee without rolling hips backward.", cues: "Small controlled range." },
  { name: "Wall Sit", category: "Strength", instructions: "Slide down a wall and hold with knees stacked above ankles.", cues: "Weight through heels; breathe steadily." },
];

function daysForFrequency(frequency: number) {
  const patterns: Record<number, number[]> = { 1: [1], 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 6], 5: [1, 2, 3, 5, 6] };
  return patterns[Math.min(5, Math.max(1, frequency))] || patterns[3];
}

export async function createPlanFromIntake(intake: IntakeInput) {
  const supabase = getSupabaseServer();
  const { data: intakeRow, error: intakeError } = await supabase.from("intakes").insert(intake).select("id").single();
  if (intakeError) throw intakeError;

  const title = `${intake.plan_duration_weeks}-Week ${intake.primary_condition} Plan`;
  const summary = `A personalised ${intake.equipment_access}-based plan focused on ${intake.goals.join(", ")} with ${intake.frequency_days_per_week} sessions per week.`;
  const { data: plan, error: planError } = await supabase.from("plans").insert({ intake_id: intakeRow.id, title, summary, status: "active", summary_source: "rule-engine", summary_confidence: 0.82 }).select("id").single();
  if (planError) throw planError;

  const exerciseIds: string[] = [];
  for (const exercise of exerciseLibrary) {
    const { data: existing } = await supabase.from("exercises").select("id").eq("name", exercise.name).maybeSingle();
    if (existing?.id) {
      exerciseIds.push(existing.id);
      continue;
    }
    const { data, error } = await supabase.from("exercises").insert(exercise).select("id").single();
    if (error) throw error;
    exerciseIds.push(data.id);
  }

  const days = daysForFrequency(intake.frequency_days_per_week);
  for (let weekNumber = 1; weekNumber <= intake.plan_duration_weeks; weekNumber++) {
    const { data: week, error: weekError } = await supabase.from("weeks").insert({ plan_id: plan.id, week_number: weekNumber, goal: weekNumber === 1 ? "Establish safe baseline and reduce symptoms" : "Progress capacity while respecting feedback" }).select("id").single();
    if (weekError) throw weekError;
    for (let i = 0; i < days.length; i++) {
      const { data: session, error: sessionError } = await supabase.from("sessions").insert({ week_id: week.id, plan_id: plan.id, day_of_week: days[i], title: `Week ${weekNumber} Day ${i + 1} — ${i % 2 === 0 ? "Mobility & Control" : "Strength Foundation"}`, duration_minutes: 20 + i * 5, status: "scheduled" }).select("id").single();
      if (sessionError) throw sessionError;
      const baseReps = 8 + weekNumber + i;
      const rows = [0, 1, 2].map((offset) => ({ session_id: session.id, exercise_id: exerciseIds[(i + offset) % exerciseIds.length], sets: offset === 0 ? 2 : 3, reps: baseReps + offset * 2, hold_seconds: offset === 0 && i % 2 ? 30 : 0, rest_seconds: 30 + offset * 15, order_index: offset + 1 }));
      const { error: seError } = await supabase.from("session_exercises").insert(rows);
      if (seError) throw seError;
    }
  }

  return plan.id as string;
}

export async function adjustFutureTargets(sessionId: string, effort: number) {
  const supabase = getSupabaseServer();
  const { data: session } = await supabase.from("sessions").select("id, plan_id, day_of_week").eq("id", sessionId).single();
  if (!session) return;
  const { data: logs } = await supabase.from("session_logs").select("perceived_effort").eq("session_id", sessionId).order("created_at", { ascending: false }).limit(2);
  const shouldReduce = effort >= 4 || (logs || []).filter((l) => (l.perceived_effort || 0) >= 4).length >= 2;
  const shouldIncrease = effort <= 2 || (logs || []).filter((l) => (l.perceived_effort || 0) <= 2).length >= 2;
  if (!shouldReduce && !shouldIncrease) return;
  const factor = shouldReduce ? 0.9 : 1.1;
  const { data: futureSessions } = await supabase.from("sessions").select("id").eq("plan_id", session.plan_id).eq("status", "scheduled").neq("id", sessionId).limit(3);
  const ids = (futureSessions || []).map((s) => s.id);
  if (!ids.length) return;
  const { data: targets } = await supabase.from("session_exercises").select("id,reps").in("session_id", ids);
  for (const target of targets || []) {
    const before = target.reps || 1;
    const after = Math.max(1, Math.round(before * factor));
    await supabase.from("session_exercises").update({ reps: after }).eq("id", target.id);
    await supabase.from("audit_logs").insert({ actor_type: "rule-engine", action: shouldReduce ? "reduce_reps_10_percent" : "increase_reps_10_percent", object_type: "session_exercise", object_id: target.id, before_json: { reps: before }, after_json: { reps: after } });
  }
}

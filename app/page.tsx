export const dynamic = "force-dynamic";

import { IntakeForm } from "../components/IntakeForm";
import { PlanOverview } from "../components/PlanOverview";
import { getSupabaseServer, type PlanWithWeeks } from "../lib/supabase";

async function getDemoPlan() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from("plans").select("id,title,summary,status,created_at,weeks(id,week_number,goal,sessions(id,title,day_of_week,duration_minutes,status,session_exercises(id,sets,reps,hold_seconds,rest_seconds,order_index,exercises(name,category))))").order("created_at", { ascending: true }).limit(1).single();
    if (error) throw error;
    return data as unknown as PlanWithWeeks;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Home() {
  const demoPlan = await getDemoPlan();
  return <main className="container space-y-8"><header className="top"><div><p className="eyebrow">TheraPlan</p><h1>Adaptive physiotherapy you can actually complete.</h1></div><a href="#intake" className="primary linkbutton">Create plan</a></header>{demoPlan ? <PlanOverview plan={demoPlan} /> : <div className="card"><h2>No demo plan found</h2><p className="muted">Apply the Supabase migration and seed data, then refresh.</p></div>}<div id="intake"><IntakeForm /></div></main>;
}

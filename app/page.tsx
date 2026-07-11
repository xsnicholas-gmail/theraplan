export const dynamic = "force-dynamic";

import { IntakeForm } from "../components/IntakeForm";
import { PlanOverview } from "../components/PlanOverview";
import { TheraHeroVisual } from "../components/TheraHeroVisual";
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
  return (
    <main className="container space-y-8">
      <header className="top hero-showcase">
        <div className="hero-copy">
          <p className="eyebrow">TheraPlan</p>
          <h1>Adaptive physiotherapy that feels guided, visual, and doable.</h1>
          <p className="muted">A plan dashboard inspired by modern rehab and fitness apps: clear movement cues, progress cards, printable plans, and set-by-set logging.</p>
          <div className="hero-pills"><span>AI plan builder</span><span>Rep logging</span><span>PDF export</span></div>
          <div className="actions"><a href="#intake" className="primary linkbutton">Create plan</a><a href="/login" className="linkbutton secondary">Sign in</a></div>
        </div>
        <TheraHeroVisual />
      </header>
      <section className="visual-strip" aria-label="TheraPlan workflow highlights">
        <article><strong>01</strong><span>Intake</span><small>Condition, goals, schedule</small></article>
        <article><strong>02</strong><span>Weekly plan</span><small>Sessions, targets, progress</small></article>
        <article><strong>03</strong><span>Session logging</span><small>Timer, reps, feedback</small></article>
      </section>
      {demoPlan ? <PlanOverview plan={demoPlan} /> : <div className="card"><h2>No demo plan found</h2><p className="muted">Apply the Supabase migration and seed data, then refresh.</p></div>}
      <div id="intake"><IntakeForm /></div>
    </main>
  );
}

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
          <h1>Rehab that moves like a personal training plan.</h1>
          <p className="muted">Physiotherapy plans with a sharper coaching feel: targeted movement cues, pain-aware reps, bold progress cards, and set-by-set execution.</p>
          <div className="hero-pills"><span>Recovery protocol</span><span>Pain-aware reps</span><span>Printable plan</span></div>
          <div className="actions"><a href="#intake" className="primary linkbutton">Create plan</a><a href="/login" className="linkbutton secondary">Sign in</a></div>
        </div>
        <TheraHeroVisual />
      </header>
      <section className="visual-strip" aria-label="TheraPlan workflow highlights">
        <article><strong>01</strong><span>Assess</span><small>Condition, goals, schedule</small></article>
        <article><strong>02</strong><span>Program</span><small>Therapy sessions and targets</small></article>
        <article><strong>03</strong><span>Execute</span><small>Timer, reps, feedback</small></article>
      </section>
      {demoPlan ? <PlanOverview plan={demoPlan} /> : <div className="card"><h2>No demo plan found</h2><p className="muted">Apply the Supabase migration and seed data, then refresh.</p></div>}
      <div id="intake"><IntakeForm /></div>
    </main>
  );
}

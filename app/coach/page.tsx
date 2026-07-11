export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSupabaseServer } from "../../lib/supabase";

async function getCurrentPlan() {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase.from("plans").select("id,title,summary").eq("status", "active").order("created_at", { ascending: false }).limit(1).maybeSingle();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const prompts = [
  "This felt painful — make the next session easier.",
  "I need a shorter version today.",
  "Swap an exercise that needs floor work.",
  "Help me focus more on range of motion.",
];

export default async function CoachPage() {
  const plan = await getCurrentPlan();

  return (
    <main className="container space-y-6">
      <Link href="/">← Home</Link>
      <section className="hero">
        <div>
          <p className="eyebrow">Coach mode</p>
          <h1>Adjust the plan before pain derails it.</h1>
          <p className="muted">Use Coach mode to review symptoms, schedule friction, exercise substitutions, and the next best recovery step.</p>
        </div>
        <Link href={plan ? `/plan/${plan.id}` : "/#intake"} className="primary linkbutton">{plan ? "Review active plan" : "Create a plan"}</Link>
      </section>
      <section className="grid two">
        <div className="card space-y-4">
          <p className="eyebrow">Current focus</p>
          <h2>{plan?.title || "No active plan yet"}</h2>
          <p className="muted">{plan?.summary || "Create an intake first, then come back to discuss schedule, pain response, and plan changes."}</p>
        </div>
        <div className="card space-y-4">
          <p className="eyebrow">Coach questions</p>
          <h2>What changed since your last session?</h2>
          <ul className="plain-list">
            <li>Did pain stay in the target range?</li>
            <li>Did any exercise feel restricted or unsafe?</li>
            <li>Do you need a shorter or gentler session?</li>
            <li>Should we move a session to another day?</li>
          </ul>
        </div>
      </section>
      <section className="card space-y-4">
        <p className="eyebrow">Quick feedback prompts</p>
        <div className="prompt-grid">{prompts.map((prompt) => <Link className="mode-card" href={plan ? `/plan/${plan.id}` : "/#intake"} key={prompt}>{prompt}</Link>)}</div>
      </section>
    </main>
  );
}

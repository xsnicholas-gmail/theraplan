export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSupabaseServer } from "../../lib/supabase";

type Exercise = {
  id: string;
  name: string | null;
  category: string | null;
  instructions: string | null;
  cues: string | null;
};

async function getExercises() {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase.from("exercises").select("id,name,category,instructions,cues").order("category", { ascending: true }).order("name", { ascending: true }).limit(50);
    return (data || []) as Exercise[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function friendlyCategory(category: string | null) {
  const value = (category || "education").toLowerCase();
  if (value.includes("strength")) return "Build support";
  if (value.includes("mobility")) return "Move more easily";
  if (value.includes("control")) return "Improve control";
  if (value.includes("balance")) return "Improve balance";
  if (value.includes("flex")) return "Reduce tightness";
  return category || "Learn what to do";
}

export default async function LibraryPage() {
  const exercises = await getExercises();

  return (
    <main className="container space-y-6">
      <Link href="/">← Home</Link>
      <section className="hero">
        <div>
          <p className="eyebrow">Exercise library</p>
          <h1>Know why each movement matters.</h1>
          <p className="muted">Browse the rehab exercise library by purpose, not gym jargon. Each card explains the target, instructions, and coach cue.</p>
        </div>
        <Link href="/#plan" className="primary linkbutton">Back to plan</Link>
      </section>
      {exercises.length ? <section className="sessions">
        {exercises.map((exercise) => <article className="session" key={exercise.id}>
          <p className="eyebrow">{friendlyCategory(exercise.category)}</p>
          <h2>{exercise.name}</h2>
          <p>{exercise.instructions}</p>
          <small>Coach cue: {exercise.cues || "Move slowly and stay inside a comfortable range."}</small>
        </article>)}
      </section> : <section className="card"><h2>No exercises found</h2><p className="muted">Seed or generate a plan to populate the exercise library.</p></section>}
    </main>
  );
}

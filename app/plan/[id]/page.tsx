import Link from "next/link";
import { notFound } from "next/navigation";
import { PlanOverview } from "../../../components/PlanOverview";
import { getSupabaseServer, type PlanWithWeeks } from "../../../lib/supabase";

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("plans").select("id,title,summary,status,created_at,weeks(id,week_number,goal,sessions(id,title,day_of_week,duration_minutes,status,session_exercises(id,sets,reps,hold_seconds,rest_seconds,order_index,exercises(name,category))))").eq("id", id).single();
  if (error || !data) notFound();
  return <main className="container space-y-6"><Link href="/">← Home</Link><PlanOverview plan={data as unknown as PlanWithWeeks} /></main>;
}

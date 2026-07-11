import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionLogger } from "../../../components/SessionLogger";
import { getSupabaseServer, type SessionDetail } from "../../../lib/supabase";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from("sessions").select("id,title,day_of_week,duration_minutes,status,plan_id,session_exercises(id,sets,reps,hold_seconds,rest_seconds,order_index,exercises(id,name,category,instructions,cues))").eq("id", id).single();
  if (error || !data) notFound();
  const session = data as unknown as SessionDetail;
  return <main className="container space-y-6"><Link href={`/plan/${session.plan_id}`}>← Back to week</Link><div className="hero"><div><p className="eyebrow">Session execution</p><h1>{session.title}</h1><p>Log every set, use the rest timer, and save effort feedback to adapt future targets.</p></div><span className={`badge ${session.status}`}>{session.status}</span></div><SessionLogger session={session} /></main>;
}

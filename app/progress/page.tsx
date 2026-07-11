export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSupabaseServer } from "../../lib/supabase";

type SessionRow = { id: string; status: string | null; title: string | null; day_of_week: number | null; duration_minutes: number | null };
type SessionLogRow = { id: string; perceived_effort: number | null; feedback: string | null; completed_at: string | null };

async function getProgress() {
  try {
    const supabase = getSupabaseServer();
    const [{ data: sessions }, { data: logs }] = await Promise.all([
      supabase.from("sessions").select("id,status,title,day_of_week,duration_minutes").order("created_at", { ascending: false }).limit(20),
      supabase.from("session_logs").select("id,perceived_effort,feedback,completed_at").order("completed_at", { ascending: false }).limit(6),
    ]);
    return { sessions: (sessions || []) as SessionRow[], logs: (logs || []) as SessionLogRow[] };
  } catch (error) {
    console.error(error);
    return { sessions: [] as SessionRow[], logs: [] as SessionLogRow[] };
  }
}

export default async function ProgressPage() {
  const { sessions, logs } = await getProgress();
  const completed = sessions.filter((session) => session.status === "done").length;
  const scheduled = sessions.filter((session) => session.status === "scheduled").length;
  const averageEffort = logs.length ? (logs.reduce((sum, log) => sum + (log.perceived_effort || 0), 0) / logs.length).toFixed(1) : "—";

  return (
    <main className="container space-y-6">
      <Link href="/">← Home</Link>
      <section className="hero">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>Recovery consistency, not vanity metrics.</h1>
          <p className="muted">Track completed sessions, effort, and feedback so the plan can adapt to what your body reports.</p>
        </div>
        <Link href="/#plan" className="primary linkbutton">Open plan</Link>
      </section>
      <section className="visual-strip">
        <article><strong>{completed}</strong><span>Completed</span><small>Sessions marked done</small></article>
        <article><strong>{scheduled}</strong><span>Upcoming</span><small>Sessions still scheduled</small></article>
        <article><strong>{averageEffort}</strong><span>Avg effort</span><small>Recent 1–5 session score</small></article>
      </section>
      <section className="card space-y-4">
        <p className="eyebrow">Recent feedback</p>
        {logs.length ? <ul className="plain-list">{logs.map((log) => <li key={log.id}><strong>Effort {log.perceived_effort || "—"}/5:</strong> {log.feedback || "No note added."}</li>)}</ul> : <p className="muted">Complete a session to see effort and feedback trends here.</p>}
      </section>
    </main>
  );
}

export const dynamic = "force-dynamic";

import Link from "next/link";
import { WeeklyEmailForm } from "../../components/WeeklyEmailForm";
import { getSupabaseServer } from "../../lib/supabase";

type EmailSession = { title: string | null; day_of_week: number | null; duration_minutes: number | null };

const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

async function getPreviewSessions() {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase.from("sessions").select("title,day_of_week,duration_minutes").eq("status", "scheduled").order("day_of_week", { ascending: true }).limit(5);
    return (data || []) as EmailSession[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function WeeklyEmailPage() {
  const sessions = await getPreviewSessions();

  return (
    <main className="container space-y-6">
      <Link href="/">← Home</Link>
      <section className="hero">
        <div>
          <p className="eyebrow">Weekly email</p>
          <h1>Preview the next recovery week.</h1>
          <p className="muted">Review upcoming scheduled sessions before sending a reminder email. Sends are approval-gated and audited.</p>
        </div>
        <Link href="/#plan" className="primary linkbutton">Back to plan</Link>
      </section>
      <section className="grid two">
        <div className="card space-y-4">
          <p className="eyebrow">Preview</p>
          <h2>Your TheraPlan week</h2>
          {sessions.length ? <ul className="plain-list">{sessions.map((session, index) => <li key={`${session.title}-${index}`}><strong>{dayNames[session.day_of_week || 1]}:</strong> {session.title} ({session.duration_minutes || 0} min)</li>)}</ul> : <p className="muted">No scheduled sessions are ready for email preview.</p>}
        </div>
        <WeeklyEmailForm />
      </section>
    </main>
  );
}

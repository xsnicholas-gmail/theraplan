import Link from "next/link";
import { RescheduleSession } from "./RescheduleSession";
import { ExportPlanPdfButton } from "./ExportPlanPdfButton";
import type { PlanWithWeeks } from "../lib/supabase";

const dayNames = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function PlanOverview({ plan }: { plan: PlanWithWeeks }) {
  const sessions = plan.weeks.flatMap((week) => week.sessions);
  const done = sessions.filter((session) => session.status === "done").length;
  return <section className="space-y-5">
    <div className="hero"><div><p className="eyebrow">Active therapy plan</p><h1>{plan.title}</h1><p>{plan.summary}</p><div className="actions"><ExportPlanPdfButton /><Link href={`/plan/${plan.id}`} className="linkbutton secondary no-print">Printable plan view</Link></div></div><div className="progress"><strong>{done}/{sessions.length}</strong><span>sessions complete</span></div></div>
    {plan.weeks.sort((a,b)=>(a.week_number||0)-(b.week_number||0)).map((week) => <div className="card" key={week.id}><h2>Week {week.week_number}: {week.goal}</h2><div className="sessions">{week.sessions.sort((a,b)=>(a.day_of_week||0)-(b.day_of_week||0)).map((session) => <article className={`session ${session.status}`} key={session.id}><Link href={`/session/${session.id}`} className="session-link"><span>{dayNames[session.day_of_week || 1]}</span><strong>{session.title}</strong><small>{session.duration_minutes} min · {session.status}</small><small>{session.session_exercises.map((item) => `${item.exercises?.name}: ${item.sets}×${item.reps}`).join(" · ")}</small></Link><RescheduleSession sessionId={session.id} currentDay={session.day_of_week} /></article>)}</div></div>)}
  </section>;
}

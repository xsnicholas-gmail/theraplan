"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SessionDetail } from "../lib/supabase";

export function SessionLogger({ session }: { session: SessionDetail }) {
  const router = useRouter();
  const initialSets = useMemo(() => session.session_exercises.flatMap((item) => Array.from({ length: item.sets || 1 }, (_, index) => ({ session_exercise_id: item.id, set_number: index + 1, reps_completed: item.reps || 0, weight_kg: "" }))), [session]);
  const [sets, setSets] = useState(initialSets);
  const [effort, setEffort] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateSet(index: number, key: "reps_completed" | "weight_kg", value: string) {
    setSets((current) => current.map((set, i) => i === index ? { ...set, [key]: key === "reps_completed" ? Number(value) : value } : set));
  }

  async function startTimer(rest: number) {
    setSeconds(rest);
    const interval = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) { window.clearInterval(interval); return 0; }
      return value - 1;
    }), 1000);
  }

  async function complete() {
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/session-log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: session.id, perceived_effort: effort, feedback, sets }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      router.push(`/plan/${session.plan_id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  }

  let setIndex = 0;
  return <div className="space-y-6">
    {seconds > 0 && <div className="timer">Rest timer: {seconds}s</div>}
    {session.session_exercises.map((item) => <section className="card" key={item.id}>
      <p className="eyebrow">{item.exercises?.category}</p><h2>{item.exercises?.name}</h2>
      <p>{item.exercises?.instructions}</p><p className="muted">Cue: {item.exercises?.cues}</p>
      <p><strong>Target:</strong> {item.sets} sets × {item.reps} reps {item.hold_seconds ? `with ${item.hold_seconds}s hold` : ""}</p>
      <div className="setgrid">{Array.from({ length: item.sets || 1 }, (_, idx) => { const current = setIndex++; return <div className="setrow" key={idx}><span>Set {idx + 1}</span><label>Reps completed<input aria-label={`reps completed for set ${idx + 1}`} inputMode="numeric" min="0" type="number" value={sets[current]?.reps_completed ?? 0} onChange={(e) => updateSet(current, "reps_completed", e.target.value)} /></label><label>Weight (kg)<input aria-label={`weight kg for set ${idx + 1}`} inputMode="decimal" placeholder="optional" value={sets[current]?.weight_kg ?? ""} onChange={(e) => updateSet(current, "weight_kg", e.target.value)} /></label><button type="button" onClick={() => startTimer(item.rest_seconds || 30)}>Start {item.rest_seconds || 30}s rest</button></div>; })}</div>
    </section>)}
    <section className="card"><h2>Complete session</h2><label>Perceived effort (1 easy – 5 hard)<input type="range" min="1" max="5" value={effort} onChange={(e) => setEffort(Number(e.target.value))} /> {effort}</label><label>Feedback<textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What felt good or difficult?" /></label>{error && <p className="error">{error}</p>}<button className="primary" onClick={complete} disabled={saving}>{saving ? "Saving…" : "Mark session done"}</button></section>
  </div>;
}

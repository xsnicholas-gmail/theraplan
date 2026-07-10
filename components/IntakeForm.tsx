"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function IntakeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = {
      age: formData.get("age"),
      primary_condition: formData.get("primary_condition"),
      pain_areas: String(formData.get("pain_areas") || "").split(","),
      goals: formData.getAll("goals"),
      frequency_days_per_week: formData.get("frequency_days_per_week"),
      plan_duration_weeks: formData.get("plan_duration_weeks"),
      equipment_access: formData.get("equipment_access"),
      notes: formData.get("notes"),
    };
    try {
      const response = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Plan generation failed");
      router.push(`/plan/${data.planId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Plan generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="card space-y-4">
      <div>
        <p className="eyebrow">Create your plan</p>
        <h2>Personalised intake</h2>
        <p className="muted">No login required. Your answers are stored to generate a working weekly programme.</p>
      </div>
      <div className="grid two">
        <label>Age<input name="age" type="number" min="16" max="100" defaultValue="34" required /></label>
        <label>Main condition<input name="primary_condition" defaultValue="Lower back pain" required /></label>
      </div>
      <label>Pain areas (comma-separated)<input name="pain_areas" defaultValue="lumbar, left hip" /></label>
      <fieldset><legend>Goals</legend><div className="checks">{["pain relief", "mobility", "strength", "return to sport"].map((goal) => <label key={goal}><input type="checkbox" name="goals" value={goal} defaultChecked={goal === "pain relief" || goal === "mobility"} />{goal}</label>)}</div></fieldset>
      <div className="grid two">
        <label>Sessions per week<select name="frequency_days_per_week" defaultValue="3"><option>2</option><option>3</option><option>4</option><option>5</option></select></label>
        <label>Duration (weeks)<select name="plan_duration_weeks" defaultValue="4"><option>2</option><option>4</option><option>6</option><option>8</option></select></label>
      </div>
      <fieldset><legend>Equipment</legend><div className="checks"><label><input type="radio" name="equipment_access" value="home" defaultChecked />Home</label><label><input type="radio" name="equipment_access" value="gym" />Gym</label><label><input type="radio" name="equipment_access" value="both" />Both</label></div></fieldset>
      <label>Notes<textarea name="notes" defaultValue="Desk job, symptoms worse after sitting." /></label>
      {error && <p className="error">{error} <button type="submit">Retry</button></p>}
      <button className="primary" disabled={loading}>{loading ? "Building your plan…" : "Generate my plan"}</button>
    </form>
  );
}

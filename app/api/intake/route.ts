import { NextResponse } from "next/server";
import { createPlanFromIntake } from "../../../lib/plan-engine";

function asList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const intake = {
      age: Number(body.age),
      primary_condition: String(body.primary_condition || "").trim(),
      pain_areas: asList(body.pain_areas),
      goals: asList(body.goals),
      frequency_days_per_week: Number(body.frequency_days_per_week),
      plan_duration_weeks: Number(body.plan_duration_weeks),
      equipment_access: body.equipment_access === "gym" || body.equipment_access === "both" ? body.equipment_access : "home",
      notes: String(body.notes || "").trim(),
    } as const;

    if (!intake.primary_condition || !intake.goals.length || intake.frequency_days_per_week < 1 || intake.plan_duration_weeks < 1) {
      return NextResponse.json({ error: "Please complete condition, goals, frequency, and duration." }, { status: 400 });
    }

    const planId = await createPlanFromIntake(intake);
    return NextResponse.json({ planId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "We could not build your plan. Check configuration and try again." }, { status: 500 });
  }
}

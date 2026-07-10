import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseServer() {
  if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey!, {
    auth: { persistSession: false },
  });
}

export type PlanWithWeeks = {
  id: string;
  title: string | null;
  summary: string | null;
  status: string | null;
  created_at: string;
  weeks: Array<{
    id: string;
    week_number: number | null;
    goal: string | null;
    sessions: Array<{
      id: string;
      title: string | null;
      day_of_week: number | null;
      duration_minutes: number | null;
      status: string | null;
      session_exercises: Array<{
        id: string;
        sets: number | null;
        reps: number | null;
        hold_seconds: number | null;
        rest_seconds: number | null;
        order_index: number | null;
        exercises: { name: string | null; category: string | null } | null;
      }>;
    }>;
  }>;
};

export type SessionDetail = {
  id: string;
  title: string | null;
  day_of_week: number | null;
  duration_minutes: number | null;
  status: string | null;
  plan_id: string;
  session_exercises: Array<{
    id: string;
    sets: number | null;
    reps: number | null;
    hold_seconds: number | null;
    rest_seconds: number | null;
    order_index: number | null;
    exercises: {
      id: string;
      name: string | null;
      category: string | null;
      instructions: string | null;
      cues: string | null;
    } | null;
  }>;
};

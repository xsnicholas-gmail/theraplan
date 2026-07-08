# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres + RLS + Storage)
- **AI:** OpenAI GPT-4o via server-side API route (never exposed to browser)
- **Email (later):** Resend

## Now vs Later
**Now:** intake → plan generation → session execution → rep logging → feedback loop
**Later:** user accounts + per-user data isolation, video library, weekly emails, physio review portal

## Key User Action — Step by Step
1. User fills intake form (condition, goals, frequency, equipment) → POST `/api/intake`
2. Server validates + stores `intake` row in Supabase
3. Server calls OpenAI with structured intake JSON → receives plan JSON
4. Server stores `plan`, `weeks`, `sessions`, `exercises` rows; returns `plan.id`
5. Browser redirects to `/plan/[id]` — weekly overview renders from DB (not from AI response)
6. User taps a session → session detail loads exercises from DB
7. User starts timer, logs sets via `/api/session-log` → `session_logs` + `set_logs` rows written
8. On session complete, feedback stored; plan-adjustment rule runs server-side (no AI needed)
9. Weekly overview re-renders with updated completion status

## Layer Order
1. **Data layer** — tables, constraints, RLS policies, seed data
2. **App logic** — CRUD routes, plan-adjustment rules (rule-based, no AI dependency)
3. **Intelligence** — OpenAI plan generation sits on top; removing it degrades to a manual plan entry, the rest of the app still works

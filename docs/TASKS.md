# Tasks & Sprints

## Sprint 1 — Data Foundation + Demo Seed
**Goal:** DB schema live, seed data renders on homepage without login.
- [ ] Write and apply migration SQL (all tables, RLS v1 permissive policies)
- [ ] Seed 2 demo plans with weeks, sessions, exercises, session_exercises
- [ ] `/` homepage shows seeded plan weekly overview (read from DB)
- [ ] Session detail page shows exercises with targets (read from DB)
- [ ] All pages handle loading, empty, and error states
**DoD:** Visiting `/` and `/plan/[demo-id]` shows real seeded data; no login required; Supabase table viewer confirms rows exist.

## Sprint 2 — Intake → Plan Generation Engine ✦ v1 functional
**Goal:** Core engine works end-to-end.
- [ ] Intake form (all fields, validation, equipment toggle)
- [ ] POST `/api/intake` stores intake row
- [ ] POST `/api/generate-plan` calls OpenAI, parses response, writes plan/weeks/sessions/session_exercises
- [ ] Redirect to `/plan/[id]` after generation; weekly overview renders live plan
- [ ] Loading state during generation (spinner + copy: "Building your plan…")
- [ ] Error state if OpenAI fails (retry button, error message)
**DoD:** Complete intake → see generated plan in under 60 s; plan rows exist in Supabase; error path shows user-friendly message.

## Sprint 3 — Session Execution + Rep Logging
**Goal:** Users can execute and log a session.
- [ ] Session detail: exercise cards with instructions, set/rep targets
- [ ] Countdown timer per exercise (configurable rest period)
- [ ] Set logger: input reps completed + optional weight
- [ ] POST `/api/session-log` writes session_log + set_logs
- [ ] Mark session complete; updates session.status in DB
- [ ] Perceived effort rating (1–5) on session completion
- [ ] Empty state: no sets logged yet; error state: save failure with retry
**DoD:** Log all sets for a session → session marked done → DB rows confirmed → weekly overview shows session as complete.

## Sprint 4 — Feedback Loop + Plan Adjustment
**Goal:** Plan adapts based on effort feedback.
- [ ] Rule engine: reads last 2 session_logs for perceived_effort; triggers ±10% rep adjustment
- [ ] `adjust_session_targets` tool writes updated reps + audit_log row
- [ ] Weekly overview shows adjusted targets (not original)
- [ ] User can manually reschedule a session (drag or date picker)
- [ ] `reschedule_session` tool updates day_of_week + audit_log row
**DoD:** 2 high-effort sessions → next session shows reduced reps in DB and UI; audit_log row present.

## Sprint 5 — Lock It Down (Auth + Per-User Isolation)
**Goal:** Real users own their data.
- [ ] Supabase Auth (email/password + magic link)
- [ ] Signup/login pages; redirect to intake on first login
- [ ] Swap RLS policies to `auth.uid() = user_id` on all tables
- [ ] Backfill user_id on any existing rows; add NOT NULL after migration
- [ ] Confirm anonymous visitors still see demo seed rows (demo plan has user_id = null, read policy allows null)
**DoD:** Two separate user accounts see only their own plans; demo plan visible to anonymous visitor; RLS policy test passes on staging.

## Sprint 6 — Polish + Weekly Email
**Goal:** Retention hook.
- [ ] Weekly email via Resend: sends session list for coming week every Monday
- [ ] Email uses `send_weekly_email` approved tool (high risk → builder approves send list before go-live)
- [ ] Mobile-responsive layout passes on iOS Safari and Android Chrome
- [ ] Exercise instruction copy reviewed for accuracy

## Gantt (sprint → weeks)
```
S1 Data Foundation         W1
S2 Intake + Generation     W1-W2  ← v1 functional
S3 Session Execution       W2
S4 Feedback + Adjustment   W3
S5 Lock It Down            W3-W4
S6 Polish + Email          W4
```

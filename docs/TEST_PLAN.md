# Test Plan

## Core Success Scenario (manual)
1. Open `/` → weekly overview of demo plan loads within 3 s. **Pass:** session cards visible, no spinner stuck.
2. Click "Create my plan" → intake form renders all fields. **Pass:** equipment toggle shows Home/Gym/Both options.
3. Fill form (age 35, lower back pain, 3 days/week, 6 weeks, home) → submit. **Pass:** spinner appears with "Building your plan…" copy.
4. Plan page loads → at least 3 sessions shown in Week 1. **Pass:** Supabase `sessions` table has new rows matching plan_id.
5. Open Day 1 session → exercise list with instructions and set targets visible. **Pass:** no blank exercise cards.
6. Start timer for Exercise 1 → countdown runs; log 3 sets. **Pass:** set_logs rows created in DB after each save.
7. Mark session complete → rate effort 4/5 → feedback text submitted. **Pass:** session_log row with perceived_effort = 4 exists; session.status = 'done'.
8. Return to weekly overview → Day 1 shows ✓ complete. **Pass:** status reflects DB truth (survives page refresh).

## Empty States
- New plan with no logs yet: session detail shows "No sets logged yet — tap Start to begin".
- Intake submitted but OpenAI times out: error banner "Plan generation failed. Try again" + retry button visible.

## Error States
- Submit intake with missing required field → inline validation error, no DB write.
- Session log save fails (network off) → toast "Save failed — your data is not lost, retry" + retry queued.
- Invalid plan ID in URL → 404 page with link back to homepage.

## Regression Checks (run after each sprint)
- Seeded demo plan still visible on `/` without login.
- No Supabase service role key visible in browser network tab.
- All buttons/forms persist data; no dead buttons.

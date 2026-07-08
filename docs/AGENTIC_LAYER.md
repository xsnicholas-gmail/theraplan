# Agentic Layer

## Risk Levels & Actions

### Low — Auto (no approval)
- Tag exercise category from name (rule + AI fallback)
- Draft plan summary text from intake fields
- Score perceived effort trend per user

### Medium — Light Approval (builder reviews before applying)
- Adjust next week's rep targets based on feedback trend
- Reschedule a missed session to the next available day

### High — Always Approval
- Regenerate the entire plan (discards current progress context)
- Send weekly summary email to user

### Critical — Human Only
- Delete a user's plan or intake data
- Any action touching payment or medical record export

## Named Tools (server-side only)
- `generate_plan(intake_id)` → calls OpenAI, writes plan/weeks/sessions to DB
- `adjust_session_targets(session_id, direction)` → updates reps ±10%, logs audit event
- `reschedule_session(session_id, new_date)` → updates day_of_week, logs audit event

## Audit Log Fields
`id | created_at | actor_type (user/system/ai) | action | object_type | object_id | before_json | after_json | approved_by`

## v1 vs Later
**v1:** `generate_plan` + rule-based `adjust_session_targets` (auto, logged)
**Later:** Full re-plan approval flow, email tool, physio review queue

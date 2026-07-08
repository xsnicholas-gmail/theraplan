# Security

## Secrets
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live only in Vercel environment variables — never in frontend bundles or client-side code.
- All AI calls go through `/api/generate-plan` (server route); browser never touches OpenAI directly.

## Permission Model (v1)
- RLS enabled on every table; v1 policies are permissive (demo-first, no login wall).
- Lock-down sprint: swap to `auth.uid() = user_id` owner policies; add NOT NULL constraint on user_id after migration.

## Approved Tools Rule
- Only named server-side tools (`generate_plan`, `adjust_session_targets`, `reschedule_session`) may mutate data.
- No `eval`, no dynamic SQL, no `run_any` escape hatches.
- Every tool call writes to `audit_logs` before returning.

## Audit Principle
- Every meaningful write (plan generated, session completed, targets adjusted) produces an `audit_logs` row with before/after JSON.
- Logs are append-only; no delete policy on `audit_logs`.

## Warnings
- Before enabling auth and real user data: run Supabase RLS policy tests against a staging project — do not rely on manual review alone.
- If adding payments later: stop and engage a payments specialist; do not DIY.

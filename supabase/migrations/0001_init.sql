create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  category text not null,
  instructions text,
  cues text,
  video_url text
);
alter table exercises enable row level security;
drop policy if exists "exercises_v1_read" on exercises;
create policy "exercises_v1_read" on exercises for select using (true);
drop policy if exists "exercises_v1_write" on exercises;
create policy "exercises_v1_write" on exercises for all using (true) with check (true);

create table if not exists intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  age int,
  primary_condition text,
  pain_areas text[],
  goals text[],
  frequency_days_per_week int,
  plan_duration_weeks int,
  equipment_access text,
  notes text
);
alter table intakes enable row level security;
drop policy if exists "intakes_v1_read" on intakes;
create policy "intakes_v1_read" on intakes for select using (true);
drop policy if exists "intakes_v1_write" on intakes;
create policy "intakes_v1_write" on intakes for all using (true) with check (true);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  intake_id uuid references intakes(id),
  title text,
  summary text,
  status text default 'active',
  summary_source text,
  summary_confidence numeric,
  summary_review_status text default 'unreviewed'
);
alter table plans enable row level security;
drop policy if exists "plans_v1_read" on plans;
create policy "plans_v1_read" on plans for select using (true);
drop policy if exists "plans_v1_write" on plans;
create policy "plans_v1_write" on plans for all using (true) with check (true);

create table if not exists weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  plan_id uuid references plans(id),
  week_number int,
  goal text
);
alter table weeks enable row level security;
drop policy if exists "weeks_v1_read" on weeks;
create policy "weeks_v1_read" on weeks for select using (true);
drop policy if exists "weeks_v1_write" on weeks;
create policy "weeks_v1_write" on weeks for all using (true) with check (true);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  week_id uuid references weeks(id),
  plan_id uuid references plans(id),
  day_of_week int,
  title text,
  duration_minutes int,
  status text default 'scheduled'
);
alter table sessions enable row level security;
drop policy if exists "sessions_v1_read" on sessions;
create policy "sessions_v1_read" on sessions for select using (true);
drop policy if exists "sessions_v1_write" on sessions;
create policy "sessions_v1_write" on sessions for all using (true) with check (true);

create table if not exists session_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id),
  exercise_id uuid references exercises(id),
  sets int,
  reps int,
  hold_seconds int default 0,
  rest_seconds int default 30,
  order_index int
);
alter table session_exercises enable row level security;
drop policy if exists "session_exercises_v1_read" on session_exercises;
create policy "session_exercises_v1_read" on session_exercises for select using (true);
drop policy if exists "session_exercises_v1_write" on session_exercises;
create policy "session_exercises_v1_write" on session_exercises for all using (true) with check (true);

create table if not exists session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_id uuid references sessions(id),
  completed_at timestamptz,
  perceived_effort int,
  feedback text
);
alter table session_logs enable row level security;
drop policy if exists "session_logs_v1_read" on session_logs;
create policy "session_logs_v1_read" on session_logs for select using (true);
drop policy if exists "session_logs_v1_write" on session_logs;
create policy "session_logs_v1_write" on session_logs for all using (true) with check (true);

create table if not exists set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  session_log_id uuid references session_logs(id),
  session_exercise_id uuid references session_exercises(id),
  set_number int,
  reps_completed int,
  weight_kg numeric
);
alter table set_logs enable row level security;
drop policy if exists "set_logs_v1_read" on set_logs;
create policy "set_logs_v1_read" on set_logs for select using (true);
drop policy if exists "set_logs_v1_write" on set_logs;
create policy "set_logs_v1_write" on set_logs for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  actor_type text,
  action text,
  object_type text,
  object_id uuid,
  before_json jsonb,
  after_json jsonb,
  approved_by text
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into exercises (id, name, category, instructions, cues) values
  ('a1000000-0000-0000-0000-000000000001', 'Cat-Cow Stretch', 'Mobility', 'Start on hands and knees. Inhale and arch your back (cow), exhale and round your spine (cat). Move slowly and breathe.', 'Keep wrists under shoulders; do not rush the movement'),
  ('a1000000-0000-0000-0000-000000000002', 'Glute Bridge', 'Strength', 'Lie on your back, knees bent, feet flat. Drive hips up until body is in a straight line. Squeeze glutes at the top.', 'Do not hyperextend the lower back; keep core braced'),
  ('a1000000-0000-0000-0000-000000000003', 'Dead Bug', 'Control', 'Lie on your back, arms to ceiling, knees at 90°. Lower opposite arm and leg toward floor while keeping lower back flat.', 'Lower back must stay pressed to floor throughout'),
  ('a1000000-0000-0000-0000-000000000004', 'Hip Flexor Stretch', 'Mobility', 'Kneel on one knee, lunge forward. Push hips forward gently and hold.', 'Keep torso upright; avoid arching the lower back'),
  ('a1000000-0000-0000-0000-000000000005', 'Banded Clamshell', 'Control', 'Lie on your side, knees bent and stacked. Rotate top knee toward ceiling while keeping feet together.', 'Do not roll your hips backward; movement is small and controlled'),
  ('a1000000-0000-0000-0000-000000000006', 'Wall Sit', 'Strength', 'Slide your back down a wall until thighs are parallel to floor. Hold position.', 'Keep knees over ankles; weight in heels')
on conflict (id) do nothing;

insert into intakes (id, primary_condition, pain_areas, goals, frequency_days_per_week, plan_duration_weeks, equipment_access, age, notes) values
  ('b1000000-0000-0000-0000-000000000001', 'Lower back pain', array['lumbar','left hip'], array['pain relief','improve posture'], 3, 6, 'home', 34, 'Desk job, sitting 8h/day. No acute injury, chronic tightness.')
on conflict (id) do nothing;

insert into plans (id, intake_id, title, summary, status, summary_source, summary_confidence, summary_review_status) values
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '6-Week Lower Back Recovery', 'A progressive home-based programme targeting lumbar mobility, glute strength, and core control to reduce lower back pain and improve daily posture.', 'active', 'openai/gpt-4o', 0.91, 'unreviewed')
on conflict (id) do nothing;

insert into weeks (id, plan_id, week_number, goal) values
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 1, 'Establish movement baseline — reduce stiffness and activate posterior chain'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 2, 'Build glute and core endurance with progressive loading')
on conflict (id) do nothing;

insert into sessions (id, week_id, plan_id, day_of_week, title, duration_minutes, status) values
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 1, 'Day 1 — Mobility & Activation', 25, 'scheduled'),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 3, 'Day 2 — Strength Foundation', 30, 'scheduled'),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 5, 'Day 3 — Control & Stretch', 20, 'scheduled'),
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 1, 'Day 4 — Glute & Core Build', 35, 'scheduled')
on conflict (id) do nothing;

insert into session_exercises (id, session_id, exercise_id, sets, reps, hold_seconds, rest_seconds, order_index) values
  ('f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 3, 10, 0, 30, 1),
  ('f1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 2, 1, 30, 30, 2),
  ('f1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 3, 12, 0, 45, 1),
  ('f1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000006', 3, 1, 40, 60, 2),
  ('f1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 3, 8, 0, 30, 1),
  ('f1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', 3, 12, 0, 30, 2),
  ('f1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 4, 15, 0, 45, 1),
  ('f1000000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 3, 10, 0, 30, 2)
on conflict (id) do nothing;
# Data Model

## intakes
| field | type |
|---|---|
| id | uuid PK |
| user_id | uuid nullable |
| created_at | timestamptz |
| age | int |
| primary_condition | text |
| pain_areas | text[] |
| goals | text[] |
| frequency_days_per_week | int |
| plan_duration_weeks | int |
| equipment_access | text (enum: home/gym/both) |
| notes | text |

## plans
| field | type |
|---|---|
| id | uuid PK |
| user_id | uuid nullable |
| intake_id | uuid FK → intakes |
| created_at | timestamptz |
| title | text |
| summary | text |
| status | text (active/paused/complete) |
| summary_source | text |
| summary_confidence | numeric |
| summary_review_status | text default 'unreviewed' |

## weeks
| id | uuid PK | plan_id FK | week_number int | goal text | created_at |

## sessions
| id | uuid PK | week_id FK | plan_id FK | day_of_week int | title text | duration_minutes int | status text (scheduled/done/skipped) | created_at |

## exercises
| id | uuid PK | name text | category text (Strength/Mobility/Control/Power) | instructions text | cues text | video_url text | created_at |

## session_exercises
| id | uuid PK | session_id FK | exercise_id FK | sets int | reps int | hold_seconds int | rest_seconds int | order_index int | created_at |

## session_logs
| id | uuid PK | user_id uuid nullable | session_id FK | completed_at timestamptz | perceived_effort int (1-5) | feedback text | created_at |

## set_logs
| id | uuid PK | session_log_id FK | session_exercise_id FK | set_number int | reps_completed int | weight_kg numeric nullable | created_at |

## RLS
All tables: RLS enabled. v1 permissive policies (select/all using true). Lock-down sprint replaces with `auth.uid() = user_id`.

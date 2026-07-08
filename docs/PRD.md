# TheraPlan — Product Requirements

## Problem
People recovering from injury or wanting preventive physiotherapy have no structured, personalised plan they can follow at home or in the gym. Generic YouTube videos don't adapt to their condition, progress, or schedule.

## Target User
Adults with an injury, chronic pain, or a lifestyle gap (desk posture, sport imbalance) who want a guided, adaptive exercise programme without a full-time physio.

## Core Objects
- **Intake** — health history, injuries/pain, goals, frequency, duration, equipment access
- **Plan** — AI-generated weekly/monthly programme tied to an intake
- **Week** — slice of a plan; contains ordered daily sessions
- **Session** — one day's workout (sets of exercises with targets)
- **Exercise** — library item (name, category, instructions, cues, video URL)
- **SessionLog** — user's recorded completion of a session (sets, reps, intensity, feedback)
- **SetLog** — individual set result within a session log

## MVP Must-Haves (v1)
- [ ] Intake form captures condition, goals, frequency, duration, equipment
- [ ] AI generates a structured weekly plan from intake (stored in DB)
- [ ] Daily session view shows exercises with instructions and set targets
- [ ] Rep/set logger with countdown timer per exercise
- [ ] Session completion marks progress; feedback captured
- [ ] Weekly overview screen showing all sessions and completion status
- [ ] Demo plan visible without login (seed data)
- [ ] Plan adjusts session targets when user marks difficulty feedback

## Non-Goals (v1)
- Human physio review / approval workflow
- Video library
- Automated weekly email digests
- Payments / subscriptions
- Multi-user teams

## Success Criteria
A new visitor lands, sees a demo plan, completes the intake form, receives a generated plan within 30 seconds, opens Day 1, logs all sets with the timer, marks the session done, and sees their weekly progress update — end to end, no login required.

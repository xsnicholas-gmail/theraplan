# Intelligence Layer

## Messy Inputs (from intake form)
- Free-text pain description, mixed goal phrasing, inconsistent equipment answers

## Auto-Structure Schema (sent to OpenAI)
```json
{
  "patient_profile": {
    "age": 34,
    "primary_condition": "lower back pain",
    "pain_areas": ["lumbar", "left hip"],
    "goals": ["pain relief", "return to running"],
    "frequency_days_per_week": 4,
    "plan_duration_weeks": 6,
    "equipment_access": "home"
  },
  "output": {
    "plan_title": "...",
    "plan_summary": "...",
    "weeks": [
      {
        "week_number": 1,
        "goal": "...",
        "sessions": [
          {
            "day_of_week": 1,
            "title": "...",
            "duration_minutes": 30,
            "exercises": [
              { "name": "...", "category": "Mobility", "sets": 3, "reps": 10, "hold_seconds": 0, "rest_seconds": 30 }
            ]
          }
        ]
      }
    ]
  }
}
```

## Events to Track
- Intake submitted
- Plan generated (latency, token count)
- Session completed + perceived_effort score
- Set logged (reps vs target delta)

## Scoring Rules (rule-based v1)
- If `perceived_effort >= 4` for 2 consecutive sessions → reduce next week's reps by 10%
- If `perceived_effort <= 2` for 2 consecutive sessions → increase next week's reps by 10%
- Stores adjustment decision as an audit event

## v1 vs Later
**v1:** OpenAI generates plan once; rule-based adjustment after each session
**Later:** Continuous re-planning via AI using accumulated session logs; exercise recommendation ranking

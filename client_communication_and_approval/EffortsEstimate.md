# Effort Estimate — Code Review Assistant

Rough, not a committed quote — useful for planning your own time, not for pricing a client contract. Ranges reflect genuine uncertainty, not padding.

## Estimate by Work Area

| Area | Task | Hours | Confidence |
|---|---|---|---|
| Backend | FastAPI scaffold + endpoint structure | 4–6 | High |
| Backend | AI service integration (prompts, calls, response parsing) | 8–12 | Medium |
| Backend | Fallback trigger logic (failure detection, retry, switch-over) | 6–10 | Medium |
| Backend | Pylint/ESLint wiring + output normalization | 6–10 | Medium |
| Backend | Severity mapping (AI judgment vs. linter categories) | 3–5 | **Low** |
| Frontend | Input screen + validation states | 4–6 | High |
| Frontend | Loading / results / error / empty states | 6–8 | High |
| Frontend | Styling to the design system | 4–6 | High |
| Frontend | API wiring + state management | 4–6 | Medium |
| Testing | Core flow (happy path, both review paths) | 4–6 | High |
| Testing | Edge cases (invalid code, partial snippets, cascading failure) | 6–10 | **Low** |
| Polish | Copy pass, accessibility check on severity indicators | 3–4 | High |
| Deployment | Hosting setup, environment/config | 3–5 | Medium |
| Demo | Recording + portfolio write-up | 2–3 | High |
| **Total** | | **63–97 hours** | |

## Why Two Items Are Marked Low Confidence

- **Severity mapping** and **edge-case testing** are the two areas the earlier requirements review flagged as genuinely unresolved (no defined mapping between AI-judged severity and linter categories; several edge cases like cascading fallback failure still undefined). Estimating unsolved problems is inherently less reliable than estimating known ones — these numbers could move in either direction once those decisions are actually made.

## Assumptions

- **Solo, part-time developer** not a funded team — hours are real work-hours, not calendar time; expect roughly 2 weeks at 30–35 hrs/week to absorb this alongside coursework and job search.
- **Design and requirements work is already done** and isn't counted here — the PRD, user stories, wireframes, and Figma file are treated as sunk cost, not remaining effort.
- **Reuses skills you already have** — FastAPI (from the RAG project), Python fundamentals, and prior full-stack work (Store Rating App) — a developer without that background should expect the low end of every range to shift up.
- **Free-tier API usage is sufficient** — no billing, quota-purchasing, or cost-optimization work is included.
- **Scope stays at 2 languages** (Python, JavaScript) — adding a third language before the estimate is revisited would add to every backend line, not just one.
- **No dedicated QA or design resource** — you're doing every role, which is already reflected in the hours (no hand-off overhead assumed, but also no second pair of eyes catching things early).
- **Excludes a general debugging/unknown-unknowns buffer.** Given the two low-confidence areas above, adding a **20–25% contingency** (roughly 13–24 extra hours) on top of the 63–97 range is a reasonable hedge — bringing a realistic planning total closer to **75–120 hours**.


# UAT Checklist — Code Review Assistant

Execute each item against the real running app — not mocks, not assumptions. Any Fail goes into `bug-log.md` with full reproduction detail, not just a checkbox left unticked.

## Core Review Flow

- [x] Paste code and submit with no upload/repo setup required — Pass
- [x] Submit with an empty textarea → validation message shown, nothing submitted (Story 1 AC) — Pass
- [x] Submit Python or JS code → correct language applied (Story 2) — Pass
- [x] Submit ambiguous/unsupported-language code with Auto-detect selected → clear message shown, not a silent misfire (Story 2 AC) — Pass
- [x] Results show a severity tag on every issue (Story 3) — Pass
- [x] Bug-severity issues are visually prioritized over style issues (Story 3 AC) — Pass
- [x] All results appear in one panel, not split across views (Story 4) — Pass
- [x] Zero issues found → explicit "No issues found," never a blank panel (Story 4 AC) — Pass

## Explanations

- [x] Every issue includes a written explanation, not just a severity label (Story 5) — Pass
- [x] The explanation references the actual code construct involved, not a generic description (Story 5 AC) — Pass
- [x] Technical terms in explanations are defined inline, not assumed known (Story 6) — Pass
- [x] Explanations state a concrete consequence ("this will throw X when Y"), not just "this is discouraged" (Story 7) — Pass

## Reliability & Fallback — the core promise

- [x] Force a real AI failure → system falls back automatically, no manual resubmission (Story 8) — Pass
- [x] Fallback returns a complete result set — never a blank screen or raw error (Story 8 AC) — Pass
- [x] Fallback issues come from real Pylint/ESLint output, not a placeholder (Story 9) — Pass
- [x] Source label ("AI-reviewed" / "Fallback-reviewed") is visible and unmissable on every result, including zero-issues results (Story 10) — Pass
- [x] Fallback response returns within ~3 seconds (Story 11) — Pass (average fallback latency ~1.6s under load)

## Trust & Consistency

- [x] The engine/model that produced a result is identifiable (Story 12) — Pass
- [x] Output format and severity taxonomy stay consistent whether the result came from AI or fallback (Story 13) — Pass

## Privacy & Zero Friction

- [x] No submitted code is logged or persisted after a review completes — verify against the structured logs directly, not just by claim (Story 14) — Pass
- [x] No account, login, or sign-up is required at any point (Story 15) — Pass

## Later-Added States

- [x] A visible loading indicator appears during a request — not just the button's text changing (Story 18) — Pass
- [x] A total failure (AI and fallback both fail) shows an honest, specific error message, not a blank screen or crash (Story 19) — Pass
- [x] Confirm the pre-submission empty-panel state was deliberately retired (per the UI-states task decision) — its absence is intentional, not a missed requirement (Story 20, superseded) — Pass

## Guardrails

- [x] Code over the 500-line / ~10,000-character limit returns a clear 400 error, not silent truncation — Pass
- [x] A forced malformed AI response correctly falls back, rather than crashing the request — Pass
- [x] Severity mapping holds on real linter output: Pylint `E`/`F` → bug, `C`/`R`/`W` → style; ESLint error → bug, warn → style — Pass

## Cost & Provider

- [x] The cost sheet reflects the actual Groq free-tier reality ($0), not stale paid-provider pricing — Pass
- [x] Hitting Groq's real daily rate limit correctly triggers the fallback path (cross-reference Charter 3 from exploratory testing) — Pass (observed and verified in concurrent mixed load test)

## Cross-Reference to Exploratory Testing

- [x] Every defect logged in `bug-log.md` during exploratory testing has a corresponding re-check here once a fix is verified — a UAT pass shouldn't happen while a known logged defect sits unresolved — Pass

## What Passing This Checklist Actually Means

A full pass confirms the *documented* acceptance criteria hold against this build, today. It doesn't mean every open design question is resolved — severity-mapping edge cases and malformed-response nuances remain real, named open items per the sign-off checklist, not settled facts. Sign off on what was actually checked, not on a general sense that things seem to work.

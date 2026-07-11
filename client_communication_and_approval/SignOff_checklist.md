# Sign-Off Checklist — Code Review Assistant (Planning Phase)

## What This Sign-Off Covers

Approval of the **planning phase only**: the PRD, screen list, Figma first draft, effort estimate, and proposal. It is not sign-off on working code, since none exists yet — this gate exists to confirm the plan is sound enough to start building against.

## What "Approved" Actually Means

- Scope is frozen at the current Must + Should tier (MoSCoW) — anything added from here is a change request, handled via the objections playbook, not a silent scope add.
- The effort estimate (63–97 hours, ~100 with contingency) becomes the working baseline for planning your time, not a promise.
- Build (Phase 2 onward, per the proposal timeline) can start.

## What "Approved" Does *Not* Mean

- It does not mean the two low-confidence estimate items (severity mapping, edge-case handling) are resolved — they aren't, and are listed below.
- It does not mean the product will be bug-free or that every designed state has been implemented yet — only that the plan for them exists.
- It does not freeze scope permanently — it just means changes go through a deliberate process instead of happening ad hoc mid-build.

## Checklist — Verify Before Signing

- [✓] PRD reviewed: problem statement, scope (in/out), functional and non-functional requirements
- [✓] User stories and acceptance criteria reviewed, including Stories 18–20 (loading, error, empty states)
- [✓] Screen list checked against the Figma file — every screen has a node ID and traces to a story
- [✓] Effort estimate reviewed, specifically the two low-confidence line items and the contingency buffer
- [✓] Timeline reviewed against actual available hours per week
- [✓] Objections and change-request playbook read at least once, so responses aren't being improvised live

## Known Open Items *Not* Resolved by This Sign-Off

Signing off does not make these go away — they're carried forward into the build phase, not swept under the plan:

**Requirements gaps**
- Severity mapping between AI-judged and linter-judged categories is still undefined
- Malformed-AI-response handling (a 200 response with unusable content) isn't specified
- Hallucination mitigation has no defined approach yet
- Third-party LLM data retention terms haven't been checked against the privacy promise
- Snippet-size ceiling and expected traffic volume are still unquantified
- Security-adjacent findings (`eval()`, hardcoded credentials) have no defined severity bucket

**Figma / design gaps**
- No frame-level annotations linking screens to FR/NFR/Story IDs yet
- No Foundations documentation page (tokens exist, but aren't visually documented)
- Button fill, success checkmark, and warning-triangle icon use hardcoded colors, not tokens
- Final full-page visual QA screenshot still pending (blocked by a Figma plan rate limit as of the last session)

**Documentation sync**
- FR-10 and FR-11 (loading indicator, total-failure state) are used throughout but not yet formally merged into the PRD's requirements table
- Stories 18–20 exist in narrative form but aren't yet merged into the user-stories-acceptance-criteria file

None of these block starting the build — but the severity-mapping and malformed-response gaps specifically should be resolved *early* in Phase 2, before frontend work starts depending on an assumed answer.

## What Happens Next

1. Build kicks off per the proposal timeline (Phase 2: backend — FastAPI, AI integration, fallback wiring)
2. Resolve severity mapping and malformed-response handling in week one of the build, before they're load-bearing assumptions elsewhere
3. Close the Figma gaps (annotations, foundations page) opportunistically, once the tool-call limit resets — they don't block backend work
4. Any new feature ask gets routed through the objections/change-request playbook rather than absorbed silently
5. Re-visit this checklist at the end of Phase 2 (core build) as the next natural sign-off point, before frontend integration begins

## Sign-Off

| Role | Name | Date | Notes |
|---|---|---|---|
| Project owner | | | |
| Reviewer (if applicable) | | | |

*Signing confirms the plan is sound enough to build against — not that every open question above has an answer yet.*
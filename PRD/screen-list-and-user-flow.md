# Screen List & User Flow — Code Review Assistant

Derived from the PRD (v1.0). Two screens required adding new requirements to close traceability gaps identified during review — both included below.

## Screen List

| ID | Screen | Type | Traces to |
|---|---|---|---|
| S-1 | Input screen — paste code, pick language | Primary | FR-1, FR-2 |
| S-1a | Empty-input validation message | Inline/modal state on S-1 | Story 1 AC |
| S-1b | Unsupported-language message | Inline/modal state on S-1 | FR-2, Story 2 AC |
| S-2 | Loading / in-progress state | Primary | **FR-10** *(new — see below)*, NFR-2 |
| S-3 | Results screen — AI-reviewed | Primary | FR-3, FR-4, FR-7, FR-8, NFR-3, NFR-5 |
| S-3a | Zero-issues-found state | Sub-state of S-3 / S-4 | Story 4 AC |
| S-4 | Results screen — Fallback-reviewed | Primary | FR-5, FR-6, FR-7, NFR-5, Story 9, Story 10 |
| S-5 | Total-failure / error state | Primary | **FR-11** *(new — see below)* |

### New requirements added to close traceability gaps
- **FR-10:** System shall display a loading/progress indicator while a review is in progress.
- **FR-11:** System shall display an explicit, honest error state — not a blank screen — if both the AI path and the static-analysis fallback fail.

*(These should be added to Section 3.1 of the PRD to keep the documents in sync.)*

## User Flow

1. User lands on **S-1 (Input screen)** and pastes code.
2. **Validation:**
   - Empty input → **S-1a**, stays on S-1.
   - Unsupported language → **S-1b**, stays on S-1.
   - Valid input → proceeds.
3. User submits → **S-2 (Loading state)**.
4. System attempts the AI review path.
   - **Succeeds** → **S-3 (Results screen, AI-reviewed)**. If no issues found → **S-3a** sub-state.
   - **Fails** (timeout, rate limit, quota, malformed response) → auto-retries once, then falls back.
5. System attempts the static-analysis fallback path.
   - **Succeeds** → **S-4 (Results screen, Fallback-reviewed)**. If no issues found → **S-3a** sub-state.
   - **Fails** → **S-5 (Total-failure / error state)**.

## Design Note

S-5 is the only screen with no "happy path" traffic — it exists solely to catch the compounding failure of two independent systems (AI provider + local linter). It's the one screen where the product's core reliability promise (NFR-1) is actually being tested, so it should be designed deliberately rather than defaulted to a generic error message.

The two validation states (S-1a, S-1b) are modeled as inline/modal states on S-1 rather than separate full-screen views, since they're loop-backs rather than forward progress in the flow.

# Project Proposal: Code Review Assistant

## Problem

Developers working solo or without ready access to a senior reviewer lack fast, explainable feedback on code quality and bugs — leading to delayed bug detection, inconsistent review standards, and slower learning. Existing tools solve half of this: linters (ESLint, Pylint) flag issues but never explain them, while AI-powered review tools (CodeRabbit, Greptile, Qodo) explain well but are built for team PR workflows and treat AI availability as guaranteed — leaving users with nothing when a provider hits an outage, rate limit, or quota cap. No existing tool combines explanation-first review with a reliability guarantee for the individual developer.

## Solution

Code Review Assistant: paste a code snippet, get bugs flagged with plain-language explanations, and get a usable result every time — even when the AI backend is unavailable, via an automatic, deterministic static-analysis fallback (Pylint/ESLint). The product's differentiator is reliability and explanation quality, not raw detection accuracy, which is a benchmark war already being fought (and largely won on marketing, not substance) by funded competitors.

**Target users:** solo developers who need review coverage without a team, junior developers who need to understand *why* code is wrong, and team leads who need consistent, explainable review quality.

## Scope

**In scope (MVP):**
- Paste-in code review for Python and JavaScript
- LLM-powered bug detection with severity labels (bug/style) and plain-language explanations
- Automatic fallback to real static-analysis tools on AI failure, with clear "AI-reviewed" vs. "Fallback-reviewed" labeling
- Loading, empty, success (with and without issues), and error states, each explicitly designed
- Stateless — no accounts, no login, no saved history

**Out of scope (this phase):** git/PR integration, auto-fix or auto-commit, security/SAST-grade scanning, unit test generation, cross-file/whole-codebase analysis, enterprise features (SSO, audit logs, self-hosting), support beyond 2–3 languages, team accounts, IDE extension, mobile app.

*(Full requirements, user stories, and acceptance criteria are maintained in the companion PRD.)*

## Timeline

Scoped for part-time solo development (portfolio project pace, not a funded team sprint):

| Phase | Duration | Deliverable |
|---|---|---|
| **1. Foundations** | Week 1 | Finalized PRD, screen list, Figma wireframes and design system (largely complete) |
| **2. Core build** | Weeks 2–3 | FastAPI backend, LLM integration (Gemini/Groq), Pylint/ESLint fallback wiring, fallback-trigger logic |
| **3. Frontend + states** | Week 4 | Input/loading/results/error screens built to the design system, wired to the backend |
| **4. Reliability testing** | Week 5 | Deliberately break the AI path (pulled key, forced timeout) to verify graceful fallback end-to-end — this is the core demo, not an afterthought |
| **5. Polish & demo prep** | Week 6 | Copy pass, accessibility check on severity indicators, recorded walkthrough for portfolio/interview use |

~6 weeks part-time, assuming no major scope changes. Phase 2 (Figma-only work) has already progressed ahead of this schedule.

## Assumptions

- Single developer (Jayesh) resourcing this solo, part-time alongside coursework and job search — timeline reflects that, not a funded team's velocity.
- Free-tier quotas on the chosen LLM provider (Gemini or Groq) are sufficient for demo-scale traffic; production-scale usage is explicitly out of scope.
- Python and JavaScript coverage is sufficient to demonstrate the concept for portfolio/interview purposes — broader language support is a Phase 2+ concern, not a blocker for this proposal.
- The product's goal is portfolio/interview value and technical demonstration, not commercial launch — scope and timeline would both change materially if this became a funded or team effort.
- Design work (Figma) continues on the existing file; further Figma automation is paused pending the Starter plan's tool-call limits, so some polish (annotations, foundations documentation) may be finished manually rather than via the MCP connector.
- No dedicated design or QA resource beyond what's been built here — Jayesh owns both product and execution decisions end to end.

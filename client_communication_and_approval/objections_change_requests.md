# Objection & Change Request Playbook — Code Review Assistant

For stakeholder reviews, client conversations, or interview walkthroughs. Every response here is grounded in a decision already made in the PRD, proposal, or competitor scan — not improvised justification.

## Part 1: Objections to the Core Idea

**"Isn't this just a wrapper around an LLM API?"**
Partly fair — the AI call itself isn't the hard part. The engineering that *is* real: detecting failure and switching to a genuinely independent fallback system without the user noticing a gap, keeping severity labels consistent across two completely different engines (an LLM's judgment vs. a linter's fixed rule categories), and designing five distinct screen states so nothing ever renders blank. That's where the actual decisions live — not in calling an API.

**"Why would anyone use this over CodeRabbit, GitHub Copilot, or just asking ChatGPT?"**
Those tools solve a different problem. CodeRabbit, Greptile, and Qodo are built for team pull-request workflows — not a solo developer pasting in one function. Asking ChatGPT directly gives you an explanation but no fallback, no consistent severity structure, and no guarantee of an answer if that session's response is malformed or the service is slow. This product's bet is specifically the individual, explanation-first use case with a reliability guarantee — a gap the competitor scan found genuinely open, not a claim to be better at everything.

**"AI code review already exists everywhere — what's actually novel here?"**
Honestly, not the AI bug-detection itself. The novel part is the combination: explanation-first design aimed at an individual learner, plus treating "the AI is unavailable" as a first-class product state instead of an edge case. Neither piece alone is new; building both together, deliberately, is the actual contribution.

## Part 2: Objections to Scope

**"Why only Python and JavaScript?"**
Depth over breadth for a first version. Every additional language multiplies backend work — a new fallback linter to wire in, new prompt tuning, new testing. Two languages let the reliability and explanation mechanics get built properly once; adding a third later is comparatively cheap. Faking broad language support now, badly, would be worse than doing two well.

**"Why no auto-fix? People want fixes, not just explanations."**
Auto-modifying someone's code without them verifying it first is a trust and liability risk this product isn't ready to take on — especially before the detection logic itself has track record. It's explicitly deferred, not rejected: it's a Phase 3 item once the review quality has been proven out.

**"Why not add GitHub PR integration now — isn't that the real value?"**
That's a different product category, structurally — OAuth, webhooks, per-seat pricing, git-platform lock-in. It's exactly what CodeRabbit and Greptile already do well. Adding it now would roughly double the effort estimate and dilute the one differentiation this product actually has room to own: reliability for the individual user. It's on the roadmap, deliberately, for later.

## Part 3: Objections to Technical Approach

**"Why build a custom fallback instead of just calling a second AI provider as backup?"**
Two AI providers still share the same failure category — both can go down, rate-limit, or return a malformed response, sometimes for correlated reasons (shared cloud infrastructure, industry-wide traffic spikes). A deterministic static-analysis tool fails independently of any AI provider's status, which is the actual property this product needs. Redundant AI is weaker insurance than a genuinely different kind of check.

**"Isn't the static-analysis fallback strictly worse than the AI review? Why bother?"**
Yes — it's narrower, and that's stated openly in the requirements. But narrower-and-available beats broader-and-unavailable, which is the entire premise of the product. The fallback isn't meant to match the AI's quality; it's meant to guarantee something instead of nothing.

**"What happens if the fallback also fails — isn't that a fatal flaw?"**
This was flagged during the requirements review as a real gap, and it's already been addressed rather than ignored: there's a dedicated total-failure error state (honest messaging, not a blank screen or raw error) designed specifically for that scenario. Worth raising, but it's not a blind spot — it's a documented, designed-for case.

## Part 4: Common Change Requests, With Honest Trade-Offs

**"Can we ship faster — cut the timeline in half?"**
The lever available is scope, not compression — the effort estimate (63–97 hours, plus contingency) reflects real work, not padding. To roughly halve it: cut to one language, skip the deliberate reliability-testing phase, or drop one of the five designed states down to a generic message. Compressing the calendar without cutting scope just means the same work happens under more pressure, with less testing.

**"Can we add login/saved history since it's probably needed anyway?"**
It's already planned for Phase 2, deliberately deferred from the MVP. Zero-friction, no-account access is itself a trust signal for the solo-freelancer persona this product targets first. Pulling it into the MVP now adds real backend complexity (auth, storage, data retention policy) and would likely delay the reliability-testing phase — the one phase most central to the product's actual pitch.

**"The client wants an analytics dashboard for their team."**
That's a Phase 3, team-lead-tier feature — and it implies a structurally different product (accounts, multi-tenancy, permissions), not an incremental add-on. Worth naming clearly as a different scope of project, not a small extension, before agreeing to timeline or effort changes.

**"Can it support more languages before launch?"**
Possible, but not free — refer to the effort estimate: each additional language adds a proportional chunk across backend integration, fallback-linter wiring, and testing. Reasonable to accommodate if the timeline and estimate are revisited together, not as a silent scope add.


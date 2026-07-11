# Demo Script — Code Review Assistant
## Opening 


"Quick context before I show you this. If you're a developer working alone — freelancing, or just without a senior around — you've got two options today. A free linter, which catches typos but never tells you *why* something's wrong. Or an AI review tool, which explains things well right up until the moment it's rate-limited, down, or you've used your free quota for the day — and then you get nothing.

This tool is built around fixing that second problem specifically. Let me show you."

---

## Act 1 — The everyday case 

*Paste this snippet into the input screen:*

```
def get_first(items):
    return items[0]
```

"Say I've just written this. Looks fine at a glance."

*Click Review. Loading state appears.*


*Results screen appears — AI-reviewed, with the "Unhandled empty list" bug and the "Inconsistent naming" style issue.*

"Two things flagged. The bug — an empty list would throw an error here — comes with a plain-English explanation, not just a line number. That's the actual point of this tool: it's not enough to say something's wrong, it has to say *why*, so a junior developer reading this actually learns something instead of just copy-pasting a fix."

*Point to the "AI-reviewed" label at the top.*

"And notice this label. Every result tells you which engine reviewed it. Keep that in mind — it's about to matter a lot."

---

## Act 2 — The quiet detail 

*Paste in a clean snippet, or just narrate this one without re-demoing:*

"If I paste in code that's actually fine, I don't get a blank panel that looks broken. I get an explicit 'no issues found' — still labeled AI-reviewed, still consistent. Sounds small. It's one of the details that's easy to skip and immediately makes a tool feel unfinished if you do."

---

## Act 3 — The actual pitch 


"Now here's the part that's actually the point of this whole product."

 "I'm going to disconnect the AI service right now."*

"In most tools, this is where it ends. You'd see a spinner that never resolves, or a raw error message, or — worst case — nothing at all, and you'd have no idea if it's your code, your internet, or their server."

*Paste the same snippet back in. Click Review.*

"Watch what happens instead."

*Loading state, slightly longer this time (one retry happens automatically). Then the results screen appears — same layout, same severity badges — but the label at top now reads Fallback-reviewed, styled differently on purpose.*

"Same problems, still caught — this time by a real, deterministic tool running underneath, not the AI. Fewer of the issues might come through, because this backup checker isn't as smart as the AI one, but it's never *nothing*. And that label change isn't decoration — it's the one thing on this whole screen that has to be impossible to miss, because it's the difference between 'trust this fully' and 'trust this, but the AI didn't actually look at it this time.'"

*Pause. Let that land before moving on.*

"That's the entire pitch, honestly. Every other AI code review tool on the market — CodeRabbit, Greptile, the rest — assumes the AI is always there. This one assumes it isn't, sometimes, and is built around that assumption instead of being surprised by it."

---

## Act 4 — The honest edge case 


"One more state worth mentioning, even though I won't demo it live — if the AI check *and* the backup check both fail at the same time, you don't get a crash or a blank page either. You get an honest message: review couldn't complete, both checks failed, try again shortly. It's the one screen with no happy-path traffic at all — it exists purely so the product never lies to you by going silent."

---

## Close 

"So to recap: explanations that actually teach you something, not just flag it — and a tool that's honest about which engine looked at your code, every single time, including the one time it's not the AI. That's the whole idea. Happy to go deeper into any part of this — the fallback logic, the design decisions, or the roadmap for what comes after this first version."

---

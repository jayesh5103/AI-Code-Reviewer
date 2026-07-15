# Monthly Cost Note — Code Review Assistant

## Current Total: $0/month

| Service | Role | Cost | Real constraint (not dollars) |
|---|---|---|---|
| Render | Backend hosting | $0 (Hobby tier) | 750 instance-hours/month, 15-min inactivity spin-down (30–60s cold start), 100GB bandwidth |
| Vercel | Frontend hosting | $0 (free tier) | Generous bandwidth/build limits — not realistically a constraint at this project's scale |
| Groq | AI inference | $0 (free tier) | ~1,000 requests/day |

Nothing here costs money today. "Where to trim it" is therefore a forward-looking question — what would actually start costing money first if this grew, and what's the cheapest lever at that point — not a list of savings to make right now.

## The built-in cost control this project already has

Worth naming directly: **the fallback architecture, built for reliability, is also the cost-control mechanism.** If Groq's free daily limit is ever hit, the system doesn't need a paid AI tier to keep working — it degrades gracefully to the already-free Pylint/ESLint fallback. Most projects would treat "we're out of AI budget" as an outage; this one treats it as an expected, designed-for state. That's not a coincidence — it's the same NFR-1 guarantee, just viewed from the cost side instead of the reliability side.

## Where a real cost would appear first, if this scaled

**1. Render's 750-hour/month limit** — this is the first plausible constraint, not the AI cost. 750 hours covers roughly one always-on service for a full month (~744 hours in a 31-day month), so it's already close to the edge for continuous uptime, before any traffic growth is even considered. If guaranteed uptime became genuinely important (e.g. avoiding a cold-start delay during a live interview demo), the cheapest fix is a single **$7/month Starter instance** — not a team plan, not multiple services, just removing the spin-down on the one backend service.

**2. Groq's daily request cap** — if usage genuinely outgrew ~1,000 requests/day, the honest options are: accept more fallback-only reviews (free, already-designed-for, slightly lower quality), add a second free-tier provider as an additional fallback layer (e.g. Gemini, per the earlier provider-agnostic config decision), or move to a paid tier on a chosen provider — in that order of cheapness.

**3. Vercel** — realistically not a cost driver at this project's traffic level; not worth planning around.

## The honest bottom line

There's nothing to trim today because there's nothing being spent. If this project needed one dollar spent to meaningfully improve it, it would be the **$7/month Render Starter tier**, and only for the specific reason of removing cold-start delay before a demo or interview — not because of AI cost, which the fallback design already protects against by construction.

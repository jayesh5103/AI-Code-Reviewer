# Code Review Assistant — Project Overview

*A plain-language version of the project plan, written for anyone reviewing this project without a technical background.*

## The Problem

Writing code alone is common — freelancers, students, and small teams often don't have a second person available to check their work before it goes out the door. The usual options aren't great:

- Free code-checking tools catch small mistakes (like formatting) but never explain *why* something is a problem.
- AI-powered review tools explain things well, but they depend entirely on an internet connection to an AI service — if that service is slow, down, or you've used up your free usage for the day, you get nothing at all.

Nobody currently offers a tool that explains problems clearly *and* keeps working when the AI portion doesn't.

## What We're Building

A simple web tool: paste in a piece of code, and get back a list of problems, each explained in plain English — not just "line 12, error," but *why* it's a problem and what could go wrong if it's left as-is.

The key promise: **you will always get a useful answer.** If the AI-powered check can't run (service down, too busy, daily limit reached), the tool automatically switches to a reliable backup check instead of showing an error or a blank screen. You'll always be told which kind of check you received, so you know how much to trust it.

## Who This Helps

- **A freelance developer** working alone, who needs a second opinion before sending code to a client — and can't afford to lose that safety net if an AI service happens to be down that day.
- **A junior developer** who wants to understand *why* their code has a problem, not just be told that it does — so they actually learn from each mistake instead of just fixing it and moving on.
- **A team lead** who wants review quality to stay consistent no matter who's reviewing, and who needs to be able to explain to their own boss why a bug was or wasn't caught.

## What's Included in the First Version

- Paste in code written in Python or JavaScript (the two most common languages for this kind of tool)
- Get a list of problems, each labeled as either a "bug" (something that will actually break) or a "style" issue (works fine, but could be cleaner), with a plain-English explanation for each
- Automatic backup checking if the AI-powered check isn't available, with a clear label showing which one you got
- No sign-up, no account, no login — just paste code and get an answer

## What's Not Included Yet

To keep the first version focused and reliable, some things are deliberately left for later:

- Connecting directly to GitHub or similar code-hosting sites to review changes automatically
- Automatically fixing or rewriting your code (the tool will tell you what's wrong, but won't change your code for you)
- Deep security scanning (checking for hacking vulnerabilities is a specialized job on its own)
- Support for programming languages beyond Python and JavaScript, for now
- Team accounts, saved history, or admin dashboards

None of these are ruled out for later — they're just not part of what we're building first.

## What Happens in Every Situation

We've deliberately planned for more than just "it works." Every screen someone might see has been thought through:

- **Before you've submitted anything** — a friendly invitation to paste code and get started, not a blank page.
- **While it's checking** — a clear loading indicator so it's obvious the tool is working, not frozen.
- **When it finds problems** — a clear list, worst issues first, each explained simply.
- **When it finds nothing wrong** — an explicit "all clear" message, not an empty-looking screen that might be mistaken for something broken.
- **When something goes wrong on both fronts** — an honest message explaining that the check couldn't be completed and to try again shortly, rather than a technical error message or a silent failure.

That last one matters more than it might seem. A tool that quietly fails when things go wrong isn't trustworthy — this one is designed to always tell you plainly what happened.

## Risks Worth Knowing About

- **The AI service itself might occasionally give a wrong or unhelpful answer.** This is a known limitation of all AI tools today, not unique to this one. The backup check exists specifically to reduce how much this matters.
- **Free usage limits could be reached if this gets a lot of traffic at once.** For a small-scale or portfolio use case this isn't a concern; it would need attention before wider public use.
- **This is being built by one person, part-time**, so the timeline below assumes steady, realistic progress — not a funded team's pace.

## Timeline

Roughly two weeks, part-time, broken into stages: planning and design (mostly done), building the core checking tool, building the screens people will actually see, deliberately testing what happens when things fail, and a final polish pass before it's demo-ready.

## The Bottom Line

This isn't trying to out-feature the big, funded code-review tools on the market — it's solving one thing they don't: what happens when the AI isn't available. That's the whole pitch.
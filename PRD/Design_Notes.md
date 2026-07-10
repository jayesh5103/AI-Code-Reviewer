Design Notes — Code Review Assistant

Companion to the PRD and screen-list docs. Captures decisions made during the wireframe → design system → states pass, and the current traceability status.

Design System

TokenValueUseType18px medium (screen title) · 14px medium (item title) · 13px regular (body) · 12px medium (labels/chips)4 sizes, no moreSpacing4px base → 8 / 16 / 24 between elements, 32 between sectionsOne scale throughoutColor — structureNeutral gray surfaces, hairline bordersCards, dividersColor — severityBug = danger (red) · Style = warning (amber)Always paired with a text label, never color aloneColor — sourceAI-reviewed = accent (blue) · Fallback-reviewed = pro (purple)Deliberately not green/success — avoids implying "fallback = all clear"Color — outcomeSuccess (green) reserved for the zero-issues checkmark onlyNever reused for source labeling, to avoid double meaningRadius/border12px cards, 8px controls, 0.5px hairline, no shadowsFlat, consistent with the reliability-first positioning

Hierarchy Decisions


Source label (AI-reviewed / Fallback-reviewed) is the most prominent element on any results view — it's the NFR-5 trust signal, not a footnote, and appears even when there are zero issues to report.
Severity badge sits at equal visual weight on both the AI and fallback paths, so Story 13 (consistency across paths) is visible, not just documented.
Explanation text is deliberately lighter weight than the issue title — informative for Aditi's persona without competing with "what's wrong" for attention.


Screens & States Designed


S-1 Input, S-1a/S-1b validation states
S-2 Loading
S-3 Results — AI-reviewed, S-3a Zero-issues-found
S-4 Results — Fallback-reviewed
S-5 Total-failure / error state
Pre-submission empty state (results panel, before first review)


Traceability Status (as of this pass)

Screen / StateTraces toStatusS-1, S-1a, S-1bStory 1, Story 2TracedS-2 LoadingFR-10 only — no storyGap → Story 18S-3, S-3aStory 3–7, 10, 12TracedS-4Story 9, Story 10TracedS-5 ErrorFR-11 only — no storyGap → Story 19Pre-submission empty stateNothingGap → Story 20

New stories added to close gaps


Story 18: As a developer, I want a loading indicator while my review processes, so that I know the system hasn't frozen.
Story 19: As a developer, I want an honest message if both AI and fallback reviews fail, so that I know to retry rather than assume the tool is broken.
Story 20: As a first-time user, I want an inviting message on the results panel before I've submitted anything, so that I understand what to do next.


(Full Given/When/Then for these three should be added to the user-stories-acceptance-criteria file and the PRD's requirements section to keep all documents in sync — not yet merged as of this note.)

Open Items / Not Yet Resolved


Copy in the empty/loading/error states is placeholder quality — needs a real product-voice pass before shipping.
Colorblind-safe secondary encoding for severity (beyond the text label) not yet stress-tested visually.
No actual Figma file exists yet — wireframes and mockups in this project were rendered as inline references, not built in Figma. Use the "first Figma draft" step list to construct the real file from these notes.
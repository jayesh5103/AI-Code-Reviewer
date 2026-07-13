// MOCK BACKEND — replace with the real FastAPI service when it exists.
// Do NOT build features on top of this file. It is a local test stub only.
//
// Run with:  npm run server
// Exposes:   POST http://localhost:3001/api/review
//
// Behavior driven by request body:
//   code containing "[0]"         → 200, one bug-severity issue
//   code containing "TRIGGER_500" → 500, empty body  (exercises the frontend error path)
//   anything else                 → 200, zero issues  (clean-review state)
//
// A 1–2 s artificial delay is added before every response so the
// "Reviewing…" button state is visible and testable in the browser.

import express from "express";

const app = express();
const PORT = 3001;

// Parse JSON request bodies
app.use(express.json());

// ---------------------------------------------------------------------------
// POST /api/review
// ---------------------------------------------------------------------------
app.post("/api/review", (req, res) => {
  const { code = "", language } = req.body ?? {};

  // Artificial delay: randomise between 1 000 and 2 000 ms so it feels
  // realistic and the loading state is clearly visible.
  const delayMs = 1000 + Math.floor(Math.random() * 1000);

  setTimeout(() => {
    // ── Error path ──────────────────────────────────────────────────────────
    if (code.includes("TRIGGER_500")) {
      console.log(`[stub] 500  POST /api/review  (TRIGGER_500 detected, lang=${language})`);
      res.status(500).end();
      return;
    }

    // ── Success path ─────────────────────────────────────────────────────────
    const issues = code.includes("[0]")
      ? [
          {
            severity: "bug",
            title: "Unhandled empty list",
            explanation:
              "Accessing index [0] without a bounds check will throw an " +
              "IndexError (Python) or return undefined (JavaScript) when the " +
              "list is empty.",
          },
        ]
      : [];

    const body = { source: "ai", issues };
    console.log(
      `[stub] 200  POST /api/review  (lang=${language}, issues=${issues.length}, delay=${delayMs}ms)`
    );
    res.json(body);
  }, delayMs);
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n  Stub review server listening on http://localhost:${PORT}`);
  console.log(`  POST /api/review`);
  console.log(`  Trigger patterns:`);
  console.log(`    [0]          → bug issue`);
  console.log(`    TRIGGER_500  → 500 response`);
  console.log(`    (anything else) → zero issues\n`);
});

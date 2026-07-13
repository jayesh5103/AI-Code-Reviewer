import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CodeInputForm from "./CodeInputForm";
import ReviewResults from "./ReviewResults";
import ReviewError from "./ReviewError";
import ReviewLoading from "./ReviewLoading";
import { useReview, useReviewSubmit } from "./ReviewContext.jsx";

// ---------------------------------------------------------------------------
// Route components
// ---------------------------------------------------------------------------

/**
 * / — Home / Input screen.
 *
 * Reads the last-submitted code/language from context so values survive
 * navigating back from /results. The form's internal `code`/`language`
 * state still handles each keystroke — context only provides the initial
 * values and receives the final validated payload on submit. All validation
 * logic inside CodeInputForm is untouched.
 *
 * When status === "loading", the disabled form and a visible loading card
 * are both shown (S-2 treatment) — the loading card appears below the form
 * so the user can see what they submitted while waiting.
 */
function InputPage() {
  const { state } = useReview();
  const submit = useReviewSubmit();

  const isLoading = state.status === "loading";

  return (
    <div className="page-center">
      <div className="input-page__stack">
        <CodeInputForm
          initialCode={state.code}
          initialLanguage={state.language}
          onSubmit={({ code, language }) => submit(code, language)}
          isSubmitting={isLoading}
        />
        {isLoading && <ReviewLoading />}
      </div>
    </div>
  );
}

/**
 * /results — Review output screen.
 *
 * Reads from context.state.result, not location.state.
 * Redirects to / when status is "idle" (including on page refresh, which
 * resets the reducer to INITIAL_STATE — correct, expected behavior per FR-9).
 */
function ResultsPage() {
  const { state } = useReview();

  // Guard: only render when there's actual result data.
  // "idle"   → fresh load or page refresh (correct: redirect to /)
  // "loading"→ shouldn't be navigated to mid-flight, but guard anyway
  // "error"  → belongs on /error, not here
  // "success"→ render
  if (state.status !== "success" || !state.result) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-center">
      <ReviewResults
        source={state.result.source}
        issues={state.result.issues}
      />
    </div>
  );
}

/**
 * /error — Review failure screen.
 *
 * Reads from context.state.status, not location.state.
 * Same redirect-to-/ guard as ResultsPage for direct navigation / refresh.
 */
function ErrorPage() {
  const { state } = useReview();

  if (state.status !== "error") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-center">
      <ReviewError />
    </div>
  );
}

// ---------------------------------------------------------------------------
// App — route table only
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InputPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/error" element={<ErrorPage />} />
      {/* Catch-all: anything unknown redirects to the input screen */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
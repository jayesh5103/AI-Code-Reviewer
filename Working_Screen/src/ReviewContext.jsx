/**
 * ReviewContext.jsx
 *
 * Single source of truth for the entire review lifecycle.
 * Uses React's built-in Context + useReducer — no external state library.
 *
 * In-memory only (FR-9): state is never written to localStorage,
 * sessionStorage, or cookies. A page refresh intentionally resets
 * everything to "idle". That is correct, expected behavior — not a bug.
 *
 * Exports
 * ─────────────────────────────────────────────────────────────────────
 *  ReviewProvider   – wraps the app; owns the reducer
 *  useReview        – read-only access to { state, dispatch }
 *  useReviewSubmit  – returns a submit() function that runs the fetch
 *                     call, dispatches actions, and navigates on outcome
 */

import { createContext, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ReviewState
 * @property {string} code           – last value typed in the textarea
 * @property {string} language       – last language selector value ("auto" | "python" | "javascript")
 * @property {"idle"|"loading"|"success"|"error"} status
 * @property {{ source: "ai"|"fallback", issues: Array } | null} result
 * @property {string | null} errorMessage
 */

/** @type {ReviewState} */
const INITIAL_STATE = {
  code: "",
  language: "auto",
  status: "idle",
  result: null,
  errorMessage: null,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

/**
 * Pure reducer — no side-effects. All transitions are exhaustive.
 *
 * Actions
 *   SUBMIT_START   { code, language }   – begin an in-flight review
 *   SUBMIT_SUCCESS { result }           – review resolved with data
 *   SUBMIT_ERROR   { message }          – review failed (any reason)
 *   RESET                               – return to idle / clear result
 */
function reviewReducer(state, action) {
  switch (action.type) {
    case "SUBMIT_START":
      return {
        ...state,
        code: action.code,
        language: action.language,
        status: "loading",
        result: null,
        errorMessage: null,
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        status: "success",
        result: action.result,
        errorMessage: null,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        status: "error",
        result: null,
        errorMessage: action.message ?? "Review failed",
      };

    case "RESET":
      return INITIAL_STATE;

    default:
      // Unrecognised action — return state unchanged (no silent corruption).
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ReviewContext = createContext(null);

/**
 * Wraps the app. Must be a descendant of <BrowserRouter> so that
 * useReviewSubmit() can call useNavigate().
 */
export function ReviewProvider({ children }) {
  const [state, dispatch] = useReducer(reviewReducer, INITIAL_STATE);

  return (
    <ReviewContext.Provider value={{ state, dispatch }}>
      {children}
    </ReviewContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hooks
// ---------------------------------------------------------------------------

/**
 * Access review state and dispatch from any component inside ReviewProvider.
 *
 * @returns {{ state: ReviewState, dispatch: React.Dispatch }}
 */
export function useReview() {
  const ctx = useContext(ReviewContext);
  if (ctx === null) {
    throw new Error("useReview must be used inside <ReviewProvider>");
  }
  return ctx;
}

/**
 * Returns a submit(code, language) function that:
 *  1. Dispatches SUBMIT_START (sets status → "loading")
 *  2. POSTs to /api/review with a 15-second AbortController timeout
 *  3. On success   → dispatches SUBMIT_SUCCESS, navigates to /results
 *  4. On any error → dispatches SUBMIT_ERROR, navigates to /error
 *
 * "Any error" includes: non-200 status, network failure, AbortError
 * (timeout), malformed JSON, and unexpected response shape.
 *
 * The fetch call itself is unchanged from the previous task —
 * only its location has moved (from InputPage into this hook).
 *
 * @returns {(code: string, language: string) => Promise<void>}
 */
export function useReviewSubmit() {
  const { dispatch } = useReview();
  const navigate = useNavigate();

  return async function submit(code, language) {
    dispatch({ type: "SUBMIT_START", code, language });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (
        (data.source !== "ai" && data.source !== "fallback") ||
        !Array.isArray(data.issues)
      ) {
        throw new Error("Unexpected response shape from review API");
      }

      dispatch({ type: "SUBMIT_SUCCESS", result: data });
      navigate("/results");
    } catch (err) {
      clearTimeout(timeoutId);
      dispatch({
        type: "SUBMIT_ERROR",
        message: err?.message ?? "Review failed",
      });
      navigate("/error");
    }
  };
}

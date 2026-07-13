import { useNavigate } from "react-router-dom";
import { useReview } from "./ReviewContext.jsx";
import "./ReviewError.css";

/**
 * Renders the S-5 error state: both the AI review and the fallback check
 * failed. Provides a "Try again" button that returns the user to the input
 * screen.
 *
 * No props — all copy is static for this screen.
 */
export default function ReviewError() {
  const navigate = useNavigate();
  const { dispatch } = useReview();

  function handleRetry() {
    dispatch({ type: "RESET" });
    navigate("/");
  }

  return (
    <div className="error-card" role="alert" aria-live="assertive">
      <span className="error-card__icon" aria-hidden="true">
        {/* Warning icon — inline SVG so no extra dependency is needed */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </span>

      <div className="error-card__body">
        <p className="error-card__title">Review couldn't complete</p>
        <p className="error-card__message">
          Both the AI review and backup check failed. Try again shortly.
        </p>
      </div>

      <button
        id="error-try-again"
        className="error-card__retry"
        onClick={handleRetry}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}

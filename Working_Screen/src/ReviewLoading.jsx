import "./ReviewLoading.css";

/**
 * Visible loading state (S-2) shown on `/` while a review request is in flight.
 * Appears below the (disabled) CodeInputForm so both are visible during the
 * 1–2 second stub delay — the form's "Reviewing…" button stays on screen.
 *
 * No props — content is static; the parent (InputPage) controls when this
 * mounts/unmounts based on context status === "loading".
 */
export default function ReviewLoading() {
  return (
    <div
      className="loading-card"
      role="status"
      aria-live="polite"
      aria-label="Review in progress"
    >
      <span className="loading-card__spinner" aria-hidden="true" />

      <div className="loading-card__body">
        <p className="loading-card__title">Reviewing your code…</p>
        <p className="loading-card__subtitle">
          This usually takes a second or two.
        </p>
      </div>
    </div>
  );
}

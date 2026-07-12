import "./ReviewResults.css";

/**
 * Renders the results panel for a code review — covers all three states
 * built in Figma: AI-reviewed with issues, Fallback-reviewed with issues,
 * and the zero-issues "success" state (S-3, S-4, S-3a).
 *
 * @param {"ai" | "fallback"} source - which engine produced this result.
 *   Drives the source chip's label and color — this label must always be
 *   visible (NFR-5), including when issues is empty.
 * @param {{ severity: "bug" | "style", title: string, explanation: string }[]} issues
 *   Empty array renders the "No issues found" state, not a blank panel (Story 4 AC).
 */
export default function ReviewResults({ source = "ai", issues = [] }) {
  const sourceStyle = SOURCE_STYLES[source] ?? SOURCE_STYLES.ai;

  return (
    <div className="review-card">
      <span className={sourceStyle.className}>{sourceStyle.label}</span>

      {issues.length === 0 ? (
        <div className="review-empty">
          <span className="success-dot" aria-hidden="true" />
          <p className="review-empty__title">No issues found</p>
          <p className="review-empty__body">No bugs or style issues detected.</p>
        </div>
      ) : (
        <ul className="issue-list">
          {issues.map((issue, i) => {
            const severity = SEVERITY_STYLES[issue.severity] ?? SEVERITY_STYLES.style;
            return (
              <li className="issue-row" key={i}>
                <span className={severity.className}>{severity.label}</span>
                <div className="issue-text">
                  <p className="issue-title">{issue.title}</p>
                  <p className="issue-explanation">{issue.explanation}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const SEVERITY_STYLES = {
  bug: { className: "badge badge--danger", label: "Bug" },
  style: { className: "badge badge--warning", label: "Style" },
};

const SOURCE_STYLES = {
  ai: { className: "chip chip--accent", label: "AI-reviewed" },
  fallback: { className: "chip chip--pro", label: "Fallback-reviewed" },
};

/* --------------------------------------------------------------------
 * Usage:
 *
 * <ReviewResults
 *   source="ai"
 *   issues={[
 *     { severity: "bug", title: "Unhandled empty list",
 *       explanation: "This will throw an IndexError if the input list is empty." },
 *     { severity: "style", title: "Inconsistent naming",
 *       explanation: "Variable tmp doesn't describe its purpose." },
 *   ]}
 * />
 *
 * <ReviewResults source="fallback" issues={[]} /> // renders the zero-issues state
 * ------------------------------------------------------------------ */

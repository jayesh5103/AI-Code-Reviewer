import { useState } from "react";
import "./CodeInputForm.css";

const LANGUAGE_OPTIONS = [
  { value: "auto", label: "Auto-detect" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
];

/**
 * Controlled input form for the Code Review Assistant (S-1).
 * Validates on submit:
 *  - empty code -> S-1a message (Story 1 AC)
 *  - "Auto-detect" selected but the code doesn't confidently match
 *    Python or JavaScript -> S-1b message (Story 2 AC)
 *
 * @param {(payload: { code: string, language: "python" | "javascript" }) => void} onSubmit
 * @param {boolean} isSubmitting - disables the button and swaps its label while a review is in flight
 */
export default function CodeInputForm({ onSubmit, isSubmitting = false }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [errors, setErrors] = useState({});

  function handleCodeChange(e) {
    setCode(e.target.value);
    if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }));
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
    if (errors.language) setErrors((prev) => ({ ...prev, language: undefined }));
  }

  function validate() {
    const nextErrors = {};
    let resolvedLanguage = language;

    if (code.trim() === "") {
      nextErrors.code = "Paste some code to get started.";
    } else if (language === "auto") {
      const detected = detectLanguage(code);
      if (!detected) {
        nextErrors.language =
          "We couldn't tell what language this is — try selecting Python or JavaScript directly.";
      } else {
        resolvedLanguage = detected;
      }
    }

    return { nextErrors, resolvedLanguage };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { nextErrors, resolvedLanguage } = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ code, language: resolvedLanguage });
    }
  }

  return (
    <form className="code-input-form" onSubmit={handleSubmit} noValidate>
      <label className="code-input-form__label" htmlFor="code-textarea">
        Paste your code
      </label>
      <textarea
        id="code-textarea"
        className={`code-input-form__textarea ${errors.code ? "has-error" : ""}`}
        value={code}
        onChange={handleCodeChange}
        placeholder="Paste code here…"
        rows={8}
        aria-invalid={Boolean(errors.code)}
        aria-describedby={errors.code ? "code-error" : undefined}
      />
      {errors.code && (
        <p className="code-input-form__error" id="code-error" role="alert">
          {errors.code}
        </p>
      )}

      <div className="code-input-form__controls">
        <select
          className={`code-input-form__select ${errors.language ? "has-error" : ""}`}
          value={language}
          onChange={handleLanguageChange}
          aria-label="Language"
          aria-invalid={Boolean(errors.language)}
          aria-describedby={errors.language ? "language-error" : undefined}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button type="submit" className="code-input-form__submit" disabled={isSubmitting}>
          {isSubmitting ? "Reviewing…" : "Review"}
        </button>
      </div>

      {errors.language && (
        <p className="code-input-form__error" id="language-error" role="alert">
          {errors.language}
        </p>
      )}
    </form>
  );
}

// Deliberately simple heuristic — a scaffold, not a real language parser.
// Returns "python" | "javascript" | null (null = couldn't confidently tell).
function detectLanguage(code) {
  const pythonHints = /\bdef\s+\w+\(|^\s*import\s+\w+|\bprint\(/m;
  const jsHints = /\bfunction\s+\w+\(|=>|\bconst\s+\w+\s*=|\bconsole\.log\(/m;
  const looksLikePython = pythonHints.test(code);
  const looksLikeJs = jsHints.test(code);
  if (looksLikePython && !looksLikeJs) return "python";
  if (looksLikeJs && !looksLikePython) return "javascript";
  return null;
}

/* --------------------------------------------------------------------
 * Usage:
 *
 * <CodeInputForm
 *   isSubmitting={reviewInFlight}
 *   onSubmit={({ code, language }) => runReview(code, language)}
 * />
 * ------------------------------------------------------------------ */

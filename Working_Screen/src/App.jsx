import { useState } from "react";
import CodeInputForm from "./CodeInputForm";
import ReviewResults from "./ReviewResults";

export default function App() {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit({ code, language }) {
    setIsSubmitting(true);
    setResult(null);

    // Fakes a review call so you can see the full loop before a real backend exists.
    setTimeout(() => {
      setIsSubmitting(false);
      setResult({
        source: "ai",
        issues: code.includes("[0]")
          ? [{ severity: "bug", title: "Unhandled empty list", explanation: "This will throw an IndexError if the input list is empty." }]
          : [],
      });
    }, 1200);
  }

  return (
    <div style={{ padding: 40, display: "flex", gap: 24, flexWrap: "wrap" }}>
      <CodeInputForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      {result && <ReviewResults source={result.source} issues={result.issues} />}
    </div>
  );
}
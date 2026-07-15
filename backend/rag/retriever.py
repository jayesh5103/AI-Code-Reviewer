"""
retriever.py

Minimal in-memory RAG retriever for style-guide grounding.

Loads style-guide excerpt files at module import time, splits them into
per-rule chunks, indexes them with TF-IDF, and exposes a retrieve()
function that returns the top-k most similar chunks for a code query.

## Embedding approach: TF-IDF (not neural embeddings)

The original design called for sentence-transformers (all-MiniLM-L6-v2),
but that package requires PyTorch, which does not have Python 3.14 wheels.
TF-IDF is used instead. This is an honest trade-off, not a silent downgrade:

  - For this specific document set (≤16 short, keyword-dense style rules),
    TF-IDF performs acceptably because the rules contain the same vocabulary
    that appears in code: snake_case, camelCase, type hint, docstring,
    semicolon, const, let, etc.
  - TF-IDF retrieval is lexical, not semantic. If a rule uses different
    words than the code (e.g., "identifier length" vs "variable name"),
    it may not be retrieved even if it is the most relevant rule.
  - Log the retrieved chunks and their scores. If scores are consistently
    low (< 0.05) or clearly wrong, that is evidence retrieval quality is
    poor and should be addressed before relying on it further.

  When Python 3.14-compatible PyTorch wheels become available, switching
  to sentence-transformers requires only replacing _build_index() and the
  retrieval step — the public API and integration in main.py stay unchanged.

## Design decisions

  - No vector database — TF-IDF matrix + cosine similarity over a numpy array.
    Justified: < 20 chunks total.
  - Indexes built once at module import (uvicorn startup), reused per request.
  - Graceful degradation: if scikit-learn is not installed, retrieve() returns
    [] and the caller uses the unaugmented prompt silently.

Directory layout (relative to this file):
  rag/
    retriever.py          ← this file
    style_docs/
      pep8_excerpts.txt
      js_style_excerpts.txt
"""

from __future__ import annotations

import logging
from pathlib import Path

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Document sources
# ---------------------------------------------------------------------------

_DOCS_DIR = Path(__file__).parent / "style_docs"

_SOURCES: dict[str, Path] = {
    "python":     _DOCS_DIR / "pep8_excerpts.txt",
    "javascript": _DOCS_DIR / "js_style_excerpts.txt",
}

# ---------------------------------------------------------------------------
# Chunker
# ---------------------------------------------------------------------------

def _chunk(text: str, source_label: str) -> list[dict]:
    """
    Split document text on blank lines (one rule per paragraph).
    Returns a list of {text, label} dicts, filtering out very short fragments.
    """
    raw = [c.strip() for c in text.split("\n\n") if c.strip()]
    return [
        {"text": chunk, "label": f"{source_label} #{i + 1}"}
        for i, chunk in enumerate(raw)
        if len(chunk) > 30   # discard accidental short separators
    ]

# ---------------------------------------------------------------------------
# TF-IDF index (built once at module import)
# ---------------------------------------------------------------------------

# Per language: {"chunks": list[dict], "vectorizer": TfidfVectorizer, "matrix": sparse}
_index: dict[str, dict] = {}
_sklearn_available = False


def _load() -> bool:
    """
    Build TF-IDF indexes for all languages.
    Called once at module import (i.e., at uvicorn startup).
    Returns True on success, False on any failure.
    """
    global _index, _sklearn_available

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
    except ImportError as exc:
        log.warning(
            "RAG disabled — scikit-learn not installed",
            extra={
                "event": "rag_disabled_no_sklearn",
                "error": str(exc),
            }
        )
        return False

    _sklearn_available = True

    for language, path in _SOURCES.items():
        if not path.exists():
            log.warning(
                "Style doc not found — skipping language indexing",
                extra={
                    "event": "rag_style_doc_missing",
                    "path": str(path),
                    "language": language,
                }
            )
            continue

        text = path.read_text(encoding="utf-8")
        label = "pep8" if language == "python" else "js-style"
        chunks = _chunk(text, source_label=label)

        if not chunks:
            log.warning(
                "No chunks extracted from style doc",
                extra={
                    "event": "rag_no_chunks_extracted",
                    "path": str(path),
                    "language": language,
                }
            )
            continue

        # Fit a TF-IDF vectorizer on the chunk texts.
        # sublinear_tf dampens the effect of very frequent terms;
        # ngram_range=(1,2) captures two-word phrases like "type hint",
        # "snake case", "arrow function" which are common in style rules.
        vectorizer = TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 2))
        matrix = vectorizer.fit_transform([c["text"] for c in chunks])

        _index[language] = {
            "chunks":     chunks,
            "vectorizer": vectorizer,
            "matrix":     matrix,
        }
        log.info(
            "RAG index built (TF-IDF)",
            extra={
                "event": "rag_index_built",
                "chunks_count": len(chunks),
                "language": language,
            }
        )

    return bool(_index)


# Trigger once at import time so the index is ready before the first request.
_load()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def retrieve(query: str, language: str, top_k: int = 2) -> list[dict]:
    """
    Return the top_k style-guide chunks most similar to ``query`` for the
    given language, ranked by TF-IDF cosine similarity.

    Returns an empty list if:
      - scikit-learn isn't installed.
      - The requested language has no indexed documents.
      - top_k is 0 or negative.

    Each item in the return list is a dict with:
      text  – raw chunk text (style guide rule)
      label – human-readable source label, e.g. "pep8 #3"
      score – TF-IDF cosine similarity (0–1, higher = more similar)

    Retrieval quality note: TF-IDF is lexical — it matches on shared
    vocabulary between the code and the style-guide rule. Rules that use
    different terminology than the code may not be retrieved even if they
    are conceptually relevant. This is an accepted limitation of the
    minimal version. Monitor logged scores; values < 0.05 indicate very
    weak or likely irrelevant matches.
    """
    if not _sklearn_available or language not in _index or top_k <= 0:
        return []

    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np

    idx = _index[language]

    # Transform the query using the same vocabulary as the index.
    query_vec = idx["vectorizer"].transform([query])

    # Cosine similarity between query and each chunk.
    scores: np.ndarray = cosine_similarity(query_vec, idx["matrix"])[0]
    top_indices = scores.argsort()[::-1][:top_k]

    return [
        {
            "text":  idx["chunks"][i]["text"],
            "label": idx["chunks"][i]["label"],
            "score": float(scores[i]),
        }
        for i in top_indices
    ]

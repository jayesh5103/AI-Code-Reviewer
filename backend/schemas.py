"""
schemas.py

Pydantic models that define the request/response contract for the review API.
These are the canonical types — the frontend, FastAPI route handlers, and any
future AI/Pylint integration all reference these same shapes.
"""

from typing import Literal
from pydantic import BaseModel


class ReviewRequest(BaseModel):
    """Body accepted by POST /api/review."""

    code: str
    language: Literal["python", "javascript"]


class Issue(BaseModel):
    """A single diagnostic produced by the review engine."""

    severity: Literal["bug", "style"]
    title: str
    explanation: str
    fix: str | None = None  # actionable suggestion; populated by AI path, None in fallback


class ReviewResponse(BaseModel):
    """Body returned by POST /api/review."""

    source: Literal["ai", "fallback"]
    issues: list[Issue]


class UsageResponse(BaseModel):
    """Body returned by GET /api/usage."""

    total_requests: int
    ai_requests: int
    fallback_requests: int
    total_prompt_tokens: int
    total_completion_tokens: int
    total_tokens: int


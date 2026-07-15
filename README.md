# AI Code Reviewer Assistant

An explanation-first code review tool that analyzes Python and JavaScript snippets for logical bugs and style conventions. Designed with a strict reliability guarantee, the system gracefully falls back to real static analysis linters (Pylint & ESLint) if the AI engine is offline or rate-limited.

**Live Deployed Application**: [https://ai-code-reviewer-psi-one.vercel.app](https://ai-code-reviewer-psi-one.vercel.app)

---

## Key Features

*   **Dual-Path Architecture**: Runs primary reviews using the Groq AI engine (`llama-3.3-70b-versatile`); automatically switches to local subprocess linters (Pylint/ESLint) on AI failure.
*   **Style Guide Grounding (RAG)**: Uses a local TF-IDF retriever to extract style excerpts from PEP 8 and JavaScript guides, ensuring style warnings explicitly reference official conventions (e.g. *"Per PEP 8 naming conventions..."*).
*   **Pragmatic Senior Guidelines**: Follows clean-code rules (performance prioritization, PEP 484/604 compliance, and obvious contextual naming) to prevent pedantic critique.
*   **Structured Logging & Tracing**: Injects correlation IDs into request logs for easy distributed request tracking.
*   **Usage Alerts**: Tracks API request volume in-memory and alerts via a Discord webhook at 80% of the daily quota.
*   **Honest Error Handling**: Gracefully renders a clean `/error` fallback view if both the AI engine and local linters fail to execute, preventing silent crashes or blank screens.

---

## Architecture Overview

```
                      +-----------------------------+
                      |       React Frontend        |
                      |          (Vercel)           |
                      +--------------+--------------+
                                     |
                                     |  POST /api/review
                                     v
                      +-----------------------------+
                      |       FastAPI Backend       |
                      |          (Render)           |
                      +--------------+--------------+
                                     |
             +-----------------------+-----------------------+
             |                                               |
             | [Success Path]                                | [Fallback Path] (AI Error)
             v                                               v
+------------------------+                      +------------------------+
|    Groq AI Engine      |                      |   Local Linter Exec    |
| (Style Excerpts / RAG) |                      |    (Pylint / ESLint)   |
+------------------------+                      +------------------------+
```

1.  **Code Input**: User submits a code snippet (up to 500 lines) and selects the language (Python, JavaScript, or Auto-detect).
2.  **RAG Query**: Backend retrieves the top-2 style guide rule excerpts matching the code keywords.
3.  **Primary Attempt**: Backend calls the Groq API with the code and style excerpts.
4.  **Fallback Path**: If the Groq API call fails (e.g., due to rate limits or invalid keys), the backend catches the error and runs local linter subprocesses (Pylint/ESLint).
5.  **Clean Output**: Returns a structured JSON list of issues mapped consistently to `bug` or `style` severity levels. If both paths fail, it gracefully returns a 500 error allowing the frontend to show a clean retry screen.

---

## Setup Instructions

### Prerequisites
*   Python 3.11+
*   Node.js 20+ and npm

### 1. Backend Server Setup
From the repository root:
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file (copying from [.env.example](file:///Users/macbook/repos/practice/backend/.env.example)) and configure your API key:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and fill in `GROQ_API_KEY=gsk_your_key`.
5.  Start the FastAPI server:
    ```bash
    uvicorn main:app --host 127.0.0.1 --port 8000
    ```
    Confirm the backend is running by accessing the health endpoint at `http://127.0.0.1:8000/health`.

### 2. Frontend Setup
From the repository root:
1.  Navigate to the frontend directory:
    ```bash
    cd Working_Screen
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Start the local Vite dev server:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## Running the Tests

Ensure your virtual environment is active in the backend directory before running backend tests.

*   **Backend Unit Tests**:
    ```bash
    pytest backend/tests/test_core.py
    ```
*   **Backend Integration Tests** (requires a valid `GROQ_API_KEY` configured in `backend/.env`):
    ```bash
    pytest backend/tests/test_integration.py
    ```
*   **Frontend Unit Tests**:
    From the `Working_Screen` directory:
    ```bash
    npx vitest run src/
    ```
*   **End-to-End (E2E) Tests**:
    From the `Working_Screen` directory:
    ```bash
    npx playwright test
    ```

---

## Known Limitations

This project embraces real-world operational trade-offs rather than hiding them:
*   **Linter Severity Mapping**: Mapping Pylint/ESLint warnings into binary severity levels (`bug` vs `style`) is a debatable design constraint. Some linter warnings fall in grey areas and may not align perfectly with every team's custom rules.
*   **In-Memory Usage Quota**: The usage quota tracker and warning logger are stored in-memory (FR-9). Since Render restarts the container on cold starts, this counter resets to zero and acts as a *best-effort alert signal*, not a definitive total.
*   **Render Cold Starts**: Because the backend is hosted on Render's free tier, the container spins down after **15 minutes of idle time**. The first request after a spin-down experiences a **30–60 second latency delay**.
*   **TF-IDF Simplification (RAG)**: The RAG retriever uses the raw code body as a search query. This keyword-matching approach is lexical rather than semantic, meaning it may miss relevant rules if the terminology in the code differs completely from the style guide phrasing.

---

## Operational Costs

*   **Total Cost**: **$0/month** (runs on free hobby tiers of Vercel, Render, and Groq).
*   **Upgrade Path**: If guaranteed uptime is required to eliminate the Render cold-start latency, the backend can be upgraded to the **Render Starter tier** for **$7/month**.
*   For further cost breakdowns, refer to [cost-sheet.md](file:///Users/macbook/repos/practice/client_communication_and_approval/cost-sheet.md) and [monthly-cost-note.md](file:///Users/macbook/repos/practice/client_communication_and_approval/monthly-cost-note.md).

---

## Deep Documentation Links

*   **Product Requirements Document (PRD)**: [PRD-code-review-assistant.md](file:///Users/macbook/repos/practice/PRD/PRD-code-review-assistant.md)
*   **System Design & Architecture Notes**: [Design_Notes.md](file:///Users/macbook/repos/practice/PRD/Design_Notes.md)
*   **Deployment Runbook**: [DEPLOY_RUNBOOK.md](file:///Users/macbook/repos/practice/DEPLOY_RUNBOOK.md)
*   **Exploratory Test & Bug Log**: [bug-log.md](file:///Users/macbook/repos/practice/client_communication_and_approval/bug-log.md)

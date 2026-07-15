# Deployment & Operations Runbook

This document is a practical, single-screen reference meant to be opened during live incidents, deployments, or demos.

---

## 1. Environments & Live URLs

*   **Local Development**:
    *   Frontend: `http://localhost:5173` (Vite dev server)
    *   Backend: `http://localhost:8000` (FastAPI / Uvicorn)
*   **Continuous Integration (CI)**:
    *   GitHub Actions: Executes tests on push (Unit/E2E on every push; Integration on `main` only).
*   **Staging / Preview**:
    *   Automatic Vercel PR preview URLs act as our "staging in spirit" for frontend verification before merging.
*   **Production**:
    *   **Frontend**: [https://ai-code-reviewer-psi-one.vercel.app](https://ai-code-reviewer-psi-one.vercel.app) (Vercel)
    *   **Backend**: [https://ai-code-reviewer-ghm1.onrender.com](https://ai-code-reviewer-ghm1.onrender.com) (Render)

---

## 2. Deploy Process

*   **Continuous Deployment**: Push/merge to the `main` branch.
*   **Execution**: Both Vercel and Render automatically detect changes to `main` and trigger builds/deploys. No manual commands or credentials are required to release.

---

## 3. Secrets & Configuration

We keep secrets out of source control. Refer to [backend/.env.example](file:///Users/macbook/repos/practice/backend/.env.example) for the full variable list.

*   **Local Dev**: Defined in a local `backend/.env` file (stores developer `GROQ_API_KEY`).
*   **CI Pipeline**: Configured as a GitHub Actions repository secret named `GROQ_API_KEY_CI`.
*   **Production**: Managed in the Render service dashboard environment settings (stores production `GROQ_API_KEY` and optional `ALERT_WEBHOOK_URL`).

---

## 4. Cold-Start Behavior (Crucial for Demos)

*   **Behavior**: Render's free tier spins down the backend container after **15 minutes of idle time**. The next request triggers a cold-start delay of **30–60 seconds**.
*   **Mitigation**: Before any live demo, presentation, or interview, perform a manual warm-up request to the health check endpoint:
    ```bash
    curl https://ai-code-reviewer-ghm1.onrender.com/health
    ```
    Do this **1 to 2 minutes before** the demo to ensure zero-latency response for the first user interaction.

---

## 5. Monitoring & Alerting

*   **Usage Stats**: Access `/api/usage` on the backend to view current request metrics.
*   **Threshold Alerting**: A Discord webhook alert is triggered when the backend detects API request volume reaching **80% of Groq's daily quota** (800 requests/day).
*   > [!IMPORTANT]
    > **Caveat**: The quota counter is in-memory. Render's free tier container restarts (or cold starts) reset this counter to zero. Treat it as a *best-effort warning signal*, not a definitive total.

---

## 6. Rollback Procedure

In the event of a production failure, perform recovery steps in this specific order:

1.  **Platform Rollback (Immediate Recovery)**:
    *   **Render (Backend)**: Log into the Render dashboard, select the backend service, go to **Deploys**, find the last stable release, and select **Rollback to this deploy** (or redeploy previous).
    *   **Vercel (Frontend)**: Log into Vercel, go to the project deployments list, locate the last known good deployment, click the menu button, and select **Promote to Production**.
2.  **Git History Realignment (Permanent Fix)**:
    *   Create a pull request reverting the breaking change.
    *   Use `git revert <commit_hash>` to revert the change in history.
    *   > [!WARNING]
        > **Never use `git reset --hard`** on a deployed branch (`main`). This destroys git history and desynchronizes it from deployed platforms.

---

## 7. Operational Costs

*   **Current Cost**: **$0/month** across Vercel, Render, and Groq (Hobby / Free tiers).
*   **Uptime Upgrade Path**: If guaranteed backend availability becomes necessary (removing the cold-start delay entirely), upgrade to the **Render Starter tier** ($7/month) to keep the backend service always-on.

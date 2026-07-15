import { test, expect } from "@playwright/test";

const testCases = [
  {
    name: "happy path with issues",
    source: "ai",
    issues: [
      {
        severity: "bug",
        title: "Mocked Bug Title",
        explanation: "Mocked Bug Explanation.",
        fix: "Mocked Bug Fix"
      }
    ],
    expectedState: "issues"
  },
  {
    name: "zero issues success state",
    source: "fallback",
    issues: [],
    expectedState: "zero-issues"
  }
];

for (const tc of testCases) {
  test(`End-to-End Flow: ${tc.name}`, async ({ page }) => {
    // Intercept the API route to serve our mock data deterministically
    await page.route("**/api/review", async (route) => {
      // Add a slight delay to ensure the loading card mounts and is assertable
      await new Promise(resolve => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          source: tc.source,
          issues: tc.issues
        })
      });
    });

    // 1. Navigate to home input page
    await page.goto("/");

    // 2. Paste a code snippet
    const textarea = page.locator("#code-textarea");
    await expect(textarea).toBeVisible();
    await textarea.fill("def add(a, b):\n    return a + b");

    // 3. Submit
    const submitBtn = page.locator(".code-input-form__submit");
    await submitBtn.click();

    // 4. Assert the loading state appears before response resolves
    const loadingCard = page.locator(".loading-card");
    await expect(loadingCard).toBeVisible();
    await expect(page.locator(".loading-card__title")).toHaveText("Reviewing your code…");

    // 5. Assert navigation to /results occurs
    await page.waitForURL("**/results");

    // 6. Assert source label is visible, has correct text and styling (NFR-5 trust signal)
    const sourceChip = page.locator(".chip");
    await expect(sourceChip).toBeVisible();
    if (tc.source === "ai") {
      await expect(sourceChip).toHaveText("AI-reviewed");
      await expect(sourceChip).toHaveClass(/chip--accent/);
    } else {
      await expect(sourceChip).toHaveText("Fallback-reviewed");
      await expect(sourceChip).toHaveClass(/chip--pro/);
    }

    // 7. Assert the outcomes match expectations
    if (tc.expectedState === "issues") {
      const issueRow = page.locator(".issue-row").first();
      await expect(issueRow).toBeVisible();

      // Check severity badge is visible and correct
      const badge = issueRow.locator(".badge");
      await expect(badge).toHaveText("Bug");
      await expect(badge).toHaveClass(/badge--danger/);

      // Check title and explanation match within the same row
      await expect(issueRow.locator(".issue-title")).toHaveText("Mocked Bug Title");
      await expect(issueRow.locator(".issue-explanation")).toHaveText("Mocked Bug Explanation.");
    } else {
      const emptyDiv = page.locator(".review-empty");
      await expect(emptyDiv).toBeVisible();
      await expect(emptyDiv.locator(".review-empty__title")).toHaveText("No issues found");
      await expect(emptyDiv.locator(".review-empty__body")).toHaveText("No bugs or style issues detected.");
    }
  });
}
